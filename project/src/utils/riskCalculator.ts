import type { RiskAssessmentForm, Patient } from '../types';

// Risk calculation model based on the provided Python implementation
export class RiskCalculator {
  private static readonly TIER_LABELS = {
    1: "Very Low",
    2: "Low", 
    3: "Medium",
    4: "High",
    5: "Very High"
  };

  private static readonly CARE_RECOMMENDATIONS = {
    5: "Immediate RN outreach, care manager assignment, intensive monitoring",
    4: "Care manager within 7 days, pharmacist review, follow-up monthly",
    3: "Digital coaching, quarterly check-ins, PCP scheduling",
    2: "Preventive nudges, annual visit scheduling",
    1: "Education only, self-service resources"
  };

  static calculateFeatures(data: RiskAssessmentForm) {
    // Feature engineering based on the Python model
    const bmiGlucose = data.bmi * data.glucose;
    const ageBmi = data.age * data.bmi;
    const glucoseInsulinRatio = data.glucose / (data.insulin + 1);
    const glucoseSq = data.glucose ** 2;
    const bmiExp = Math.exp(data.bmi / 10);
    const insulinLog = Math.log1p(data.insulin);
    const totalRiskScore = 
      (data.glucose > 140 ? 1 : 0) +
      (data.bmi > 30 ? 1 : 0) +
      (data.age > 45 ? 1 : 0) +
      (data.bloodPressure > 80 ? 1 : 0);

    return {
      ...data,
      bmiGlucose,
      ageBmi,
      glucoseInsulinRatio,
      glucoseSq,
      bmiExp,
      insulinLog,
      totalRiskScore
    };
  }

  static calculateRiskProbability(features: any): number {
    // Simplified risk calculation based on key factors
    let riskScore = 0;

    // Glucose contribution (0-0.4)
    if (features.glucose >= 200) riskScore += 0.4;
    else if (features.glucose >= 140) riskScore += 0.3;
    else if (features.glucose >= 100) riskScore += 0.2;
    else riskScore += 0.1;

    // BMI contribution (0-0.25)
    if (features.bmi >= 35) riskScore += 0.25;
    else if (features.bmi >= 30) riskScore += 0.2;
    else if (features.bmi >= 25) riskScore += 0.15;
    else riskScore += 0.05;

    // Age contribution (0-0.2)
    if (features.age >= 65) riskScore += 0.2;
    else if (features.age >= 45) riskScore += 0.15;
    else if (features.age >= 35) riskScore += 0.1;
    else riskScore += 0.05;

    // Blood pressure contribution (0-0.1)
    if (features.bloodPressure >= 140) riskScore += 0.1;
    else if (features.bloodPressure >= 130) riskScore += 0.08;
    else if (features.bloodPressure >= 120) riskScore += 0.05;
    else riskScore += 0.02;

    // Diabetes pedigree function (0-0.05)
    riskScore += Math.min(features.diabetesPedigreeFunction, 0.05);

    return Math.min(riskScore, 1);
  }

  static assignTier(probability: number): number {
    if (probability < 0.2) return 1;
    else if (probability < 0.4) return 2;
    else if (probability < 0.6) return 3;
    else if (probability < 0.8) return 4;
    else return 5;
  }

  static calculateMultiHorizonRisk(data: RiskAssessmentForm) {
    const features = this.calculateFeatures(data);
    const baseProb = this.calculateRiskProbability(features);

    // Simulate multi-horizon predictions with some variance
    const p30 = Math.min(Math.max(baseProb * (0.9 + Math.random() * 0.2), 0), 1);
    const p60 = Math.min(Math.max(baseProb * (0.8 + Math.random() * 0.4), 0), 1);
    const p90 = Math.min(Math.max(baseProb * (0.7 + Math.random() * 0.6), 0), 1);

    const tier30 = this.assignTier(p30);
    const tier60 = this.assignTier(p60);
    const tier90 = this.assignTier(p90);

    // Weighted combination for final tier
    const finalScore = tier30 * 0.5 + tier60 * 0.3 + tier90 * 0.2;
    const finalTier = this.assignFinalTier(finalScore);

    return {
      p30: Math.round(p30 * 100 * 100) / 100,
      tier30,
      p60: Math.round(p60 * 100 * 100) / 100,
      tier60,
      p90: Math.round(p90 * 100 * 100) / 100,
      tier90,
      finalScore: Math.round(finalScore * 100) / 100,
      finalTier,
      riskCategory: this.TIER_LABELS[finalTier as keyof typeof this.TIER_LABELS],
      carePlan: this.CARE_RECOMMENDATIONS[finalTier as keyof typeof this.CARE_RECOMMENDATIONS]
    };
  }

  private static assignFinalTier(score: number): number {
    if (score < 2) return 1;
    else if (score < 3) return 2;
    else if (score < 4) return 3;
    else if (score < 5) return 4;
    else return 5;
  }
}