'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Canvas, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

// Interactive room creation component
interface Point {
  x: number;
  y: number;
}

interface WallDefinition {
  start: Point;
  end: Point;
  id: string;
}

interface RoomDefinition {
  id: string;
  walls: WallDefinition[];
  center: Point;
  area: number;
}

export default function InteractiveRoomBuilder() {
  const [mode, setMode] = useState<'draw' | 'furniture' | 'view'>('draw');
  const [currentWalls, setCurrentWalls] = useState<WallDefinition[]>([]);
  const [rooms, setRooms] = useState<RoomDefinition[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  const finishRoom = useCallback(() => {
    if (currentPoints.length < 3) return;

    // Create walls from points
    const walls: WallDefinition[] = [];
    for (let i = 0; i < currentPoints.length; i++) {
      const start = currentPoints[i];
      const end = currentPoints[(i + 1) % currentPoints.length];
      walls.push({
        id: `wall-${Date.now()}-${i}`,
        start,
        end
      });
    }

    // Calculate room center and area
    const centerX = currentPoints.reduce((sum, p) => sum + p.x, 0) / currentPoints.length;
    const centerY = currentPoints.reduce((sum, p) => sum + p.y, 0) / currentPoints.length;
    const area = calculatePolygonArea(currentPoints);

    const newRoom: RoomDefinition = {
      id: `room-${Date.now()}`,
      walls,
      center: { x: centerX, y: centerY },
      area
    };

    setRooms(prev => [...prev, newRoom]);
    setCurrentPoints([]);
    setIsDrawing(false);
  }, [currentPoints]);

  const calculatePolygonArea = (points: Point[]): number => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
  };

  // Floor plan drawing functions
  const handleFloorPlanClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'draw') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 40 - 20; // Convert to 3D coordinates
    const y = ((event.clientY - rect.top) / rect.height) * 40 - 20;

    const newPoint: Point = { x, y };

    if (!isDrawing) {
      // Start drawing
      setIsDrawing(true);
      setCurrentPoints([newPoint]);
    } else {
      // Continue drawing
      setCurrentPoints(prev => [...prev, newPoint]);
    }
  }, [mode, isDrawing]);

  const handleFloorPlanDoubleClick = useCallback(() => {
    if (mode === 'draw' && isDrawing && currentPoints.length >= 3) {
      finishRoom();
    }
  }, [mode, isDrawing, currentPoints.length, finishRoom]);

  const clearAll = () => {
    setRooms([]);
    setCurrentPoints([]);
    setIsDrawing(false);
  };

  const createSampleRooms = () => {
    // Create a sample house layout
    const sampleRooms: RoomDefinition[] = [
      {
        id: 'living-room',
        walls: [
          { id: 'w1', start: { x: -8, y: -5 }, end: { x: 8, y: -5 } },
          { id: 'w2', start: { x: 8, y: -5 }, end: { x: 8, y: 5 } },
          { id: 'w3', start: { x: 8, y: 5 }, end: { x: -8, y: 5 } },
          { id: 'w4', start: { x: -8, y: 5 }, end: { x: -8, y: -5 } }
        ],
        center: { x: 0, y: 0 },
        area: 160
      },
      {
        id: 'kitchen',
        walls: [
          { id: 'w5', start: { x: 8, y: -5 }, end: { x: 15, y: -5 } },
          { id: 'w6', start: { x: 15, y: -5 }, end: { x: 15, y: 2 } },
          { id: 'w7', start: { x: 15, y: 2 }, end: { x: 8, y: 2 } },
          { id: 'w8', start: { x: 8, y: 2 }, end: { x: 8, y: -5 } }
        ],
        center: { x: 11.5, y: -1.5 },
        area: 49
      },
      {
        id: 'bedroom',
        walls: [
          { id: 'w9', start: { x: -8, y: 5 }, end: { x: 3, y: 5 } },
          { id: 'w10', start: { x: 3, y: 5 }, end: { x: 3, y: 12 } },
          { id: 'w11', start: { x: 3, y: 12 }, end: { x: -8, y: 12 } },
          { id: 'w12', start: { x: -8, y: 12 }, end: { x: -8, y: 5 } }
        ],
        center: { x: -2.5, y: 8.5 },
        area: 77
      }
    ];
    
    setRooms(sampleRooms);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Room Builder</h2>
        
        {/* Mode Controls */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Mode</h3>
          <div className="space-y-2">
            {[
              { id: 'draw', label: '✏️ Draw Rooms', desc: 'Create room layouts' },
              { id: 'furniture', label: '🛋️ Add Furniture', desc: 'Place furniture & decor' },
              { id: 'view', label: '👁️ View Only', desc: 'Navigate and inspect' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`w-full px-3 py-2 rounded text-left ${
                  mode === m.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium">{m.label}</div>
                <div className={`text-xs ${mode === m.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-6 p-3 bg-blue-50 rounded">
          <h3 className="text-sm font-semibold mb-2">How to Use</h3>
          {mode === 'draw' && (
            <div className="text-xs text-gray-700 space-y-1">
              <p><strong>Step 1:</strong> Click points on the grid to draw room corners</p>
              <p><strong>Step 2:</strong> Need at least 3 points to make a room</p>
              <p><strong>Step 3:</strong> Click "Finish Room" when done</p>
              <p><strong>Tip:</strong> Click where you want the walls to be</p>
              {isDrawing && (
                <div className="mt-2 p-2 bg-green-100 rounded">
                  <p className="font-semibold text-green-800">
                    Currently drawing... ({currentPoints.length} points)
                  </p>
                  <p className="text-green-700">
                    {currentPoints.length < 3 
                      ? `Need ${3 - currentPoints.length} more points`
                      : 'Ready to finish room!'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
          {mode === 'furniture' && (
            <div className="text-xs text-gray-700 space-y-1">
              <p><strong>Step 1:</strong> Select furniture from the list below</p>
              <p><strong>Step 2:</strong> Click in a room to place it</p>
              <p><strong>Tip:</strong> Different rooms get different furniture</p>
            </div>
          )}
          {mode === 'view' && (
            <div className="text-xs text-gray-700">
              <p>• Drag to rotate the 3D view</p>
              <p>• Scroll to zoom in/out</p>
              <p>• Explore your designed spaces</p>
            </div>
          )}
        </div>

        {/* Drawing Controls */}
        {mode === 'draw' && (
          <div className="mb-6">
            <div className="space-y-2">
              {isDrawing && (
                <button
                  onClick={finishRoom}
                  disabled={currentPoints.length < 3}
                  className={`w-full px-4 py-2 rounded ${
                    currentPoints.length >= 3
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Finish Room ({currentPoints.length} points)
                </button>
              )}
              
              {!isDrawing && rooms.length === 0 && (
                <button
                  onClick={createSampleRooms}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  🏠 Create Sample House
                </button>
              )}
              
              <button
                onClick={clearAll}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Furniture Controls */}
        {mode === 'furniture' && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Furniture Library</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🛋️', name: 'Sofa', type: 'sofa' },
                { icon: '📺', name: 'TV', type: 'tv' },
                { icon: '🍽️', name: 'Table', type: 'table' },
                { icon: '🪑', name: 'Chair', type: 'chair' },
                { icon: '🛏️', name: 'Bed', type: 'bed' },
                { icon: '🚿', name: 'Shower', type: 'shower' },
                { icon: '🔥', name: 'Stove', type: 'stove' },
                { icon: '❄️', name: 'Fridge', type: 'fridge' }
              ].map((item) => (
                <button
                  key={item.type}
                  className="flex flex-col items-center p-2 border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-2xl mb-1">{item.icon}</span>
                  <span className="text-xs">{item.name}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-600 bg-yellow-50 p-2 rounded">
              💡 Furniture is automatically placed when you create rooms. Use "🏠 Create Sample House" to see examples!
            </div>
          </div>
        )}

        {/* Room List */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Rooms ({rooms.length})</h3>
          <div className="space-y-2">
            {rooms.map((room, index) => (
              <div key={room.id} className="p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium">Room {index + 1}</div>
                <div className="text-xs text-gray-600">
                  Area: {room.area.toFixed(1)} sq ft
                </div>
                <div className="text-xs text-gray-600">
                  Walls: {room.walls.length}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col">
        {/* 2D Floor Plan */}
        <div className="h-1/2 bg-white border-b">
          <div className="h-full relative">
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
              2D Floor Plan - {mode === 'draw' ? 'Click to draw' : mode}
            </div>
            <div
              className="w-full h-full cursor-crosshair bg-gray-50"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
              onClick={handleFloorPlanClick}
              onDoubleClick={handleFloorPlanDoubleClick}
            >
              {/* Draw current points */}
              {currentPoints.map((point, index) => (
                <div
                  key={index}
                  className="absolute w-2 h-2 bg-blue-600 rounded-full transform -translate-x-1 -translate-y-1"
                  style={{
                    left: `${((point.x + 20) / 40) * 100}%`,
                    top: `${((point.y + 20) / 40) * 100}%`
                  }}
                />
              ))}
              
              {/* Draw current lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {currentPoints.map((point, index) => {
                  if (index === 0) return null;
                  const prevPoint = currentPoints[index - 1];
                  return (
                    <line
                      key={index}
                      x1={`${((prevPoint.x + 20) / 40) * 100}%`}
                      y1={`${((prevPoint.y + 20) / 40) * 100}%`}
                      x2={`${((point.x + 20) / 40) * 100}%`}
                      y2={`${((point.y + 20) / 40) * 100}%`}
                      stroke="#2563eb"
                      strokeWidth="2"
                    />
                  );
                })}
                
                {/* Draw existing rooms */}
                {rooms.map(room => 
                  room.walls.map(wall => (
                    <line
                      key={wall.id}
                      x1={`${((wall.start.x + 20) / 40) * 100}%`}
                      y1={`${((wall.start.y + 20) / 40) * 100}%`}
                      x2={`${((wall.end.x + 20) / 40) * 100}%`}
                      y2={`${((wall.end.y + 20) / 40) * 100}%`}
                      stroke="#059669"
                      strokeWidth="3"
                    />
                  ))
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* 3D View */}
        <div className="h-1/2 bg-gray-100">
          <div className="h-full relative">
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm z-10">
              3D View - Real-time Preview ({rooms.length} rooms)
            </div>
            <div className="w-full h-full">
              <Canvas 
                camera={{ position: [20, 20, 20], fov: 60 }}
                style={{ background: '#f8fafc' }}
                gl={{ antialias: true }}
              >
                {/* Basic lighting */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                
                {/* Test cube to verify Three.js is working */}
                <mesh position={[0, 1, 0]}>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial color="orange" />
                </mesh>
                
                {/* Grid */}
                <gridHelper args={[40, 20]} />
                
                {/* Render 3D rooms */}
                {rooms.length > 0 && rooms.map(room => (
                  <Room3D key={room.id} room={room} />
                ))}
                
                {/* Show current drawing in 3D */}
                {currentPoints.length > 0 && (
                  <CurrentDrawing3D points={currentPoints} />
                )}
                
                {/* Controls */}
                <OrbitControls 
                  enableDamping 
                  dampingFactor={0.05}
                  minDistance={5}
                  maxDistance={50}
                />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3D Room Component
function Room3D({ room }: { room: RoomDefinition }) {
  const roomType = room.id.includes('living') ? 'living' : 
                   room.id.includes('kitchen') ? 'kitchen' : 
                   room.id.includes('bedroom') ? 'bedroom' : 'room';

  // Calculate room bounds
  const minX = Math.min(...room.walls.map(w => Math.min(w.start.x, w.end.x)));
  const maxX = Math.max(...room.walls.map(w => Math.max(w.start.x, w.end.x)));
  const minY = Math.min(...room.walls.map(w => Math.min(w.start.y, w.end.y)));
  const maxY = Math.max(...room.walls.map(w => Math.max(w.start.y, w.end.y)));
  
  const roomWidth = maxX - minX;
  const roomDepth = maxY - minY;

  return (
    <group>
      {/* Simplified walls */}
      {room.walls.map((wall, index) => {
        const length = Math.sqrt(Math.pow(wall.end.x - wall.start.x, 2) + Math.pow(wall.end.y - wall.start.y, 2));
        const angle = Math.atan2(wall.end.y - wall.start.y, wall.end.x - wall.start.x);
        
        return (
          <mesh 
            key={`${room.id}-wall-${index}`}
            position={[
              (wall.start.x + wall.end.x) / 2,
              2,
              (wall.start.y + wall.end.y) / 2
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[length, 4, 0.2]} />
            <meshStandardMaterial color="#f0f0f0" />
          </mesh>
        );
      })}
      
      {/* Floor */}
      <mesh position={[room.center.x, 0.01, room.center.y]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      
      {/* Room Label */}
      <Text
        position={[room.center.x, 4.5, room.center.y]}
        fontSize={0.8}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
      </Text>

      {/* Add Furniture based on room type */}
      <RoomFurniture room={room} type={roomType} />
    </group>
  );
}

// Furniture Component
function RoomFurniture({ room, type }: { room: RoomDefinition, type: string }) {
  const furniture = [];

  if (type === 'living') {
    // Sofa
    furniture.push(
      <mesh key="sofa" position={[room.center.x - 2, 0.4, room.center.y]}>
        <boxGeometry args={[3, 0.8, 1.5]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    );
    
    // Coffee Table
    furniture.push(
      <mesh key="table" position={[room.center.x + 1, 0.2, room.center.y]}>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    );

    // TV Stand
    furniture.push(
      <mesh key="tv" position={[room.center.x + 3, 0.5, room.center.y - 2]}>
        <boxGeometry args={[2, 1, 0.3]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    );
  }

  if (type === 'kitchen') {
    // Counter
    furniture.push(
      <mesh key="counter" position={[room.center.x - 1, 0.5, room.center.y - 2]}>
        <boxGeometry args={[4, 1, 0.6]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    );

    // Refrigerator
    furniture.push(
      <mesh key="fridge" position={[room.center.x + 2, 1, room.center.y + 1]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#f7fafc" />
      </mesh>
    );

    // Stove
    furniture.push(
      <mesh key="stove" position={[room.center.x, 0.4, room.center.y - 2]}>
        <boxGeometry args={[0.8, 0.8, 0.6]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
    );
  }

  if (type === 'bedroom') {
    // Bed
    furniture.push(
      <mesh key="bed" position={[room.center.x, 0.3, room.center.y]}>
        <boxGeometry args={[2, 0.6, 3]} />
        <meshStandardMaterial color="#cbd5e0" />
      </mesh>
    );

    // Nightstand
    furniture.push(
      <mesh key="nightstand" position={[room.center.x + 2, 0.3, room.center.y + 1]}>
        <boxGeometry args={[0.6, 0.6, 0.4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    );

    // Wardrobe
    furniture.push(
      <mesh key="wardrobe" position={[room.center.x - 3, 1, room.center.y - 1]}>
        <boxGeometry args={[0.6, 2, 1.5]} />
        <meshStandardMaterial color="#4a5568" />
      </mesh>
    );
  }

  return <>{furniture}</>;
}

// Current drawing preview in 3D
function CurrentDrawing3D({ points }: { points: Point[] }) {
  return (
    <group>
      {points.map((point, index) => (
        <mesh key={index} position={[point.x, 0.1, point.y]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      ))}
    </group>
  );
}