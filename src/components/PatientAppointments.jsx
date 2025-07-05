import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Heart,
  Star,
  Sparkles,
  DollarSign,
  MapPin,
  Phone
} from 'lucide-react';

const PatientAppointments = () => {
  const { user } = useAuth();
  const { getPatientIncidents, patients } = useData();
  const [filter, setFilter] = useState('all');

  const patientIncidents = user?.patientId ? getPatientIncidents(user.patientId) : [];
  const patient = patients.find(p => p.id === user?.patientId);

  const filteredIncidents = patientIncidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled':
        return <Clock className="h-5 w-5" />;
      case 'In Progress':
        return <AlertCircle className="h-5 w-5" />;
      case 'Completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'Cancelled':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'from-blue-500 to-cyan-500';
      case 'In Progress':
        return 'from-yellow-500 to-orange-500';
      case 'Completed':
        return 'from-green-500 to-teal-500';
      case 'Cancelled':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const upcomingAppointments = filteredIncidents.filter(incident => {
    const appointmentDate = new Date(incident.appointmentDate);
    const now = new Date();
    return appointmentDate >= now && (incident.status === 'Scheduled' || incident.status === 'In Progress');
  });

  const pastAppointments = filteredIncidents.filter(incident => {
    const appointmentDate = new Date(incident.appointmentDate);
    const now = new Date();
    return appointmentDate < now || incident.status === 'Completed' || incident.status === 'Cancelled';
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            My Appointments 📅
          </h1>
          <p className="text-gray-400 text-lg">
            Track your dental care journey
          </p>
        </div>
      </div>

      {/* Patient Info Card */}
      {patient && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-blue-500/20 backdrop-blur-sm p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{patient.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
              <p className="text-blue-300">Patient ID: {patient.id}</p>
            </div>
            <Heart className="ml-auto h-6 w-6 text-pink-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center text-gray-300">
              <Phone className="h-4 w-4 mr-2 text-blue-400" />
              {patient.contact}
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2 text-blue-400" />
              {patient.address.split(',')[0]}
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              Member since {new Date(patient.memberSince).getFullYear()}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Appointments', emoji: '📋' },
          { key: 'Scheduled', label: 'Upcoming', emoji: '⏰' },
          { key: 'Completed', label: 'Completed', emoji: '✅' },
          { key: 'Cancelled', label: 'Cancelled', emoji: '❌' }
        ].map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === key
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            <span className="mr-2">{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-green-500/20 backdrop-blur-sm">
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="h-6 w-6 mr-3 text-green-400" />
              Upcoming Appointments
              <span className="ml-3 text-sm bg-gradient-to-r from-green-500 to-teal-500 px-3 py-1 rounded-full">
                {upcomingAppointments.length}
              </span>
            </h3>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className={`bg-gradient-to-r ${getStatusColor(appointment.status)}/10 backdrop-blur-sm p-6 rounded-xl border border-${getStatusColor(appointment.status).split('-')[1]}-500/20 hover:border-${getStatusColor(appointment.status).split('-')[1]}-400/40 transition-all duration-200`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`bg-gradient-to-r ${getStatusColor(appointment.status)} p-2 rounded-lg`}>
                          {getStatusIcon(appointment.status)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{appointment.title}</h4>
                          <p className="text-gray-300">{formatDate(appointment.appointmentDate)}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{appointment.description}</p>
                      {appointment.comments && (
                        <div className="bg-white/5 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-400">
                            <strong className="text-white">Note:</strong> {appointment.comments}
                          </p>
                        </div>
                      )}
                      {appointment.treatment && (
                        <div className="flex items-center text-sm text-gray-400">
                          <FileText className="h-4 w-4 mr-2" />
                          Treatment: {appointment.treatment}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r ${getStatusColor(appointment.status)} text-white`}>
                        {appointment.status}
                      </span>
                      {appointment.cost && (
                        <p className="text-2xl font-bold text-white mt-2">
                          ${appointment.cost}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-purple-500/20 backdrop-blur-sm">
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="h-6 w-6 mr-3 text-purple-400" />
              Treatment History
              <span className="ml-3 text-sm bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full">
                {pastAppointments.length}
              </span>
            </h3>
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <div key={appointment.id} className={`bg-gradient-to-r ${getStatusColor(appointment.status)}/10 backdrop-blur-sm p-6 rounded-xl border border-${getStatusColor(appointment.status).split('-')[1]}-500/20 hover:border-${getStatusColor(appointment.status).split('-')[1]}-400/40 transition-all duration-200`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`bg-gradient-to-r ${getStatusColor(appointment.status)} p-2 rounded-lg`}>
                          {getStatusIcon(appointment.status)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{appointment.title}</h4>
                          <p className="text-gray-300">{formatDate(appointment.appointmentDate)}</p>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-3">{appointment.description}</p>
                      {appointment.treatment && (
                        <div className="bg-white/5 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-300">
                            <strong className="text-white">Treatment:</strong> {appointment.treatment}
                          </p>
                        </div>
                      )}
                      {appointment.comments && (
                        <div className="flex items-start text-sm text-gray-400">
                          <FileText className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{appointment.comments}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-gradient-to-r ${getStatusColor(appointment.status)} text-white mb-2`}>
                        {appointment.status}
                      </span>
                      {appointment.cost && (
                        <div className="flex items-center text-white">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span className="text-lg font-bold">${appointment.cost}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Appointments */}
      {filteredIncidents.length === 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-gray-500/20 backdrop-blur-sm">
          <div className="px-6 py-12 text-center">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No appointments found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? "You don't have any appointments yet." 
                : `No ${filter.toLowerCase()} appointments found.`}
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8" />
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Appointments</p>
          <p className="text-3xl font-bold">{patientIncidents.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8" />
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Completed</p>
          <p className="text-3xl font-bold">
            {patientIncidents.filter(i => i.status === 'Completed').length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8" />
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Total Investment</p>
          <p className="text-3xl font-bold">
            ${patientIncidents.reduce((sum, i) => sum + (i.cost || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientAppointments;