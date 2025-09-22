'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Layers, Home, DoorOpen, RectangleHorizontal, Eye, EyeOff } from 'lucide-react';

interface SidebarProps {
  rooms: any[];
  doors: any[];
  windows: any[];
  onSelectItem?: (item: any) => void;
}

export default function Sidebar({ rooms, doors, windows, onSelectItem }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('rooms');

  const sections = [
    { id: 'rooms', label: 'Rooms', icon: Home, items: rooms, color: 'bg-blue-500' },
    { id: 'doors', label: 'Doors', icon: DoorOpen, items: doors, color: 'bg-green-500' },
    { id: 'windows', label: 'Windows', icon: RectangleHorizontal, items: windows, color: 'bg-purple-500' },
  ];

  if (isCollapsed) {
    return (
      <div className="absolute left-0 top-24 bottom-0 w-12 bg-white border-r border-gray-200 shadow-sm z-40">
        <div className="flex flex-col items-center py-4 space-y-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="w-8 h-px bg-gray-200" />
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setIsCollapsed(false);
              }}
              className={`p-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={section.label}
            >
              <section.icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute left-0 top-24 bottom-0 w-80 bg-white border-r border-gray-200 shadow-sm z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-gray-600" />
          <h2 className="font-semibold text-gray-900">Project Elements</h2>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <section.icon className="w-4 h-4" />
            <span>{section.label}</span>
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {section.items.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((section) => (
          <div
            key={section.id}
            className={`${activeSection === section.id ? 'block' : 'hidden'}`}
          >
            {section.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <section.icon className="w-12 h-12 mb-4 text-gray-300" />
                <p className="text-sm">No {section.label.toLowerCase()} added yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Use the toolbar to add {section.label.toLowerCase()}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {section.items.map((item, index) => (
                  <div
                    key={`${section.id}-${item.id || index}`}
                    onClick={() => onSelectItem?.(item)}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full ${section.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name || `${section.label.slice(0, -1)} ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {section.id === 'rooms' && `${item.length || 0} × ${item.width || 0} ft`}
                        {section.id === 'doors' && `${item.width || 0} × ${item.height || 0} ft`}
                        {section.id === 'windows' && `${item.width || 0} × ${item.height || 0} ft`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Elements</span>
          <span className="font-medium">
            {rooms.length + doors.length + windows.length}
          </span>
        </div>
      </div>
    </div>
  );
}