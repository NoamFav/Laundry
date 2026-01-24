import { useState, useEffect } from "react";
import { ref, onValue, set, push, remove } from "firebase/database";
import { database } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { WASHING_PROGRAMS, DRYER_PROGRAMS } from "../config/database";
import WashingMachine from "../components/WashingMachine";
import Dryer from "../components/Dryer";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";

export default function LaundryRoom() {
    const { currentRoom } = useAuth();
    const [washingMachine, setWashingMachine] = useState(null);
    const [dryer, setDryer] = useState(null);
    const [showProgramModal, setShowProgramModal] = useState(null); // 'washer' or 'dryer'

    useEffect(() => {
        // Subscribe to washing machine state
        const washerRef = ref(database, "laundry/washingMachine");
        const unsubWasher = onValue(washerRef, (snapshot) => {
            const data = snapshot.val() || {
                status: "idle",
                program: null,
                startTime: null,
                endTime: null,
                currentUser: null,
                queue: [],
            };
            setWashingMachine(data);
        });

        // Subscribe to dryer state
        const dryerRef = ref(database, "laundry/dryer");
        const unsubDryer = onValue(dryerRef, (snapshot) => {
            const data = snapshot.val() || {
                status: "idle",
                program: null,
                startTime: null,
                endTime: null,
                currentUser: null,
                queue: [],
            };
            setDryer(data);
        });

        return () => {
            unsubWasher();
            unsubDryer();
        };
    }, []);

    const startMachine = async (machineType, program) => {
        const machinePath =
            machineType === "washer"
                ? "laundry/washingMachine"
                : "laundry/dryer";
        const startTime = Date.now();
        const endTime = startTime + program.duration * 60 * 1000;

        await set(ref(database, machinePath), {
            status: "running",
            program: program,
            startTime,
            endTime,
            currentUser: currentRoom.id,
            queue:
                machineType === "washer"
                    ? washingMachine?.queue || []
                    : dryer?.queue || [],
        });

        setShowProgramModal(null);
    };

    const stopMachine = async (machineType) => {
        const machinePath =
            machineType === "washer"
                ? "laundry/washingMachine"
                : "laundry/dryer";
        const machineData = machineType === "washer" ? washingMachine : dryer;

        if (machineData.status === "running") {
            // Mark as done
            await set(ref(database, machinePath), {
                ...machineData,
                status: "done",
            });
        } else if (machineData.status === "done") {
            // Process queue or reset to idle
            const queue = machineData.queue || [];
            if (queue.length > 0) {
                // Start next in queue
                const nextItem = queue[0];
                const remainingQueue = queue.slice(1);
                const program = (
                    machineType === "washer" ? WASHING_PROGRAMS : DRYER_PROGRAMS
                ).find((p) => p.id === nextItem.programId);

                const startTime = Date.now();
                const endTime = startTime + program.duration * 60 * 1000;

                await set(ref(database, machinePath), {
                    status: "running",
                    program,
                    startTime,
                    endTime,
                    currentUser: nextItem.roomId,
                    queue: remainingQueue,
                });
            } else {
                // Reset to idle
                await set(ref(database, machinePath), {
                    status: "idle",
                    program: null,
                    startTime: null,
                    endTime: null,
                    currentUser: null,
                    queue: [],
                });
            }
        }
    };

    const addToQueue = async (machineType, program) => {
        const machinePath =
            machineType === "washer"
                ? "laundry/washingMachine"
                : "laundry/dryer";
        const machineData = machineType === "washer" ? washingMachine : dryer;

        const queueItem = {
            roomId: currentRoom.id,
            programId: program.id,
            program: program.name,
            timestamp: Date.now(),
        };

        const currentQueue = machineData?.queue || [];
        await set(ref(database, `${machinePath}/queue`), [
            ...currentQueue,
            queueItem,
        ]);

        setShowProgramModal(null);
    };

    useEffect(() => {
        // Auto-complete when time runs out
        if (washingMachine?.status === "running" && washingMachine.endTime) {
            const timeLeft = washingMachine.endTime - Date.now();
            if (timeLeft <= 0) {
                set(ref(database, "laundry/washingMachine/status"), "done");
            } else {
                const timeout = setTimeout(() => {
                    set(ref(database, "laundry/washingMachine/status"), "done");
                }, timeLeft);
                return () => clearTimeout(timeout);
            }
        }
    }, [washingMachine]);

    useEffect(() => {
        // Auto-complete when time runs out
        if (dryer?.status === "running" && dryer.endTime) {
            const timeLeft = dryer.endTime - Date.now();
            if (timeLeft <= 0) {
                set(ref(database, "laundry/dryer/status"), "done");
            } else {
                const timeout = setTimeout(() => {
                    set(ref(database, "laundry/dryer/status"), "done");
                }, timeLeft);
                return () => clearTimeout(timeout);
            }
        }
    }, [dryer]);

    const handleMachineStart = (machineType) => {
        setShowProgramModal(machineType);
    };

    if (!washingMachine || !dryer) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading laundry room...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-24">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center py-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Laundry Room
                    </h1>
                    <p className="text-gray-600">Ground Floor</p>
                </div>

                {/* Washing Machine */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">
                        Washing Machine
                    </h2>
                    <WashingMachine
                        status={washingMachine.status}
                        program={washingMachine.program}
                        currentUser={washingMachine.currentUser}
                        queue={washingMachine.queue}
                        onStart={() => handleMachineStart("washer")}
                        onStop={() => stopMachine("washer")}
                    />
                </div>

                {/* Dryer */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">
                        Dryer
                    </h2>
                    <Dryer
                        status={dryer.status}
                        program={dryer.program}
                        currentUser={dryer.currentUser}
                        queue={dryer.queue}
                        onStart={() => handleMachineStart("dryer")}
                        onStop={() => stopMachine("dryer")}
                    />
                </div>
            </div>

            {/* Program Selection Modal */}
            <AnimatePresence>
                {showProgramModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowProgramModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">
                                    Select Program
                                </h3>
                                <button
                                    onClick={() => setShowProgramModal(null)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {(showProgramModal === "washer"
                                    ? WASHING_PROGRAMS
                                    : DRYER_PROGRAMS
                                ).map((program) => {
                                    const machineData =
                                        showProgramModal === "washer"
                                            ? washingMachine
                                            : dryer;
                                    const isIdle =
                                        machineData.status === "idle";

                                    return (
                                        <motion.button
                                            key={program.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() =>
                                                isIdle
                                                    ? startMachine(
                                                          showProgramModal,
                                                          program,
                                                      )
                                                    : addToQueue(
                                                          showProgramModal,
                                                          program,
                                                      )
                                            }
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-left"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="font-semibold text-lg">
                                                        {program.name}
                                                    </div>
                                                    <div className="text-sm text-blue-100">
                                                        {program.duration}{" "}
                                                        minutes
                                                    </div>
                                                </div>
                                                {!isIdle && (
                                                    <Plus className="w-5 h-5" />
                                                )}
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {(showProgramModal === "washer"
                                ? washingMachine
                                : dryer
                            ).status !== "idle" && (
                                <div className="mt-4 text-sm text-gray-600 text-center">
                                    Machine is busy. Program will be added to
                                    queue.
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
