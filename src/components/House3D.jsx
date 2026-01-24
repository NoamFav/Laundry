import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

// Brick texture color
const BRICK_COLOR = '#b84848';
const DARK_BRICK = '#1a1a1a';
const WINDOW_COLOR = '#ffffff';
const ROOF_COLOR = '#4a5568';

// Individual room component
function RoomBox({ position, roomId, isOccupied, onClick, size = [0.9, 0.7, 0.8] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(roomId)}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={hovered ? '#60a5fa' : isOccupied ? '#4ade80' : BRICK_COLOR}
          roughness={0.7}
        />
      </mesh>

      {/* Window */}
      <mesh position={[0, 0, size[2] / 2 + 0.01]}>
        <planeGeometry args={[0.3, 0.25]} />
        <meshStandardMaterial color={WINDOW_COLOR} emissive="#87ceeb" emissiveIntensity={0.2} />
      </mesh>

      {/* Room label */}
      <Text
        position={[0, -size[1] / 2 - 0.15, size[2] / 2 + 0.01]}
        fontSize={0.12}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {roomId}
      </Text>
    </group>
  );
}

// Kitchen/Bathroom facility
function FacilityBox({ position, label, color, type }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.9, 0.7, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Icon window */}
      <mesh position={[0, 0, 0.41]}>
        <planeGeometry args={[0.35, 0.3]} />
        <meshStandardMaterial color={WINDOW_COLOR} emissive="#fbbf24" emissiveIntensity={0.3} />
      </mesh>

      <Text
        position={[0, -0.5, 0.41]}
        fontSize={0.08}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

