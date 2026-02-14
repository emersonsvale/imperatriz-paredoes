import type { Config } from 'tailwindcss'

/**
 * Paleta refinada - Imperatriz Paredões (Som Automotivo)
 * Contraste e hierarquia otimizados para tema escuro.
 */
const colors = {
  /* Marca */
  primary: '#2ee509',
  'primary-hover': '#33f20d',
  'accent-purple': '#a855f7',
  'accent-purple-bright': '#c084fc',

  /* Fundos (do mais escuro ao mais claro) */
  'background-dark': '#0c0c0c',
  'background-page': '#111111',
  'background-player': '#1a1a1a',
  'card-dark': '#1c1c1c',
  'card-hover': '#262626',
  surface: '#2e2e2e',
  'surface-hover': '#3a3a3a',

  /* Bordas */
  'border-subtle': '#2a2a2a',
  'nav-border': '#2d3d2a',
  'border-focus': '#2ee509',

  /* Texto (primary = verde da marca; títulos = white) */
  muted: '#c2c2c2',
  'muted-secondary': '#8a8a8a',
  'muted-tertiary': '#6b6b6b',
  'muted-green': '#a1ba9c',

  /* Superfícies da página de detalhe do CD */
  'surface-dark': '#1a2a18',
  'surface-darker': '#0f1a0e',

  /* Painel do artista (referência do layout) */
  'border-dark': '#2b3928',
  'text-secondary': '#a1ba9c',
}

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors,
      fontFamily: {
        display: ['Be Vietnam Pro', 'sans-serif'],
      },
      backgroundImage: {
        'neon-gradient': `linear-gradient(to right, ${colors.primary}, ${colors['accent-purple']})`,
      },
      boxShadow: {
        'primary-glow': '0 0 24px rgba(46, 229, 9, 0.35)',
        'primary-glow-sm': '0 0 12px rgba(46, 229, 9, 0.25)',
        'player-bar': '0 -4px 24px rgba(0,0,0,0.4)',
        neon: '0 0 10px rgba(51, 242, 13, 0.3), 0 0 20px rgba(51, 242, 13, 0.1)',
        'neon-strong': '0 0 15px rgba(51, 242, 13, 0.5), 0 0 30px rgba(51, 242, 13, 0.2)',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(51, 242, 13, 0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(51, 242, 13, 0.6)' },
        },
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
