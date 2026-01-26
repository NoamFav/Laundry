import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { useState, useEffect, useRef } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ROOMS } from '../config/roomCodes';
import { AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Modal Components
import LaundryModal from './modals/LaundryModal';
import TaskModal from './modals/TaskModal';
import RoomModal from './modals/RoomModal';

// Colors
const BRICK_COLOR = '#b84848';
const DARK_BRICK = '#2c1810';
const ROOF_COLOR = '#2d3748';
const WINDOW_FRAME = '#e8e8e8';
const LIGHT_ON = '#fff4b8';
const LIGHT_OFF = '#1a3a52';

// Clickable Window component
function ClickableWindow({ position, isLit, roomId, onClick, onPointerOver, onPointerOut }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Window frame */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(roomId);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onPointerOver(roomId);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          onPointerOut();
        }}
      >
        <boxGeometry args={[0.5, 0.6, 0.08]} />
        <meshStandardMaterial color={WINDOW_FRAME} />
      </mesh>

      {/* Window glass with light */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[0.42, 0.52]} />
        <meshStandardMaterial
          color={isLit ? LIGHT_ON : LIGHT_OFF}
          emissive={isLit ? LIGHT_ON : LIGHT_OFF}
          emissiveIntensity={isLit ? 0.9 : 0.1}
        />
      </mesh>

      {/* Window dividers */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[0.42, 0.02, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0, 0.05]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.52, 0.02, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Light glow */}
      {isLit && (
        <pointLight position={[0, 0, 0.3]} intensity={1.5} distance={3} color={LIGHT_ON} />
      )}

      {/* Label on hover */}
      {hovered && (
        <Html position={[0, -0.4, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            {ROOMS[roomId]?.name || roomId}
          </div>
        </Html>
      )}
    </group>
  );
}