// Main house structure
function HouseStructure({ occupancy, onRoomClick }) {
  // Room layout based on your photos
  const layout = {
    floor1: {
      front: ['1C', '2C'], // 2 rooms on street side
      back: [] // No rooms, facilities only
    },
    floor2: {
      front: ['3C', '4C', '5C'], // 3 rooms on street side
      back: ['6C', '7C'] // 2 rooms on back side
    },
    floor3: {
      front: ['8C', '9C', '10C'], // 3 rooms on street side
      back: ['11C', '12C'] // 2 rooms on back side
    },
    floor4: {
      front: ['13C', '14C'], // 2 rooms on street side (under dormers)
      back: [] // No rooms, facilities only
    }
  };

  const renderFloorRooms = (floorNumber, rooms, yPos, isFront = true) => {
    const spacing = 1.1;
    const depth = isFront ? 1.2 : -1.2;
    const roomCount = rooms.length;
    const startX = -(roomCount - 1) * spacing / 2;

    return rooms.map((roomId, index) => (
      <RoomBox
        key={roomId}
        position={[startX + index * spacing, yPos, depth]}
        roomId={roomId}
        isOccupied={occupancy[roomId]}
        onClick={onRoomClick}
      />
    ));
  };

  return (
    <group>
      {/* Ground floor - Laundry */}
      <group position={[0, -1, 0]}>
        {/* Ground floor base */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[4.5, 0.15, 3]} />
          <meshStandardMaterial color={DARK_BRICK} />
        </mesh>

        {/* Laundry markers */}
        <mesh position={[-0.8, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[-0.8, -0.25, 0]} fontSize={0.09} color="#fff">Washer</Text>

        <mesh position={[0.8, 0, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0.8, -0.25, 0]} fontSize={0.09} color="#fff">Dryer</Text>
      </group>

      {/* Floor 1 */}
      <group position={[0, 0, 0]}>
        {/* Floor platform */}
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[4.5, 0.1, 3]} />
          <meshStandardMaterial color={BRICK_COLOR} />
        </mesh>

        {/* Front rooms (2) */}
        {renderFloorRooms(1, layout.floor1.front, 0, true)}

        {/* Back - Kitchen (lower) */}
        <FacilityBox
          position={[-0.5, 0, -1.2]}
          label="Kitchen L"
          color="#10b981"
          type="kitchen"
        />
      </group>

      {/* Floor 2 */}
      <group position={[0, 0.9, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[4.5, 0.1, 3]} />
          <meshStandardMaterial color={BRICK_COLOR} />
        </mesh>

        {/* Front rooms (3) */}
        {renderFloorRooms(2, layout.floor2.front, 0, true)}

        {/* Back rooms (2) */}
        {renderFloorRooms(2, layout.floor2.back, 0, false)}

        {/* Shower marker */}
        <mesh position={[0.8, 0, -1.2]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0.8, -0.3, -1.2]} fontSize={0.07} color="#1f2937">Shower L</Text>
      </group>

      {/* Floor 3 */}
      <group position={[0, 1.8, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[4.5, 0.1, 3]} />
          <meshStandardMaterial color={BRICK_COLOR} />
        </mesh>

        {/* Front rooms (3) */}
        {renderFloorRooms(3, layout.floor3.front, 0, true)}

        {/* Back rooms (2) */}
        {renderFloorRooms(3, layout.floor3.back, 0, false)}

        {/* Shower marker */}
        <mesh position={[0.8, 0, -1.2]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0.8, -0.3, -1.2]} fontSize={0.07} color="#1f2937">Shower L</Text>
      </group>

      {/* Floor 4 */}
      <group position={[0, 2.7, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[4.5, 0.1, 3]} />
          <meshStandardMaterial color={BRICK_COLOR} />
        </mesh>

        {/* Front rooms (2) - under dormers */}
        {renderFloorRooms(4, layout.floor4.front, 0, true)}

        {/* Back - Kitchen (upper) */}
        <FacilityBox
          position={[-0.5, 0, -1.2]}
          label="Kitchen U"
          color="#10b981"
          type="kitchen"
        />

        {/* Shower marker */}
        <mesh position={[0.8, 0, -1.2]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.4} />
        </mesh>
        <Text position={[0.8, -0.3, -1.2]} fontSize={0.07} color="#1f2937">Shower U</Text>
      </group>

      {/* Roof with dormers */}
      <group position={[0, 3.5, 0]}>
        {/* Main roof */}
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[4.5, 0.2, 3.2]} />
          <meshStandardMaterial color={ROOF_COLOR} />
        </mesh>

        {/* Dormer windows */}
        <mesh position={[-0.5, 0.3, 1.3]}>
          <boxGeometry args={[0.6, 0.4, 0.3]} />
          <meshStandardMaterial color={WINDOW_COLOR} />
        </mesh>
        <mesh position={[0.5, 0.3, 1.3]}>
          <boxGeometry args={[0.6, 0.4, 0.3]} />
          <meshStandardMaterial color={WINDOW_COLOR} />
        </mesh>
      </group>

      {/* Building outline/structure */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4.6, 4.2, 3.1]} />
        <meshStandardMaterial
          color={BRICK_COLOR}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function House3D({ occupancy = {}, onRoomClick }) {
  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-sky-100 to-blue-200 rounded-2xl overflow-hidden shadow-xl relative">
      <Canvas camera={{ position: [6, 4, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, 5, -5]} intensity={0.4} />
        <pointLight position={[0, 8, 0]} intensity={0.5} />

        <HouseStructure occupancy={occupancy} onRoomClick={onRoomClick} />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#86efac" />
        </mesh>
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl p-4 text-xs space-y-2 shadow-lg">
        <div className="font-semibold text-gray-800 mb-2">Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-400 rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded" style={{ backgroundColor: BRICK_COLOR }}></div>
          <span>Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-400 rounded"></div>
          <span>Hover/Click</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          <span>Washer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
          <span>Dryer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded"></div>
          <span>Kitchen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-cyan-500 rounded-full"></div>
          <span>Shower</span>
        </div>
      </div>

      {/* Floor labels */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur rounded-xl p-3 text-xs space-y-1 shadow-lg">
        <div className="font-semibold text-gray-800 mb-1">Floors</div>
        <div className="text-gray-600">
          <div>Floor 4: Rooms 13C-14C</div>
          <div>Floor 3: Rooms 8C-12C</div>
          <div>Floor 2: Rooms 3C-7C</div>
          <div>Floor 1: Rooms 1C-2C</div>
          <div>Ground: Laundry</div>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur rounded-lg px-3 py-2 text-white text-xs">
        🖱️ Drag to rotate • Scroll to zoom • Click rooms
      </div>
    </div>
  );
}
