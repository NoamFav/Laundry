import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { FACILITIES, ROOMS } from '../config/roomCodes';
import { getNextRoom } from '../config/database';
import { motion } from 'framer-motion';
import { ChefHat, Droplets, FileText, CheckCircle } from 'lucide-react';

export default function Tasks() {
  const { currentRoom } = useAuth();
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    const tasksRef = ref(database, 'tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val() || {
        kitchens: {
          lower: {
            trash: { currentRoom: '1C', lastCompleted: null, nextDue: null },
            cupboard: { currentRoom: '1C', lastCompleted: null, nextDue: null },
            stove: { currentRoom: '1C', lastCompleted: null, nextDue: null }
          },
          upper: {
            trash: { currentRoom: '8C', lastCompleted: null, nextDue: null },
            cupboard: { currentRoom: '8C', lastCompleted: null, nextDue: null },
            stove: { currentRoom: '8C', lastCompleted: null, nextDue: null }
          }
        },
        showers: {
          lower: { currentRoom: '1C', lastCleaned: null, nextDue: null },
          upper: { currentRoom: '8C', lastCleaned: null, nextDue: null }
        },
        toilets: {
          floor0: { paperStatus: 'full', lastChecked: null, currentRoom: null },
          floor1: { paperStatus: 'full', lastChecked: null, currentRoom: '1C' },
          floor2: { paperStatus: 'full', lastChecked: null, currentRoom: '3C' },
          floor3: { paperStatus: 'full', lastChecked: null, currentRoom: '8C' },
          floor4: { paperStatus: 'full', lastChecked: null, currentRoom: '13C' }
        }
      };
      setTasks(data);
    });

    return () => unsubscribe();
  }, []);

  const completeKitchenTask = async (kitchen, taskName) => {
    const facilityConfig = FACILITIES.kitchens[kitchen];
    const currentTaskRoom = tasks.kitchens[kitchen][taskName].currentRoom;
    const nextRoom = getNextRoom(currentTaskRoom, facilityConfig.assignedRooms);

    await set(ref(database, `tasks/kitchens/${kitchen}/${taskName}`), {
      currentRoom: nextRoom,
      lastCompleted: Date.now(),
      nextDue: Date.now() + 7 * 24 * 60 * 60 * 1000
    });
  };

  const completeShowerTask = async (shower) => {
    const facilityConfig = FACILITIES.showers[shower];
    const currentTaskRoom = tasks.showers[shower].currentRoom;
    const nextRoom = getNextRoom(currentTaskRoom, facilityConfig.assignedRooms);

    await set(ref(database, `tasks/showers/${shower}`), {
      currentRoom: nextRoom,
      lastCleaned: Date.now(),
      nextDue: Date.now() + 7 * 24 * 60 * 60 * 1000
    });
  };

  const updateToiletPaper = async (toilet, status) => {
    const currentTaskRoom = tasks.toilets[toilet].currentRoom;
    let nextRoom = currentTaskRoom;

    if (status === 'full' && currentTaskRoom) {
      const facilityConfig = FACILITIES.toilets[toilet];
      if (facilityConfig.assignedRooms.length > 0) {
        nextRoom = getNextRoom(currentTaskRoom, facilityConfig.assignedRooms);
      }
    }

    await set(ref(database, `tasks/toilets/${toilet}`), {
      paperStatus: status,
      lastChecked: Date.now(),
      currentRoom: nextRoom
    });
  };

  if (!tasks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading tasks...</div>
      </div>
    );
  }

  const isMyTask = (taskRoom) => taskRoom === currentRoom.id;

  // Helper to check if user is assigned to a facility
  const isAssignedToFacility = (assignedRooms) => {
    return assignedRooms.includes(currentRoom.id);
  };

  // Get my kitchen
  const myKitchen = Object.entries(FACILITIES.kitchens).find(([_, kitchen]) =>
    kitchen.assignedRooms.includes(currentRoom.id)
  );

  // Get my shower
  const myShower = Object.entries(FACILITIES.showers).find(([_, shower]) =>
    shower.assignedRooms.includes(currentRoom.id)
  );

  // Get my toilet (by floor)
  const myToilet = Object.entries(FACILITIES.toilets).find(([_, toilet]) =>
    toilet.assignedRooms.includes(currentRoom.id)
  );

  const paperStatusColor = {
    full: 'bg-green-500',
    low: 'bg-yellow-500',
    empty: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Tasks</h1>
          <p className="text-gray-600">{currentRoom.displayName}</p>
        </div>

        {/* My Kitchen */}
        {myKitchen && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <ChefHat className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {myKitchen[1].name}
              </h2>
            </div>

            <div className="space-y-2">
              {Object.entries(tasks.kitchens[myKitchen[0]]).map(([taskName, taskData]) => {
                const isMyTaskFlag = isMyTask(taskData.currentRoom);
                return (
                  <motion.div
                    key={taskName}
                    className={`p-4 rounded-lg border-2 ${
                      isMyTaskFlag
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-800 capitalize">
                          {taskName}
                        </div>
                        <div className="text-sm text-gray-600">
                          Current: {ROOMS[taskData.currentRoom]?.name || taskData.currentRoom}
                          {isMyTaskFlag && (
                            <span className="ml-2 text-purple-600 font-semibold">
                              (Your turn!)
                            </span>
                          )}
                        </div>
                      </div>
                      {isMyTaskFlag && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => completeKitchenTask(myKitchen[0], taskName)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* My Shower */}
        {myShower && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Droplets className="w-6 h-6 text-cyan-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {myShower[1].name}
              </h2>
            </div>

            <motion.div
              className={`p-4 rounded-lg border-2 ${
                isMyTask(tasks.showers[myShower[0]].currentRoom)
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold text-gray-800">Cleaning</div>
                  <div className="text-sm text-gray-600">
                    Current: {ROOMS[tasks.showers[myShower[0]].currentRoom]?.name || tasks.showers[myShower[0]].currentRoom}
                    {isMyTask(tasks.showers[myShower[0]].currentRoom) && (
                      <span className="ml-2 text-purple-600 font-semibold">
                        (Your turn!)
                      </span>
                    )}
                  </div>
                </div>
                {isMyTask(tasks.showers[myShower[0]].currentRoom) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => completeShowerTask(myShower[0])}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Done
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* My Toilet */}
        {myToilet && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                {myToilet[1].name} (Paper Status)
              </h2>
            </div>

            <motion.div
              className={`p-4 rounded-lg border-2 ${
                tasks.toilets[myToilet[0]].paperStatus === 'empty'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-800">Toilet Paper</div>
                    {tasks.toilets[myToilet[0]].currentRoom && (
                      <div className="text-sm text-gray-600">
                        Next refill: {ROOMS[tasks.toilets[myToilet[0]].currentRoom]?.name || tasks.toilets[myToilet[0]].currentRoom}
                        {isMyTask(tasks.toilets[myToilet[0]].currentRoom) && (
                          <span className="ml-2 text-purple-600 font-semibold">
                            (Your turn!)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                      paperStatusColor[tasks.toilets[myToilet[0]].paperStatus]
                    }`}
                  >
                    {tasks.toilets[myToilet[0]].paperStatus.toUpperCase()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateToiletPaper(myToilet[0], 'full')}
                    className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg font-semibold shadow text-sm"
                  >
                    Full
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateToiletPaper(myToilet[0], 'low')}
                    className="flex-1 bg-yellow-500 text-white px-3 py-2 rounded-lg font-semibold shadow text-sm"
                  >
                    Low
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateToiletPaper(myToilet[0], 'empty')}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold shadow text-sm"
                  >
                    Empty
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
