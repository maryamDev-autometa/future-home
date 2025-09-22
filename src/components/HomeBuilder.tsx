'use client';

import React, { useState } from 'react';
import { mcpService } from '../services/mcpService';

interface HomeBuilderProps {
  onDataUpdate: () => void;
}

export default function HomeBuilder({ onDataUpdate }: HomeBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({ name: '', length: 0, width: 0 });
  const [doorForm, setDoorForm] = useState({ roomId: '', width: 0, height: 0 });
  const [windowForm, setWindowForm] = useState({ roomId: '', width: 0, height: 0 });

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mcpService.createRoom({
        name: roomForm.name,
        length: roomForm.length,
        width: roomForm.width,
      });
      setRoomForm({ name: '', length: 0, width: 0 });
      onDataUpdate();
      alert('Room created successfully!');
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Failed to create room. Using mock data instead.');
    }
  };

  const handleCreateDoor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mcpService.createDoor({
        roomId: doorForm.roomId,
        width: doorForm.width,
        height: doorForm.height,
      });
      setDoorForm({ roomId: '', width: 0, height: 0 });
      onDataUpdate();
      alert('Door created successfully!');
    } catch (error) {
      console.error('Error creating door:', error);
      alert('Failed to create door.');
    }
  };

  const handleCreateWindow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mcpService.createWindow({
        roomId: windowForm.roomId,
        width: windowForm.width,
        height: windowForm.height,
      });
      setWindowForm({ roomId: '', width: 0, height: 0 });
      onDataUpdate();
      alert('Window created successfully!');
    } catch (error) {
      console.error('Error creating window:', error);
      alert('Failed to create window.');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        Add Elements
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Add Home Elements</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleCreateRoom} className="space-y-2">
          <h3 className="font-semibold text-blue-600">Add Room</h3>
          <input
            type="text"
            placeholder="Room name"
            value={roomForm.name}
            onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Length"
              value={roomForm.length || ''}
              onChange={(e) => setRoomForm({ ...roomForm, length: Number(e.target.value) })}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Width"
              value={roomForm.width || ''}
              onChange={(e) => setRoomForm({ ...roomForm, width: Number(e.target.value) })}
              className="flex-1 p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Add Room
          </button>
        </form>

        <form onSubmit={handleCreateDoor} className="space-y-2">
          <h3 className="font-semibold text-green-600">Add Door</h3>
          <input
            type="text"
            placeholder="Room ID"
            value={doorForm.roomId}
            onChange={(e) => setDoorForm({ ...doorForm, roomId: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Width"
              value={doorForm.width || ''}
              onChange={(e) => setDoorForm({ ...doorForm, width: Number(e.target.value) })}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Height"
              value={doorForm.height || ''}
              onChange={(e) => setDoorForm({ ...doorForm, height: Number(e.target.value) })}
              className="flex-1 p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
            Add Door
          </button>
        </form>

        <form onSubmit={handleCreateWindow} className="space-y-2">
          <h3 className="font-semibold text-purple-600">Add Window</h3>
          <input
            type="text"
            placeholder="Room ID"
            value={windowForm.roomId}
            onChange={(e) => setWindowForm({ ...windowForm, roomId: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Width"
              value={windowForm.width || ''}
              onChange={(e) => setWindowForm({ ...windowForm, width: Number(e.target.value) })}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Height"
              value={windowForm.height || ''}
              onChange={(e) => setWindowForm({ ...windowForm, height: Number(e.target.value) })}
              className="flex-1 p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700">
            Add Window
          </button>
        </form>
      </div>
    </div>
  );
}