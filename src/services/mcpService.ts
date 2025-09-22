interface Room {
  id: string;
  name: string;
  length: number;
  width: number;
}

interface Door {
  id: string;
  roomId: string;
  width: number;
  height: number;
}

interface Window {
  id: string;
  roomId: string;
  width: number;
  height: number;
}

class MCPService {
  private proxyUrl = '/api/mcp';

  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing MCP connection via proxy...');
      
      // Test our proxy endpoint first
      const response = await fetch(this.proxyUrl, {
        method: 'GET',
      });
      
      console.log('Proxy status:', response.status);
      const data = await response.json();
      console.log('Proxy response:', data);
      
      if (response.ok && data.status) {
        console.log('Proxy is working, testing MCP call...');
        
        // Try a real MCP call through the proxy
        const mcpRequest = {
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'future_home_get_rooms',
            arguments: {}
          }
        };

        const mcpResponse = await fetch(this.proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mcpRequest),
        });

        console.log('MCP call status:', mcpResponse.status);
        const mcpData = await mcpResponse.text();
        console.log('MCP call response:', mcpData);

        return mcpResponse.ok;
      }
      
      return false;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  async getRooms(): Promise<Room[]> {
    try {
      const mcpRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'future_home_get_rooms',
          arguments: {}
        }
      };

      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mcpRequest),
      });
      
      console.log('Get Rooms Response status:', response.status);
      const responseText = await response.text();
      console.log('Get Rooms Response:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        if (data.result) {
          return data.result;
        }
        if (Array.isArray(data)) {
          return data;
        }
      }
      
      throw new Error(`MCP error: ${response.status} - ${responseText}`);
    } catch (error) {
      console.warn('MCP service unavailable, using mock data:', error);
      return this.getMockRooms();
    }
  }

  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    try {
      const mcpRequest = {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'future_home_post_rooms',
          arguments: {
            body: room
          }
        }
      };

      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mcpRequest),
      });
      
      console.log('Create Room Response status:', response.status);
      const responseText = await response.text();
      console.log('Create Room Response:', responseText);
      
      if (response.ok) {
        const data = JSON.parse(responseText);
        if (data.result) {
          return data.result;
        }
        if (data.id) {
          return data;
        }
      }
      
      throw new Error(`MCP error: ${response.status} - ${responseText}`);
    } catch (error) {
      console.warn('MCP service unavailable, creating mock room:', error);
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...room,
      };
    }
  }

  async createDoor(door: Omit<Door, 'id'>): Promise<Door> {
    try {
      const response = await fetch(`${this.baseUrl}/doors`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(door),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('MCP service unavailable, creating mock door:', error);
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...door,
      };
    }
  }

  async createWindow(window: Omit<Window, 'id'>): Promise<Window> {
    try {
      const response = await fetch(`${this.baseUrl}/windows`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(window),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn('MCP service unavailable, creating mock window:', error);
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...window,
      };
    }
  }

  getMockRooms(): Room[] {
    return [
      { id: '1', name: 'Living Room', length: 15, width: 12 },
      { id: '2', name: 'Kitchen', length: 10, width: 8 },
      { id: '3', name: 'Bedroom', length: 12, width: 10 },
      { id: '4', name: 'Bathroom', length: 6, width: 5 },
    ];
  }

  getMockDoors(): Door[] {
    return [
      { id: '1', roomId: '1', width: 3, height: 7 },
      { id: '2', roomId: '2', width: 2.5, height: 7 },
      { id: '3', roomId: '3', width: 3, height: 7 },
      { id: '4', roomId: '4', width: 2, height: 7 },
    ];
  }

  getMockWindows(): Window[] {
    return [
      { id: '1', roomId: '1', width: 4, height: 3 },
      { id: '2', roomId: '1', width: 3, height: 3 },
      { id: '3', roomId: '2', width: 2, height: 2 },
      { id: '4', roomId: '3', width: 3, height: 3 },
    ];
  }
}

export const mcpService = new MCPService();
export type { Room, Door, Window };