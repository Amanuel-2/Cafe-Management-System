import { Moon, Sun } from 'lucide-react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

export function ThemeSwitch() {
  const { mode, toggle } = useAppTheme();
  const isDark = mode === 'dark';

  return (
    <Tooltip label={isDark ? 'Use light mode' : 'Use dark mode'}>
      <Button size="icon" variant="ghost" Icon={isDark ? Sun : Moon} onClick={toggle} aria-label="Toggle theme" />
    </Tooltip>
  );
}
