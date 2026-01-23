import { createContext, useContext, useState, useEffect } from 'react';
import { validateRoomCode } from '../config/roomCodes';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedRoom = localStorage.getItem('roomAuth');
    if (storedRoom) {
      try {
        const parsedRoom = JSON.parse(storedRoom);
        setCurrentRoom(parsedRoom);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored room:', error);
        localStorage.removeItem('roomAuth');
      }
    }
    setLoading(false);
  }, []);

  const login = (code) => {
    const result = validateRoomCode(code.trim().toUpperCase());

    if (result) {
      const [roomId, roomData] = result;
      const roomInfo = {
        id: roomId,
        ...roomData
      };

      setCurrentRoom(roomInfo);
      setIsAuthenticated(true);
      localStorage.setItem('roomAuth', JSON.stringify(roomInfo));
      return { success: true, room: roomInfo };
    }

    return { success: false, error: 'Invalid room code' };
  };

  const logout = () => {
    setCurrentRoom(null);
    setIsAuthenticated(false);
    localStorage.removeItem('roomAuth');
  };

  const value = {
    currentRoom,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
