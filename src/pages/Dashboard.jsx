import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import House3D from "../components/House3D";
import { motion } from "framer-motion";
import { Home, Waves, Wind, Trash2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { currentRoom } = useAuth();
    const navigate = useNavigate();
    const [presence, setPresence] = useState({});
    const [laundryStatus, setLaundryStatus] = useState({
        washer: null,
        dryer: null,
    });

    useEffect(() => {
        // Subscribe to presence data
        const presenceRef = ref(database, "presence");
        const unsubPresence = onValue(presenceRef, (snapshot) => {
            const data = snapshot.val() || {};
            setPresence(data);
        });

        // Subscribe to laundry status
        const washerRef = ref(database, "laundry/washingMachine/status");
        const dryerRef = ref(database, "laundry/dryer/status");

        const unsubWasher = onValue(washerRef, (snapshot) => {
            setLaundryStatus((prev) => ({ ...prev, washer: snapshot.val() }));
        });

        const unsubDryer = onValue(dryerRef, (snapshot) => {
            setLaundryStatus((prev) => ({ ...prev, dryer: snapshot.val() }));
        });

        return () => {
            unsubPresence();
            unsubWasher();
            unsubDryer();
        };
    }, []);

    const handleRoomClick = (roomId) => {
        console.log("Room clicked:", roomId);
        // Could navigate to room details or show modal
    };

    const getStatusBadge = (status) => {
        const badges = {
            idle: { color: "bg-gray-400", text: "Idle" },
            running: { color: "bg-blue-500", text: "Running" },
            done: { color: "bg-green-500", text: "Done" },
        };
        return badges[status] || badges.idle;
    };

    const occupiedCount = Object.values(presence).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 pb-24">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-1">
                                Welcome Back!
                            </h1>
                            <p className="text-gray-600">
                                {currentRoom.name} • Floor {currentRoom.floor}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-gray-600 mb-1">
                                <Users className="w-5 h-5" />
                                <span className="text-sm">Home</span>
                            </div>
                            <div className="text-2xl font-bold text-purple-600">
                                {occupiedCount}/14
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D House View */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        House Overview
                    </h2>
                    <House3D
                        occupancy={presence}
                        onRoomClick={handleRoomClick}
                    />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/laundry")}
                        className="bg-white rounded-2xl shadow-lg p-6 text-left"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <Waves className="w-8 h-8 text-blue-500" />
                            <span
                                className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                                    getStatusBadge(laundryStatus.washer).color
                                }`}
                            >
                                {getStatusBadge(laundryStatus.washer).text}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Washing Machine
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Ground Floor
                        </p>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/laundry")}
                        className="bg-white rounded-2xl shadow-lg p-6 text-left"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <Wind className="w-8 h-8 text-orange-500" />
                            <span
                                className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                                    getStatusBadge(laundryStatus.dryer).color
                                }`}
                            >
                                {getStatusBadge(laundryStatus.dryer).text}
                            </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">
                            Dryer
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            Ground Floor
                        </p>
                    </motion.button>
                </div>

                {/* Quick Access Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/tasks")}
                        className="bg-gradient-to-br from-green-400 to-green-600 text-white rounded-2xl shadow-lg p-6"
                    >
                        <Trash2 className="w-8 h-8 mb-2" />
                        <h3 className="text-lg font-semibold">Tasks</h3>
                        <p className="text-sm text-green-100 mt-1">
                            Kitchen, Shower, Toilet
                        </p>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/presence")}
                        className="bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl shadow-lg p-6"
                    >
                        <Users className="w-8 h-8 mb-2" />
                        <h3 className="text-lg font-semibold">Who's Home</h3>
                        <p className="text-sm text-purple-100 mt-1">
                            Track presence
                        </p>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
