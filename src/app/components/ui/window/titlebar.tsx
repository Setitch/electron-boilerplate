import { useRendererListener } from '@/app/hooks';
import { MenuChannels } from '@/consts/menu-channels.const';
import type { WindowState } from '@/electron/window-state';

import { useState } from 'react';

import Menu from './menu';
import WindowControls from './window-controls';
import classes from './titlebar.module.css';

const handleDoubleClick = () => {
  electron.ipcRenderer.invoke(MenuChannels.WINDOW_TOGGLE_MAXIMIZE);
};

export default function Titlebar() {
  const [windowState, setWindowState] = useState<WindowState>('normal');

  useRendererListener('window-state-changed', (_, windowState: WindowState) => {
    setWindowState(windowState);
  });

  // Hide titlebar in full screen mode on macOS
  if (windowState === 'full-screen' && __DARWIN__) {
    return null;
  }

  return (
    <div onDoubleClick={handleDoubleClick} className={classes.titlebar}>
      {__WIN32__ && (
        <>
          <Menu />
          <WindowControls windowState={windowState} />
        </>
      )}
    </div>
  );
}
