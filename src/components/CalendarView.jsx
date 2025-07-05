import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Plus } from 'lucide-react';

const CalendarView = () => {
  const { incidents, patients } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient?.name || 'Unknown Patient';
  };

  const getAppointmentsForDate = (date) => {
    const dateString = date.toDateString();
    return incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return appointmentDate.toDateString() === dateString &&
             (incident.status === 'Scheduled' || incident.status === 'In Progress');
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      const days = direction === 'prev' ? -7 : 7;
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateForComparison = new Date();
    currentDateForComparison.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === currentDateForComparison.toDateString();
      const appointments = getAppointmentsForDate(date);

      days.push(
        <div
          key={date.toISOString()}
          className={`min-h-[100px] border border-gray-200 p-2 ${
            isCurrentMonth ? 'bg-white' : 'bg-gray-50'
          } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
          } ${isToday ? 'text-blue-600 font-bold' : ''}`}>
            {date.getDate()}
          </div>
          <div className="space-y-1">
            {appointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className={`text-xs p-1 rounded border ${getStatusColor(appointment.status)}`}
                title={`${formatTime(appointment.appointmentDate)} - ${appointment.title} (${getPatientName(appointment.patientId)})`}
              >
                <div className="font-medium truncate">
                  {formatTime(appointment.appointmentDate)}
                </div>
                <div className="truncate">
                  {appointment.title}
                </div>
                <div className="truncate text-xs opacity-75">
                  {getPatientName(appointment.patientId)}
                </div>
              </div>
            ))}
            {appointments.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{appointments.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 p-3 text-center text-sm font-medium text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const isToday = date.toDateString() === today.toDateString();
      const appointments = getAppointmentsForDate(date);

      days.push(
        <div key={date.toISOString()} className="flex-1">
          <div className={`text-center p-3 border-b border-gray-200 ${
            isToday ? 'bg-blue-50 text-blue-700 font-bold' : 'bg-gray-50 text-gray-700'
          }`}>
            <div className="text-xs font-medium">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg ${isToday ? 'font-bold' : 'font-medium'}`}>
              {date.getDate()}
            </div>
          </div>
          <div className="p-2 space-y-2 min-h-[400px]">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-3 rounded-lg border ${getStatusColor(appointment.status)}`}
              >
                <div className="font-medium text-sm mb-1">
                  {formatTime(appointment.appointmentDate)}
                </div>
                <div className="font-medium text-sm mb-1">
                  {appointment.title}
                </div>
                <div className="text-xs opacity-75">
                  {getPatientName(appointment.patientId)}
                </div>
                {appointment.description && (
                  <div className="text-xs mt-1 opacity-60">
                    {appointment.description.slice(0, 50)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex">
          {days}
        </div>
      </div>
    );
  };

  const currentMonthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const currentWeekRange = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Calendar</h1>
          <p className="mt-1 text-sm text-gray-300">
            View and manage appointment schedules
          </p>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => view === 'month' ? navigateMonth('prev') : navigateWeek('prev')}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <h2 className="text-lg font-semibold text-white min-w-[200px] text-center">
                {view === 'month' ? currentMonthYear : currentWeekRange()}
            </h2>
            <button
              onClick={() => view === 'month' ? navigateMonth('next') : navigateWeek('next')}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-white border border-white rounded-md hover:bg-white hover:text-blue-700 transition-colors"
    >
            Today
          </button>
          </div>

        <div className="flex items-center space-x-4">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                view === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                view === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span className="text-sm text-gray-600">Scheduled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span className="text-sm text-gray-600">In Progress</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {incidents.filter(i => i.status === 'Scheduled' || i.status === 'In Progress').length} total appointments
          </span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-sm">
        {view === 'month' ? renderMonthView() : renderWeekView()}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Today's Appointments
          </h3>
          {(() => {
            const today = new Date();
            const todayAppointments = getAppointmentsForDate(today);
            
            if (todayAppointments.length > 0) {
              return (
                <div className="space-y-3">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatTime(appointment.appointmentDate)} - {appointment.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            <User className="inline h-4 w-4 mr-1" />
                            {getPatientName(appointment.patientId)}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              );
            } else {
              return (
                <p className="text-gray-500 text-center py-8">
                  No appointments scheduled for today
                </p>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;