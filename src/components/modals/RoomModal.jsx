import { motion } from 'framer-motion';
import { X, Home, UserCheck, UserX, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ROOMS } from '../../config/roomCodes';

export default function RoomModal({ roomId, onClose }) {
  const { currentRoom } = useAuth();
  const [presence, setPresence] = useState({});
  const room = ROOMS[roomId];
  const isMyRoom = roomId === currentRoom.id;

  useEffect(() => {
    const presenceRef = ref(database, 'presence');
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      setPresence(snapshot.val() || {});
    });
    return () => unsubscribe();
  }, []);

  const getRoomStatus = (rid) => {
    const status = presence[rid];
    if (status === 'N/A' || status === null || status === undefined) return 'N/A';
    else if (status) return 'home';
    else return 'away';
  };

  const toggleMyPresence = () => {
    if (!isMyRoom) return;

    const currentStatus = presence[roomId];
    let newStatus;

    if (currentStatus === 'N/A' || currentStatus === null || currentStatus === undefined) {
      newStatus = Date.now(); // Home
    } else if (currentStatus) {
      newStatus = false; // Away
    } else {
      newStatus = 'N/A'; // N/A
    }

    set(ref(database, `presence/${roomId}`), newStatus);
  };

  const status = getRoomStatus(roomId);

  const getStatusIcon = (s) => {
    if (s === 'home') return <UserCheck className="w-8 h-8 text-green-600" />;
    if (s === 'away') return <UserX className="w-8 h-8 text-gray-400" />;
    return <HelpCircle className="w-8 h-8 text-blue-400" />;
  };

  const getStatusColor = (s) => {
    if (s === 'home') return 'from-green-400 to-green-600';
    if (s === 'away') return 'from-gray-400 to-gray-600';
    return 'from-blue-400 to-blue-600';
  };

  const getStatusText = (s) => {
    if (s === 'home') return "I'm Home";
    if (s === 'away') return "I'm Away";
    return 'Status Unknown';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getStatusColor(status)} text-white p-6 rounded-t-3xl flex justify-between items-center`}>
          <div>
            <h2 className="text-3xl font-bold">{room?.displayName || roomId}</h2>
            <p className="text-sm opacity-90 mt-1">Floor {room?.floor}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              {getStatusIcon(status)}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{getStatusText(status)}</h3>
          </div>

          {isMyRoom ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleMyPresence}
                className={`w-full py-4 rounded-xl font-semibold shadow-lg text-white bg-gradient-to-r ${getStatusColor(status)}`}
              >
                Tap to Change Status
              </motion.button>

              <p className="text-sm text-gray-600 text-center">
                Cycle: {status === 'N/A' ? 'N/A → Home' : status === 'home' ? 'Home → Away' : 'Away → N/A'}
              </p>
            </>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-gray-600">You can only change your own status</p>
              <p className="text-sm text-gray-500 mt-2">This is {room?.name}'s room</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
