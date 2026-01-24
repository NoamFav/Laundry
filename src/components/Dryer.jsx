import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Dryer({
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
                setRotation((prev) => (prev + 8) % 360);
            }, 50);
            return () => clearInterval(interval);
        }
    }, [status]);

    const getStatusColor = () => {
        switch (status) {
            case "running":
                return "from-orange-400 to-red-500";
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
                    <div className="text-orange-400 font-mono text-xs mb-1">
                        {status === "idle" && "READY"}
                        {status === "running" &&
                            `DRYING${".".repeat((rotation / 120) % 4)}`}
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
                    {status === "running" && (
                        <div className="flex items-center gap-1 mt-2">
                            <div className="text-red-400 text-xs">🔥</div>
                            <div className="text-xs text-gray-400">
                                Heat Active
                            </div>
                        </div>
                    )}
                </div>

                {/* Door/Window */}
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-full aspect-square border-8 border-gray-700 overflow-hidden">
                    {/* Heat waves effect */}
                    {status === "running" && (
                        <>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent"
                                animate={{
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                            {/* Heat shimmer lines */}
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent"
                                    style={{ top: `${30 + i * 15}%` }}
                                    animate={{
                                        x: ["-100%", "100%"],
                                    }}
                                    transition={{
                                        duration: 1.5 + i * 0.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                />
                            ))}
                        </>
                    )}

                    {/* Rotating drum interior */}
                    <motion.div
                        className="absolute inset-4 rounded-full border-4 border-gray-600"
                        style={{
                            rotate: rotation,
                        }}
                    >
                        {/* Drum ridges (tumbler fins) */}
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute inset-0 flex items-center justify-center"
                                style={{
                                    transform: `rotate(${i * 90}deg)`,
                                }}
                            >
                                <div className="h-full w-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full" />
                            </div>
                        ))}

                        {/* Clothes tumbling */}
                        {status !== "idle" && (
                            <>
                                <motion.div
                                    className="absolute top-1/4 left-1/4 w-10 h-10 bg-purple-400 rounded-lg opacity-70"
                                    animate={
                                        status === "running"
                                            ? {
                                                  rotate: [0, 360],
                                                  x: [0, 15, 0],
                                                  y: [0, -15, 0],
                                              }
                                            : {}
                                    }
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                    }}
                                />
                                <motion.div
                                    className="absolute top-1/2 right-1/4 w-8 h-8 bg-green-300 rounded-lg opacity-70"
                                    animate={
                                        status === "running"
                                            ? {
                                                  rotate: [0, -360],
                                                  x: [0, -10, 0],
                                                  y: [0, 12, 0],
                                              }
                                            : {}
                                    }
                                    transition={{
                                        duration: 2.2,
                                        repeat: Infinity,
                                    }}
                                />
                                <motion.div
                                    className="absolute bottom-1/3 left-1/2 w-9 h-9 bg-pink-300 rounded-lg opacity-70"
                                    animate={
                                        status === "running"
                                            ? {
                                                  rotate: [0, 360],
                                                  x: [0, 8, 0],
                                                  y: [0, 8, 0],
                                              }
                                            : {}
                                    }
                                    transition={{
                                        duration: 1.9,
                                        repeat: Infinity,
                                    }}
                                />
                            </>
                        )}
                    </motion.div>

                    {/* Glass reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                    {/* Temperature indicator glow */}
                    {status === "running" && (
                        <motion.div
                            className="absolute inset-0 bg-orange-500/10 rounded-full"
                            animate={{
                                opacity: [0.1, 0.3, 0.1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    )}
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
        </div>
    );
}
