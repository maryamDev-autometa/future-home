'use client';

import React, { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, Environment, ContactShadows, Sky } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced interfaces
interface Point {
  x: number;
  y: number;
}

interface RoomDefinition {
  id: string;
  name: string;
  points: Point[];
  center: Point;
  area: number;
  type: 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'office' | 'dining' | 'garage';
}

interface FurnitureItem {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  roomId: string;
  color?: string;
  scale?: [number, number, number];
}

export default function ProfessionalRoomBuilder() {
  const [mode, setMode] = useState<'draw' | 'furniture' | 'materials' | 'view'>('draw');
  const [rooms, setRooms] = useState<RoomDefinition[]>([]);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [selectedFurnitureType, setSelectedFurnitureType] = useState<string>('sofa-l');
  const [selectedRoom, setSelectedRoom] = useState<string>('');

  // Create a complete house like the example
  const createCompleteHouse = () => {
    const newRooms: RoomDefinition[] = [
      {
        id: 'garage',
        name: 'Garage',
        points: [
          { x: -15, y: -10 },
          { x: -5, y: -10 },
          { x: -5, y: 5 },
          { x: -15, y: 5 }
        ],
        center: { x: -10, y: -2.5 },
        area: 150,
        type: 'garage'
      },
      {
        id: 'living-room',
        name: 'Living Room',
        points: [
          { x: -5, y: -5 },
          { x: 8, y: -5 },
          { x: 8, y: 8 },
          { x: -5, y: 8 }
        ],
        center: { x: 1.5, y: 1.5 },
        area: 169,
        type: 'living'
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        points: [
          { x: 8, y: -5 },
          { x: 15, y: -5 },
          { x: 15, y: 3 },
          { x: 8, y: 3 }
        ],
        center: { x: 11.5, y: -1 },
        area: 56,
        type: 'kitchen'
      },
      {
        id: 'dining',
        name: 'Dining Room',
        points: [
          { x: 8, y: 3 },
          { x: 15, y: 3 },
          { x: 15, y: 8 },
          { x: 8, y: 8 }
        ],
        center: { x: 11.5, y: 5.5 },
        area: 35,
        type: 'dining'
      },
      {
        id: 'master-bedroom',
        name: 'Master Bedroom',
        points: [
          { x: -5, y: 8 },
          { x: 5, y: 8 },
          { x: 5, y: 15 },
          { x: -5, y: 15 }
        ],
        center: { x: 0, y: 11.5 },
        area: 70,
        type: 'bedroom'
      },
      {
        id: 'bedroom2',
        name: 'Bedroom 2',
        points: [
          { x: 5, y: 8 },
          { x: 15, y: 8 },
          { x: 15, y: 15 },
          { x: 5, y: 15 }
        ],
        center: { x: 10, y: 11.5 },
        area: 70,
        type: 'bedroom'
      },
      {
        id: 'bathroom1',
        name: 'Bathroom 1',
        points: [
          { x: -5, y: -10 },
          { x: 0, y: -10 },
          { x: 0, y: -5 },
          { x: -5, y: -5 }
        ],
        center: { x: -2.5, y: -7.5 },
        area: 25,
        type: 'bathroom'
      },
      {
        id: 'bathroom2',
        name: 'Bathroom 2',
        points: [
          { x: 0, y: -10 },
          { x: 8, y: -10 },
          { x: 8, y: -5 },
          { x: 0, y: -5 }
        ],
        center: { x: 4, y: -7.5 },
        area: 40,
        type: 'bathroom'
      }
    ];

    const newFurniture: FurnitureItem[] = [
      // Garage
      { id: 'car1', type: 'car', position: [-12, 0.5, -2], rotation: [0, 0, 0], roomId: 'garage', color: '#dc2626' },
      { id: 'car2', type: 'car', position: [-8, 0.5, -2], rotation: [0, 0, 0], roomId: 'garage', color: '#ffffff' },
      
      // Living Room
      { id: 'sofa-l', type: 'sofa-l', position: [0, 0.4, 3], rotation: [0, 0, 0], roomId: 'living-room', color: '#4b5563' },
      { id: 'coffee-table', type: 'coffee-table', position: [2, 0.2, 1], rotation: [0, 0, 0], roomId: 'living-room' },
      { id: 'tv-unit', type: 'tv-unit', position: [7, 0.5, -3], rotation: [0, Math.PI, 0], roomId: 'living-room' },
      { id: 'plant1', type: 'plant', position: [-3, 0, 6], rotation: [0, 0, 0], roomId: 'living-room' },
      { id: 'plant2', type: 'plant', position: [6, 0, 6], rotation: [0, 0, 0], roomId: 'living-room' },
      
      // Kitchen
      { id: 'kitchen-island', type: 'kitchen-island', position: [11.5, 0.5, -1], rotation: [0, 0, 0], roomId: 'kitchen' },
      { id: 'fridge', type: 'fridge', position: [14, 1, 1], rotation: [0, -Math.PI/2, 0], roomId: 'kitchen' },
      { id: 'stove', type: 'stove', position: [9, 0.4, -4], rotation: [0, 0, 0], roomId: 'kitchen' },
      
      // Dining Room
      { id: 'dining-table', type: 'dining-table', position: [11.5, 0.4, 5.5], rotation: [0, 0, 0], roomId: 'dining' },
      { id: 'dining-chairs', type: 'dining-chairs', position: [11.5, 0.4, 5.5], rotation: [0, 0, 0], roomId: 'dining' },
      
      // Master Bedroom
      { id: 'bed1', type: 'bed', position: [0, 0.3, 13], rotation: [0, 0, 0], roomId: 'master-bedroom' },
      { id: 'wardrobe1', type: 'wardrobe', position: [-4, 1, 9], rotation: [0, Math.PI/2, 0], roomId: 'master-bedroom' },
      { id: 'nightstand1', type: 'nightstand', position: [3, 0.3, 14], rotation: [0, 0, 0], roomId: 'master-bedroom' },
      
      // Bedroom 2
      { id: 'bed2', type: 'bed', position: [10, 0.3, 13], rotation: [0, 0, 0], roomId: 'bedroom2' },
      { id: 'desk', type: 'desk', position: [13, 0.4, 9], rotation: [0, Math.PI, 0], roomId: 'bedroom2' },
      { id: 'chair', type: 'office-chair', position: [13, 0.4, 10], rotation: [0, 0, 0], roomId: 'bedroom2' },
      
      // Bathrooms
      { id: 'toilet1', type: 'toilet', position: [-4, 0.2, -8], rotation: [0, Math.PI/2, 0], roomId: 'bathroom1' },
      { id: 'sink1', type: 'sink', position: [-2, 0.4, -9], rotation: [0, 0, 0], roomId: 'bathroom1' },
      { id: 'bathtub', type: 'bathtub', position: [4, 0.3, -8], rotation: [0, 0, 0], roomId: 'bathroom2' },
      { id: 'toilet2', type: 'toilet', position: [1, 0.2, -8], rotation: [0, Math.PI/2, 0], roomId: 'bathroom2' }
    ];

    setRooms(newRooms);
    setFurniture(newFurniture);
  };

  // Interactive room drawing functions
  const finishRoom = useCallback(() => {
    if (currentPoints.length < 3) return;

    const centerX = currentPoints.reduce((sum, p) => sum + p.x, 0) / currentPoints.length;
    const centerY = currentPoints.reduce((sum, p) => sum + p.y, 0) / currentPoints.length;
    const area = calculatePolygonArea(currentPoints);

    const newRoom: RoomDefinition = {
      id: `room-${Date.now()}`,
      name: `Room ${rooms.length + 1}`,
      points: [...currentPoints],
      center: { x: centerX, y: centerY },
      area,
      type: 'living' // Default type, user can change later
    };

    setRooms(prev => [...prev, newRoom]);
    setCurrentPoints([]);
    setIsDrawing(false);
  }, [currentPoints, rooms.length]);

  const calculatePolygonArea = (points: Point[]): number => {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
  };

  // Handle 3D scene clicks for furniture placement
  const handle3DClick = useCallback((event: any) => {
    if (mode !== 'furniture') return;
    
    const position = event.point;
    if (!position) return;

    // Find which room this position is in
    const roomId = findRoomAtPosition(position.x, position.z);
    if (!roomId) return;

    const newFurniture: FurnitureItem = {
      id: `furniture-${Date.now()}`,
      type: selectedFurnitureType,
      position: [position.x, 0.5, position.z],
      rotation: [0, 0, 0],
      roomId
    };

    setFurniture(prev => [...prev, newFurniture]);
  }, [mode, selectedFurnitureType]);

  const findRoomAtPosition = (x: number, z: number): string => {
    for (const room of rooms) {
      if (isPointInPolygon(x, z, room.points)) {
        return room.id;
      }
    }
    return '';
  };

  const isPointInPolygon = (x: number, y: number, polygon: Point[]): boolean => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      if ((polygon[i].y > y) !== (polygon[j].y > y) &&
          x < (polygon[j].x - polygon[i].x) * (y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x) {
        inside = !inside;
      }
    }
    return inside;
  };

  // Floor plan drawing functions
  const handleFloorPlanClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'draw') return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 40 - 20;
    const y = ((event.clientY - rect.top) / rect.height) * 40 - 20;

    const newPoint: Point = { x, y };

    if (!isDrawing) {
      setIsDrawing(true);
      setCurrentPoints([newPoint]);
    } else {
      setCurrentPoints(prev => [...prev, newPoint]);
    }
  }, [mode, isDrawing]);

  const clearAll = () => {
    setRooms([]);
    setFurniture([]);
    setCurrentPoints([]);
    setIsDrawing(false);
  };

  const deleteRoom = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
    setFurniture(prev => prev.filter(item => item.roomId !== roomId));
  };

  const deleteFurniture = (furnitureId: string) => {
    setFurniture(prev => prev.filter(item => item.id !== furnitureId));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">🏠 Professional Home Designer</h2>
        
        {/* Mode Controls */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Design Mode</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'view', label: '👁️ View', desc: '3D Navigation' },
              { id: 'furniture', label: '🛋️ Furniture', desc: 'Place Items' },
              { id: 'materials', label: '🎨 Materials', desc: 'Colors & Textures' },
              { id: 'draw', label: '✏️ Draw', desc: 'Create Rooms' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as any)}
                className={`p-3 rounded text-center ${
                  mode === m.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="font-medium text-sm">{m.label}</div>
                <div className={`text-xs ${mode === m.id ? 'text-blue-100' : 'text-gray-500'}`}>
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2">Quick Start</h3>
          <div className="space-y-2">
            <button
              onClick={createCompleteHouse}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <div className="font-medium">🏡 Create Sample House</div>
              <div className="text-xs text-blue-100 mt-1">
                Full furnished home example
              </div>
            </button>
            <button
              onClick={clearAll}
              className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Mode-specific Controls */}
        {mode === 'draw' && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">✏️ Room Drawing</h3>
            <div className="text-xs text-gray-700 space-y-2 mb-3">
              <p><strong>How to draw:</strong></p>
              <p>1. Click points to create room corners</p>
              <p>2. Need at least 3 points</p>
              <p>3. Click "Finish Room" when done</p>
            </div>
            {isDrawing && (
              <div className="mb-3 p-2 bg-green-100 rounded">
                <p className="text-xs font-semibold text-green-800">
                  Drawing... ({currentPoints.length} points)
                </p>
                <p className="text-xs text-green-700">
                  {currentPoints.length < 3 
                    ? `Need ${3 - currentPoints.length} more points`
                    : 'Ready to finish room!'
                  }
                </p>
              </div>
            )}
            {isDrawing && (
              <button
                onClick={finishRoom}
                disabled={currentPoints.length < 3}
                className={`w-full px-4 py-2 rounded mb-2 ${
                  currentPoints.length >= 3
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                ✅ Finish Room ({currentPoints.length} points)
              </button>
            )}
            <p className="text-xs text-gray-600">
              💡 Use the 2D view below to draw room layouts, then see them in 3D!
            </p>
          </div>
        )}

        {mode === 'furniture' && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">🛋️ Furniture Placement</h3>
            <div className="text-xs text-gray-700 mb-3">
              <p><strong>How to place:</strong></p>
              <p>1. Select furniture below</p>
              <p>2. Click in 3D view to place</p>
              <p>3. Items only place inside rooms</p>
            </div>
            
            <div className="mb-3">
              <h4 className="text-xs font-semibold mb-2">Living Room</h4>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { type: 'sofa-l', icon: '🛋️', name: 'L-Sofa' },
                  { type: 'coffee-table', icon: '🪑', name: 'Coffee Table' },
                  { type: 'tv-unit', icon: '📺', name: 'TV Unit' },
                  { type: 'plant', icon: '🪴', name: 'Plant' }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setSelectedFurnitureType(item.type)}
                    className={`p-2 text-xs rounded border ${
                      selectedFurnitureType === item.type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div>{item.icon}</div>
                    <div>{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold mb-2">Kitchen</h4>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { type: 'kitchen-island', icon: '🏝️', name: 'Island' },
                  { type: 'fridge', icon: '❄️', name: 'Fridge' },
                  { type: 'stove', icon: '🔥', name: 'Stove' },
                  { type: 'sink', icon: '🚿', name: 'Sink' }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setSelectedFurnitureType(item.type)}
                    className={`p-2 text-xs rounded border ${
                      selectedFurnitureType === item.type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div>{item.icon}</div>
                    <div>{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <h4 className="text-xs font-semibold mb-2">Bedroom</h4>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { type: 'bed', icon: '🛏️', name: 'Bed' },
                  { type: 'wardrobe', icon: '🚪', name: 'Wardrobe' },
                  { type: 'nightstand', icon: '🕯️', name: 'Nightstand' },
                  { type: 'desk', icon: '🪑', name: 'Desk' }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setSelectedFurnitureType(item.type)}
                    className={`p-2 text-xs rounded border ${
                      selectedFurnitureType === item.type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div>{item.icon}</div>
                    <div>{item.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2 bg-yellow-50 rounded text-xs text-yellow-800">
              Selected: <strong>{selectedFurnitureType}</strong><br/>
              Click in 3D view to place furniture!
            </div>
          </div>
        )}

        {mode === 'materials' && (
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">🎨 Materials & Colors</h3>
            <div className="text-xs text-gray-700 mb-3">
              <p>Select room to change materials:</p>
            </div>
            <select 
              value={selectedRoom} 
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full p-2 text-xs border rounded mb-3"
            >
              <option value="">Select a room...</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
            <div className="text-xs text-gray-600">
              💡 Material editing coming soon! For now, rooms have automatic materials based on type.
            </div>
          </div>
        )}

        {/* Room Statistics */}
        <div className="mb-6 p-3 bg-gray-50 rounded">
          <h3 className="text-sm font-semibold mb-2">Project Stats</h3>
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span>Rooms:</span>
              <span className="font-medium">{rooms.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Furniture:</span>
              <span className="font-medium">{furniture.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Area:</span>
              <span className="font-medium">{rooms.reduce((sum, room) => sum + room.area, 0)} sq ft</span>
            </div>
          </div>
        </div>

        {/* Room List */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Rooms ({rooms.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {rooms.length === 0 ? (
              <div className="text-center text-gray-500 p-4">
                <div className="text-2xl mb-2">🏠</div>
                <div className="text-xs">No rooms yet</div>
                <div className="text-xs text-gray-400">
                  Switch to Draw mode to create rooms
                </div>
              </div>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="p-2 bg-gray-50 rounded text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium">{room.name}</div>
                      <div className="text-gray-600">
                        {Math.round(room.area)} sq ft • {room.type}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs"
                      title="Delete room"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Furniture List */}
        {furniture.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">Furniture ({furniture.length})</h3>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {furniture.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs">
                  <div>
                    <div className="font-medium">{item.type.replace('-', ' ')}</div>
                    <div className="text-gray-600">
                      {rooms.find(r => r.id === item.roomId)?.name || 'Unknown room'}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFurniture(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                    title="Delete furniture"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col">
        {/* 2D Floor Plan (only show in draw mode) */}
        {mode === 'draw' && (
          <div className="h-1/3 bg-white border-b">
            <div className="h-full relative">
              <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm z-10">
                2D Floor Plan - Click to draw room corners
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
                    room.points.map((point, index) => {
                      const nextPoint = room.points[(index + 1) % room.points.length];
                      return (
                        <line
                          key={`${room.id}-${index}`}
                          x1={`${((point.x + 20) / 40) * 100}%`}
                          y1={`${((point.y + 20) / 40) * 100}%`}
                          x2={`${((nextPoint.x + 20) / 40) * 100}%`}
                          y2={`${((nextPoint.y + 20) / 40) * 100}%`}
                          stroke="#059669"
                          strokeWidth="3"
                        />
                      );
                    })
                  )}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* 3D View */}
        <div className={`${mode === 'draw' ? 'h-2/3' : 'h-full'} bg-gradient-to-br from-blue-400 to-purple-600`}>
          <div className="h-full relative">
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg text-sm z-10">
              🏠 Professional 3D Home Designer - {mode} mode
            </div>
            <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs z-10">
              <div className="font-medium">Controls:</div>
              <div>• Drag to rotate</div>
              <div>• Scroll to zoom</div>
              <div>• Right-click to pan</div>
              {mode === 'furniture' && <div>• Click to place furniture</div>}
            </div>
            
            <Canvas 
              camera={{ position: [30, 25, 30], fov: 50 }}
              shadows
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <ProfessionalScene 
                  rooms={rooms} 
                  furniture={furniture} 
                  onSceneClick={handle3DClick}
                  mode={mode}
                />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}

// Professional 3D Scene
function ProfessionalScene({ 
  rooms, 
  furniture, 
  onSceneClick, 
  mode 
}: { 
  rooms: RoomDefinition[], 
  furniture: FurnitureItem[], 
  onSceneClick?: (event: any) => void,
  mode: string
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[20, 20, 10]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight skyColor="#ffffff" groundColor="#444444" intensity={0.6} />
      
      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="city" />
      
      {/* Ground - Clickable for furniture placement */}
      <Plane 
        args={[100, 100]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
        receiveShadow
        onClick={onSceneClick}
      >
        <meshLambertMaterial color="#f0f9ff" />
      </Plane>
      
      {/* Contact Shadows */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.3} 
        scale={50} 
        blur={2} 
        far={50} 
      />
      
      {/* Render Rooms */}
      {rooms.map(room => (
        <ProfessionalRoom key={room.id} room={room} />
      ))}
      
      {/* Render Furniture */}
      {furniture.map(item => (
        <ProfessionalFurniture key={item.id} item={item} />
      ))}
      
      {/* Controls */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={10}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

// Professional Room Component
function ProfessionalRoom({ room }: { room: RoomDefinition }) {
  const wallHeight = 8;
  
  // Calculate room bounds from points
  const minX = Math.min(...room.points.map(p => p.x));
  const maxX = Math.max(...room.points.map(p => p.x));
  const minY = Math.min(...room.points.map(p => p.y));
  const maxY = Math.max(...room.points.map(p => p.y));
  
  const roomWidth = maxX - minX;
  const roomDepth = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Room-specific colors and materials
  const getRoomMaterial = () => {
    switch (room.type) {
      case 'living':
        return { floor: '#d4a574', walls: '#f8f9fa' }; // Warm wood floor, light walls
      case 'kitchen':
        return { floor: '#e2e8f0', walls: '#ffffff' }; // Tile floor, white walls
      case 'bedroom':
        return { floor: '#c7b299', walls: '#f7fafc' }; // Carpet, soft walls
      case 'bathroom':
        return { floor: '#cbd5e0', walls: '#e2e8f0' }; // Tile floor and walls
      case 'garage':
        return { floor: '#6b7280', walls: '#9ca3af' }; // Concrete
      case 'dining':
        return { floor: '#d4a574', walls: '#fef7f0' }; // Wood floor, warm walls
      case 'office':
        return { floor: '#4a5568', walls: '#f7fafc' }; // Dark floor, light walls
      default:
        return { floor: '#d4a574', walls: '#f8f9fa' };
    }
  };

  const materials = getRoomMaterial();

  return (
    <group>
      {/* Floor */}
      <mesh 
        position={[centerX, 0.01, centerY]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          color={materials.floor} 
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Walls - Create from points */}
      {room.points.map((point, index) => {
        const nextPoint = room.points[(index + 1) % room.points.length];
        const wallLength = Math.sqrt(
          Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
        );
        const wallAngle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x);
        const wallCenterX = (point.x + nextPoint.x) / 2;
        const wallCenterY = (point.y + nextPoint.y) / 2;
        
        return (
          <mesh
            key={`wall-${index}`}
            position={[wallCenterX, wallHeight / 2, wallCenterY]}
            rotation={[0, wallAngle, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wallLength, wallHeight, 0.2]} />
            <meshStandardMaterial 
              color={materials.walls}
              roughness={0.7}
              metalness={0.1}
            />
          </mesh>
        );
      })}
      
      {/* Room Label */}
      <Text
        position={[centerX, wallHeight + 1, centerY]}
        fontSize={1}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </group>
  );
}

// Professional Furniture Component
function ProfessionalFurniture({ item }: { item: FurnitureItem }) {
  const furnitureComponents = {
    // Cars
    car: () => (
      <group>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[4, 1.5, 2]} />
          <meshStandardMaterial color={item.color || '#dc2626'} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Car wheels */}
        {[[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.2, pos[1]]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2]} />
            <meshStandardMaterial color="#2d3748" />
          </mesh>
        ))}
      </group>
    ),
    
    // Living Room Furniture
    'sofa-l': () => (
      <group>
        {/* Main sofa body */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[6, 1.5, 2]} />
          <meshStandardMaterial color={item.color || '#4b5563'} roughness={0.8} />
        </mesh>
        {/* Sofa back */}
        <mesh position={[0, 0.75, -0.8]} castShadow>
          <boxGeometry args={[6, 1.5, 0.4]} />
          <meshStandardMaterial color={item.color || '#4b5563'} roughness={0.8} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-2.8, 0.5, 0]} castShadow>
          <boxGeometry args={[0.4, 1, 2]} />
          <meshStandardMaterial color={item.color || '#4b5563'} roughness={0.8} />
        </mesh>
        <mesh position={[2.8, 0.5, 0]} castShadow>
          <boxGeometry args={[0.4, 1, 2]} />
          <meshStandardMaterial color={item.color || '#4b5563'} roughness={0.8} />
        </mesh>
      </group>
    ),
    
    'coffee-table': () => (
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 0.2, 1]} />
          <meshStandardMaterial color="#8b4513" roughness={0.6} />
        </mesh>
        {/* Table legs */}
        {[[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]].map((pos, i) => (
          <mesh key={i} position={[pos[0], -0.15, pos[1]]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.3]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
      </group>
    ),
    
    'tv-unit': () => (
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 1, 0.5]} />
          <meshStandardMaterial color="#2d3748" roughness={0.4} />
        </mesh>
        {/* TV */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[2.5, 1.5, 0.1]} />
          <meshStandardMaterial color="#1a202c" metalness={0.3} />
        </mesh>
      </group>
    ),
    
    plant: () => (
      <group>
        {/* Pot */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.4]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        {/* Plant */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.4]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
      </group>
    ),
    
    // Kitchen Furniture
    'kitchen-island': () => (
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 1.5, 1.5]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.6} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[3.2, 0.1, 1.7]} />
          <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
    ),
    
    fridge: () => (
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 3, 1]} />
        <meshStandardMaterial color="#f7fafc" metalness={0.3} roughness={0.4} />
      </mesh>
    ),
    
    stove: () => (
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 1.5, 1]} />
          <meshStandardMaterial color="#2d3748" metalness={0.5} />
        </mesh>
        {/* Burners */}
        {[[-0.3, 0.3], [0.3, 0.3], [-0.3, -0.3], [0.3, -0.3]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.76, pos[1]]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.02]} />
            <meshStandardMaterial color="#1a202c" />
          </mesh>
        ))}
      </group>
    ),
    
    // Dining Room
    'dining-table': () => (
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 0.1, 1.5]} />
          <meshStandardMaterial color="#8b4513" roughness={0.6} />
        </mesh>
        {/* Table legs */}
        {[[-1.3, -0.6], [1.3, -0.6], [-1.3, 0.6], [1.3, 0.6]].map((pos, i) => (
          <mesh key={i} position={[pos[0], -0.4, pos[1]]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
      </group>
    ),
    
    'dining-chairs': () => (
      <group>
        {[[-1, 0.8], [1, 0.8], [-1, -0.8], [1, -0.8], [0, 0.8], [0, -0.8]].map((pos, i) => (
          <group key={i} position={[pos[0], 0, pos[1]]}>
            {/* Seat */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <boxGeometry args={[0.4, 0.05, 0.4]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Back */}
            <mesh position={[0, 0.5, -0.15]} castShadow>
              <boxGeometry args={[0.4, 0.6, 0.05]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
          </group>
        ))}
      </group>
    ),
    
    // Bedroom Furniture
    bed: () => (
      <group>
        {/* Mattress */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <boxGeometry args={[2.5, 0.3, 4]} />
          <meshStandardMaterial color="#f7fafc" roughness={0.8} />
        </mesh>
        {/* Bed frame */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <boxGeometry args={[2.7, 0.2, 4.2]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        {/* Headboard */}
        <mesh position={[0, 0.5, -1.9]} castShadow>
          <boxGeometry args={[2.7, 1, 0.2]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      </group>
    ),
    
    wardrobe: () => (
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 4, 2]} />
        <meshStandardMaterial color="#4a5568" roughness={0.7} />
      </mesh>
    ),
    
    nightstand: () => (
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.6, 1, 0.4]} />
          <meshStandardMaterial color="#8b4513" roughness={0.6} />
        </mesh>
        {/* Drawer handle */}
        <mesh position={[0.25, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>
      </group>
    ),
    
    desk: () => (
      <group>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2, 0.05, 1]} />
          <meshStandardMaterial color="#8b4513" roughness={0.6} />
        </mesh>
        {/* Desk legs */}
        {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map((pos, i) => (
          <mesh key={i} position={[pos[0], -0.4, pos[1]]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        ))}
      </group>
    ),
    
    'office-chair': () => (
      <group>
        {/* Seat */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.05]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.5, -0.2]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.05]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.05]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
      </group>
    ),
    
    // Bathroom
    toilet: () => (
      <group>
        {/* Bowl */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.4]} />
          <meshStandardMaterial color="#f7fafc" roughness={0.3} />
        </mesh>
        {/* Tank */}
        <mesh position={[0, 0.5, -0.3]} castShadow>
          <boxGeometry args={[0.4, 0.6, 0.2]} />
          <meshStandardMaterial color="#f7fafc" roughness={0.3} />
        </mesh>
      </group>
    ),
    
    sink: () => (
      <group>
        {/* Basin */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.15]} />
          <meshStandardMaterial color="#f7fafc" roughness={0.3} />
        </mesh>
        {/* Faucet */}
        <mesh position={[0, 0.3, -0.2]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#e5e7eb" metalness={0.8} />
        </mesh>
      </group>
    ),
    
    bathtub: () => (
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#f7fafc" roughness={0.3} />
      </mesh>
    )
  };

  const FurnitureComponent = furnitureComponents[item.type as keyof typeof furnitureComponents];
  
  if (!FurnitureComponent) {
    // Fallback for unknown furniture types
    return (
      <mesh position={item.position} rotation={item.rotation} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>
    );
  }

  return (
    <group 
      position={item.position} 
      rotation={item.rotation}
      scale={item.scale || [1, 1, 1]}
    >
      <FurnitureComponent />
    </group>
  );
}