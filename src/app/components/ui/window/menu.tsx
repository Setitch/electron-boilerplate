import { useEventListener } from '@/app/hooks';
import { MenuChannels } from '@/consts/menu-channels.const';
import { fixAcceleratorText } from '@/electron/menu/accelerators';
import menuList from '@/electron/menu/app-menu';
import appLogo from 'assets/icons/icon.png';

import { createRef, useMemo, useRef, useState } from 'react';
import type React from 'react';
import classes from './menu.module.css';

export default function Menu() {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const menusRef = useMemo(() => menuList.map(() => createRef<HTMLDivElement>()), []);

  useEventListener('keydown', (event) => handleKeyDown(event));

  useEventListener('mousedown', (event) => handleClickOutside(event));

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.repeat) return;
    if (e.altKey && activeMenuIndex !== null) {
      closeActiveMenu();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (activeMenuIndex !== null) {
      if (
        menusRef[activeMenuIndex].current &&
        !menusRef[activeMenuIndex].current?.contains(event.target as Node)
      ) {
        closeActiveMenu();
      }
    }
  };

  const showMenu = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (activeMenuIndex === index) {
      closeActiveMenu();
    } else {
      setActiveMenuIndex(index);
    }
  };

  const onMenuHover = (index: number) => {
    if (activeMenuIndex !== null && activeMenuIndex !== index) {
      setActiveMenuIndex(index);
    }
  };

  const closeActiveMenu = () => {
    setActiveMenuIndex(null);
  };

  const handleAction = (menuItem: Electron.MenuItemConstructorOptions, ...a: any[]) => {
    closeActiveMenu();
    console.info('handleAction', menuItem, a);
    const actionData = menuItem.id;
    if (actionData) {
      const [actionId, ...args] = actionData.split(':');
      console.log('b', actionId, menuItem, actionData);
      if (!menuItem.click) {
        return electron.ipcRenderer.send(MenuChannels.EXECUTE_MENU_ITEM_BY_ID, actionId, ...args);
      }
      
      return electron.ipcRenderer.invoke(actionId, ...args);
    }
  };

  const renderItemAccelerator = (menuItem: Electron.MenuItemConstructorOptions) => {
    if (menuItem.id === MenuChannels.WEB_ZOOM_IN) {
      const firstKey = __DARWIN__ ? '⌘' : 'Ctrl';
      const plus = __DARWIN__ ? '' : '+';
      const thirdKey = '+';

      return `${firstKey}${plus}${thirdKey}`;
    }

    if (menuItem.accelerator) {
      return fixAcceleratorText(menuItem.accelerator);
    }
  };

  return (
    <section style={{ display: 'flex', alignItems: 'center' }}>
      {/* Titlebar icon */}
      <section style={{ padding: '0 0.5rem' }}>
        <img src={appLogo} alt='App logo' style={{ width: '1.25rem', height: '1.25rem' }} />
      </section>

      {menuList.map(({ label, submenu }, menuIndex) => {
        const isActive = activeMenuIndex === menuIndex;
        
        return (
          <div style={{ position: 'relative' }} key={`menu_${menuIndex + 1}`}>
            <button
              style={{
                padding: '0.5rem 0.625rem',
                fontSize: '0.75rem',
                border: 'none',
                background: 'none',
                color: 'inherit',
                cursor: 'pointer',
              }}
              className={classes.menuButton}
              type='button'
              tabIndex={0}
              onClick={(e) => showMenu(menuIndex, e)}
              onKeyDown={(e) => showMenu(menuIndex, e)}
              onMouseEnter={() => onMenuHover(menuIndex)}
              onDoubleClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.preventDefault()}
            >
              {label}
            </button>
            <div 
              className={`${classes.menuDropdown} ${isActive ? classes.active : ''}`}
              ref={menusRef[menuIndex]}
            >
              {Array.isArray(submenu) &&
                submenu.map((menuItem, menuItemIndex) => {
                  if (menuItem.type === 'separator') {
                    return (
                      <div
                        key={`menu_${menuIndex}_popup_item_${menuItemIndex + 1}`}
                        className={classes.menuSeparator}
                      />
                    );
                  }

                  return (
                    <button
                      key={`menu_${menuIndex}_popup_item_${menuItemIndex + 1}`}
                      className={classes.menuItem}
                      onMouseDown={(e) => e.preventDefault()}
                      onKeyDown={(e) => e.preventDefault()}
                      type='button'
                      tabIndex={0}
                      onClick={() => handleAction(menuItem)}
                    >
                      <div style={{ paddingRight: '2rem' }}>
                        {menuItem.label}
                      </div>
                      <div style={{ color: 'var(--mantine-color-muted-foreground)' }}>
                        {renderItemAccelerator(menuItem)}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
