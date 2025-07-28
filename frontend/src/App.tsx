import React, { Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SoundProvider } from './contexts/SoundContext';
import { AppRoutes } from './routes';
import GlobalStyles from './styles/global';
import { Toaster } from 'react-hot-toast';


const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider>
        <SoundProvider>
          <GlobalStyles />
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </SoundProvider>
      </ThemeProvider>
    </Suspense>
  );
};
export default App;