// Clickable Facility
function ClickableFacility({ position, size, label, onClick, facilityType }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(facilityType);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={hovered ? "#ffaa00" : "#8b4513"}
          emissive={hovered ? "#ff6600" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {hovered && (
        <Html position={[0, size[1] / 2 + 0.3, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Main House Structure
function House3DModel({ occupancy, onRoomClick, onFacilityClick }) {
  const [hoveredRoom, setHoveredRoom] = useState(null);

  // Window positions matching your house layout
  const windows = {
    // Floor 1 - Front (2 rooms)
    floor1Front: [
      { pos: [-1.2, -0.5, 2.01], room: '1C', occupied: occupancy['1C'] },
      { pos: [1.2, -0.5, 2.01], room: '2C', occupied: occupancy['2C'] }
    ],

    // Floor 2 - Front (3 rooms)
    floor2Front: [
      { pos: [-1.5, 0.5, 2.01], room: '3C', occupied: occupancy['3C'] },
      { pos: [0, 0.5, 2.01], room: '4C', occupied: occupancy['4C'] },
      { pos: [1.5, 0.5, 2.01], room: '5C', occupied: occupancy['5C'] }
    ],

    // Floor 2 - Back (2 rooms)
    floor2Back: [
      { pos: [-0.8, 0.5, -2.01], room: '6C', occupied: occupancy['6C'] },
      { pos: [0.8, 0.5, -2.01], room: '7C', occupied: occupancy['7C'] }
    ],

    // Floor 3 - Front (3 rooms)
    floor3Front: [
      { pos: [-1.5, 1.5, 2.01], room: '8C', occupied: occupancy['8C'] },
      { pos: [0, 1.5, 2.01], room: '9C', occupied: occupancy['9C'] },
      { pos: [1.5, 1.5, 2.01], room: '10C', occupied: occupancy['10C'] }
    ],

    // Floor 3 - Back (2 rooms)
    floor3Back: [
      { pos: [-0.8, 1.5, -2.01], room: '11C', occupied: occupancy['11C'] },
      { pos: [0.8, 1.5, -2.01], room: '12C', occupied: occupancy['12C'] }
    ],

    // Floor 4 - Front (2 rooms in dormers)
    floor4Front: [
      { pos: [-1.0, 2.8, 1.7], room: '13C', occupied: occupancy['13C'] },
      { pos: [1.0, 2.8, 1.7], room: '14C', occupied: occupancy['14C'] }
    ]
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d5016" roughness={0.9} />
      </mesh>

      {/* Base/Foundation */}
      <mesh position={[0, -1.2, 0]} castShadow>
        <boxGeometry args={[4.5, 0.6, 4]} />
        <meshStandardMaterial color={DARK_BRICK} roughness={0.9} />
      </mesh>

      {/* Main building walls */}
      {/* Front wall */}
      <mesh position={[0, 0.8, 2]} castShadow>
        <boxGeometry args={[4.5, 4.5, 0.2]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.8, -2]} castShadow>
        <boxGeometry args={[4.5, 4.5, 0.2]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-2.25, 0.8, 0]} castShadow>
        <boxGeometry args={[0.2, 4.5, 4]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Right wall */}
      <mesh position={[2.25, 0.8, 0]} castShadow>
        <boxGeometry args={[0.2, 4.5, 4]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Roof - slanted parts */}
      <mesh rotation={[0, 0, Math.PI / 8]} position={[-0.6, 3.3, 0]} castShadow>
        <boxGeometry args={[3.5, 0.15, 4.2]} />
        <meshStandardMaterial color={ROOF_COLOR} roughness={0.6} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 8]} position={[0.6, 3.3, 0]} castShadow>
        <boxGeometry args={[3.5, 0.15, 4.2]} />
        <meshStandardMaterial color={ROOF_COLOR} roughness={0.6} />
      </mesh>

      {/* Dormers */}
      {/* Left dormer */}
      <group position={[-1.0, 3.0, 1.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.8, 0.4]} />
          <meshStandardMaterial color={WINDOW_FRAME} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 6]} position={[-0.25, 0.55, 0]} castShadow>
          <boxGeometry args={[0.6, 0.08, 0.45]} />
          <meshStandardMaterial color={ROOF_COLOR} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 6]} position={[0.25, 0.55, 0]} castShadow>
          <boxGeometry args={[0.6, 0.08, 0.45]} />
          <meshStandardMaterial color={ROOF_COLOR} />
        </mesh>
      </group>

      {/* Right dormer */}
      <group position={[1.0, 3.0, 1.5]}>
        <mesh castShadow>
          <boxGeometry args={[0.8, 0.8, 0.4]} />
          <meshStandardMaterial color={WINDOW_FRAME} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 6]} position={[-0.25, 0.55, 0]} castShadow>
          <boxGeometry args={[0.6, 0.08, 0.45]} />
          <meshStandardMaterial color={ROOF_COLOR} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 6]} position={[0.25, 0.55, 0]} castShadow>
          <boxGeometry args={[0.6, 0.08, 0.45]} />
          <meshStandardMaterial color={ROOF_COLOR} />
        </mesh>
      </group>

      {/* Render all clickable windows */}
      {Object.values(windows).flat().map((window, index) => (
        <ClickableWindow
          key={index}
          position={window.pos}
          isLit={window.occupied}
          roomId={window.room}
          onClick={onRoomClick}
          onPointerOver={setHoveredRoom}
          onPointerOut={() => setHoveredRoom(null)}
        />
      ))}

      {/* Laundry door (clickable) */}
      <ClickableFacility
        position={[0, -0.5, 2.1]}
        size={[0.8, 1.2, 0.15]}
        label="🧺 Laundry Room"
        onClick={onFacilityClick}
        facilityType="laundry"
      />

      {/* Kitchen marker (clickable area on back) */}
      <ClickableFacility
        position={[0, 0, -2.15]}
        size={[1.5, 0.6, 0.1]}
        label="🍳 Kitchen & Tasks"
        onClick={onFacilityClick}
        facilityType="tasks"
      />
    </group>
  );
}

export default function InteractiveHouse3D() {
  const { currentRoom } = useAuth();
  const [presence, setPresence] = useState({});
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  const occupancy = {};
  Object.keys(ROOMS).forEach(roomId => {
    occupancy[roomId] = isRoomOccupied(roomId);
  });

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

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-800 overflow-hidden">
      {/* Night sky stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div className="absolute top-16 right-24 w-32 h-32 bg-yellow-100 rounded-full shadow-2xl opacity-90" />

      {/* User info overlay */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">
          {currentRoom.displayName}
        </h1>
        <p className="text-lg text-gray-200 drop-shadow">
          Click on windows and doors to interact
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [6, 4, 8], fov: 50 }}
        shadows
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -3]} intensity={0.3} />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#4169e1" />

        <House3DModel
          occupancy={occupancy}
          onRoomClick={handleRoomClick}
          onFacilityClick={handleFacilityClick}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>

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

      {/* Instructions */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-6 py-3 rounded-full text-white text-sm pointer-events-none">
        🖱️ Drag to rotate • Scroll to zoom • Click windows/doors to interact
      </div>
    </div>
  );
}
