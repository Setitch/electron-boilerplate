import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, HashRouter as Router, Routes } from 'react-router-dom';

import { queryClient } from '@/app/providers/query-client.provider';
import { ThemeProvider } from '@/app/providers/theme.provider';
import Titlebar from '@ui/window/titlebar';
import { useRendererListener } from '@/app/hooks';
import { LandingScreen } from '@/app/screens/landing.screen';
import { MenuChannels } from '@/consts/menu-channels.const';
import { ErrorBoundary } from '@/app/error-bondary';

const onMenuEvent = (_: Electron.IpcRendererEvent, channel: string, ...args: unknown[]) => {
  electron.ipcRenderer.invoke(channel, args);
};

/**
 * Idea:
 *  * Add sqlite database
 *  * List configurations
 * 
 */

export default function App() {
  useRendererListener(MenuChannels.MENU_EVENT, onMenuEvent);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Notifications />
        <QueryClientProvider client={queryClient}>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Titlebar />
              <main style={{ flex: 1, overflow: 'auto' }}>
                <Routes>
                  <Route path='/' Component={LandingScreen} />
                </Routes>
              </main>
            </div>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
