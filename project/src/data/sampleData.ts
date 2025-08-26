import type { Patient } from '../types';
import { RiskCalculator } from '../utils/riskCalculator';

// Sample patient names and data
const patientNames = [
  'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'James Wilson', 'Maria Garcia',
  'David Thompson', 'Lisa Anderson', 'Robert Martinez', 'Jennifer Brown', 'Christopher Lee',
  'Jessica Taylor', 'Daniel Rodriguez', 'Ashley Clark', 'Matthew Lewis', 'Amanda Walker',
  'Joshua Hall', 'Nicole Allen', 'Andrew Young', 'Stephanie King', 'Kevin Wright'
];

const doctors = [
  'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones',
  'Dr. Garcia', 'Dr. Miller', 'Dr. Davis', 'Dr. Rodriguez', 'Dr. Martinez'
];

const diseases = [
  ['Type 2 Diabetes', 'Hypertension'],
  ['Pre-diabetes'],
  ['Type 2 Diabetes', 'Obesity'],
  ['Hypertension', 'High Cholesterol'],
  ['Type 2 Diabetes'],
  ['Pre-diabetes', 'Hypertension'],
  ['Obesity'],
  ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol'],
  ['Pre-diabetes', 'Obesity'],
  ['Type 2 Diabetes', 'Hypertension']
];

// Raw diabetes data from CSV
const rawData = [
  [6,98,58,33,190,34.0,0.43,43,0],
  [2,112,75,32,0,35.7,0.148,21,0],
  [2,108,64,0,0,30.8,0.158,21,0],
  [8,107,80,0,0,24.6,0.856,34,0],
  [7,136,90,0,0,29.9,0.21,50,0],
  [6,103,72,32,190,37.7,0.324,55,0],
  [1,71,48,18,76,20.4,0.323,22,0],
  [0,117,0,0,0,33.8,0.932,44,0],
  [4,154,72,29,126,31.3,0.338,37,0],
  [5,147,78,0,0,33.7,0.218,65,0],
  [10,111,70,27,0,27.5,0.141,40,1],
  [7,179,95,31,0,34.2,0.164,60,0],
  [4,148,60,27,318,30.9,0.15,29,1],
  [5,96,74,18,67,33.6,0.997,43,0],
  [2,88,58,26,16,28.4,0.766,22,0],
  [1,125,50,40,167,33.3,0.962,28,1],
  [3,84,72,32,0,37.2,0.267,28,0],
  [5,86,68,28,71,30.2,0.364,24,0],
  [4,183,0,0,0,28.4,0.212,36,1],
  [0,140,65,26,130,42.6,0.431,24,1]
];

function generateContactInfo(index: number) {
  return {
    phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    email: `${patientNames[index].toLowerCase().replace(' ', '.')}@email.com`,
    address: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave'][Math.floor(Math.random() * 5)]}, City, ST 12345`
  };
}

function generateExpenses() {
  const months = ['Jan', 'Feb', 'Mar'];
  return months.map(month => ({
    month,
    expenditure: Math.floor(Math.random() * 5000) + 1000,
    savings: Math.floor(Math.random() * 2000) + 500
  }));
}

function generateAppointmentDate() {
  const today = new Date();
  const futureDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
  return futureDate.toLocaleDateString();
}

export const samplePatients: Patient[] = rawData.map((row, index) => {
  const [pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigreeFunction, age, outcome] = row;
  
  // Handle missing/zero values (replace with reasonable defaults)
  const processedData = {
    pregnancies,
    glucose: glucose || 100,
    bloodPressure: bloodPressure || 80,
    skinThickness: skinThickness || 20,
    insulin: insulin || 80,
    bmi,
    diabetesPedigreeFunction,
    age
  };

  const riskData = RiskCalculator.calculateMultiHorizonRisk(processedData);

  return {
    member_id: index + 1001,
    name: patientNames[index],
    age,
    gender: Math.random() > 0.5 ? 'Female' : 'Male',
    pregnancies,
    glucose: processedData.glucose,
    bloodPressure: processedData.bloodPressure,
    skinThickness: processedData.skinThickness,
    insulin: processedData.insulin,
    bmi,
    diabetesPedigreeFunction,
    outcome,
    ...riskData,
    nextAppointment: generateAppointmentDate(),
    doctor: doctors[Math.floor(Math.random() * doctors.length)],
    diseases: diseases[Math.floor(Math.random() * diseases.length)],
    contactInfo: generateContactInfo(index),
    hospitalizations: Math.floor(Math.random() * 3),
    expenses: generateExpenses()
  };
});