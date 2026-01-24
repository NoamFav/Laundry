import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ROOMS, getAllRoomIds } from '../config/roomCodes';
import { motion } from 'framer-motion';
import { Home, UserCheck, UserX, HelpCircle } from 'lucide-react';

export default function Presence() {
  const { currentRoom } = useAuth();
  const [presence, setPresence] = useState({});

  useEffect(() => {
    const presenceRef = ref(database, 'presence');
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPresence(data);
    });

    return () => unsubscribe();
  }, []);

  const toggleMyPresence = () => {
    const currentStatus = presence[currentRoom.id];
    let newStatus;

    if (currentStatus === 'N/A' || currentStatus === null || currentStatus === undefined) {
      newStatus = Date.now(); // Home
    } else if (currentStatus) {
      newStatus = false; // Away
    } else {
      newStatus = 'N/A'; // N/A
    }

    set(ref(database, `presence/${currentRoom.id}`), newStatus);
  };

  // Get status for a room
  const getRoomStatus = (roomId) => {
    const status = presence[roomId];
    if (status === 'N/A' || status === null || status === undefined) {
      return 'N/A';
    } else if (status) {
      return 'home';
    } else {
      return 'away';
    }
  };

  const myStatus = getRoomStatus(currentRoom.id);

  // Count statistics (excluding N/A)
  const homeCount = getAllRoomIds().filter(
    (id) => getRoomStatus(id) === 'home'
  ).length;
  const awayCount = getAllRoomIds().filter(
    (id) => getRoomStatus(id) === 'away'
  ).length;
  const naCount = getAllRoomIds().filter(
    (id) => getRoomStatus(id) === 'N/A'
  ).length;

  const getStatusIcon = (status) => {
    if (status === 'home') return <UserCheck className="w-5 h-5 text-green-600" />;
    if (status === 'away') return <UserX className="w-5 h-5 text-gray-400" />;
    return <HelpCircle className="w-5 h-5 text-blue-400" />;
  };

  const getStatusColor = (status) => {
    if (status === 'home') return 'border-green-500 bg-green-50';
    if (status === 'away') return 'border-gray-300 bg-gray-50';
    return 'border-blue-300 bg-blue-50';
  };

  const getStatusText = (status) => {
    if (status === 'home') return 'Home';
    if (status === 'away') return 'Away';
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Who's Home?</h1>
          <p className="text-gray-600">Track household presence</p>
        </div>

        {/* Quick Toggle for Current User */}
        <motion.div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">{currentRoom.displayName}</h2>
              <p className="text-purple-100 text-sm">Your Status</p>
            </div>
            <Home className="w-8 h-8" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleMyPresence}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 ${
              myStatus === 'home'
                ? 'bg-green-500 hover:bg-green-600'
                : myStatus === 'away'
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {getStatusIcon(myStatus)}
            {myStatus === 'home' ? "I'm Home" : myStatus === 'away' ? "I'm Away" : "Status Unknown"}
          </motion.button>

          <p className="text-sm text-purple-100 mt-3 text-center">
            Tap to cycle: {myStatus === 'N/A' ? 'N/A → Home' : myStatus === 'home' ? 'Home → Away' : 'Away → N/A'}
          </p>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{homeCount}</div>
            <div className="text-sm text-gray-600 mt-1">Home</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-400">{awayCount}</div>
            <div className="text-sm text-gray-600 mt-1">Away</div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{naCount}</div>
            <div className="text-sm text-gray-600 mt-1">N/A</div>
          </div>
        </div>

        {/* All Rooms by Floor */}
        {[1, 2, 3, 4].map((floor) => {
          const roomsOnFloor = getAllRoomIds().filter(
            (id) => ROOMS[id].floor === floor
          );

          if (roomsOnFloor.length === 0) return null;

          return (
            <div key={floor} className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Floor {floor}</h3>

              <div className="grid grid-cols-2 gap-3">
                {roomsOnFloor.map((roomId) => {
                  const status = getRoomStatus(roomId);
                  const isCurrentRoom = roomId === currentRoom.id;

                  return (
                    <div
                      key={roomId}
                      className={`p-4 rounded-xl border-2 ${getStatusColor(status)} ${
                        isCurrentRoom ? 'ring-2 ring-purple-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-semibold text-gray-800">
                            {ROOMS[roomId].name}
                            {isCurrentRoom && (
                              <span className="ml-1 text-purple-600 text-xs">(You)</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">{roomId}</div>
                        </div>
                        {getStatusIcon(status)}
                      </div>
                      <div className="mt-2 text-xs font-medium text-gray-700">
                        {getStatusText(status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm text-gray-700">
          <p className="font-semibold mb-1">ℹ️ How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>You can only update your own status</li>
            <li>Default status is "N/A" (unknown)</li>
            <li>Tap your status card to cycle through options</li>
            <li>Others can see your status in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
