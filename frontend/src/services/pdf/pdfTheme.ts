export const CONARK_PDF_THEME = {
  colors: {
    bgBase: '#EDECE7',       // Warm off-white background
    cardWhite: '#FFFFFF',    // White card background
    inkBlack: '#111111',     // Black typography
    textMuted: '#555555',    // Technical muted text
    borderDark: '#111111',   // Dark thin borders
    borderDashed: '#444444', // Dashed border accent
    
    // ConArk Accents
    accentBlue: '#4FC3F7',
    accentChartreuse: '#E4FF5B',
    accentMint: '#7CFFA6',
    accentCream: '#F5F3E3',
    accentMagenta: '#FF2AA1',
    accentGreen: '#15803D',
    accentRed: '#DC2626',
    accentAmber: '#D97706',
    tableAltRow: '#F5F4EE'
  },
  fonts: {
    display: 'helvetica',
    body: 'helvetica',
    mono: 'courier'
  },
  page: {
    format: 'a4' as const,
    orientation: 'portrait' as const,
    width: 210,   // A4 width in mm
    height: 297,  // A4 height in mm
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    contentWidth: 180 // 210 - 15*2
  }
};
