import { MouseEvent } from 'react';

interface DisabledStyles {
  opacity: number;
  cursor: 'not-allowed';
  ':hover'?: {
    cursor: 'not-allowed';
    filter: 'grayscale(100%)';
  };
}

interface DisabledConfig {
  isDisabled: boolean;
  baseStyles?: Record<string, any>;
  baseColor?: string;
  onDisabledClick?: () => void;
}

interface DisabledResult {
  style: Record<string, any>;
  disabled: boolean;
  onClick: (e: MouseEvent) => void;
  'aria-disabled': boolean;
}

const getDisabledStyles = (baseColor: string = '#999'): DisabledStyles => ({
  opacity: 0.5,
  cursor: 'not-allowed',
  ':hover': {
    cursor: 'not-allowed',
    filter: 'grayscale(100%)',
  },
});

/**
 * A comprehensive utility for handling disabled state in components
 * @param config Configuration object for disabled state
 * @param originalOnClick Original onClick handler
 * @returns Object containing styles, disabled state, and click handler
 */
export const useDisabled = (
  config: DisabledConfig,
  originalOnClick?: (e: MouseEvent) => void
): DisabledResult => {
  const { isDisabled, baseStyles = {}, baseColor, onDisabledClick } = config;

  const handleClick = (e: MouseEvent) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      onDisabledClick?.();
      return;
    }
    originalOnClick?.(e);
  };

  const styles = isDisabled
    ? {
        ...baseStyles,
        ...getDisabledStyles(baseColor),
      }
    : baseStyles;

  return {
    style: styles,
    disabled: isDisabled,
    onClick: handleClick,
    'aria-disabled': isDisabled,
  };
};

/**
 * Legacy style-only utility for backward compatibility
 */
export const applyDisabledStyles = (
  isDisabled: boolean,
  baseStyles: Record<string, any>,
  baseColor: string = '#999'
) => {
  if (!isDisabled) return baseStyles;
  return {
    ...baseStyles,
    ...getDisabledStyles(baseColor),
  };
};
