import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'sidebar-bg':      '#1D3D48',
        'sidebar-hover':   '#285260',
        'sidebar-active':  '#548C92',
        'deep-teal':       '#285260',
        teal:              '#548C92',
        'light-teal':      '#B4D7D8',
        cream:             '#E0D7CF',
        sand:              '#AB9072',
        gold:              '#C9A84C',
        bg:                '#FAF8F5',
        surface:           '#F5F1EC',
        'surface-2':       '#EDE9E3',
        divider:           '#E5E1DA',
        ink:               '#1A1410',
        'ink-muted':       '#6B6560',
        'ink-faint':       '#A8A29C',
        border:            'hsl(var(--border))',
        input:             'hsl(var(--input))',
        ring:              'hsl(var(--ring))',
        background:        'hsl(var(--background))',
        foreground:        'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        muted:   { DEFAULT: 'hsl(var(--muted))',   foreground: 'hsl(var(--muted-foreground))' },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Jost', 'Inter', 'sans-serif'],
        sans:    ['Jost', 'Inter', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in':        { from: { opacity: '0' },            to: { opacity: '1' } },
        'slide-in-left':  { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.2s ease-out',
        'slide-in-left':  'slide-in-left 0.25s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
