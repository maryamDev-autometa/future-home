'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { mcpService, Room, Door, Window } from '../services/mcpService';

interface RoomProps {
  room: Room;
  doors: Door[];
  windows: Window[];
  position: [number, number, number];
}

function RoomComponent({ room, doors, windows, position }: RoomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const roomHeight = 8;

  // Simplified wall geometry - just basic walls without holes for now
  const wallGeometry = useMemo(() => {
    try {
      // Create 4 walls instead of complex extrusion
      return new THREE.BoxGeometry(room.width, roomHeight, 0.2);
    } catch (error) {
      console.error('Error creating wall geometry:', error);
      return new THREE.BoxGeometry(10, 8, 0.2); // fallback
    }
  }, [room.width, room.length, roomHeight]);

  const floorGeometry = useMemo(() => {
    try {
      return new THREE.PlaneGeometry(room.width, room.length);
    } catch (error) {
      console.error('Error creating floor geometry:', error);
      return new THREE.PlaneGeometry(10, 10); // fallback
    }
  }, [room.width, room.length]);

  return (
    <group position={position}>
      {/* Floor */}
      <mesh 
        geometry={floorGeometry} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[room.width / 2, 0, room.length / 2]}
        receiveShadow
      >
        <meshStandardMaterial 
          color="#d4a574" 
          roughness={0.9}
          metalness={0.0}
        />
      </mesh>

      {/* 4 Walls */}
      {/* Front Wall */}
      <mesh position={[room.width / 2, roomHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[room.width, roomHeight, 0.2]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[room.width / 2, roomHeight / 2, room.length]} castShadow receiveShadow>
        <boxGeometry args={[room.width, roomHeight, 0.2]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[0, roomHeight / 2, room.length / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.2, roomHeight, room.length]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[room.width, roomHeight / 2, room.length / 2]} castShadow receiveShadow>
        <boxGeometry args={[0.2, roomHeight, room.length]} />
        <meshStandardMaterial color="#f8f9fa" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Room Label */}
      <Text
        position={[room.width / 2, roomHeight + 1, room.length / 2]}
        fontSize={1.2}
        color="#374151"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>

      {doors.filter(door => door.roomId === room.id).map((door, index) => (
        <DoorComponent
          key={door.id}
          door={door}
          position={[
            (room.width / (doors.filter(d => d.roomId === room.id).length + 1)) * (index + 1) - door.width / 2,
            door.height / 2,
            -0.1
          ]}
        />
      ))}

      {windows.filter(window => window.roomId === room.id).map((window, index) => (
        <WindowComponent
          key={window.id}
          window={window}
          position={[
            (room.width / (windows.filter(w => w.roomId === room.id).length + 1)) * (index + 1) - window.width / 2,
            roomHeight * 0.3 + window.height / 2,
            -0.05
          ]}
        />
      ))}
    </group>
  );
}

interface DoorProps {
  door: Door;
  position: [number, number, number];
}

function DoorComponent({ door, position }: DoorProps) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[door.width, door.height, 0.1]} />
      <meshStandardMaterial 
        color="#8B4513" 
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

interface WindowProps {
  window: Window;
  position: [number, number, number];
}

function WindowComponent({ window, position }: WindowProps) {
  return (
    <mesh position={position}>
      <planeGeometry args={[window.width, window.height]} />
      <meshStandardMaterial 
        color="#87CEEB" 
        transparent 
        opacity={0.4}
        roughness={0.1}
        metalness={0.9}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function Scene({ rooms, doors, windows }: { rooms: Room[], doors: Door[], windows: Window[] }) {
  const roomPositions = useMemo(() => {
    try {
      const positions: [number, number, number][] = [];
      let currentX = 0;
      let currentZ = 0;
      let maxHeightInRow = 0;

      // Ensure rooms is an array before calling forEach
      const roomsArray = Array.isArray(rooms) ? rooms : [];
      
      roomsArray.forEach((room, index) => {
        if (index > 0 && currentX + (room.width || 10) > 50) {
          currentX = 0;
          currentZ += maxHeightInRow + 5;
          maxHeightInRow = 0;
        }

        positions.push([currentX, 0, currentZ]);
        currentX += (room.width || 10) + 5;
        maxHeightInRow = Math.max(maxHeightInRow, room.length || 10);
      });

      return positions;
    } catch (error) {
      console.error('Error calculating room positions:', error);
      return [[0, 0, 0]]; // fallback position
    }
  }, [rooms]);

  return (
    <>
      {/* Basic Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      
      {/* Test Cube to verify rendering */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      {/* Grid Helper */}
      <gridHelper args={[50, 25]} position={[0, 0, 0]} />
      
      {/* Rooms */}
      {Array.isArray(rooms) && rooms.length > 0 && rooms.map((room, index) => {
        const pos = roomPositions[index] || [0, 0, 0];
        return (
          <RoomComponent
            key={room.id || index}
            room={room}
            doors={doors || []}
            windows={windows || []}
            position={pos}
          />
        );
      })}
      
      {/* Basic Controls */}
      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}

interface HomeSceneProps {
  rooms: Room[];
  doors: Door[];
  windows: Window[];
}

export default function HomeScene({ rooms, doors, windows }: HomeSceneProps) {

  return (
    <div className="w-full h-full bg-gray-100">
      <Canvas 
        camera={{ position: [15, 15, 15], fov: 75 }}
        style={{ background: '#f8fafc' }}
      >
        <Scene rooms={rooms} doors={doors} windows={windows} />
      </Canvas>
    </div>
  );
}