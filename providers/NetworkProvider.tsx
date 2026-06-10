import NetInfo from '@react-native-community/netinfo';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

interface NetworkState {
  isOnline: boolean;
}

const NetworkContext = createContext<NetworkState>({ isOnline: true });

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  // Default to online so first paint is not gated by a connectivity check.
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected) && state.isInternetReachable !== false;
      setIsOnline(online);
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ isOnline }), [isOnline]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork(): NetworkState {
  return useContext(NetworkContext);
}
