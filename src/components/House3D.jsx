import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState } from 'react';
import { ROOMS } from '../config/roomCodes';

// Individual room component
function Room({ position, roomId, isOccupied, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(roomId)}
      >
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial
          color={hovered ? '#60a5fa' : isOccupied ? '#4ade80' : '#e5e7eb'}
          emissive={hovered ? '#3b82f6' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      <Text
        position={[0, 0, 0.41]}
        fontSize={0.15}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {roomId}
      </Text>
    </group>
  );
}

// Floor component
function Floor({ floorNumber, rooms, occupancy, onRoomClick }) {
  const yPosition = floorNumber * 0.8;
  const roomsOnFloor = Object.entries(rooms).filter(
    ([_, room]) => room.floor === floorNumber
  );

  // Arrange rooms in a row
  const spacing = 1.2;
  const totalWidth = (roomsOnFloor.length - 1) * spacing;
  const startX = -totalWidth / 2;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Floor platform */}
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[totalWidth + 1.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Rooms */}
      {roomsOnFloor.map(([roomId], index) => (
        <Room
          key={roomId}
          position={[startX + index * spacing, 0, 0]}
          roomId={roomId}
          isOccupied={occupancy[roomId]}
          onClick={onRoomClick}
        />
      ))}

      {/* Floor label */}
      <Text
        position={[startX - 0.8, 0, 0]}
        fontSize={0.2}
        color="#475569"
        anchorX="center"
        anchorY="middle"
      >
        F{floorNumber}
      </Text>
    </group>
  );
}

// Special facility markers
function FacilityMarker({ position, label, color }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.1}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

export default function House3D({ occupancy = {}, onRoomClick }) {
  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-xl">
      <Canvas camera={{ position: [5, 4, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, 10, -5]} intensity={0.4} />

        {/* Ground Floor (0) - Laundry */}
        <group position={[0, -0.5, 0]}>
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[4, 0.1, 1.5]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <FacilityMarker position={[-1, 0, 0]} label="Washer" color="#3b82f6" />
          <FacilityMarker position={[1, 0, 0]} label="Dryer" color="#f97316" />
          <Text
            position={[-2.5, 0, 0]}
            fontSize={0.2}
            color="#475569"
            anchorX="center"
            anchorY="middle"
          >
            Ground
          </Text>
        </group>

        {/* Floor 1 */}
        <Floor floorNumber={1} rooms={ROOMS} occupancy={occupancy} onRoomClick={onRoomClick} />

        {/* Floor 2 */}
        <Floor floorNumber={2} rooms={ROOMS} occupancy={occupancy} onRoomClick={onRoomClick} />

        {/* Floor 3 */}
        <Floor floorNumber={3} rooms={ROOMS} occupancy={occupancy} onRoomClick={onRoomClick} />

        {/* Floor 4 */}
        <Floor floorNumber={4} rooms={ROOMS} occupancy={occupancy} onRoomClick={onRoomClick} />

        {/* Kitchen markers */}
        <FacilityMarker position={[-2.5, 0.8, 0.8]} label="Kitchen" color="#10b981" />
        <FacilityMarker position={[-2.5, 2.4, 0.8]} label="Kitchen" color="#10b981" />

        {/* Shower markers */}
        <FacilityMarker position={[2.5, 0.8, 0.8]} label="Shower" color="#06b6d4" />
        <FacilityMarker position={[2.5, 2.4, 0.8]} label="Shower" color="#06b6d4" />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-400 rounded"></div>
          <span>Hover</span>
        </div>
      </div>
    </div>
  );
}
