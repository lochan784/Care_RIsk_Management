import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import PatientDetails from './components/PatientDetails';
import RiskCheckup from './components/RiskCheckup';
import Reports from './components/Reports';
import DietPlan from './components/DietPlan';
import DataAnalysis from './components/DataAnalysis';
import Feedback from './components/Feedback';
import { samplePatients } from './data/sampleData';
import type { User, Patient } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleLogin = (username: string) => {
    setCurrentUser({
      id: 1,
      name: username,
      role: 'Healthcare Provider',
      avatar: '/api/placeholder/32/32'
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setSelectedPatient(null);
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentPage('patient-details');
  };

  const handleBackToDashboard = () => {
    setSelectedPatient(null);
    setCurrentPage('dashboard');
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'patient-details':
        return selectedPatient ? (
          <PatientDetails patient={selectedPatient} onBack={handleBackToDashboard} />
        ) : (
          <Dashboard patients={samplePatients} onPatientSelect={handlePatientSelect} />
        );
      case 'risk-checkup':
        return <RiskCheckup />;
      case 'reports':
        return <Reports patients={samplePatients} />;
      case 'diet-plan':
        return <DietPlan />;
      case 'data-analysis':
        return <DataAnalysis patients={samplePatients} />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Dashboard patients={samplePatients} onPatientSelect={handlePatientSelect} />;
    }
  };

  return (
    <Layout currentUser={currentUser} onLogout={handleLogout}>
      {currentPage !== 'patient-details' && (
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      )}
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;