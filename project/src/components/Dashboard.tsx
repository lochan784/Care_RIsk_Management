import React, { useState, useMemo } from 'react';
import { Search, Users, Filter, Calendar, Stethoscope } from 'lucide-react';
import type { Patient } from '../types';

interface DashboardProps {
  patients: Patient[];
  onPatientSelect: (patient: Patient) => void;
}

const tierColors = {
  1: 'bg-green-100 text-green-800 border-green-200',
  2: 'bg-blue-100 text-blue-800 border-blue-200',
  3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  4: 'bg-orange-100 text-orange-800 border-orange-200',
  5: 'bg-red-100 text-red-800 border-red-200'
};

export default function Dashboard({ patients, onPatientSelect }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.member_id.toString().includes(searchTerm);
      const matchesTier = selectedTier === null || patient.finalTier === selectedTier;
      return matchesSearch && matchesTier;
    });
  }, [patients, searchTerm, selectedTier]);

  const tierCounts = useMemo(() => {
    return {
      total: patients.length,
      tier1: patients.filter(p => p.finalTier === 1).length,
      tier2: patients.filter(p => p.finalTier === 2).length,
      tier3: patients.filter(p => p.finalTier === 3).length,
      tier4: patients.filter(p => p.finalTier === 4).length,
      tier5: patients.filter(p => p.finalTier === 5).length,
    };
  }, [patients]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{tierCounts.total}</p>
            </div>
          </div>
        </div>
        
        {[1, 2, 3, 4, 5].map(tier => (
          <button
            key={tier}
            onClick={() => setSelectedTier(selectedTier === tier ? null : tier)}
            className={`bg-white p-4 rounded-lg shadow-sm border transition-all hover:shadow-md ${
              selectedTier === tier ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">Tier {tier}</p>
              <p className="text-2xl font-bold text-gray-900">
                {tierCounts[`tier${tier}` as keyof typeof tierCounts]}
              </p>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                tierColors[tier as keyof typeof tierColors]
              }`}>
                {tier === 1 ? 'Very Low' : tier === 2 ? 'Low' : tier === 3 ? 'Medium' : tier === 4 ? 'High' : 'Very High'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search patients by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedTier && (
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
              <Filter className="h-4 w-4 mr-1" />
              Filtered by Tier {selectedTier}
              <button
                onClick={() => setSelectedTier(null)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Patient Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score (90D)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Appointment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.member_id}
                  onClick={() => onPatientSelect(patient)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{patient.member_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.age} years, {patient.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                      tierColors[patient.finalTier as keyof typeof tierColors]
                    }`}>
                      Tier {patient.finalTier} - {patient.riskCategory}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.p90}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {patient.nextAppointment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Stethoscope className="h-4 w-4 mr-1" />
                      {patient.doctor}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}