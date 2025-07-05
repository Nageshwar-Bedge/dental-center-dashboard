import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserRoles } from '../types/index.js';
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  LogOut, 
  Menu,
  X,
  Sparkles,
  Zap,
  Heart,
  Star
} from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === UserRoles.ADMIN;

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: BarChart3, 
      adminOnly: false,
      gradient: 'from-purple-500 to-pink-500',
      emoji: '📊'
    },
    { 
      name: 'Patients', 
      href: '/patients', 
      icon: Users, 
      adminOnly: true,
      gradient: 'from-blue-500 to-cyan-500',
      emoji: '👥'
    },
    { 
      name: 'Appointments', 
      href: '/appointments', 
      icon: FileText, 
      adminOnly: true,
      gradient: 'from-green-500 to-teal-500',
      emoji: '📋'
    },
    { 
      name: 'Calendar', 
      href: '/calendar', 
      icon: Calendar, 
      adminOnly: true,
      gradient: 'from-orange-500 to-red-500',
      emoji: '📅'
    },
    { 
      name: 'My Appointments', 
      href: '/my-appointments', 
      icon: Calendar, 
      adminOnly: false, 
      patientOnly: true,
      gradient: 'from-indigo-500 to-purple-500',
      emoji: '🗓️'
    }
  ];

  const filteredNavigation = navigation.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    if (item.patientOnly && isAdmin) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="fixed top-0 left-0 w-80 h-full bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl border-r border-gray-500/20">
          <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl">DentalCare Pro</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="mt-8 px-4">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.emoji}</span>
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {isActive && <Star className="ml-auto h-4 w-4" />}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-gradient-to-r from-gray-700/20 to-gray-900/20 backdrop-blur-sm p-4 rounded-xl border border-gray-500/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{user?.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-xs text-gray-300">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl border-r border-gray-500/20">
          <div className="flex items-center h-16 flex-shrink-0 px-6 bg-gradient-to-r from-purple-600 to-pink-600">
            <div className="bg-white/20 p-2 rounded-lg mr-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">DentalCare Pro</span>
            <Zap className="ml-auto h-5 w-5 text-yellow-300" />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105`
                        : 'text-gray-300 hover:bg-white/10 hover:text-white hover:scale-102'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.emoji}</span>
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {isActive && <Star className="ml-auto h-4 w-4" />}
                  </Link>
                );
              })}
            </nav>
            <div className="flex-shrink-0 p-4">
              <div className="bg-gradient-to-r from-gray-700/20 to-gray-900/20 backdrop-blur-sm p-4 rounded-xl border border-gray-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{user?.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user?.name || user?.email}
                    </p>
                    <p className="text-xs text-gray-300">{user?.role}</p>
                    {user?.specialty && (
                      <p className="text-xs text-gray-400">{user?.specialty}</p>
                    )}
                  </div>
                  <Heart className="h-4 w-4 text-pink-400" />
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg border-b border-gray-500/20">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <span className="text-white font-bold">DentalCare Pro</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="flex-1 min-h-screen">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
