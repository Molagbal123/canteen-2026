import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { REALTIME_URL } from '../config/runtime';
import RealtimeContext from './RealtimeContext';

const RealtimeProvider = ({ children }) => {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  const socket = useMemo(() => io(REALTIME_URL, {
    autoConnect: false,
    auth: token ? { token } : {},
    withCredentials: true,
  }), [token]);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
};

export default RealtimeProvider;
