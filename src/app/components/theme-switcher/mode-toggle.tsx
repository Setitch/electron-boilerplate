import { ActionIcon } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

import classes from './mode-toggle.module.css';
import { useThemeColorScheme } from '../../providers/theme.provider';

export function ModeToggle() {
  const { colorScheme, setColorScheme } = useThemeColorScheme();

  return (
    <ActionIcon
      onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      className={classes.actionIcon}
    >
      <IconSun className={`${classes.icon} ${classes.light}`} stroke={1.5} />
      <IconMoon className={`${classes.icon} ${classes.dark}`} stroke={1.5} />
    </ActionIcon>
  );
}
