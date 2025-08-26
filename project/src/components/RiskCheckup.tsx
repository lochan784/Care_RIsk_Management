import React, { useState, useEffect } from 'react';
import { Calculator, Activity, AlertCircle, Heart, TrendingUp, Users, DollarSign, Clock, RefreshCw } from 'lucide-react';

// Types
interface RiskAssessmentForm {
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree_function: number;
  age: number;
}

interface PredictionResponse {
  prediction: number;
  probability: number;
  risk_tier: string;
  risk_level: number;
  net_profit: number;
  roi_percent: number;
  recommendations: string;
}

interface ExamplePatient {
  name: string;
  description: string;
  data: RiskAssessmentForm;
}

const DiabetesRiskApp = () => {
  const [formData, setFormData] = useState<RiskAssessmentForm>({
    pregnancies: 1,
    glucose: 115,
    blood_pressure: 70,
    skin_thickness: 20,
    insulin: 80,
    bmi: 26,
    diabetes_pedigree_function: 0.4,
    age: 28
  });

  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [examplePatients, setExamplePatients] = useState<ExamplePatient[]>([]);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string | null>(null);

  // API Base URL - Update this to match your backend
  const API_BASE_URL = 'http://localhost:8000';

  // Check API health on component mount
  useEffect(() => {
    checkApiHealth();
    loadExamplePatients();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setApiStatus('online');
      } else {
        setApiStatus('offline');
      }
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const loadExamplePatients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/examples`);
      if (response.ok) {
        const data = await response.json();
        setExamplePatients(data.examples);
      }
    } catch (error) {
      console.error('Failed to load example patients:', error);
    }
  };

  const handleInputChange = (field: keyof RiskAssessmentForm, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const loadExample = (example: ExamplePatient) => {
    setFormData(example.data);
    setSelectedExample(example.name);
    setResults(null);
    setError(null);
  };

  const calculateRisk = async () => {
    if (apiStatus === 'offline') {
      setError('API is offline. Please check if the backend server is running.');
      return;
    }

    setIsCalculating(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Request failed: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Failed to calculate risk:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate risk. Please try again.');
      setResults(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const getTierColor = (level: number) => {
    const colors = {
      1: 'text-green-600 bg-green-100 border-green-200',
      2: 'text-blue-600 bg-blue-100 border-blue-200',
      3: 'text-yellow-600 bg-yellow-100 border-yellow-200',
      4: 'text-orange-600 bg-orange-100 border-orange-200',
      5: 'text-red-600 bg-red-100 border-red-200'
    };
    return colors[level as keyof typeof colors] || colors[3];
  };

  const getStatusIndicator = () => {
    switch (apiStatus) {
      case 'online':
        return <div className="flex items-center text-green-600 text-sm"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>API Online</div>;
      case 'offline':
        return <div className="flex items-center text-red-600 text-sm"><div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>API Offline</div>;
      default:
        return <div className="flex items-center text-yellow-600 text-sm"><div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>Checking...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Heart className="mr-3 text-red-200 w-8 h-8" />
              <h1 className="text-4xl font-bold">Diabetes Risk Assessment</h1>
              <Heart className="ml-3 text-red-200 w-8 h-8" />
            </div>
            <p className="text-xl text-blue-100 mb-4">AI-Powered Predictive Healthcare Analytics</p>
            <div className="flex justify-center">
              {getStatusIndicator()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
            <button
              onClick={checkApiHealth}
              className="ml-auto bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Retry
            </button>
          </div>
        )}

        {/* Example Patients */}
        {examplePatients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Example Patients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {examplePatients.map((patient, index) => (
                <div 
                  key={index}
                  onClick={() => loadExample(patient)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedExample === patient.name 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{patient.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{patient.description}</p>
                  <div className="text-xs text-blue-600 font-medium">Click to load data →</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Calculator Form */}
        <div className="bg-white rounded-lg shadow-lg border p-8 mb-8">
          <div className="flex items-center mb-6">
            <Calculator className="text-blue-600 mr-3 w-6 h-6" />
            <h2 className="text-2xl font-bold text-gray-900">Patient Data Input</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Pregnancies
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={formData.pregnancies}
                  onChange={(e) => handleInputChange('pregnancies', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Glucose Level (mg/dL)
                </label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={formData.glucose}
                  onChange={(e) => handleInputChange('glucose', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="number"
                  min="40"
                  max="200"
                  value={formData.blood_pressure}
                  onChange={(e) => handleInputChange('blood_pressure', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skin Thickness (mm)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.skin_thickness}
                  onChange={(e) => handleInputChange('skin_thickness', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Insulin Level (μU/mL)
                </label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={formData.insulin}
                  onChange={(e) => handleInputChange('insulin', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BMI (Body Mass Index)
                </label>
                <input
                  type="number"
                  min="10"
                  max="60"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diabetes Pedigree Function
                </label>
                <input
                  type="number"
                  min="0"
                  max="3"
                  step="0.001"
                  value={formData.diabetes_pedigree_function}
                  onChange={(e) => handleInputChange('diabetes_pedigree_function', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years)
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={calculateRisk}
              disabled={isCalculating || apiStatus === 'offline'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Analyzing Patient Data...
                </>
              ) : (
                <>
                  <Activity className="mr-3 w-5 h-5" />
                  Calculate Diabetes Risk
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Display */}
        {results && (
          <div className="bg-white rounded-lg shadow-lg border p-8 animate-fade-in">
            <div className="flex items-center mb-6">
              <AlertCircle className="text-orange-600 mr-3 w-6 h-6" />
              <h3 className="text-2xl font-bold text-gray-900">Risk Assessment Results</h3>
            </div>

            {/* Main Results Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="w-6 h-6 text-blue-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-700">Prediction</h4>
                </div>
                <p className="text-3xl font-bold text-blue-600 mb-2">
                  {results.prediction === 1 ? 'Diabetic' : 'Not Diabetic'}
                </p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getTierColor(results.risk_level)}`}>
                  {results.risk_tier} Risk
                </span>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-700">Risk Probability</h4>
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-2">
                  {(results.probability * 100).toFixed(1)}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      results.risk_level <= 2 ? 'bg-green-500' :
                      results.risk_level === 3 ? 'bg-yellow-500' :
                      results.risk_level === 4 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(results.probability * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-gray-700">Intervention ROI</h4>
                </div>
                <p className="text-3xl font-bold text-green-600 mb-2">
                  {results.roi_percent.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">
                  Net Profit: ${results.net_profit.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  Clinical Recommendations
                </h4>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${getTierColor(results.risk_level)}`}>
                  Tier {results.risk_level}
                </span>
              </div>
              
              <div className="bg-white border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800 leading-relaxed">
                  {results.recommendations}
                </p>
              </div>

              {/* Additional Risk Factors Display */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Key Risk Factors:</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className={`px-2 py-1 rounded ${formData.glucose > 140 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    Glucose: {formData.glucose} mg/dL
                  </div>
                  <div className={`px-2 py-1 rounded ${formData.bmi > 30 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    BMI: {formData.bmi}
                  </div>
                  <div className={`px-2 py-1 rounded ${formData.age > 45 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    Age: {formData.age} years
                  </div>
                  <div className={`px-2 py-1 rounded ${formData.blood_pressure > 80 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    BP: {formData.blood_pressure} mmHg
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiabetesRiskApp;