import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  lastMessage: any;
  sendMessage: (event: string, data: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: React.ReactNode;
}

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Create socket connection
      const newSocket = io('http://localhost:3001', {
        auth: {
          token: localStorage.getItem('token'),
        },
        transports: ['websocket', 'polling'],
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      // Connection events
      newSocket.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
      });

      // Real-time events
      newSocket.on('task:created', (data) => {
        console.log('Task created:', data);
        setLastMessage({ type: 'task:created', data });
      });

      newSocket.on('task:updated', (data) => {
        console.log('Task updated:', data);
        setLastMessage({ type: 'task:updated', data });
      });

      newSocket.on('task:deleted', (data) => {
        console.log('Task deleted:', data);
        setLastMessage({ type: 'task:deleted', data });
      });

      newSocket.on('project:created', (data) => {
        console.log('Project created:', data);
        setLastMessage({ type: 'project:created', data });
      });

      newSocket.on('project:updated', (data) => {
        console.log('Project updated:', data);
        setLastMessage({ type: 'project:updated', data });
      });

      newSocket.on('project:deleted', (data) => {
        console.log('Project deleted:', data);
        setLastMessage({ type: 'project:deleted', data });
      });

      newSocket.on('comment:added', (data) => {
        console.log('Comment added:', data);
        setLastMessage({ type: 'comment:added', data });
      });

      newSocket.on('notification', (data) => {
        console.log('Notification received:', data);
        setLastMessage({ type: 'notification', data });
      });

      // Join user's rooms
      newSocket.emit('join:user', { userId: user.id });

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const value: WebSocketContextType = {
    socket,
    isConnected,
    lastMessage,
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { useWebSocket, WebSocketProvider }; 