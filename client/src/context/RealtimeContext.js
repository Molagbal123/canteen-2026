import { createContext } from 'react';

const RealtimeContext = createContext({ socket: null, isConnected: false });

export default RealtimeContext;
