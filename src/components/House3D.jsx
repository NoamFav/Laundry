import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState } from 'react';

// Colors matching your house
const BRICK_COLOR = '#b84848'; // Red brick
const DARK_BRICK = '#2c1810'; // Dark base
const ROOF_COLOR = '#2d3748'; // Dark gray roof
const WINDOW_FRAME = '#e8e8e8'; // White frames
const LIGHT_ON = '#fff4b8'; // Warm yellow light
const LIGHT_OFF = '#1a3a52'; // Dark blue (off)

// Window component with light
function Window({ position, isLit, roomId }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Window frame */}
      <mesh>
        <boxGeometry args={[0.35, 0.45, 0.05]} />
        <meshStandardMaterial color={WINDOW_FRAME} />
      </mesh>

      {/* Window glass with light */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.3, 0.4]} />
        <meshStandardMaterial
          color={isLit ? LIGHT_ON : LIGHT_OFF}
          emissive={isLit ? LIGHT_ON : LIGHT_OFF}
          emissiveIntensity={isLit ? 0.8 : 0.1}
        />
      </mesh>

      {/* Room label */}
      {roomId && (
        <Text
          position={[0, -0.3, 0.03]}
          fontSize={0.08}
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {roomId}
        </Text>
      )}

      {/* Light glow effect */}
      {isLit && (
        <pointLight position={[0, 0, 0.5]} intensity={0.5} distance={2} color={LIGHT_ON} />
      )}
    </group>
  );
}

