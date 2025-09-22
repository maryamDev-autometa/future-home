'use client';

import React from 'react';
import * as THREE from 'three';

interface RealisticFurnitureProps {
  item: {
    id: string;
    type: string;
    position: [number, number, number];
    rotation: [number, number, number];
    color?: string;
    scale?: [number, number, number];
  };
}

export default function RealisticFurniture({ item }: RealisticFurnitureProps) {
  const furnitureComponents = {
    // OFFICE FURNITURE - Realistic and detailed
    'desk': () => (
      <group>
        {/* Desktop - wood grain texture */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.06, 1.2]} />
          <meshStandardMaterial 
            color="#8B6914" 
            roughness={0.4} 
            metalness={0.1}
            normalScale={[0.1, 0.1]}
          />
        </mesh>
        
        {/* Desk drawers */}
        <mesh position={[0.6, 0.15, 0]} castShadow>
          <boxGeometry args={[1, 0.25, 1]} />
          <meshStandardMaterial color="#7A5A0F" roughness={0.5} />
        </mesh>
        
        {/* Desk legs - metal */}
        {[[-0.9, -0.4], [0.9, -0.4], [-0.9, 0.4], [0.9, 0.4]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.2, pos[1]]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.4]} />
            <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
        
        {/* Cable management */}
        <mesh position={[0, 0.43, -0.5]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#1C1C1C" />
        </mesh>
      </group>
    ),
    
    'office-chair': () => (
      <group>
        {/* Seat cushion - fabric texture */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.1]} />
          <meshStandardMaterial 
            color="#2E3A47" 
            roughness={0.9} 
            metalness={0.0}
          />
        </mesh>
        
        {/* Backrest */}
        <mesh position={[0, 0.8, -0.25]} castShadow>
          <boxGeometry args={[0.6, 0.7, 0.08]} />
          <meshStandardMaterial color="#2E3A47" roughness={0.9} />
        </mesh>
        
        {/* Armrests */}
        <mesh position={[-0.3, 0.65, -0.1]} castShadow>
          <boxGeometry args={[0.08, 0.3, 0.4]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        <mesh position={[0.3, 0.65, -0.1]} castShadow>
          <boxGeometry args={[0.08, 0.3, 0.4]} />
          <meshStandardMaterial color="#1A1A1A" />
        </mesh>
        
        {/* Chair base - 5-spoke star base */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.3]} />
          <meshStandardMaterial color="#1A1A1A" metalness={0.7} />
        </mesh>
        
        {/* Chair wheels */}
        {[0, 72, 144, 216, 288].map((angle, i) => {
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * 0.4;
          const z = Math.sin(radian) * 0.4;
          return (
            <group key={i}>
              <mesh position={[x, 0.05, z]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.04]} />
                <meshStandardMaterial color="#1A1A1A" />
              </mesh>
            </group>
          );
        })}
      </group>
    ),
    
    // LIVING ROOM FURNITURE - Very detailed and realistic
    'sofa-l': () => (
      <group>
        {/* Main seat sections */}
        <mesh position={[-1, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.6, 2]} />
          <meshStandardMaterial 
            color={item.color || "#4A5568"} 
            roughness={0.8} 
            metalness={0.0}
          />
        </mesh>
        
        <mesh position={[1.25, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.6, 2]} />
          <meshStandardMaterial 
            color={item.color || "#4A5568"} 
            roughness={0.8} 
            metalness={0.0}
          />
        </mesh>
        
        {/* Seat cushions - slightly raised */}
        <mesh position={[-1, 0.7, 0]} castShadow>
          <boxGeometry args={[2.3, 0.15, 1.8]} />
          <meshStandardMaterial 
            color={item.color || "#5A6478"} 
            roughness={0.9}
          />
        </mesh>
        
        <mesh position={[1.25, 0.7, 0]} castShadow>
          <boxGeometry args={[1.8, 0.15, 1.8]} />
          <meshStandardMaterial 
            color={item.color || "#5A6478"} 
            roughness={0.9}
          />
        </mesh>
        
        {/* Backrest cushions */}
        <mesh position={[-1, 1.1, -0.8]} castShadow>
          <boxGeometry args={[2.3, 0.8, 0.2]} />
          <meshStandardMaterial 
            color={item.color || "#4A5568"} 
            roughness={0.8}
          />
        </mesh>
        
        <mesh position={[1.25, 1.1, -0.8]} castShadow>
          <boxGeometry args={[1.8, 0.8, 0.2]} />
          <meshStandardMaterial 
            color={item.color || "#4A5568"} 
            roughness={0.8}
          />
        </mesh>
        
        {/* Armrests */}
        <mesh position={[-2.1, 0.8, 0]} castShadow>
          <boxGeometry args={[0.3, 0.9, 2]} />
          <meshStandardMaterial 
            color={item.color || "#4A5568"} 
            roughness={0.8}
          />
        </mesh>
        
        <mesh position={[2.15, 0.8, 0]} castShadow>
          <boxGeometry args={[0.3, 0.9, 2]} />
          <meshStandardMaterial 
            color={item.color || "#4A5568"} 
            roughness={0.8}
          />
        </mesh>
        
        {/* Sofa legs */}
        {[[-2, -0.8], [-0.2, -0.8], [0.4, -0.8], [2, -0.8], [-2, 0.8], [2, 0.8]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.1, pos[1]]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.15]} />
            <meshStandardMaterial color="#2D3748" metalness={0.6} />
          </mesh>
        ))}
        
        {/* Decorative pillows */}
        <mesh position={[-1.5, 0.9, 0.3]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.15]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
        </mesh>
        
        <mesh position={[0.8, 0.9, 0.3]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.15]} />
          <meshStandardMaterial color="#CBD5E0" roughness={0.9} />
        </mesh>
      </group>
    ),
    
    'coffee-table': () => (
      <group>
        {/* Tabletop - glass surface */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.03, 1]} />
          <meshPhysicalMaterial 
            color="#F7FAFC"
            metalness={0.0}
            roughness={0.1}
            transmission={0.3}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
        
        {/* Table frame - wood */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[1.85, 0.08, 1.05]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        
        {/* Lower shelf */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.03, 0.8]} />
          <meshStandardMaterial color="#A0522D" roughness={0.7} />
        </mesh>
        
        {/* Table legs */}
        {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.275, pos[1]]} castShadow>
            <boxGeometry args={[0.06, 0.35, 0.06]} />
            <meshStandardMaterial color="#654321" roughness={0.7} />
          </mesh>
        ))}
        
        {/* Decorative items on table */}
        <mesh position={[0.3, 0.45, 0.2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.12]} />
          <meshStandardMaterial color="#F7FAFC" roughness={0.3} />
        </mesh>
        
        <mesh position={[-0.4, 0.43, -0.1]} castShadow>
          <boxGeometry args={[0.3, 0.02, 0.2]} />
          <meshStandardMaterial color="#2D3748" roughness={0.9} />
        </mesh>
      </group>
    ),
    
    'tv-unit': () => (
      <group>
        {/* Main TV stand body */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.5, 0.5]} />
          <meshStandardMaterial color="#2D3748" roughness={0.4} metalness={0.1} />
        </mesh>
        
        {/* TV screen */}
        <mesh position={[0, 1.2, 0.02]} castShadow>
          <boxGeometry args={[2.8, 1.6, 0.08]} />
          <meshStandardMaterial color="#1A202C" metalness={0.8} roughness={0.1} />
        </mesh>
        
        {/* TV bezel */}
        <mesh position={[0, 1.2, 0.06]} castShadow>
          <boxGeometry args={[2.7, 1.5, 0.02]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Stand legs */}
        <mesh position={[-0.8, 0.52, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.3]} />
          <meshStandardMaterial color="#2D3748" metalness={0.3} />
        </mesh>
        
        <mesh position={[0.8, 0.52, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.3]} />
          <meshStandardMaterial color="#2D3748" metalness={0.3} />
        </mesh>
        
        {/* Drawers */}
        <mesh position={[-0.7, 0.3, 0.26]} castShadow>
          <boxGeometry args={[0.8, 0.15, 0.02]} />
          <meshStandardMaterial color="#1A202C" />
        </mesh>
        
        <mesh position={[0.7, 0.3, 0.26]} castShadow>
          <boxGeometry args={[0.8, 0.15, 0.02]} />
          <meshStandardMaterial color="#1A202C" />
        </mesh>
        
        {/* Remote on TV stand */}
        <mesh position={[0.5, 0.56, 0.1]} castShadow>
          <boxGeometry args={[0.05, 0.15, 0.02]} />
          <meshStandardMaterial color="#2D3748" />
        </mesh>
      </group>
    ),
    
    // PLANTS - Very natural and lively
    'plant': () => (
      <group>
        {/* Plant pot - ceramic */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.4]} />
          <meshStandardMaterial 
            color="#8B4513" 
            roughness={0.6} 
            metalness={0.1}
          />
        </mesh>
        
        {/* Soil */}
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.04]} />
          <meshStandardMaterial color="#4A4A4A" roughness={0.9} />
        </mesh>
        
        {/* Main trunk/stem */}
        <mesh position={[0, 0.7, 0]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 0.6]} />
          <meshStandardMaterial color="#228B22" roughness={0.8} />
        </mesh>
        
        {/* Large leaves - multiple for natural look */}
        {[
          { pos: [0.2, 1.0, 0.1], rot: [0, 0.3, 0.2], scale: 1 },
          { pos: [-0.15, 1.1, 0.2], rot: [0, -0.4, -0.1], scale: 0.9 },
          { pos: [0.1, 1.2, -0.2], rot: [0, 0.2, 0.3], scale: 1.1 },
          { pos: [-0.2, 0.9, -0.1], rot: [0, -0.5, -0.2], scale: 0.8 },
          { pos: [0.3, 0.8, 0], rot: [0, 0.6, 0.1], scale: 0.7 }
        ].map((leaf, i) => (
          <mesh 
            key={i} 
            position={leaf.pos} 
            rotation={leaf.rot}
            scale={[leaf.scale, leaf.scale, leaf.scale]}
            castShadow
          >
            <planeGeometry args={[0.4, 0.6]} />
            <meshStandardMaterial 
              color="#228B22" 
              side={THREE.DoubleSide}
              roughness={0.8}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        ))}
        
        {/* Small decorative stones around base */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * 0.32;
          const z = Math.sin(radian) * 0.32;
          return (
            <mesh key={i} position={[x, 0.41, z]} castShadow>
              <sphereGeometry args={[0.02]} />
              <meshStandardMaterial color="#696969" roughness={0.8} />
            </mesh>
          );
        })}
      </group>
    ),
    
    // KITCHEN FURNITURE
    'kitchen-island': () => (
      <group>
        {/* Island base */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3, 0.8, 1.5]} />
          <meshStandardMaterial color="#F8F9FA" roughness={0.6} />
        </mesh>
        
        {/* Marble countertop */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.08, 1.7]} />
          <meshStandardMaterial 
            color="#E2E8F0" 
            metalness={0.3} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Cabinet doors */}
        <mesh position={[-1, 0.3, 0.76]} castShadow>
          <boxGeometry args={[0.8, 0.6, 0.02]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        
        <mesh position={[1, 0.3, 0.76]} castShadow>
          <boxGeometry args={[0.8, 0.6, 0.02]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        
        {/* Handles */}
        <mesh position={[-0.7, 0.3, 0.77]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.15]} />
          <meshStandardMaterial color="#BFC1C2" metalness={0.8} />
        </mesh>
        
        <mesh position={[1.3, 0.3, 0.77]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.15]} />
          <meshStandardMaterial color="#BFC1C2" metalness={0.8} />
        </mesh>
        
        {/* Bar stools */}
        <mesh position={[-1.5, 0.6, -1.2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
        
        <mesh position={[1.5, 0.6, -1.2]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.05]} />
          <meshStandardMaterial color="#8B4513" roughness={0.7} />
        </mesh>
      </group>
    ),
    
    'fridge': () => (
      <group>
        {/* Main body */}
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.7, 1.8, 0.7]} />
          <meshStandardMaterial 
            color="#F7FAFC" 
            metalness={0.4} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Upper door */}
        <mesh position={[0.36, 1.2, 0]} castShadow>
          <boxGeometry args={[0.02, 1.2, 0.65]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        
        {/* Lower door */}
        <mesh position={[0.36, 0.4, 0]} castShadow>
          <boxGeometry args={[0.02, 0.6, 0.65]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        
        {/* Door handles */}
        <mesh position={[0.37, 1.3, 0.2]} castShadow>
          <boxGeometry args={[0.03, 0.2, 0.02]} />
          <meshStandardMaterial color="#BFC1C2" metalness={0.8} />
        </mesh>
        
        <mesh position={[0.37, 0.5, 0.2]} castShadow>
          <boxGeometry args={[0.03, 0.15, 0.02]} />
          <meshStandardMaterial color="#BFC1C2" metalness={0.8} />
        </mesh>
        
        {/* Control panel */}
        <mesh position={[0.36, 1.6, 0]} castShadow>
          <boxGeometry args={[0.03, 0.1, 0.3]} />
          <meshStandardMaterial color="#1A202C" />
        </mesh>
      </group>
    ),
    
    'stove': () => (
      <group>
        {/* Main body */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.8, 1]} />
          <meshStandardMaterial 
            color="#2D3748" 
            metalness={0.5} 
            roughness={0.4}
          />
        </mesh>
        
        {/* Cooktop */}
        <mesh position={[0, 0.86, 0]} castShadow>
          <boxGeometry args={[1.5, 0.02, 1]} />
          <meshStandardMaterial color="#1A202C" metalness={0.7} />
        </mesh>
        
        {/* Burners */}
        {[[-0.35, 0.25], [0.35, 0.25], [-0.35, -0.25], [0.35, -0.25]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.88, pos[1]]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.02]} />
            <meshStandardMaterial color="#1A202C" />
          </mesh>
        ))}
        
        {/* Oven door */}
        <mesh position={[0.76, 0.3, 0]} castShadow>
          <boxGeometry args={[0.02, 0.5, 0.9]} />
          <meshStandardMaterial color="#2D3748" />
        </mesh>
        
        {/* Oven handle */}
        <mesh position={[0.77, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.6]} />
          <meshStandardMaterial color="#BFC1C2" metalness={0.8} />
        </mesh>
        
        {/* Control knobs */}
        {[-0.5, -0.2, 0.1, 0.4].map((x, i) => (
          <mesh key={i} position={[x, 0.88, -0.45]} castShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.02]} />
            <meshStandardMaterial color="#1A202C" />
          </mesh>
        ))}
      </group>
    ),
    
    'nightstand': () => (
      <group>
        {/* Main body */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.6, 0.4]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        
        {/* Top surface */}
        <mesh position={[0, 0.61, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 0.02, 0.45]} />
          <meshStandardMaterial color="#A0522D" roughness={0.5} />
        </mesh>
        
        {/* Drawer */}
        <mesh position={[0.31, 0.4, 0]} castShadow>
          <boxGeometry args={[0.02, 0.15, 0.35]} />
          <meshStandardMaterial color="#654321" />
        </mesh>
        
        {/* Drawer handle */}
        <mesh position={[0.32, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.08]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} />
        </mesh>
        
        {/* Legs */}
        {[[-0.25, -0.15], [0.25, -0.15], [-0.25, 0.15], [0.25, 0.15]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.05, pos[1]]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.1]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
        
        {/* Lamp on nightstand */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.25]} />
          <meshStandardMaterial color="#2D3748" />
        </mesh>
        
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.15]} />
          <meshStandardMaterial color="#F7FAFC" />
        </mesh>
      </group>
    ),
    
    'wardrobe': () => (
      <group>
        {/* Main body */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 2, 0.6]} />
          <meshStandardMaterial color="#4A5568" roughness={0.7} />
        </mesh>
        
        {/* Left door */}
        <mesh position={[0.51, 1, 0]} castShadow>
          <boxGeometry args={[0.02, 1.8, 0.55]} />
          <meshStandardMaterial color="#2D3748" />
        </mesh>
        
        {/* Right door */}
        <mesh position={[-0.51, 1, 0]} castShadow>
          <boxGeometry args={[0.02, 1.8, 0.55]} />
          <meshStandardMaterial color="#2D3748" />
        </mesh>
        
        {/* Door handles */}
        <mesh position={[0.52, 1.1, 0.15]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.1]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} />
        </mesh>
        
        <mesh position={[-0.52, 1.1, 0.15]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.1]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} />
        </mesh>
        
        {/* Base */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[1.1, 0.1, 0.7]} />
          <meshStandardMaterial color="#2D3748" />
        </mesh>
      </group>
    ),

    // BEDROOM FURNITURE
    'bed': () => (
      <group>
        {/* Bed frame base */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.7, 0.3, 4.2]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        
        {/* Mattress */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.25, 4]} />
          <meshStandardMaterial color="#F7FAFC" roughness={0.8} />
        </mesh>
        
        {/* Bedsheets */}
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[2.5, 0.02, 4]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
        </mesh>
        
        {/* Pillows */}
        <mesh position={[-0.6, 0.6, -1.7]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.6]} />
          <meshStandardMaterial color="#F7FAFC" roughness={0.9} />
        </mesh>
        
        <mesh position={[0.6, 0.6, -1.7]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.6]} />
          <meshStandardMaterial color="#F7FAFC" roughness={0.9} />
        </mesh>
        
        {/* Headboard */}
        <mesh position={[0, 0.8, -2]} castShadow>
          <boxGeometry args={[2.7, 1.2, 0.15]} />
          <meshStandardMaterial color="#6B7280" roughness={0.7} />
        </mesh>
        
        {/* Bed legs */}
        {[[-1.2, -1.9], [1.2, -1.9], [-1.2, 1.9], [1.2, 1.9]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.075, pos[1]]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.15]} />
            <meshStandardMaterial color="#654321" />
          </mesh>
        ))}
        
        {/* Blanket partially folded */}
        <mesh position={[0, 0.52, 1]} castShadow>
          <boxGeometry args={[2.3, 0.1, 1.5]} />
          <meshStandardMaterial color="#4A90E2" roughness={0.8} />
        </mesh>
      </group>
    )
  };

  const FurnitureComponent = furnitureComponents[item.type as keyof typeof furnitureComponents];
  
  if (!FurnitureComponent) {
    // Fallback for unknown furniture types - make it look like a simple box
    return (
      <mesh position={item.position} rotation={item.rotation} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.7} />
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