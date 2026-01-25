import { motion } from 'framer-motion';
import { X, ChefHat, Droplets, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { FACILITIES, ROOMS } from '../../config/roomCodes';

export default function TaskModal({ onClose }) {
  const { currentRoom } = useAuth();
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    const tasksRef = ref(database, 'tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      setTasks(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  if (!tasks) return null;

  // Get my kitchen
  const myKitchen = Object.entries(FACILITIES.kitchens).find(([_, kitchen]) =>
    kitchen.assignedRooms.includes(currentRoom.id)
  );

  // Get my shower
  const myShower = Object.entries(FACILITIES.showers).find(([_, shower]) =>
    shower.assignedRooms.includes(currentRoom.id)
  );

  // Get my toilet
  const myToilet = Object.entries(FACILITIES.toilets).find(([_, toilet]) =>
    toilet.assignedRooms.includes(currentRoom.id)
  );

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
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Your Tasks</h2>
            <p className="text-green-100 text-sm mt-1">{currentRoom.displayName}</p>
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
          {/* Kitchen Tasks */}
          {myKitchen && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <ChefHat className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">{myKitchen[1].name}</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(tasks.kitchens[myKitchen[0]]).map(([taskName, taskData]) => (
                  <div key={taskName} className="p-3 bg-white rounded-lg border-2 border-gray-200">
                    <div className="font-semibold text-gray-800 capitalize">{taskName}</div>
                    <div className="text-sm text-gray-600">
                      Current: {ROOMS[taskData.currentRoom]?.name || taskData.currentRoom}
                      {taskData.currentRoom === currentRoom.id && (
                        <span className="ml-2 text-purple-600 font-semibold">(Your turn!)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shower Tasks */}
          {myShower && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Droplets className="w-6 h-6 text-cyan-600" />
                <h3 className="text-xl font-semibold text-gray-800">{myShower[1].name}</h3>
              </div>
              <div className="p-3 bg-white rounded-lg border-2 border-gray-200">
                <div className="font-semibold text-gray-800">Cleaning</div>
                <div className="text-sm text-gray-600">
                  Current: {ROOMS[tasks.showers[myShower[0]].currentRoom]?.name}
                  {tasks.showers[myShower[0]].currentRoom === currentRoom.id && (
                    <span className="ml-2 text-purple-600 font-semibold">(Your turn!)</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toilet Paper */}
          {myToilet && (
            <div className="bg-gray-50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-800">{myToilet[1].name}</h3>
              </div>
              <div className="p-3 bg-white rounded-lg border-2 border-gray-200">
                <div className="font-semibold text-gray-800">Toilet Paper Status</div>
                <div className="text-sm text-gray-600 mt-1">
                  Status: <span className="font-bold uppercase">{tasks.toilets[myToilet[0]].paperStatus}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
