import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

import { store } from './store';
import { theme } from './theme';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { NetworkProvider } from './contexts/NetworkContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider store={store}>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={theme}>
            <SafeAreaProvider>
              <NetworkProvider>
                <AuthProvider>
                  <NavigationContainer>
                    <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                    <AppNavigator />
                  </NavigationContainer>
                </AuthProvider>
              </NetworkProvider>
            </SafeAreaProvider>
          </PaperProvider>
        </QueryClientProvider>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default App; 