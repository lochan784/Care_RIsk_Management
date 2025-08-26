export interface Patient {
  member_id: number;
  name: string;
  age: number;
  gender: string;
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  outcome: number;
  p30: number;
  tier30: number;
  p60: number;
  tier60: number;
  p90: number;
  tier90: number;
  finalScore: number;
  finalTier: number;
  riskCategory: string;
  carePlan: string;
  nextAppointment: string;
  doctor: string;
  diseases: string[];
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  hospitalizations: number;
  expenses: Array<{ month: string; expenditure: number; savings: number }>;
}

export interface User {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

export interface RiskAssessmentForm {
  pregnancies: number;
  glucose: number;
  bloodPressure: number;
  skinThickness: number;
  insulin: number;
  bmi: number;
  diabetesPedigreeFunction: number;
  age: number;
}

export interface FeedbackForm {
  patientId: number;
  rating: number;
  comments: string;
  category: string;
}