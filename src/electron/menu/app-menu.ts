import { send } from 'vite';
import { MenuChannels } from '../../consts/menu-channels.const';
import { emitEvent } from '../web-contents';

const MenuItems: Electron.MenuItemConstructorOptions[] = [
  {
    label: `Seti's Badge Generator`,
    submenu: [
     
      {
        type: 'separator',
      },
      {
        id: MenuChannels.WINDOW_CLOSE,
        label: 'Exit',
        role: 'quit',
        accelerator: 'CmdOrCtrl+Q',
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        id: `${MenuChannels.MENU_EVENT}:documentation`,
        label: 'Documentation',
      },
      {
        type: 'separator',
      },
      {
        id: `${MenuChannels.OPEN_GITHUB_PROFILE}:setitch/electron-base-template`,
        label: 'Github',
        click: emitEvent(MenuChannels.OPEN_GITHUB_PROFILE, 'setitch/electron-base-template'),
      },
      {
        type: 'separator',
      },
      {
        id: `${MenuChannels.MENU_EVENT}:about`,
        label: 'About',
        role: 'about',
        click: emitEvent(MenuChannels.MENU_EVENT, 'about'),
      },
      {
        id: MenuChannels.WEB_TOGGLE_DEVTOOLS,
        label: 'Toogle Developer Tools',
        role: 'toggleDevTools',
        accelerator: 'CmdOrCtrl+Shift+I',
      },
    ],
  },
];

export default MenuItems;
