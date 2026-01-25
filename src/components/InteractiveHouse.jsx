import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ROOMS } from '../config/roomCodes';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Star } from 'lucide-react';

// Modal Components
import LaundryModal from './modals/LaundryModal';
import TaskModal from './modals/TaskModal';
import RoomModal from './modals/RoomModal';

export default function InteractiveHouse() {
  const { currentRoom } = useAuth();
  const [presence, setPresence] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(null);

  useEffect(() => {
    const presenceRef = ref(database, 'presence');
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val() || {};
      setPresence(data);
    });
    return () => unsubscribe();
  }, []);

  const isRoomOccupied = (roomId) => {
    const status = presence[roomId];
    return status && status !== 'N/A' && status !== false;
  };

  const handleRoomClick = (roomId) => {
    setSelectedRoom(roomId);
    setActiveModal('room');
  };

  const handleFacilityClick = (facility) => {
    setActiveModal(facility);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRoom(null);
  };

  // Window component for each room
  const Window = ({ roomId, x, y, width = 80, height = 100 }) => {
    const isLit = isRoomOccupied(roomId);
    const isHovered = hoveredElement === roomId;

    return (
      <motion.g
        onClick={() => handleRoomClick(roomId)}
        onMouseEnter={() => setHoveredElement(roomId)}
        onMouseLeave={() => setHoveredElement(null)}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {/* Window frame */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="#e8e8e8"
          stroke="#555"
          strokeWidth="3"
          rx="5"
        />

        {/* Window panes */}
        <rect
          x={x + 5}
          y={y + 5}
          width={width - 10}
          height={height - 10}
          fill={isLit ? '#fff4b8' : '#1a3a52'}
          opacity={isLit ? 0.95 : 0.6}
        />

        {/* Window divider */}
        <line
          x1={x + width / 2}
          y1={y + 5}
          x2={x + width / 2}
          y2={y + height - 5}
          stroke="#555"
          strokeWidth="2"
        />
        <line
          x1={x + 5}
          y1={y + height / 2}
          x2={x + width - 5}
          y2={y + height / 2}
          stroke="#555"
          strokeWidth="2"
        />

        {/* Light glow effect when lit */}
        {isLit && (
          <rect
            x={x - 10}
            y={y - 10}
            width={width + 20}
            height={height + 20}
            fill="url(#windowGlow)"
            opacity="0.4"
            pointerEvents="none"
          />
        )}

        {/* Room label */}
        {isHovered && (
          <text
            x={x + width / 2}
            y={y + height + 20}
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
          >
            {ROOMS[roomId]?.name || roomId}
          </text>
        )}
      </motion.g>
    );
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-800 overflow-hidden">
      {/* Night sky background */}
      <div className="absolute inset-0">
        {/* Moon */}
        <motion.div
          className="absolute top-20 right-32 w-24 h-24 bg-yellow-100 rounded-full shadow-2xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-2 bg-yellow-50 rounded-full opacity-50" />
        </motion.div>

        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-green-900 to-green-950" />

      {/* Street */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gray-800 border-t-4 border-yellow-400" />

      {/* SVG House */}
      <svg
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 1200 900"
        style={{ width: '90vw', maxWidth: '1200px', height: 'auto' }}
      >
        <defs>
          {/* Gradient for window glow */}
          <radialGradient id="windowGlow">
            <stop offset="0%" stopColor="#fff4b8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff4b8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Main house structure */}

        {/* Base/Foundation */}
        <rect x="200" y="650" width="800" height="80" fill="#2c1810" />

        {/* Main building walls */}
        <rect x="200" y="250" width="800" height="400" fill="#b84848" stroke="#8b3838" strokeWidth="4" />

        {/* Roof */}
        <polygon
          points="150,250 600,80 1050,250"
          fill="#2d3748"
          stroke="#1a202c"
          strokeWidth="4"
        />

        {/* Roof dormers */}
        <g>
          {/* Left dormer */}
          <rect x="320" y="150" width="120" height="100" fill="#e8e8e8" stroke="#555" strokeWidth="2" />
          <polygon points="310,150 380,100 450,150" fill="#2d3748" stroke="#1a202c" strokeWidth="2" />
          <Window roomId="13C" x="340" y="170" width="80" height="70" />
        </g>

        <g>
          {/* Right dormer */}
          <rect x="760" y="150" width="120" height="100" fill="#e8e8e8" stroke="#555" strokeWidth="2" />
          <polygon points="750,150 820,100 890,150" fill="#2d3748" stroke="#1a202c" strokeWidth="2" />
          <Window roomId="14C" x="780" y="170" width="80" height="70" />
        </g>

        {/* Floor 3 - Front (3 rooms) */}
        <Window roomId="8C" x="250" y="280" />
        <Window roomId="9C" x="460" y="280" />
        <Window roomId="10C" x="670" y="280" />

        {/* Floor 3 - Back (2 rooms) - Darker/smaller */}
        <Window roomId="11C" x="880" y="320" width="60" height="80" />
        <Window roomId="12C" x="960" y="320" width="60" height="80" />

        {/* Floor 2 - Front (3 rooms) */}
        <Window roomId="3C" x="250" y="420" />
        <Window roomId="4C" x="460" y="420" />
        <Window roomId="5C" x="670" y="420" />

        {/* Floor 2 - Back (2 rooms) */}
        <Window roomId="6C" x="880" y="460" width="60" height="80" />
        <Window roomId="7C" x="960" y="460" width="60" height="80" />

        {/* Floor 1 - Front (2 rooms) */}
        <Window roomId="1C" x="300" y="560" />
        <Window roomId="2C" x="600" y="560" />

        {/* Ground Floor - Laundry (clickable door) */}
        <motion.g
          onClick={() => handleFacilityClick('laundry')}
          onMouseEnter={() => setHoveredElement('laundry')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.05 }}
        >
          <rect x="450" y="570" width="100" height="150" fill="#8b4513" stroke="#654321" strokeWidth="3" rx="5" />
          <circle cx="530" cy="640" r="5" fill="#ffd700" />
          {hoveredElement === 'laundry' && (
            <text x="500" y="750" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              Laundry Room
            </text>
          )}
        </motion.g>

        {/* Kitchen markers (clickable areas) */}
        <motion.g
          onClick={() => handleFacilityClick('tasks')}
          onMouseEnter={() => setHoveredElement('tasks')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="880" y="600" width="140" height="50" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" rx="5" />
          {hoveredElement === 'tasks' && (
            <text x="950" y="632" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              Kitchen & Tasks
            </text>
          )}
        </motion.g>

        {/* User info display */}
        <text x="600" y="50" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold">
          {currentRoom.displayName}
        </text>
        <text x="600" y="80" textAnchor="middle" fill="#cbd5e0" fontSize="16">
          Click rooms and facilities to interact
        </text>
      </svg>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'laundry' && (
          <LaundryModal onClose={closeModal} />
        )}
        {activeModal === 'tasks' && (
          <TaskModal onClose={closeModal} />
        )}
        {activeModal === 'room' && selectedRoom && (
          <RoomModal roomId={selectedRoom} onClose={closeModal} />
        )}
      </AnimatePresence>
    </div>
  );
}
