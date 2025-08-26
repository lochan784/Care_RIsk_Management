import React from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign,
  Activity,
  Heart,
  AlertTriangle
} from 'lucide-react';
import type { Patient } from '../types';

interface PatientDetailsProps {
  patient: Patient;
  onBack: () => void;
}

const tierColors = {
  1: 'bg-green-100 text-green-800 border-green-200',
  2: 'bg-blue-100 text-blue-800 border-blue-200',
  3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  4: 'bg-orange-100 text-orange-800 border-orange-200',
  5: 'bg-red-100 text-red-800 border-red-200'
};

export default function PatientDetails({ patient, onBack }: PatientDetailsProps) {
  const totalExpenditure = patient.expenses.reduce((sum, exp) => sum + exp.expenditure, 0);
  const totalSavings = patient.expenses.reduce((sum, exp) => sum + exp.savings, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full border ${
          tierColors[patient.finalTier as keyof typeof tierColors]
        }`}>
          Risk Tier {patient.finalTier} - {patient.riskCategory}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Patient Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                <p className="text-lg text-gray-600">Patient ID: #{patient.member_id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Age: {patient.age}</p>
                <p className="text-sm text-gray-500">Gender: {patient.gender}</p>
              </div>
            </div>
            
            {/* Diseases */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Conditions:</h3>
              <div className="flex flex-wrap gap-2">
                {patient.diseases.map((disease, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full border border-red-200"
                  >
                    {disease}
                  </span>
                ))}
              </div>
            </div>

            {/* Risk Scores */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Risk Scores by Period:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">30 Days</span>
                    <span className="text-lg font-bold text-gray-900">{patient.p30}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        patient.tier30 <= 2 ? 'bg-green-500' :
                        patient.tier30 === 3 ? 'bg-yellow-500' :
                        patient.tier30 === 4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${patient.p30}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">60 Days</span>
                    <span className="text-lg font-bold text-gray-900">{patient.p60}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        patient.tier60 <= 2 ? 'bg-green-500' :
                        patient.tier60 === 3 ? 'bg-yellow-500' :
                        patient.tier60 === 4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${patient.p60}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">90 Days</span>
                    <span className="text-lg font-bold text-gray-900">{patient.p90}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        patient.tier90 <= 2 ? 'bg-green-500' :
                        patient.tier90 === 3 ? 'bg-yellow-500' :
                        patient.tier90 === 4 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${patient.p90}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Care Plan */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recommended Care Plan</h3>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">{patient.carePlan}</p>
            </div>
          </div>
        </div>

        {/* Right Section - ROI & Contact */}
        <div className="space-y-6">
          {/* ROI Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Return on Investment</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Hospitalizations (3mo)</span>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="font-semibold text-gray-900">{patient.hospitalizations}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Expenditure & Savings</h4>
                <div className="space-y-3">
                  {patient.expenses.map((expense, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{expense.month}</span>
                      <div className="text-right">
                        <div className="text-red-600">-${expense.expenditure.toLocaleString()}</div>
                        <div className="text-green-600">+${expense.savings.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-4 w-4 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.contactInfo.phone}</p>
                  <p className="text-xs text-gray-500">Primary phone</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-4 w-4 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.contactInfo.email}</p>
                  <p className="text-xs text-gray-500">Email address</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.contactInfo.address}</p>
                  <p className="text-xs text-gray-500">Home address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Calendar className="h-5 w-5 mr-2" />
            Schedule Intervention
          </button>
        </div>
      </div>
    </div>
  );
}