from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
import os

# Optional imports (required for unpickling if your model used these)
try:
    import xgboost  # noqa: F401
except Exception:
    pass
try:
    import lightgbm  # noqa: F401
except Exception:
    pass
try:
    import catboost  # noqa: F401
except Exception:
    pass

APP_TITLE = "Diabetes Risk Assessment API"
APP_DESC = "AI-powered diabetes risk prediction using a stacked ML model and ROI analysis"
APP_VERSION = "1.0.0"

app = FastAPI(title=APP_TITLE, description=APP_DESC, version=APP_VERSION)

# --------------------------
# CORS (adjust allow_origins for production)
# --------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Pydantic Schemas
# --------------------------
class PatientData(BaseModel):
    pregnancies: int = Field(..., ge=0, le=20, description="Number of pregnancies")
    glucose: float = Field(..., ge=50, le=300, description="Glucose level (mg/dL)")
    blood_pressure: float = Field(..., ge=40, le=200, description="Blood pressure (mmHg)")
    skin_thickness: float = Field(..., ge=0, le=100, description="Skin thickness (mm)")
    insulin: float = Field(..., ge=0, le=500, description="Insulin level (μU/mL)")
    bmi: float = Field(..., ge=10, le=60, description="Body Mass Index")
    diabetes_pedigree_function: float = Field(..., ge=0, le=3, description="Diabetes pedigree function")
    age: int = Field(..., ge=18, le=100, description="Age in years")

    class Config:
        json_schema_extra = {
            "example": {
                "pregnancies": 1,
                "glucose": 115,
                "blood_pressure": 70,
                "skin_thickness": 20,
                "insulin": 80,
                "bmi": 26.0,
                "diabetes_pedigree_function": 0.4,
                "age": 28,
            }
        }

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="0 = Not Diabetic, 1 = Diabetic")
    probability: float = Field(..., description="Probability of diabetes (0-1)")
    risk_tier: str = Field(..., description="Risk tier (Very Low, Low, Medium, High, Very High)")
    risk_level: int = Field(..., description="Risk level (1-5)")
    net_profit: float = Field(..., description="Expected net savings from intervention")
    roi_percent: float = Field(..., description="Return on investment percentage")
    recommendations: str = Field(..., description="Clinical recommendations")

class HealthResponse(BaseModel):
    status: str
    message: str

# --------------------------
# Globals for model components
# --------------------------
model = None
scaler = None
feature_cols = None

# --------------------------
# Utilities
# --------------------------

def load_model_components() -> bool:
    """Load the trained model, scaler, and feature list saved by the Colab script."""
    global model, scaler, feature_cols
    try:
        model_path = Path("output/final_model.pkl")
        scaler_path = Path("output/scaler.pkl")
        features_path = Path("output/feature_cols.pkl")

        if not (model_path.exists() and scaler_path.exists() and features_path.exists()):
            print("⚠ Model artifacts not found in ./output. Falling back to rule-based prediction.")
            return False

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        feature_cols = joblib.load(features_path)
        return True
    except Exception as e:
        print(f"Error loading model components: {e}")
        return False


def engineer_features(data: Dict[str, float]) -> pd.DataFrame:
    """Apply the same feature engineering as training (names must match training columns)."""
    df = pd.DataFrame([data])
    mapping = {
        "pregnancies": "Pregnancies",
        "glucose": "Glucose",
        "blood_pressure": "BloodPressure",
        "skin_thickness": "SkinThickness",
        "insulin": "Insulin",
        "bmi": "BMI",
        "diabetes_pedigree_function": "DiabetesPedigreeFunction",
        "age": "Age",
    }
    df = df.rename(columns=mapping)

    # Engineered features used in training
    if feature_cols and "BMI_Glucose" in feature_cols:
        df["BMI_Glucose"] = df["BMI"] * df["Glucose"]
        df["Age_BMI"] = df["Age"] * df["BMI"]
        df["Glucose_Insulin_Ratio"] = df["Glucose"] / (df["Insulin"] + 1)
        df["Glucose_sq"] = df["Glucose"] ** 2
        df["BMI_exp"] = np.exp(df["BMI"] / 10)
        df["Insulin_log"] = np.log1p(df["Insulin"])
        df["Total_Risk_Score"] = (
            (df["Glucose"] > 140).astype(int)
            + (df["BMI"] > 30).astype(int)
            + (df["Age"] > 45).astype(int)
            + (df["BloodPressure"] > 80).astype(int)
        )

    # Align to training feature order; fill any missing columns (e.g., Cluster dummies) with 0
    if feature_cols:
        df = df.reindex(columns=feature_cols, fill_value=0)

    return df


def get_risk_tier(probability: float) -> tuple[str, int]:
    if probability <= 0.20:
        return "Very Low", 1
    elif probability <= 0.40:
        return "Low", 2
    elif probability <= 0.60:
        return "Medium", 3
    elif probability <= 0.80:
        return "High", 4
    else:
        return "Very High", 5


def calculate_roi(probability: float) -> tuple[float, float]:
    """Replicates the ROI logic from training: 
    benefit = risk * future_cost; net_savings = benefit - intervention_cost; ROI% = net_savings / benefit.
    Here risk ≈ model probability (0-1).
    """
    intervention_cost = 20000.0
    future_cost = 300000.0

    risk = float(np.clip(probability, 0.0, 1.0))
    benefit = risk * future_cost
    if benefit <= 0:
        return -intervention_cost, -100.0

    net_savings = benefit - intervention_cost
    roi_percent = (net_savings / benefit) * 100.0
    return float(net_savings), float(roi_percent)