// Main house structure
function RealisticHouse({ occupancy }) {
  // Define window positions based on your house layout
  const windows = {
    // Floor 1 - Front (2 rooms)
    floor1Front: [
      { pos: [-0.8, 0.3, 1.51], room: '1C', occupied: occupancy['1C'] },
      { pos: [0.8, 0.3, 1.51], room: '2C', occupied: occupancy['2C'] }
    ],

    // Floor 2 - Front (3 rooms)
    floor2Front: [
      { pos: [-1.2, 1.2, 1.51], room: '3C', occupied: occupancy['3C'] },
      { pos: [0, 1.2, 1.51], room: '4C', occupied: occupancy['4C'] },
      { pos: [1.2, 1.2, 1.51], room: '5C', occupied: occupancy['5C'] }
    ],

    // Floor 2 - Back (2 rooms)
    floor2Back: [
      { pos: [-0.6, 1.2, -1.51], room: '6C', occupied: occupancy['6C'] },
      { pos: [0.6, 1.2, -1.51], room: '7C', occupied: occupancy['7C'] }
    ],

    // Floor 3 - Front (3 rooms)
    floor3Front: [
      { pos: [-1.2, 2.1, 1.51], room: '8C', occupied: occupancy['8C'] },
      { pos: [0, 2.1, 1.51], room: '9C', occupied: occupancy['9C'] },
      { pos: [1.2, 2.1, 1.51], room: '10C', occupied: occupancy['10C'] }
    ],

    // Floor 3 - Back (2 rooms)
    floor3Back: [
      { pos: [-0.6, 2.1, -1.51], room: '11C', occupied: occupancy['11C'] },
      { pos: [0.6, 2.1, -1.51], room: '12C', occupied: occupancy['12C'] }
    ],

    // Floor 4 - Front (2 rooms under dormers)
    floor4Front: [
      { pos: [-0.8, 3.0, 1.51], room: '13C', occupied: occupancy['13C'] },
      { pos: [0.8, 3.0, 1.51], room: '14C', occupied: occupancy['14C'] }
    ]
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Ground floor / Base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[3.5, 0.5, 3]} />
        <meshStandardMaterial color={DARK_BRICK} roughness={0.9} />
      </mesh>

      {/* Main building walls */}
      {/* Front wall */}
      <mesh position={[0, 1.5, 1.5]}>
        <boxGeometry args={[3.5, 3.5, 0.15]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -1.5]}>
        <boxGeometry args={[3.5, 3.5, 0.15]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-1.75, 1.5, 0]}>
        <boxGeometry args={[0.15, 3.5, 3]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Right wall */}
      <mesh position={[1.75, 1.5, 0]}>
        <boxGeometry args={[0.15, 3.5, 3]} />
        <meshStandardMaterial color={BRICK_COLOR} roughness={0.8} />
      </mesh>

      {/* Floor separators (horizontal lines) */}
      <mesh position={[0, 0.8, 1.52]}>
        <boxGeometry args={[3.5, 0.08, 0.05]} />
        <meshStandardMaterial color={WINDOW_FRAME} />
      </mesh>
      <mesh position={[0, 1.7, 1.52]}>
        <boxGeometry args={[3.5, 0.08, 0.05]} />
        <meshStandardMaterial color={WINDOW_FRAME} />
      </mesh>
      <mesh position={[0, 2.6, 1.52]}>
        <boxGeometry args={[3.5, 0.08, 0.05]} />
        <meshStandardMaterial color={WINDOW_FRAME} />
      </mesh>

      {/* Roof structure */}
      <group position={[0, 3.4, 0]}>
        {/* Main roof - slanted */}
        <mesh rotation={[0, 0, Math.PI / 8]} position={[-0.4, 0.3, 0]}>
          <boxGeometry args={[2.8, 0.1, 3.2]} />
          <meshStandardMaterial color={ROOF_COLOR} roughness={0.6} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 8]} position={[0.4, 0.3, 0]}>
          <boxGeometry args={[2.8, 0.1, 3.2]} />
          <meshStandardMaterial color={ROOF_COLOR} roughness={0.6} />
        </mesh>

        {/* Dormer 1 (left) */}
        <group position={[-0.7, 0.2, 1.2]}>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.3]} />
            <meshStandardMaterial color={WINDOW_FRAME} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial
              color={occupancy['13C'] ? LIGHT_ON : LIGHT_OFF}
              emissive={occupancy['13C'] ? LIGHT_ON : LIGHT_OFF}
              emissiveIntensity={occupancy['13C'] ? 0.7 : 0.1}
            />
          </mesh>
          {/* Dormer roof */}
          <mesh rotation={[0, 0, Math.PI / 6]} position={[-0.15, 0.35, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.35]} />
            <meshStandardMaterial color={ROOF_COLOR} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 6]} position={[0.15, 0.35, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.35]} />
            <meshStandardMaterial color={ROOF_COLOR} />
          </mesh>
        </group>

        {/* Dormer 2 (right) */}
        <group position={[0.7, 0.2, 1.2]}>
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.3]} />
            <meshStandardMaterial color={WINDOW_FRAME} />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial
              color={occupancy['14C'] ? LIGHT_ON : LIGHT_OFF}
              emissive={occupancy['14C'] ? LIGHT_ON : LIGHT_OFF}
              emissiveIntensity={occupancy['14C'] ? 0.7 : 0.1}
            />
          </mesh>
          {/* Dormer roof */}
          <mesh rotation={[0, 0, Math.PI / 6]} position={[-0.15, 0.35, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.35]} />
            <meshStandardMaterial color={ROOF_COLOR} />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 6]} position={[0.15, 0.35, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.35]} />
            <meshStandardMaterial color={ROOF_COLOR} />
          </mesh>
        </group>
      </group>

      {/* Render all windows */}
      {Object.values(windows).flat().map((window, index) => (
        <Window
          key={index}
          position={window.pos}
          isLit={window.occupied}
          roomId={window.room}
        />
      ))}

      {/* Ground floor - Laundry area (glass doors visible) */}
      <group position={[0, -0.05, -1.52]}>
        <mesh>
          <planeGeometry args={[1.2, 0.6]} />
          <meshStandardMaterial
            color="#a0c4d8"
            transparent
            opacity={0.6}
            emissive="#87ceeb"
            emissiveIntensity={0.2}
          />
        </mesh>
        <Text position={[0, -0.4, 0]} fontSize={0.1} color="#fff">
          Laundry
        </Text>
      </group>

      {/* Kitchen markers (back side) */}
      <Text position={[-0.8, 0.3, -1.6]} fontSize={0.08} color="#fff">
        Kitchen L
      </Text>
      <Text position={[-0.8, 3.0, -1.6]} fontSize={0.08} color="#fff">
        Kitchen U
      </Text>

      {/* Ground plane (pavement/garden) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#7ca982" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function House3D({ occupancy = {}, onRoomClick }) {
  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-sky-200 via-blue-100 to-blue-50 rounded-2xl overflow-hidden shadow-2xl relative">
      <Canvas camera={{ position: [5, 3, 6], fov: 50 }}>
        {/* Lighting for realistic effect */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 5, -3]} intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.3} color="#fff4b8" />

        <RealisticHouse occupancy={occupancy} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl p-4 text-xs space-y-2 shadow-lg max-w-[200px]">
        <div className="font-semibold text-gray-800 mb-2">💡 How it works</div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: LIGHT_ON }}></div>
          <span className="text-gray-700">Light ON = Home</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: LIGHT_OFF }}></div>
          <span className="text-gray-700">Light OFF = Away</span>
        </div>
        <div className="text-xs text-gray-600 mt-2 pt-2 border-t">
          Windows show room occupancy in real-time
        </div>
      </div>

      {/* Floor guide */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-xl p-3 text-xs space-y-1 shadow-lg">
        <div className="font-semibold text-gray-800 mb-1">🏠 Floors</div>
        <div className="text-gray-600 space-y-0.5">
          <div>Top: 13C-14C (Dormers)</div>
          <div>Floor 3: 8C-12C</div>
          <div>Floor 2: 3C-7C</div>
          <div>Floor 1: 1C-2C</div>
          <div>Ground: Laundry</div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur rounded-lg px-4 py-2 text-white text-xs font-medium shadow-lg">
        🖱️ Drag • Scroll to zoom • Explore your house
      </div>

      {/* Status bar */}
      <div className="absolute bottom-4 right-4 bg-gradient-to-r from-green-500 to-green-600 backdrop-blur rounded-lg px-4 py-2 text-white text-xs font-semibold shadow-lg">
        {Object.values(occupancy).filter(Boolean).length} / 14 Home
      </div>
    </div>
  );
}
