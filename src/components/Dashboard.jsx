import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { UserRoles } from '../types/index.js';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  TrendingUp,
  User,
  FileText,
  Sparkles,
  Zap,
  Heart,
  Star,
  Trophy,
  Target
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardStats, patients, incidents, getPatientIncidents } = useData();

  const isAdmin = user?.role === UserRoles.ADMIN;

  const getUpcomingAppointments = () => {
    const now = new Date();
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
    
    let appointmentsToShow = incidents;
    
    if (!isAdmin && user?.patientId) {
      appointmentsToShow = getPatientIncidents(user.patientId);
    }
    
    return appointmentsToShow
      .filter(incident => {
        const appointmentDate = new Date(incident.appointmentDate);
        return appointmentDate >= now && appointmentDate <= tenDaysFromNow && 
               (incident.status === 'Scheduled' || incident.status === 'In Progress');
      })
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime())
      .slice(0, 10);
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const upcomingAppointments = getUpcomingAppointments();

  const StatCard = ({ icon: Icon, title, value, gradient, emoji, trend }) => (
    <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/20 p-3 rounded-xl">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl">{emoji}</span>
      </div>
      <div className="text-white">
        <p className="text-sm opacity-90 mb-1">{title}</p>
        <p className="text-3xl font-bold mb-2">{value}</p>
        {trend && (
          <div className="flex items-center text-xs opacity-75">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Welcome back, {user?.name?.split(' ')[1] || 'Doctor'} ✨
            </h1>
            <p className="text-gray-400 text-lg">
              Here's what's happening at your dental practice today
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-purple-500/30">
              <div className="text-purple-300 text-sm">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            title="Total Patients"
            value={dashboardStats.totalPatients}
            gradient="from-blue-500 to-cyan-500"
            emoji="👥"
            trend="+12% this month"
          />
          <StatCard
            icon={Calendar}
            title="Total Appointments"
            value={dashboardStats.totalAppointments}
            gradient="from-green-500 to-teal-500"
            emoji="📅"
            trend="+8% this week"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed Treatments"
            value={dashboardStats.completedTreatments}
            gradient="from-purple-500 to-pink-500"
            emoji="✅"
            trend="95% success rate"
          />
          <StatCard
            icon={Clock}
            title="Pending Appointments"
            value={dashboardStats.pendingAppointments}
            gradient="from-orange-500 to-red-500"
            emoji="⏰"
            trend="Next 7 days"
          />
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white/20 p-4 rounded-xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <Trophy className="h-6 w-6 text-yellow-300" />
              </div>
            </div>
            <div className="text-white">
              <p className="text-sm opacity-90 mb-2">Monthly Revenue</p>
              <p className="text-4xl font-bold mb-2">${dashboardStats.monthlyRevenue.toLocaleString()}</p>
              <div className="flex items-center text-sm opacity-75">
                <TrendingUp className="h-4 w-4 mr-2" />
                +15% from last month
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-xl border border-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-white/20 p-4 rounded-xl">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <Star className="h-6 w-6 text-yellow-300" />
              </div>
            </div>
            <div className="text-white">
              <p className="text-sm opacity-90 mb-2">Weekly Revenue</p>
              <p className="text-4xl font-bold mb-2">${dashboardStats.weeklyRevenue.toLocaleString()}</p>
              <div className="flex items-center text-sm opacity-75">
                <Zap className="h-4 w-4 mr-2" />
                On track for monthly goal
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-purple-500/20 backdrop-blur-sm">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <Sparkles className="h-6 w-6 mr-3 text-purple-400" />
                Upcoming Appointments
                <span className="ml-3 text-sm bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full">
                  Next 10 Days
                </span>
              </h3>
            </div>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white">
                            {getPatientName(appointment.patientId)}
                          </p>
                          <p className="text-purple-300">{appointment.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {formatDate(appointment.appointmentDate)}
                        </p>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          appointment.status === 'Scheduled' 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-purple-400 mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No upcoming appointments</h3>
                <p className="text-purple-300">
                  Enjoy your free time! 🌟
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Patient Dashboard
  const patientIncidents = user?.patientId ? getPatientIncidents(user.patientId) : [];
  const completedTreatments = patientIncidents.filter(i => i.status === 'Completed');
  const totalCost = completedTreatments.reduce((sum, i) => sum + (i.cost || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Hello, {user?.name} 👋
          </h1>
          <p className="text-gray-400 text-lg">
            Your dental health journey continues here
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-blue-500/30">
            <div className="text-blue-300 text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Patient Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          icon={FileText}
          title="Total Appointments"
          value={patientIncidents.length}
          gradient="from-blue-500 to-cyan-500"
          emoji="📋"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed Treatments"
          value={completedTreatments.length}
          gradient="from-green-500 to-teal-500"
          emoji="✅"
        />
        <StatCard
          icon={DollarSign}
          title="Total Investment"
          value={`$${totalCost.toLocaleString()}`}
          gradient="from-purple-500 to-pink-500"
          emoji="💰"
        />
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-blue-500/20 backdrop-blur-sm">
        <div className="px-6 py-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Heart className="h-6 w-6 mr-3 text-pink-400" />
            Your Upcoming Appointments
          </h3>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm p-6 rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-medium text-white mb-2">{appointment.title}</h4>
                      <p className="text-blue-300 mb-3">{appointment.description}</p>
                      {appointment.comments && (
                        <p className="text-sm text-gray-400">
                          <strong>Note:</strong> {appointment.comments}
                        </p>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-white font-medium mb-2">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === 'Scheduled' 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-16 w-16 text-blue-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No upcoming appointments</h3>
              <p className="text-blue-300">
                You're all caught up! 😊
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Treatment History */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl border border-green-500/20 backdrop-blur-sm">
        <div className="px-6 py-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Star className="h-6 w-6 mr-3 text-yellow-400" />
            Recent Treatment History
          </h3>
          {completedTreatments.length > 0 ? (
            <div className="space-y-4">
              {completedTreatments.slice(0, 5).map((treatment) => (
                <div key={treatment.id} className="bg-gradient-to-r from-green-500/10 to-teal-500/10 backdrop-blur-sm p-6 rounded-xl border border-green-500/20 hover:border-green-400/40 transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-medium text-white mb-2">{treatment.title}</h4>
                      <p className="text-green-300 mb-2">{treatment.treatment}</p>
                      <p className="text-sm text-gray-400">
                        Completed: {formatDate(treatment.updatedAt)}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      {treatment.cost && (
                        <p className="text-2xl font-bold text-white mb-2">
                          ${treatment.cost}
                        </p>
                      )}
                      <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                        Completed ✅
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-green-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No completed treatments yet</h3>
              <p className="text-green-300">
                Your treatment history will appear here 🦷
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;