import { create } from 'zustand';
import io from 'socket.io-client';

export const useSocketStore = create((set, get) => ({
  socket: null,
  connectionStatus: 'disconnected', // disconnected, connecting, connected, error
  
  initSocket: () => {
    const { socket } = get();
    
    if (socket) {
      return socket;
    }
    
    set({ connectionStatus: 'connecting' });
    
    // Get backend URL - must be set in Vercel environment variables
    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
    
    // Log for debugging
    if (import.meta.env.PROD) {
      console.log('Socket URL:', serverUrl);
      if (!import.meta.env.VITE_SERVER_URL) {
        console.warn('⚠️ VITE_SERVER_URL not set! Socket.io will fail. Please set it in Vercel.');
      }
    }
    
    try {
      const newSocket = io(serverUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
      });
      
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        set({ connectionStatus: 'connected', socket: newSocket });
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        set({ connectionStatus: 'error' });
      });
      
      newSocket.on('disconnect', (reason) => {
        console.log('Disconnected from socket server:', reason);
        set({ connectionStatus: 'disconnected' });
      });
      
      set({ socket: newSocket });
      return newSocket;
    } catch (err) {
      console.error('Error initializing socket:', err);
      set({ connectionStatus: 'error' });
      return null;
    }
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connectionStatus: 'disconnected' });
    }
  }
}));
