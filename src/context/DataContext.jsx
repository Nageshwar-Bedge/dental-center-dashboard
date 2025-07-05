import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppointmentStatus } from '../types/index.js';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const INITIAL_PATIENTS = [
  {
    id: 'p1',
    name: 'John Doe',
    dob: '1990-05-10',
    contact: '(555) 123-4567',
    email: 'john@entnt.in',
    address: '123 Sunset Boulevard, Los Angeles, CA 90028',
    healthInfo: 'No known allergies. Previous root canal treatment in 2022. Regular coffee drinker.',
    emergencyContact: 'Jane Doe - (555) 123-4568',
    avatar: '👨',
    memberSince: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    dob: '1985-08-22',
    contact: '(555) 987-6543',
    email: 'jane@entnt.in',
    address: '456 Ocean Drive, Miami Beach, FL 33139',
    healthInfo: 'Allergic to penicillin. Regular cleanings every 6 months. Sensitive teeth.',
    emergencyContact: 'Mike Smith - (555) 987-6544',
    avatar: '👩',
    memberSince: '2024-02-01T14:30:00Z',
    createdAt: '2024-02-01T14:30:00Z'
  },
  {
    id: 'p3',
    name: 'Robert Johnson',
    dob: '1978-12-03',
    contact: '(555) 456-7890',
    email: 'robert.johnson@email.com',
    address: '789 Broadway, New York, NY 10003',
    healthInfo: 'Diabetes type 2. Takes medication for blood pressure. History of gum disease.',
    emergencyContact: 'Mary Johnson - (555) 456-7891',
    avatar: '👨‍💼',
    memberSince: '2024-01-20T09:15:00Z',
    createdAt: '2024-01-20T09:15:00Z'
  }
];

const INITIAL_INCIDENTS = [
  {
    id: 'i1',
    patientId: 'p1',
    title: 'Routine Cleaning & Checkup',
    description: 'Comprehensive dental cleaning and oral health examination',
    comments: 'Patient reports no pain or sensitivity. Excellent oral hygiene.',
    appointmentDate: '2024-12-20T10:00:00Z',
    cost: 150,
    treatment: 'Professional cleaning, fluoride treatment, oral health assessment',
    status: AppointmentStatus.COMPLETED,
    nextAppointmentDate: '2025-06-20T10:00:00Z',
    files: [],
    priority: 'routine',
    createdAt: '2024-12-15T08:00:00Z',
    updatedAt: '2024-12-20T11:00:00Z'
  },
  {
    id: 'i2',
    patientId: 'p1',
    title: 'Composite Filling Replacement',
    description: 'Replace old amalgam filling with modern composite material',
    comments: 'Old filling showing signs of wear and minor decay detected',
    appointmentDate: '2025-01-15T14:00:00Z',
    status: AppointmentStatus.SCHEDULED,
    files: [],
    priority: 'medium',
    createdAt: '2024-12-18T10:00:00Z',
    updatedAt: '2024-12-18T10:00:00Z'
  },
  {
    id: 'i3',
    patientId: 'p2',
    title: 'Professional Teeth Whitening',
    description: 'In-office professional teeth whitening treatment',
    comments: 'Patient interested in cosmetic improvement for upcoming wedding',
    appointmentDate: '2025-01-10T11:00:00Z',
    cost: 350,
    treatment: 'Professional whitening gel application with LED activation',
    status: AppointmentStatus.COMPLETED,
    files: [],
    priority: 'cosmetic',
    createdAt: '2024-12-10T13:00:00Z',
    updatedAt: '2025-01-10T12:30:00Z'
  },
  {
    id: 'i4',
    patientId: 'p3',
    title: 'Ceramic Crown Installation',
    description: 'Custom ceramic crown placement for damaged molar',
    comments: 'Temporary crown placed, permanent crown ready for installation',
    appointmentDate: '2025-01-25T09:00:00Z',
    status: AppointmentStatus.SCHEDULED,
    files: [],
    priority: 'high',
    createdAt: '2024-12-20T15:00:00Z',
    updatedAt: '2024-12-20T15:00:00Z'
  }
];

export const DataProvider = ({ children }) => {
  const [patients, setPatients] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    completedTreatments: 0,
    pendingAppointments: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0
  });

  useEffect(() => {
    const storedPatients = localStorage.getItem('dental_patients');
    const storedIncidents = localStorage.getItem('dental_incidents');

    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    } else {
      setPatients(INITIAL_PATIENTS);
      localStorage.setItem('dental_patients', JSON.stringify(INITIAL_PATIENTS));
    }

    if (storedIncidents) {
      setIncidents(JSON.parse(storedIncidents));
    } else {
      setIncidents(INITIAL_INCIDENTS);
      localStorage.setItem('dental_incidents', JSON.stringify(INITIAL_INCIDENTS));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dental_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('dental_incidents', JSON.stringify(incidents));
    calculateStats();
  }, [incidents]);

  const calculateStats = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    const completedIncidents = incidents.filter(i => i.status === AppointmentStatus.COMPLETED);
    const pendingIncidents = incidents.filter(i => 
      i.status === AppointmentStatus.SCHEDULED || i.status === AppointmentStatus.IN_PROGRESS
    );
    
    const monthlyRevenue = completedIncidents
      .filter(i => new Date(i.updatedAt) >= startOfMonth && i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0);

    const weeklyRevenue = completedIncidents
      .filter(i => new Date(i.updatedAt) >= startOfWeek && i.cost)
      .reduce((sum, i) => sum + (i.cost || 0), 0);

    setDashboardStats({
      totalPatients: patients.length,
      totalAppointments: incidents.length,
      completedTreatments: completedIncidents.length,
      pendingAppointments: pendingIncidents.length,
      monthlyRevenue,
      weeklyRevenue
    });
  };

  const addPatient = (patientData) => {
    const newPatient = {
      ...patientData,
      id: `p${Date.now()}`,
      avatar: '👤',
      memberSince: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id, updates) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setIncidents(prev => prev.filter(i => i.patientId !== id));
  };

  const addIncident = (incidentData) => {
    const newIncident = {
      ...incidentData,
      id: `i${Date.now()}`,
      priority: incidentData.priority || 'routine',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setIncidents(prev => [...prev, newIncident]);
  };

  const updateIncident = (id, updates) => {
    setIncidents(prev => prev.map(i => 
      i.id === id 
        ? { ...i, ...updates, updatedAt: new Date().toISOString() }
        : i
    ));
  };

  const deleteIncident = (id) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  const getPatientIncidents = (patientId) => {
    return incidents.filter(i => i.patientId === patientId);
  };

  return (
    <DataContext.Provider value={{
      patients,
      incidents,
      dashboardStats,
      addPatient,
      updatePatient,
      deletePatient,
      addIncident,
      updateIncident,
      deleteIncident,
      getPatientIncidents
    }}>
      {children}
    </DataContext.Provider>
  );
};