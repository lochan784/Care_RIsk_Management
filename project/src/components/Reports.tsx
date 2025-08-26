import React from 'react';
import { FileText, TrendingUp, Calendar, Download } from 'lucide-react';
import type { Patient } from '../types';

interface ReportsProps {
  patients: Patient[];
}

export default function Reports({ patients }: ReportsProps) {
  const totalPatients = patients.length;
  const highRiskPatients = patients.filter(p => p.finalTier >= 4).length;
  const avgRiskScore = patients.reduce((sum, p) => sum + p.finalScore, 0) / totalPatients;
  const totalHospitalizations = patients.reduce((sum, p) => sum + p.hospitalizations, 0);

  const riskDistribution = {
    tier1: patients.filter(p => p.finalTier === 1).length,
    tier2: patients.filter(p => p.finalTier === 2).length,
    tier3: patients.filter(p => p.finalTier === 3).length,
    tier4: patients.filter(p => p.finalTier === 4).length,
    tier5: patients.filter(p => p.finalTier === 5).length,
  };

  const monthlyData = [
    { month: 'Jan', hospitalizations: 12, avgRisk: 2.8 },
    { month: 'Feb', hospitalizations: 8, avgRisk: 2.6 },
    { month: 'Mar', hospitalizations: 15, avgRisk: 3.1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Health Analysis Reports</h2>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Risk Patients</p>
              <p className="text-2xl font-bold text-gray-900">{highRiskPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Risk Score</p>
              <p className="text-2xl font-bold text-gray-900">{avgRiskScore.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hospitalizations</p>
              <p className="text-2xl font-bold text-gray-900">{totalHospitalizations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Tier Distribution</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(riskDistribution).map(([tier, count], index) => {
            const tierNumber = index + 1;
            const percentage = ((count / totalPatients) * 100).toFixed(1);
            const colors = [
              'bg-green-500',
              'bg-blue-500',
              'bg-yellow-500',
              'bg-orange-500',
              'bg-red-500'
            ];
            
            return (
              <div key={tier} className="text-center">
                <div className="mb-2">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <div 
                      className={`w-12 h-12 rounded-full ${colors[index]} flex items-center justify-center`}
                      style={{ 
                        transform: `scale(${Math.max(0.3, count / Math.max(...Object.values(riskDistribution)))})`
                      }}
                    >
                      <span className="text-white font-bold text-xs">{count}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">Tier {tierNumber}</p>
                <p className="text-xs text-gray-500">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends (Last 3 Months)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hospitalizations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Average Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyData.map((data, index) => (
                <tr key={data.month}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month} 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.hospitalizations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.avgRisk}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        index === 0 ? 'text-red-500' :
                        index === 1 ? 'text-green-500' : 'text-orange-500'
                      }`} />
                      <span className={
                        index === 0 ? 'text-red-500' :
                        index === 1 ? 'text-green-500' : 'text-orange-500'
                      }>
                        {index === 0 ? '↑ High' : index === 1 ? '↓ Improving' : '↑ Rising'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Risk Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">High-Risk Patient Analysis</h3>
        <div className="space-y-4">
          {patients.filter(p => p.finalTier >= 4).slice(0, 5).map((patient) => (
            <div key={patient.member_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-8 w-8">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {patient.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                  <p className="text-xs text-gray-500">ID: #{patient.member_id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  patient.finalTier === 5 ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-orange-100 text-orange-800 border border-orange-200'
                }`}>
                  Tier {patient.finalTier} - {patient.riskCategory}
                </span>
                <p className="text-xs text-gray-500 mt-1">90D Risk: {patient.p90}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}