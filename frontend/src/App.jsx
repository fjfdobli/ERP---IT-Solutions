import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp, theme } from 'antd';
import { useAuthStore, useAppStore } from './store';
import router from './router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, 
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { darkMode } = useAppStore();
  const { fetchCurrentUser, isAuthenticated, accessToken } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchCurrentUser();
    }
  }, [isAuthenticated, accessToken, fetchCurrentUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#667eea',
            borderRadius: 8,
          },
        }}
      >
        <AntApp>
          <RouterProvider router={router} />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
