'use client';

import React, { useState } from 'react';
import { Home, Square, DoorOpen, RectangleHorizontal, Settings, Save, Download, Undo2, Redo2 } from 'lucide-react';

interface ToolbarProps {
  onAddRoom: () => void;
  onAddDoor: () => void;
  onAddWindow: () => void;
}

export default function Toolbar({ onAddRoom, onAddDoor, onAddWindow }: ToolbarProps) {
  const [activeTab, setActiveTab] = useState('build');

  const tools = [
    { id: 'room', icon: Square, label: 'Add Room', action: onAddRoom },
    { id: 'door', icon: DoorOpen, label: 'Add Door', action: onAddDoor },
    { id: 'window', icon: RectangleHorizontal, label: 'Add Window', action: onAddWindow },
  ];

  const actions = [
    { id: 'undo', icon: Undo2, label: 'Undo' },
    { id: 'redo', icon: Redo2, label: 'Redo' },
    { id: 'save', icon: Save, label: 'Save' },
    { id: 'download', icon: Download, label: 'Export' },
  ];

  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Home className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Home Designer 3D</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('build')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'build'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Build
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'design'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'view'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            3D View
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {actions.map((action) => (
            <button
              key={action.id}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title={action.label}
            >
              <action.icon className="w-5 h-5" />
            </button>
          ))}
          <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Tool Panel */}
      {activeTab === 'build' && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Building Tools:</span>
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={tool.action}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <tool.icon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}