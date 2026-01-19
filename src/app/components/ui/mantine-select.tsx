import React from 'react';
import Select, { Props as ReactSelectProps, StylesConfig } from 'react-select';
import { useMantineTheme, MantineColor, useComputedColorScheme } from '@mantine/core';

export interface MantineSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MantineSelectProps extends Omit<ReactSelectProps<MantineSelectOption>, 'styles' | 'theme'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'filled' | 'unstyled';
  error?: boolean;
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  menuPlacement?: 'top' | 'bottom' | 'auto';
  usePortal?: boolean;
}

export const MantineSelect: React.FC<MantineSelectProps> = ({
  size = 'sm',
  variant = 'default',
  error = false,
  radius = 'sm',
  menuPlacement = 'auto',
  usePortal = true,
  ...props
}) => {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light');
  const isDark = computedColorScheme === 'dark';
  
  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'xs':
        return { fontSize: '12px', padding: '4px 8px', minHeight: '24px' };
      case 'sm':
        return { fontSize: '14px', padding: '6px 12px', minHeight: '32px' };
      case 'md':
        return { fontSize: '14px', padding: '8px 12px', minHeight: '36px' };
      case 'lg':
        return { fontSize: '16px', padding: '10px 16px', minHeight: '42px' };
      case 'xl':
        return { fontSize: '16px', padding: '12px 16px', minHeight: '48px' };
      default:
        return { fontSize: '14px', padding: '6px 12px', minHeight: '32px' };
    }
  };

  const getRadiusValue = (radius: string) => {
    switch (radius) {
      case 'xs':
        return '2px';
      case 'sm':
        return '4px';
      case 'md':
        return '8px';
      case 'lg':
        return '12px';
      case 'xl':
        return '16px';
      default:
        return '4px';
    }
  };

  const sizeStyles = getSizeStyles(size);
  const radiusValue = getRadiusValue(radius);

  // Theme-aware colors
  const colors = {
    background: isDark ? theme.colors.dark[6] : theme.colors.white,
    backgroundFilled: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
    text: isDark ? theme.colors.dark[0] : theme.colors.gray[9],
    textSecondary: isDark ? theme.colors.dark[2] : theme.colors.gray[6],
    border: isDark ? theme.colors.dark[4] : theme.colors.gray[4],
    borderHover: isDark ? theme.colors.dark[3] : theme.colors.gray[5],
    borderFocus: theme.colors.blue[6],
    focusRing: isDark ? theme.colors.blue[9] : theme.colors.blue[1],
    optionHover: isDark ? theme.colors.dark[5] : theme.colors.gray[1],
    optionSelected: isDark ? theme.colors.blue[9] : theme.colors.blue[1],
    optionSelectedText: isDark ? theme.colors.blue[1] : theme.colors.blue[9],
    menuBackground: isDark ? theme.colors.dark[6] : theme.colors.white,
    menuBorder: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    menuShadow: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
  };

  const customStyles: StylesConfig<MantineSelectOption> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: sizeStyles.minHeight,
      height: sizeStyles.minHeight,
      fontSize: sizeStyles.fontSize,
      backgroundColor: variant === 'filled' ? colors.backgroundFilled : colors.background,
      borderColor: error 
        ? theme.colors.red[6] 
        : state.isFocused 
          ? colors.borderFocus 
          : colors.border,
      borderWidth: '1px',
      borderRadius: radiusValue,
      boxShadow: state.isFocused ? `0 0 0 2px ${colors.focusRing}` : 'none',
      '&:hover': {
        borderColor: state.isFocused ? colors.borderFocus : colors.borderHover,
      },
      cursor: 'pointer',
      transition: 'border-color 150ms ease, box-shadow 150ms ease',
    }),
    
    valueContainer: (provided) => ({
      ...provided,
      padding: `0 ${sizeStyles.padding.split(' ')[1]}`,
      height: sizeStyles.minHeight,
      display: 'flex',
      alignItems: 'center',
    }),
    
    placeholder: (provided) => ({
      ...provided,
      color: colors.textSecondary,
      fontSize: sizeStyles.fontSize,
      margin: '0',
    }),
    
    singleValue: (provided) => ({
      ...provided,
      color: colors.text,
      fontSize: sizeStyles.fontSize,
      margin: '0',
    }),
    
    input: (provided) => ({
      ...provided,
      color: colors.text,
      fontSize: sizeStyles.fontSize,
      margin: '0',
      padding: '0',
    }),
    
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: colors.border,
      margin: '8px 0',
    }),
    
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: colors.textSecondary,
      padding: '4px',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 150ms ease, color 150ms ease',
      '&:hover': {
        color: colors.text,
      },
    }),
    
    menu: (provided) => ({
      ...provided,
      backgroundColor: colors.menuBackground,
      borderRadius: radiusValue,
      boxShadow: `0 4px 12px ${colors.menuShadow}`,
      border: `1px solid ${colors.menuBorder}`,
      marginTop: '4px',
      zIndex: 9999,
    }),
    
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    
    menuList: (provided) => ({
      ...provided,
      padding: '4px 0',
      maxHeight: '200px',
      borderRadius: radiusValue,
    }),
    
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? colors.optionSelected 
        : state.isFocused 
          ? colors.optionHover 
          : 'transparent',
      color: state.isSelected 
        ? colors.optionSelectedText 
        : colors.text,
      fontSize: sizeStyles.fontSize,
      padding: `${sizeStyles.padding.split(' ')[0]} ${sizeStyles.padding.split(' ')[1]}`,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? colors.optionSelected : colors.optionHover,
      },
      '&:active': {
        backgroundColor: state.isSelected ? colors.optionSelected : colors.optionHover,
      },
    }),
    
    noOptionsMessage: (provided) => ({
      ...provided,
      color: colors.textSecondary,
      fontSize: sizeStyles.fontSize,
      padding: sizeStyles.padding,
    }),
    
    loadingMessage: (provided) => ({
      ...provided,
      color: colors.textSecondary,
      fontSize: sizeStyles.fontSize,
      padding: sizeStyles.padding,
    }),
  };

  return (
    <Select
      {...props}
      styles={customStyles}
      classNamePrefix="mantine-select"
      isSearchable={false}
      menuPlacement={menuPlacement}
      menuPosition={usePortal ? 'fixed' : 'absolute'}
      menuPortalTarget={usePortal ? document.body : undefined}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};

export default MantineSelect; 