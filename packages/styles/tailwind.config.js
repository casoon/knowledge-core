/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--color-primary))',
          hover: 'hsl(var(--color-primary-hover))',
        },
        secondary: 'hsl(var(--color-secondary))',
        surface: {
          DEFAULT: 'hsl(var(--color-surface))',
          alt: 'hsl(var(--color-surface-alt))',
        },
        border: 'hsl(var(--color-border))',
        text: {
          DEFAULT: 'hsl(var(--color-text))',
          muted: 'hsl(var(--color-text-muted))',
        },
        success: {
          DEFAULT: 'hsl(var(--color-success))',
          bg: 'hsl(var(--color-success-bg))',
        },
        warning: {
          DEFAULT: 'hsl(var(--color-warning))',
          bg: 'hsl(var(--color-warning-bg))',
        },
        error: {
          DEFAULT: 'hsl(var(--color-error))',
          bg: 'hsl(var(--color-error-bg))',
        },
        info: {
          DEFAULT: 'hsl(var(--color-info))',
          bg: 'hsl(var(--color-info-bg))',
        },
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        s: 'var(--spacing-s)',
        m: 'var(--spacing-m)',
        l: 'var(--spacing-l)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        base: 'var(--transition-base)',
        slow: 'var(--transition-slow)',
      },
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
