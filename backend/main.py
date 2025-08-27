from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any
import joblib
import numpy as np
import pandas as pd
import os
from pathlib import Path
import uvicorn

app = FastAPI(
    title="Diabetes Risk Assessment API",
    description="AI-powered diabetes risk prediction using machine learning",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------
# Pydantic Models
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
        schema_extra = {
            "example": {
                "pregnancies": 1,
                "glucose": 115,
                "blood_pressure": 70,
                "skin_thickness": 20,
                "insulin": 80,
                "bmi": 26.0,
                "diabetes_pedigree_function": 0.4,
                "age": 28
            }
        }

class PredictionResponse(BaseModel):
    prediction: int = Field(..., description="0 = Not Diabetic, 1 = Diabetic")
    probability: float = Field(..., description="Probability of diabetes (0-1)")
    risk_tier: str = Field(..., description="Risk tier (Very Low, Low, Medium, High, Very High)")
    risk_level: int = Field(..., description="Risk level (1-5)")
    net_profit: float = Field(..., description="Expected net profit from intervention")
    roi_percent: float = Field(..., description="Return on investment percentage")
    recommendations: str = Field(..., description="Clinical recommendations")

class HealthResponse(BaseModel):
    status: str
    message: str

# --------------------------
# Global Variables for Model Components
# --------------------------

model = None
scaler = None
feature_cols = None

# --------------------------
# Model Loading and Utility Functions
# --------------------------

def load_model_components():
    """Load the trained model, scaler, and feature columns"""
    global model, scaler, feature_cols
    
    try:
        # Adjust paths based on your model location
        model_path = Path("output/final_model.pkl")
        scaler_path = Path("output/scaler.pkl")
        features_path = Path("output/feature_cols.pkl")
        
        if not all([model_path.exists(), scaler_path.exists(), features_path.exists()]):
            print("Warning: Model files not found. Using fallback prediction.")
            return False
            
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        feature_cols = joblib.load(features_path)
        return True
        
    except Exception as e:
        print(f"Error loading model components: {e}")
        return False

def engineer_features(data: Dict[str, float]) -> pd.DataFrame:
    """Apply feature engineering as in the original code"""
    input_df = pd.DataFrame([data])
    
    # Rename columns to match the original dataset format
    column_mapping = {
        'pregnancies': 'Pregnancies',
        'glucose': 'Glucose',
        'blood_pressure': 'BloodPressure',
        'skin_thickness': 'SkinThickness',
        'insulin': 'Insulin',
        'bmi': 'BMI',
        'diabetes_pedigree_function': 'DiabetesPedigreeFunction',
        'age': 'Age'
    }
    
    input_df = input_df.rename(columns=column_mapping)
    
    # Add engineered features if they exist in the model
    if feature_cols and "BMI_Glucose" in feature_cols:
        input_df["BMI_Glucose"] = input_df["BMI"] * input_df["Glucose"]
        input_df["Age_BMI"] = input_df["Age"] * input_df["BMI"]
        input_df["Glucose_Insulin_Ratio"] = input_df["Glucose"] / (input_df["Insulin"] + 1)
        input_df["Glucose_sq"] = input_df["Glucose"] ** 2
        input_df["BMI_exp"] = np.exp(input_df["BMI"] / 10)
        input_df["Insulin_log"] = np.log1p(input_df["Insulin"])
        input_df["Total_Risk_Score"] = (
            (input_df["Glucose"] > 140).astype(int) +
            (input_df["BMI"] > 30).astype(int) +
            (input_df["Age"] > 45).astype(int) +
            (input_df["BloodPressure"] > 80).astype(int)
        )
    
    return input_df

def get_risk_tier(probability: float) -> tuple[str, int]:
    """Determine risk tier from probability"""
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

def calculate_roi(risk: float) -> tuple[float, float]:
    
    print(risk)
    intervention_cost = 200

    # Linear mapping from risk → ROI%
    roi_percent = 200 - (risk * 300)

    # Net profit derived from ROI%
    net_profit = (roi_percent / 100) * intervention_cost

    return net_profit, roi_percent


def get_recommendations(risk_level: int) -> str:
    """Provide clinical recommendations based on risk level"""
    recommendations = {
        1: "Continue with regular annual check-ups. Maintain healthy lifestyle habits including balanced diet and regular exercise.",
        2: "Schedule routine monitoring every 6 months. Focus on maintaining healthy weight and glucose levels through diet and exercise.",
        3: "Increase monitoring frequency to every 3 months. Consider lifestyle interventions and dietary counseling. Monitor glucose levels regularly.",
        4: "Monthly monitoring recommended. Implement comprehensive diabetes prevention program including intensive lifestyle modification, dietary consultation, and regular glucose monitoring.",
        5: "Immediate medical consultation required. Intensive monitoring and intervention needed. Consider pre-diabetes management protocol with frequent follow-ups."
    }
    return recommendations.get(risk_level, recommendations[3])

def fallback_prediction(data: Dict[str, float]) -> tuple[int, float]:
    """Fallback prediction when model is not available"""
    # Simple rule-based prediction for demonstration
    risk_score = 0
    
    # Glucose impact (highest weight)
    if data['glucose'] > 140:
        risk_score += 0.35
    elif data['glucose'] > 120:
        risk_score += 0.20
    elif data['glucose'] > 100:
        risk_score += 0.10
    
    # BMI impact
    if data['bmi'] > 35:
        risk_score += 0.25
    elif data['bmi'] > 30:
        risk_score += 0.15
    elif data['bmi'] > 25:
        risk_score += 0.08
    
    # Age impact
    if data['age'] > 60:
        risk_score += 0.20
    elif data['age'] > 45:
        risk_score += 0.12
    elif data['age'] > 35:
        risk_score += 0.06
    
    # Other factors
    risk_score += data['pregnancies'] * 0.02
    risk_score += (0.08 if data['blood_pressure'] > 80 else 0)
    risk_score += data['diabetes_pedigree_function'] * 0.15
    risk_score += (0.10 if data['insulin'] > 150 else 0)
    risk_score += (0.05 if data['skin_thickness'] > 30 else 0)
    
    # Normalize probability
    probability = min(max(risk_score, 0), 0.95)
    prediction = 1 if probability > 0.5 else 0
    
    return prediction, probability

# --------------------------
# Startup Event
# --------------------------

@app.on_event("startup")
async def startup_event():
    """Load model components on startup"""
    success = load_model_components()
    if success:
        print("✅ Model components loaded successfully")
    else:
        print("⚠  Model components not found. Using fallback prediction.")

# --------------------------
# API Endpoints
# --------------------------

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - API health check"""
    return HealthResponse(
        status="healthy",
        message="Diabetes Risk Assessment API is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    model_status = "loaded" if model is not None else "fallback"
    return HealthResponse(
        status="healthy",
        message=f"API is running. Model status: {model_status}"
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_diabetes_risk(patient_data: PatientData):
    """
    Predict diabetes risk for a patient
    
    Returns prediction, probability, risk tier, and ROI analysis
    """
    try:
        # Convert to dictionary
        data = patient_data.dict()
        
        if model is not None and scaler is not None and feature_cols is not None:
            # Use trained model
            input_df = engineer_features(data)
            input_df = input_df.reindex(columns=feature_cols, fill_value=0)
            scaled_input = scaler.transform(input_df)
            
            prediction = model.predict(scaled_input)[0]
            probability = model.predict_proba(scaled_input)[0][1]
        else:
            # Use fallback prediction
            prediction, probability = fallback_prediction(data)
        
        # Calculate additional metrics
        risk_tier, risk_level = get_risk_tier(probability)
        net_profit, roi_percent = calculate_roi(probability)
        recommendations = get_recommendations(risk_level)
        
        return PredictionResponse(
            prediction=int(prediction),
            probability=float(probability),
            risk_tier=risk_tier,
            risk_level=risk_level,
            net_profit=net_profit,
            roi_percent=roi_percent,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/batch")
async def predict_batch(patients: list[PatientData]):
    """
    Predict diabetes risk for multiple patients
    
    Returns list of predictions
    """
    try:
        results = []
        for patient_data in patients:
            # Reuse the single prediction logic
            prediction_response = await predict_diabetes_risk(patient_data)
            results.append(prediction_response)
        
        return {"predictions": results, "count": len(results)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

@app.get("/examples")
async def get_example_patients():
    """
    Get example patients for testing
    
    Returns the same example patients from the original code
    """
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
                "age": 28
            }
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
                "age": 45
            }
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
                "age": 25
            }
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
                "age": 60
            }
        }
    ]
    
    return {"examples": examples}

@app.get("/model/info")
async def get_model_info():
    """
    Get information about the loaded model
    """
    return {
        "model_loaded": model is not None,
        "scaler_loaded": scaler is not None,
        "features_loaded": feature_cols is not None,
        "feature_count": len(feature_cols) if feature_cols is not None else 0,
        "model_type": str(type(model).name) if model is not None else "fallback"
    }

# --------------------------
# Main execution
# --------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )

#''' Ethu backend side code '''
# go to backend
# 1.python -m venv venv
# 2.venv/bin/activate
# 3.pip install -r requirements.txt
# 4.uvicorn main:app --reload

#''' Ethu frontend side code '''
# go to frontend
# 1.npm install
# 2.npm run dev
