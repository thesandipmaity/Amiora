import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* AMIORA Brand */
        'deep-teal':   '#285260',
        teal:          '#548C92',
        'light-teal':  '#B4D7D8',
        cream:         '#E0D7CF',
        sand:          '#AB9072',

        /* Surfaces */
        bg:            '#FAF8F5',
        surface:       '#F5F1EC',
        'surface-2':   '#EDE9E3',
        divider:       '#D8D2C9',

        /* Text */
        ink:           '#1A1410',
        'ink-muted':   '#6B6560',
        'ink-faint':   '#A8A29C',

        /* Gold */
        gold:          '#C9A84C',
        'gold-light':  '#E8D5A3',

        /* shadcn/ui */
        border:            'hsl(var(--border))',
        input:             'hsl(var(--input))',
        ring:              'hsl(var(--ring))',
        background:        'hsl(var(--background))',
        foreground:        'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Cormorant', 'Georgia', 'serif'],
        body:    ['Jost', 'Inter', 'Helvetica Neue', 'sans-serif'],
        sans:    ['Jost', 'Inter', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        '2xs':    ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
      animation: {
        'accordion-down':  'accordion-down 0.2s ease-out',
        'accordion-up':    'accordion-up 0.2s ease-out',
        'fade-up':         'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in':         'fade-in 0.4s ease-out forwards',
        'slide-in-right':  'slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-left':   'slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        sm:      '0 1px 3px rgba(26,20,16,0.08)',
        DEFAULT: '0 4px 16px rgba(26,20,16,0.10)',
        lg:      '0 12px 40px rgba(26,20,16,0.14)',
        teal:    '0 4px 24px rgba(84,140,146,0.28)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
