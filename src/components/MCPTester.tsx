'use client';

import React, { useState } from 'react';
import { mcpService } from '../services/mcpService';

export default function MCPTester() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runTest = async () => {
    setIsLoading(true);
    setTestResult('Testing MCP connection...\n');
    
    try {
      const isConnected = await mcpService.testConnection();
      setTestResult(prev => prev + `Connection test result: ${isConnected}\n`);
      
      if (isConnected) {
        try {
          const rooms = await mcpService.getRooms();
          setTestResult(prev => prev + `Rooms fetched: ${JSON.stringify(rooms, null, 2)}\n`);
        } catch (error) {
          setTestResult(prev => prev + `Error fetching rooms: ${error}\n`);
        }
      }
    } catch (error) {
      setTestResult(prev => prev + `Test failed: ${error}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCreateRoom = async () => {
    setIsLoading(true);
    try {
      const room = await mcpService.createRoom({
        name: 'Test Room',
        length: 10,
        width: 8
      });
      setTestResult(prev => prev + `Room created: ${JSON.stringify(room, null, 2)}\n`);
    } catch (error) {
      setTestResult(prev => prev + `Error creating room: ${error}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 w-96 max-h-64 overflow-y-auto">
      <h3 className="font-bold mb-2">MCP Connection Tester</h3>
      <div className="space-y-2 mb-2">
        <button
          onClick={runTest}
          disabled={isLoading}
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
        <button
          onClick={testCreateRoom}
          disabled={isLoading}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 ml-2"
        >
          Test Create Room
        </button>
      </div>
      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
        {testResult || 'Click "Test Connection" to check MCP status'}
      </pre>
    </div>
  );
}