'use client';

import React, { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Plane, Environment, ContactShadows, Sky } from '@react-three/drei';
import { File, Save, Undo, Redo, RotateCcw, Wrench, Image as ImageIcon, HelpCircle } from 'lucide-react';
import * as THREE from 'three';
import ProjectGallery from './ProjectGallery';
import FurnitureLibrary from './FurnitureLibrary';
import RealisticFurniture from './RealisticFurniture';

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

interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'outdoor';
  style: 'modern' | 'traditional' | 'minimalist' | 'cozy' | 'luxury';
  lastModified: string;
}

export default function CoohomStyleDesigner() {
  const [currentView, setCurrentView] = useState<'gallery' | 'designer'>('designer'); // Start with designer view
  const [currentProject, setCurrentProject] = useState<ProjectTemplate | null>({
    id: 'demo-house',
    title: 'Complete Furnished Demo House',
    description: 'Fully furnished modern home showcase',
    image: '',
    category: 'living',
    style: 'modern',
    lastModified: 'now'
  });
  
  // Designer state - Load demo house immediately
  const [rooms, setRooms] = useState<RoomDefinition[]>(createDemoHouse().rooms);
  const [furniture, setFurniture] = useState<FurnitureItem[]>(createDemoHouse().furniture);
  const [selectedFurnitureCategory, setSelectedFurnitureCategory] = useState('popular');
  const [view3D, setView3D] = useState<'1F' | '2D' | '3D'>('3D');
  const [showFurnitureLibrary, setShowFurnitureLibrary] = useState(true);
  const [placementMessage, setPlacementMessage] = useState<string>('');

  // Create complete demo house
  function createDemoHouse() {
    const demoRooms: RoomDefinition[] = [
      // Living Room
      {
        id: 'living-room',
        name: 'Living Room',
        points: [
          { x: -10, y: -8 },
          { x: 10, y: -8 },
          { x: 10, y: 8 },
          { x: -10, y: 8 }
        ],
        center: { x: 0, y: 0 },
        area: 320,
        type: 'living'
      },
      
      // Kitchen
      {
        id: 'kitchen',
        name: 'Kitchen',
        points: [
          { x: 10, y: -8 },
          { x: 18, y: -8 },
          { x: 18, y: 0 },
          { x: 10, y: 0 }
        ],
        center: { x: 14, y: -4 },
        area: 64,
        type: 'kitchen'
      },
      
      // Bedroom
      {
        id: 'bedroom',
        name: 'Master Bedroom',
        points: [
          { x: -10, y: 8 },
          { x: 8, y: 8 },
          { x: 8, y: 18 },
          { x: -10, y: 18 }
        ],
        center: { x: -1, y: 13 },
        area: 180,
        type: 'bedroom'
      },
      
      // Office
      {
        id: 'office',
        name: 'Home Office',
        points: [
          { x: 8, y: 8 },
          { x: 18, y: 8 },
          { x: 18, y: 18 },
          { x: 8, y: 18 }
        ],
        center: { x: 13, y: 13 },
        area: 100,
        type: 'office'
      }
    ];

    const demoFurniture: FurnitureItem[] = [
      // Living Room Furniture
      { id: 'living-sofa', type: 'sofa-l', position: [-2, 0.4, 2], rotation: [0, 0, 0], roomId: 'living-room', color: '#4A5568' },
      { id: 'living-coffee-table', type: 'coffee-table', position: [2, 0.2, 0], rotation: [0, 0, 0], roomId: 'living-room' },
      { id: 'living-tv', type: 'tv-unit', position: [0, 0.5, -6], rotation: [0, Math.PI, 0], roomId: 'living-room' },
      { id: 'living-plant1', type: 'plant', position: [-8, 0, 6], rotation: [0, 0, 0], roomId: 'living-room' },
      { id: 'living-plant2', type: 'plant', position: [8, 0, -6], rotation: [0, 0, 0], roomId: 'living-room' },
      { id: 'living-plant3', type: 'plant', position: [6, 0, 6], rotation: [0, 0, 0], roomId: 'living-room' },
      
      // Kitchen Furniture  
      { id: 'kitchen-island', type: 'kitchen-island', position: [14, 0.5, -4], rotation: [0, 0, 0], roomId: 'kitchen' },
      { id: 'kitchen-fridge', type: 'fridge', position: [16, 1, -7], rotation: [0, Math.PI/2, 0], roomId: 'kitchen' },
      { id: 'kitchen-stove', type: 'stove', position: [12, 0.4, -7], rotation: [0, 0, 0], roomId: 'kitchen' },
      
      // Bedroom Furniture
      { id: 'bedroom-bed', type: 'bed', position: [-1, 0.3, 15], rotation: [0, 0, 0], roomId: 'bedroom', color: '#F7FAFC' },
      { id: 'bedroom-nightstand1', type: 'nightstand', position: [2, 0.3, 16], rotation: [0, 0, 0], roomId: 'bedroom' },
      { id: 'bedroom-nightstand2', type: 'nightstand', position: [-4, 0.3, 16], rotation: [0, 0, 0], roomId: 'bedroom' },
      { id: 'bedroom-wardrobe', type: 'wardrobe', position: [-8, 1, 10], rotation: [0, Math.PI/2, 0], roomId: 'bedroom' },
      { id: 'bedroom-plant', type: 'plant', position: [6, 0, 16], rotation: [0, 0, 0], roomId: 'bedroom' },
      
      // Office Furniture
      { id: 'office-desk', type: 'desk', position: [13, 0.4, 15], rotation: [0, Math.PI, 0], roomId: 'office' },
      { id: 'office-chair', type: 'office-chair', position: [13, 0.4, 13], rotation: [0, 0, 0], roomId: 'office' },
      { id: 'office-bookshelf', type: 'wardrobe', position: [16, 1, 10], rotation: [0, Math.PI, 0], roomId: 'office' },
      { id: 'office-plant1', type: 'plant', position: [10, 0, 16], rotation: [0, 0, 0], roomId: 'office' },
      { id: 'office-plant2', type: 'plant', position: [16, 0, 16], rotation: [0, 0, 0], roomId: 'office' },
      
      // Additional scattered furniture for fullness
      { id: 'extra-coffee-table', type: 'coffee-table', position: [-6, 0.2, -4], rotation: [0, Math.PI/4, 0], roomId: 'living-room' },
      { id: 'reading-chair', type: 'office-chair', position: [-6, 0.4, 4], rotation: [0, Math.PI/3, 0], roomId: 'living-room', color: '#8B4513' }
    ];

    return { rooms: demoRooms, furniture: demoFurniture };
  }

  // Load template data
  const loadTemplate = (template: ProjectTemplate) => {
    setCurrentProject(template);
    
    // Load template-specific rooms and furniture
    const templateRooms = getTemplateRooms(template);
    const templateFurniture = getTemplateFurniture(template);
    
    setRooms(templateRooms);
    setFurniture(templateFurniture);
    setCurrentView('designer');
  };

  const getTemplateRooms = (template: ProjectTemplate): RoomDefinition[] => {
    // Return different room layouts based on template
    switch (template.id) {
      case 'home-office-comfort':
        return [
          {
            id: 'office-main',
            name: 'Home Office',
            points: [
              { x: -8, y: -6 },
              { x: 8, y: -6 },
              { x: 8, y: 6 },
              { x: -8, y: 6 }
            ],
            center: { x: 0, y: 0 },
            area: 192,
            type: 'office'
          }
        ];
      case 'living-room-comfort':
        return [
          {
            id: 'living-main',
            name: 'Living Room',
            points: [
              { x: -10, y: -8 },
              { x: 10, y: -8 },
              { x: 10, y: 8 },
              { x: -10, y: 8 }
            ],
            center: { x: 0, y: 0 },
            area: 320,
            type: 'living'
          }
        ];
      default:
        return [];
    }
  };

  const getTemplateFurniture = (template: ProjectTemplate): FurnitureItem[] => {
    switch (template.id) {
      case 'home-office-comfort':
        return [
          { id: 'desk-main', type: 'desk', position: [0, 0.4, -4], rotation: [0, 0, 0], roomId: 'office-main' },
          { id: 'chair-office', type: 'office-chair', position: [0, 0.4, -2], rotation: [0, 0, 0], roomId: 'office-main' },
          { id: 'bookshelf', type: 'wardrobe', position: [-6, 1, 4], rotation: [0, 0, 0], roomId: 'office-main' },
          { id: 'plant-office', type: 'plant', position: [6, 0, 4], rotation: [0, 0, 0], roomId: 'office-main' }
        ];
      case 'living-room-comfort':
        return [
          { id: 'sofa-main', type: 'sofa-l', position: [0, 0.4, 2], rotation: [0, 0, 0], roomId: 'living-main' },
          { id: 'coffee-table-main', type: 'coffee-table', position: [0, 0.2, -1], rotation: [0, 0, 0], roomId: 'living-main' },
          { id: 'tv-unit-main', type: 'tv-unit', position: [0, 0.5, -6], rotation: [0, Math.PI, 0], roomId: 'living-main' },
          { id: 'plant-living-1', type: 'plant', position: [-8, 0, 6], rotation: [0, 0, 0], roomId: 'living-main' },
          { id: 'plant-living-2', type: 'plant', position: [8, 0, 6], rotation: [0, 0, 0], roomId: 'living-main' }
        ];
      default:
        return [];
    }
  };

  const startNewProject = () => {
    setCurrentProject(null);
    setRooms([]);
    setFurniture([]);
    setCurrentView('designer');
  };

  const handleFurnitureSelect = (item: any) => {
    console.log('Furniture selected:', item);
    
    // Add the selected furniture to the scene
    const newFurniture: FurnitureItem = {
      id: `furniture-${Date.now()}`,
      type: item.id, // Use the exact ID from the furniture library
      position: [
        (Math.random() - 0.5) * 12, // Random position within the house
        0.5, 
        (Math.random() - 0.5) * 12
      ],
      rotation: [0, Math.random() * Math.PI * 2, 0], // Random rotation
      roomId: rooms[0]?.id || 'living-room', // Use existing room
      color: item.style === 'modern' ? '#4A5568' : 
             item.style === 'traditional' ? '#8B4513' : 
             '#6B7280'
    };

    setFurniture(prev => [...prev, newFurniture]);
    
    // Show success message
    setPlacementMessage(`✅ ${item.name} added to house!`);
    setTimeout(() => setPlacementMessage(''), 3000);
    console.log('Added furniture:', newFurniture);
  };

  if (currentView === 'gallery') {
    return (
      <ProjectGallery
        onSelectTemplate={loadTemplate}
        onNewProject={startNewProject}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView('gallery')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <span className="text-xl">🏠</span>
              <span className="font-semibold">FUTURE HOME</span>
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <File className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Save className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Undo className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Redo className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Wrench className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* View Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setView3D('1F')}
                className={`px-3 py-1 text-sm rounded ${view3D === '1F' ? 'bg-white shadow' : ''}`}
              >
                1F
              </button>
              <button
                onClick={() => setView3D('2D')}
                className={`px-3 py-1 text-sm rounded ${view3D === '2D' ? 'bg-white shadow' : ''}`}
              >
                2D
              </button>
              <button
                onClick={() => setView3D('3D')}
                className={`px-3 py-1 text-sm rounded ${view3D === '3D' ? 'bg-white shadow' : ''}`}
              >
                3D
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <HelpCircle className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Sidebar - Furniture Library */}
        {showFurnitureLibrary && (
          <div className="w-80 bg-white border-r border-gray-200">
            <FurnitureLibrary
              onSelectFurniture={handleFurnitureSelect}
              selectedCategory={selectedFurnitureCategory}
              onCategoryChange={setSelectedFurnitureCategory}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {/* Placement Message */}
          {placementMessage && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-medium">
              {placementMessage}
            </div>
          )}
          {/* 3D/2D View */}
          <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            {view3D === '3D' ? (
              <Canvas
                camera={{ position: [25, 20, 25], fov: 50 }}
                shadows
                gl={{ antialias: true, alpha: true }}
              >
                <Suspense fallback={null}>
                  <EnhancedScene rooms={rooms} furniture={furniture} />
                </Suspense>
              </Canvas>
            ) : view3D === '2D' ? (
              <div className="h-full bg-white flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">📐</div>
                  <h3 className="text-lg font-medium mb-2">2D Floor Plan View</h3>
                  <p className="text-sm">Switch to 3D view to see your design in three dimensions</p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-white flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="text-lg font-medium mb-2">Floor Plan View</h3>
                  <p className="text-sm">First Floor layout</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom View Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white rounded-lg shadow-lg px-4 py-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded">
              <span className="text-sm">👁️</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded">
              <span className="text-sm">📏</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded">
              <span className="text-sm">🔄</span>
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded">
              <span className="text-sm">🔍</span>
            </button>
            <div className="border-l border-gray-200 h-6 mx-2"></div>
            <span className="text-sm text-gray-600">100%</span>
            <button className="p-1 text-gray-600 hover:text-gray-900">
              <span className="text-lg">+</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">2D view</h3>
              <button className="text-blue-600 text-sm">Select room</button>
            </div>

            {/* Floor Controls */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2">🏠 Floor</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                  <span>🔺</span>
                  <span>New upper floor</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                  <span>🔻</span>
                  <span>New lower floor</span>
                </button>
              </div>
              
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Current floor</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">1F</span>
                  <span className="text-sm">1F</span>
                </div>
              </div>
            </div>

            {/* Room Properties */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-2">Basic</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600">Interior area</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">21.81</span>
                    <span className="text-xs text-gray-500">m²</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Room height</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">2800</span>
                    <span className="text-xs text-gray-500">mm</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Slab thickness</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">0</span>
                    <span className="text-xs text-gray-500">mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Opacity Controls */}
            <div>
              <h4 className="text-sm font-semibold mb-2">Opacity</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Wall</span>
                    <span className="text-xs">100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Floor</span>
                    <span className="text-xs">100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Info */}
            {currentProject && (
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">Current Project</h4>
                <p className="text-xs text-blue-700">{currentProject.title}</p>
                <p className="text-xs text-blue-600 mt-1">{currentProject.style} style</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced 3D Scene Component
function EnhancedScene({ rooms, furniture }: { rooms: RoomDefinition[], furniture: FurnitureItem[] }) {
  return (
    <>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[20, 20, 10]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <hemisphereLight args={["#ffffff", "#444444", 0.4]} />
      
      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="apartment" />
      
      {/* Enhanced Ground */}
      <Plane 
        args={[100, 100]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#f8fafc" 
          roughness={0.8}
          metalness={0.1}
        />
      </Plane>
      
      {/* Enhanced Contact Shadows */}
      <ContactShadows 
        position={[0, 0, 0]} 
        opacity={0.4} 
        scale={50} 
        blur={1.5} 
        far={50} 
      />
      
      {/* Render Rooms */}
      {rooms.map(room => (
        <EnhancedRoom key={room.id} room={room} />
      ))}
      
      {/* Render Realistic Furniture */}
      {furniture.map(item => (
        <RealisticFurniture key={item.id} item={item} />
      ))}
      
      {/* Enhanced Controls */}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.03}
        minDistance={8}
        maxDistance={50}
        maxPolarAngle={Math.PI / 2.1}
        enablePan={true}
        panSpeed={0.5}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
      />
    </>
  );
}

// Enhanced Room Component with better materials
function EnhancedRoom({ room }: { room: RoomDefinition }) {
  const wallHeight = 8;
  
  const minX = Math.min(...room.points.map(p => p.x));
  const maxX = Math.max(...room.points.map(p => p.x));
  const minY = Math.min(...room.points.map(p => p.y));
  const maxY = Math.max(...room.points.map(p => p.y));
  
  const roomWidth = maxX - minX;
  const roomDepth = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const getRoomMaterials = () => {
    switch (room.type) {
      case 'office':
        return { floor: '#e5e7eb', walls: '#f9fafb' };
      case 'living':
        return { floor: '#d4a574', walls: '#fefefe' };
      default:
        return { floor: '#f3f4f6', walls: '#ffffff' };
    }
  };

  const materials = getRoomMaterials();

  return (
    <group>
      {/* Enhanced Floor */}
      <mesh 
        position={[centerX, 0.01, centerY]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[roomWidth, roomDepth]} />
        <meshStandardMaterial 
          color={materials.floor} 
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      
      {/* Enhanced Walls */}
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
              roughness={0.8}
              metalness={0.02}
            />
          </mesh>
        );
      })}
      
      {/* Room Label */}
      <Text
        position={[centerX, wallHeight + 1, centerY]}
        fontSize={0.8}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </group>
  );
}

// Enhanced Furniture Component (simplified version)
function EnhancedFurniture({ item }: { item: FurnitureItem }) {
  const getBasicFurniture = () => {
    switch (item.type) {
      case 'desk':
        return (
          <mesh position={item.position} rotation={item.rotation} castShadow>
            <boxGeometry args={[2, 0.05, 1]} />
            <meshStandardMaterial color="#8b4513" roughness={0.6} />
          </mesh>
        );
      case 'office-chair':
        return (
          <mesh position={item.position} rotation={item.rotation} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        );
      case 'sofa-l':
        return (
          <mesh position={item.position} rotation={item.rotation} castShadow>
            <boxGeometry args={[6, 1.5, 2]} />
            <meshStandardMaterial color="#4b5563" roughness={0.8} />
          </mesh>
        );
      default:
        return (
          <mesh position={item.position} rotation={item.rotation} castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#9ca3af" />
          </mesh>
        );
    }
  };

  return <>{getBasicFurniture()}</>;
}