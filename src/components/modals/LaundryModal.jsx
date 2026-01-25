import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../config/firebase';
import WashingMachine from '../WashingMachine';
import Dryer from '../Dryer';
import { useAuth } from '../../contexts/AuthContext';

export default function LaundryModal({ onClose }) {
  const { currentRoom } = useAuth();
  const [washer, setWasher] = useState(null);
  const [dryer, setDryer] = useState(null);

  useEffect(() => {
    const washerRef = ref(database, 'laundry/washingMachine');
    const dryerRef = ref(database, 'laundry/dryer');

    const unsubWasher = onValue(washerRef, (snapshot) => {
      setWasher(snapshot.val());
    });

    const unsubDryer = onValue(dryerRef, (snapshot) => {
      setDryer(snapshot.val());
    });

    return () => {
      unsubWasher();
      unsubDryer();
    };
  }, []);

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
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-6 rounded-t-3xl flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Laundry Room</h2>
            <p className="text-blue-100 text-sm mt-1">Ground Floor • Manage washing & drying</p>
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
          {washer && (
            <WashingMachine
              status={washer.status}
              program={washer.program}
              currentUser={washer.currentUser}
              onStart={() => {}}
              onStop={() => {}}
            />
          )}

          {dryer && (
            <Dryer
              status={dryer.status}
              program={dryer.program}
              currentUser={dryer.currentUser}
              onStart={() => {}}
              onStop={() => {}}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
