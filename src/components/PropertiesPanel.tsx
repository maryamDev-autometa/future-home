'use client';

import React, { useState } from 'react';
import { Settings, X, Palette, Ruler, Move3D } from 'lucide-react';

interface PropertiesPanelProps {
  selectedItem?: any;
  onClose: () => void;
  onUpdate: (item: any) => void;
}

export default function PropertiesPanel({ selectedItem, onClose, onUpdate }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('properties');

  if (!selectedItem) return null;

  const tabs = [
    { id: 'properties', label: 'Properties', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'transform', label: 'Transform', icon: Move3D },
  ];

  return (
    <div className="absolute right-0 top-24 bottom-0 w-80 bg-white border-l border-gray-200 shadow-sm z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Properties</h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-3 h-3" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={selectedItem.name || ''}
                onChange={(e) => onUpdate({ ...selectedItem, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {selectedItem.width !== undefined && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={selectedItem.width || 0}
                      onChange={(e) => onUpdate({ ...selectedItem, width: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-2 text-sm text-gray-400">ft</span>
                  </div>
                </div>
                {selectedItem.length !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Length</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedItem.length || 0}
                        onChange={(e) => onUpdate({ ...selectedItem, length: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-400">ft</span>
                    </div>
                  </div>
                )}
                {selectedItem.height !== undefined && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedItem.height || 0}
                        onChange={(e) => onUpdate({ ...selectedItem, height: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span className="absolute right-3 top-2 text-sm text-gray-400">ft</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Default</option>
                <option>Wood</option>
                <option>Concrete</option>
                <option>Brick</option>
                <option>Glass</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-6 gap-2">
                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transform' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="number"
                    placeholder="X"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Y"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Z"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rotation</label>
              <input
                type="range"
                min="0"
                max="360"
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}