import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Waves, ClipboardList, Users, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/laundry', icon: Waves, label: 'Laundry' },
    { path: '/tasks', icon: ClipboardList, label: 'Tasks' },
    { path: '/presence', icon: Users, label: 'Presence' }
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-2xl mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;

            return (
              <motion.button
                key={path}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full"
                  />
                )}
              </motion.button>
            );
          })}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex flex-col items-center justify-center px-4 py-2 rounded-lg text-red-600 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
