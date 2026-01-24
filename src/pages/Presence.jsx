import { useState, useEffect } from "react";
import { ref, onValue, set } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { ROOMS, getAllRoomIds } from "../config/roomCodes";
import { motion } from "framer-motion";
import { Home, UserCheck, UserX } from "lucide-react";

export default function Presence() {
    const { currentRoom } = useAuth();
    const [presence, setPresence] = useState({});

    useEffect(() => {
        const presenceRef = ref(database, "presence");
        const unsubscribe = onValue(presenceRef, (snapshot) => {
            const data = snapshot.val() || {};
            setPresence(data);
        });

        return () => unsubscribe();
    }, []);

    const togglePresence = async (roomId) => {
        const currentStatus = presence[roomId];
        const newStatus = currentStatus ? false : Date.now();

        await set(ref(database, `presence/${roomId}`), newStatus);
    };

    const toggleMyPresence = () => {
        togglePresence(currentRoom.id);
    };

    const occupiedRooms = getAllRoomIds().filter((id) => presence[id]);
    const emptyRooms = getAllRoomIds().filter((id) => !presence[id]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-24">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center py-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Who's Home?
                    </h1>
                    <p className="text-gray-600">Track household presence</p>
                </div>

                {/* Quick Toggle for Current User */}
                <motion.div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">
                                {currentRoom.name}
                            </h2>
                            <p className="text-purple-100 text-sm">
                                Quick Status Toggle
                            </p>
                        </div>
                        <Home className="w-8 h-8" />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleMyPresence}
                        className={`w-full py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 ${
                            presence[currentRoom.id]
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-600 hover:bg-gray-700"
                        }`}
                    >
                        {presence[currentRoom.id] ? (
                            <>
                                <UserCheck className="w-5 h-5" />
                                I'm Home
                            </>
                        ) : (
                            <>
                                <UserX className="w-5 h-5" />
                                I'm Out
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <div className="text-3xl font-bold text-green-600">
                            {occupiedRooms.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Home</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <div className="text-3xl font-bold text-gray-400">
                            {emptyRooms.length}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Out</div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-4 text-center">
                        <div className="text-3xl font-bold text-purple-600">
                            {Math.round((occupiedRooms.length / 14) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                            Occupied
                        </div>
                    </div>
                </div>

                {/* All Rooms by Floor */}
                {[0, 1, 2, 3, 4].map((floor) => {
                    const roomsOnFloor = getAllRoomIds().filter(
                        (id) => ROOMS[id].floor === floor,
                    );

                    if (roomsOnFloor.length === 0 && floor !== 0) return null;

                    return (
                        <div
                            key={floor}
                            className="bg-white rounded-2xl shadow-lg p-6"
                        >
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                {floor === 0
                                    ? "Ground Floor"
                                    : `Floor ${floor}`}
                            </h3>

                            {floor === 0 ? (
                                <div className="text-center text-gray-500 py-4">
                                    Ground floor is laundry - no rooms
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {roomsOnFloor.map((roomId) => {
                                        const isHome = presence[roomId];
                                        const isCurrentRoom =
                                            roomId === currentRoom.id;

                                        return (
                                            <motion.button
                                                key={roomId}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() =>
                                                    togglePresence(roomId)
                                                }
                                                className={`p-4 rounded-xl border-2 transition-all ${
                                                    isHome
                                                        ? "border-green-500 bg-green-50"
                                                        : "border-gray-300 bg-gray-50"
                                                } ${isCurrentRoom ? "ring-2 ring-purple-500" : ""}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="text-left">
                                                        <div className="font-semibold text-gray-800">
                                                            {roomId}
                                                            {isCurrentRoom && (
                                                                <span className="ml-1 text-purple-600 text-xs">
                                                                    (You)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-gray-600">
                                                            {ROOMS[roomId].name}
                                                        </div>
                                                    </div>
                                                    {isHome ? (
                                                        <UserCheck className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <UserX className="w-5 h-5 text-gray-400" />
                                                    )}
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
