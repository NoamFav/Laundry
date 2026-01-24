import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function WashingMachine({
    status,
    program,
    onStart,
    onStop,
    currentUser,
    queue = [],
}) {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        if (status === "running") {
            const interval = setInterval(() => {
                setRotation((prev) => (prev + 10) % 360);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [status]);

    const getStatusColor = () => {
        switch (status) {
            case "running":
                return "from-blue-400 to-blue-600";
            case "done":
                return "from-green-400 to-green-600";
            default:
                return "from-gray-300 to-gray-400";
        }
    };

    return (
        <div className="relative">
            {/* Machine body */}
            <motion.div
                className={`relative w-full aspect-square rounded-3xl bg-gradient-to-br ${getStatusColor()} shadow-2xl p-6`}
                animate={
                    status === "done"
                        ? {
                              scale: [1, 1.02, 1],
                              boxShadow: [
                                  "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                                  "0 20px 25px -5px rgba(34, 197, 94, 0.4)",
                                  "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                              ],
                          }
                        : {}
                }
                transition={{
                    duration: 1,
                    repeat: status === "done" ? Infinity : 0,
                    repeatType: "loop",
                }}
            >
                {/* Display panel */}
                <div className="bg-gray-900 rounded-xl p-3 mb-4">
                    <div className="text-green-400 font-mono text-xs mb-1">
                        {status === "idle" && "READY"}
                        {status === "running" &&
                            `WASHING${".".repeat((rotation / 120) % 4)}`}
                        {status === "done" && "COMPLETE!"}
                    </div>
                    {program && (
                        <div className="text-white text-sm font-semibold">
                            {program.name}
                        </div>
                    )}
                    {currentUser && (
                        <div className="text-gray-400 text-xs mt-1">
                            User: {currentUser}
                        </div>
                    )}
                </div>

                {/* Door/Window */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-full aspect-square border-8 border-gray-700 overflow-hidden">
                    {/* Water effect */}
                    {status === "running" && (
                        <motion.div
                            className="absolute inset-0 bg-blue-300 opacity-30"
                            animate={{
                                y: ["100%", "0%", "100%"],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    )}

                    {/* Rotating drum interior */}
                    <motion.div
                        className="absolute inset-4 rounded-full border-4 border-gray-600"
                        style={{
                            rotate: rotation,
                        }}
                    >
                        {/* Drum ridges */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    transform: `rotate(${i * 60}deg)`,
                                }}
                            >
                                <div className="h-full w-2 bg-gray-500" />
                            </div>
                        ))}

                        {/* Clothes representation */}
                        {status !== "idle" && (
                            <>
                                <motion.div
                                    className="absolute top-1/4 left-1/4 w-8 h-8 bg-red-400 rounded-full opacity-70"
                                    animate={
                                        status === "running"
                                            ? { x: [0, 10, 0], y: [0, -10, 0] }
                                            : {}
                                    }
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                />
                                <motion.div
                                    className="absolute top-1/3 right-1/4 w-6 h-6 bg-blue-300 rounded-full opacity-70"
                                    animate={
                                        status === "running"
                                            ? { x: [0, -8, 0], y: [0, 8, 0] }
                                            : {}
                                    }
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                    }}
                                />
                                <motion.div
                                    className="absolute bottom-1/3 left-1/3 w-7 h-7 bg-yellow-300 rounded-full opacity-70"
                                    animate={
                                        status === "running"
                                            ? { x: [0, 5, 0], y: [0, 10, 0] }
                                            : {}
                                    }
                                    transition={{
                                        duration: 1.8,
                                        repeat: Infinity,
                                    }}
                                />
                            </>
                        )}
                    </motion.div>

                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                </div>

                {/* Control buttons */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    {status === "idle" && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStart}
                            className="flex-1 bg-white text-gray-800 font-bold py-2 px-4 rounded-lg shadow-lg"
                        >
                            START
                        </motion.button>
                    )}
                    {(status === "running" || status === "done") && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onStop}
                            className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
                        >
                            {status === "running" ? "STOP" : "CLEAR"}
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Queue indicator */}
            {queue && queue.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 bg-white rounded-lg p-3 shadow-lg"
                >
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                        Queue ({queue.length})
                    </div>
                    {queue.slice(0, 3).map((item, index) => (
                        <div
                            key={index}
                            className="text-xs text-gray-600 py-1 border-b last:border-b-0"
                        >
                            {index + 1}. {item.roomId} - {item.program}
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