def get_recommendations(risk_level: int) -> str:
    recs = {
        5: "Immediate RN outreach, care manager assignment, intensive monitoring",
        4: "Care manager within 7 days, pharmacist review, follow-up monthly",
        3: "Digital coaching, quarterly check-ins, PCP scheduling",
        2: "Preventive nudges, annual visit scheduling",
        1: "Education only, self-service resources",
    }
    return recs.get(risk_level, recs[3])


def fallback_prediction(data: Dict[str, float]) -> tuple[int, float]:
    """Simple rule-based fallback if model artifacts are missing."""
    risk_score = 0.0

    # Glucose
    g = data.get("glucose", 0)
    if g > 140:
        risk_score += 0.35
    elif g > 120:
        risk_score += 0.20
    elif g > 100:
        risk_score += 0.10

    # BMI
    b = data.get("bmi", 0)
    if b > 35:
        risk_score += 0.25
    elif b > 30:
        risk_score += 0.15
    elif b > 25:
        risk_score += 0.08

    # Age
    a = data.get("age", 0)
    if a > 60:
        risk_score += 0.20
    elif a > 45:
        risk_score += 0.12
    elif a > 35:
        risk_score += 0.06

    risk_score += data.get("pregnancies", 0) * 0.02
    risk_score += 0.08 if data.get("blood_pressure", 0) > 80 else 0.0
    risk_score += data.get("diabetes_pedigree_function", 0.0) * 0.15
    risk_score += 0.10 if data.get("insulin", 0) > 150 else 0.0
    risk_score += 0.05 if data.get("skin_thickness", 0) > 30 else 0.0

    probability = float(np.clip(risk_score, 0.0, 0.95))
    prediction = 1 if probability > 0.5 else 0
    return prediction, probability

# --------------------------
# Startup
# --------------------------
@app.on_event("startup")
async def startup_event():
    ok = load_model_components()
    if ok:
        print("✅ Model components loaded successfully")
    else:
        print("⚠ Using fallback rule-based prediction (model artifacts missing)")

# --------------------------
# Endpoints
# --------------------------
@app.get("/", response_model=HealthResponse)
async def root():
    return HealthResponse(status="healthy", message="Diabetes Risk Assessment API is running")


@app.get("/health", response_model=HealthResponse)
async def health_check():
    model_status = "loaded" if model is not None else "fallback"
    return HealthResponse(status="healthy", message=f"API is running. Model status: {model_status}")


@app.post("/predict", response_model=PredictionResponse)
async def predict_diabetes_risk(patient_data: PatientData):
    try:
        data = patient_data.dict()

        if model is not None and scaler is not None and feature_cols is not None:
            feats = engineer_features(data)
            scaled = scaler.transform(feats)
            probability = float(model.predict_proba(scaled)[0][1])
            prediction = int(model.predict(scaled)[0])
        else:
            prediction, probability = fallback_prediction(data)

        risk_tier, risk_level = get_risk_tier(probability)
        net_savings, roi_percent = calculate_roi(probability)
        recs = get_recommendations(risk_level)

        return PredictionResponse(
            prediction=prediction,
            probability=probability,
            risk_tier=risk_tier,
            risk_level=risk_level,
            net_profit=net_savings,
            roi_percent=roi_percent,
            recommendations=recs,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/predict/batch")
async def predict_batch(patients: list[PatientData]):
    try:
        out = []
        for p in patients:
            resp = await predict_diabetes_risk(p)  # reuse single logic
            out.append(resp)
        return {"predictions": out, "count": len(out)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")


@app.get("/examples")
async def get_example_patients():
    examples = [
        {
            "name": "Mild Risk Patient",
            "description": "Young patient with normal glucose and BMI",
            "data": {
                "pregnancies": 1,
                "glucose": 115,
                "blood_pressure": 70,
                "skin_thickness": 20,
                "insulin": 80,
                "bmi": 26.0,
                "diabetes_pedigree_function": 0.4,
                "age": 28,
            },
        },
        {
            "name": "High Risk Patient",
            "description": "High glucose and BMI with multiple pregnancies",
            "data": {
                "pregnancies": 3,
                "glucose": 170,
                "blood_pressure": 85,
                "skin_thickness": 32,
                "insulin": 200,
                "bmi": 35.0,
                "diabetes_pedigree_function": 0.9,
                "age": 45,
            },
        },
        {
            "name": "Low Risk Patient",
            "description": "Young patient with normal values",
            "data": {
                "pregnancies": 0,
                "glucose": 90,
                "blood_pressure": 65,
                "skin_thickness": 18,
                "insulin": 60,
                "bmi": 22.0,
                "diabetes_pedigree_function": 0.2,
                "age": 25,
            },
        },
        {
            "name": "Borderline Risk Patient",
            "description": "Older patient with borderline values",
            "data": {
                "pregnancies": 2,
                "glucose": 130,
                "blood_pressure": 78,
                "skin_thickness": 25,
                "insulin": 100,
                "bmi": 29.0,
                "diabetes_pedigree_function": 0.6,
                "age": 60,
            },
        },
    ]
    return {"examples": examples}


@app.get("/model/info")
async def get_model_info():
    return {
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "features_loaded": feature_cols is not None,
        "feature_count": int(len(feature_cols)) if feature_cols is not None else 0,
        "model_type": type(model).__name__ if model is not None else "fallback",
    }


# --------------------------
# Entrypoint (for `python fastapi_main.py`)
# --------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "fastapi_main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        log_level="info",
    )
