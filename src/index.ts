// Public API surface. Deliberately free of CSS imports — see ./bundle.ts,
// which is the entry Vite builds and where the stylesheets are pulled in.
//
// Components under src/demo/ are intentionally absent: they are showcase
// furniture, not part of the design system. See
// docs/adr/0011-demo-components-stay-unexported.md.
export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant } from './components/Badge';

export { Button } from './components/Button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './components/Button';

export { Card } from './components/Card';
export type {
  CardBodyProps,
  CardHeaderProps,
  CardProps,
  CardVariant,
} from './components/Card';

export { Text } from './components/Text';
export type {
  TextElement,
  TextProps,
  TextRole,
  TextSize,
  TextTone,
  TextWeight,
} from './components/Text';
