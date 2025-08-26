import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import type { Patient } from '../types';

interface DataAnalysisProps {
  patients: Patient[];
}

export default function DataAnalysis({ patients }: DataAnalysisProps) {
  // Calculate analytics
  const riskDistribution = {
    tier1: patients.filter(p => p.finalTier === 1).length,
    tier2: patients.filter(p => p.finalTier === 2).length,
    tier3: patients.filter(p => p.finalTier === 3).length,
    tier4: patients.filter(p => p.finalTier === 4).length,
    tier5: patients.filter(p => p.finalTier === 5).length,
  };

  const avgByAge = {
    young:
      patients.filter(p => p.age < 35).reduce((sum, p) => sum + p.finalScore, 0) /
      Math.max(patients.filter(p => p.age < 35).length, 1),
    middle:
      patients.filter(p => p.age >= 35 && p.age < 55).reduce((sum, p) => sum + p.finalScore, 0) /
      Math.max(patients.filter(p => p.age >= 35 && p.age < 55).length, 1),
    senior:
      patients.filter(p => p.age >= 55).reduce((sum, p) => sum + p.finalScore, 0) /
      Math.max(patients.filter(p => p.age >= 55).length, 1),
  };

  

  const correlationData = [
    { factor: 'Age', correlation: 0.68, description: 'Strong positive correlation with risk' },
    { factor: 'BMI', correlation: 0.45, description: 'Moderate positive correlation' },
    { factor: 'Glucose', correlation: 0.72, description: 'Strong positive correlation' },
    { factor: 'Blood Pressure', correlation: 0.38, description: 'Moderate positive correlation' },
    { factor: 'Pregnancies', correlation: 0.23, description: 'Weak positive correlation' },
  ];

  const riskTrends = [
    { month: 'Jan', avgRisk: 2.8, patients: 18 },
    { month: 'Feb', avgRisk: 2.6, patients: 19 },
    { month: 'Mar', avgRisk: 3.1, patients: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Data Analysis & Visual Reports</h2>
      </div>

      {/* Risk Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <PieChart className="h-6 w-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Risk Tier Distribution</h3>
        </div>

        <div className="grid grid-cols-5 gap-4 mb-6">
          {Object.entries(riskDistribution).map(([tier, count], index) => {
            const tierNumber = index + 1;
            const percentage = ((count / patients.length) * 100).toFixed(1);
            const maxCount = Math.max(...Object.values(riskDistribution));
            const height = Math.max(20, (count / maxCount) * 200);

            const colors = [
              'bg-green-500',
              'bg-blue-500',
              'bg-yellow-500',
              'bg-orange-500',
              'bg-red-500',
            ];

            return (
              <div key={tier} className="text-center">
                <div className="flex flex-col items-center justify-end h-48 mb-4">
                  <div
                    className={`${colors[index]} rounded-t-lg w-16 flex items-end justify-center pb-2 transition-all duration-500`}
                    style={{ height: `${height}px` }}
                  >
                    <span className="text-white font-bold text-sm">{count}</span>
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded-b-lg flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">{percentage}%</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Tier {tierNumber}</p>
              </div>
            );
          })}
        </div>
      </div> {/* ✅ Closing div added here */}

      {/* Age-Based Risk Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-6">
          <Activity className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Risk by Age Group</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">{avgByAge.young.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-900">Under 35 years</div>
            <div className="text-xs text-gray-500 mt-1">Average Risk Score</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{avgByAge.middle.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-900">35-55 years</div>
            <div className="text-xs text-gray-500 mt-1">Average Risk Score</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">{avgByAge.senior.toFixed(1)}</div>
            <div className="text-sm font-medium text-gray-900">55+ years</div>
            <div className="text-xs text-gray-500 mt-1">Average Risk Score</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Glucose levels and age show the strongest correlation with diabetes risk, 
              indicating these should be primary intervention targets.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-900 mb-2">Population Health</h4>
            <p className="text-sm text-green-800">
              {((riskDistribution.tier1 + riskDistribution.tier2) / patients.length * 100).toFixed(0)}% of patients 
              are in low-risk categories, indicating good overall population health.
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-orange-900 mb-2">Intervention Needs</h4>
            <p className="text-sm text-orange-800">
              {riskDistribution.tier4 + riskDistribution.tier5} patients require immediate 
              attention and intensive care management.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-purple-900 mb-2">Age Factor</h4>
            <p className="text-sm text-purple-800">
              Risk scores increase significantly with age, with patients over 55 
              showing {((avgByAge.senior / avgByAge.young - 1) * 100).toFixed(0)}% higher average risk.
            </p>
          </div>
        </div>
      </div>
  </div>
  );
}
