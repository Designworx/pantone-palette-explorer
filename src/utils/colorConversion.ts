
// Color conversion utilities and Delta E calculations
export interface LABColor {
  L: number;
  a: number;
  b: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface CMYKColor {
  c: number;
  m: number;
  y: number;
  k: number;
}

// Convert HEX to RGB
export const hexToRgb = (hex: string): RGBColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Convert RGB to LAB (simplified conversion for Delta E calculation)
export const rgbToLab = (rgb: RGBColor): LABColor => {
  // Convert RGB to XYZ first
  let { r, g, b } = rgb;
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using sRGB matrix
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  // Convert XYZ to LAB
  const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
  const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
  const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b_lab = 200 * (fy - fz);

  return { L, a, b: b_lab };
};

// Calculate Delta E (CIE76) between two LAB colors
export const calculateDeltaE = (lab1: LABColor, lab2: LABColor): number => {
  const deltaL = lab1.L - lab2.L;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;
  
  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
};

// Convert CMYK percentages to RGB (approximate)
export const cmykToRgb = (cmyk: CMYKColor): RGBColor => {
  const { c, m, y, k } = cmyk;
  const r = Math.round(255 * (1 - c/100) * (1 - k/100));
  const g = Math.round(255 * (1 - m/100) * (1 - k/100));
  const b = Math.round(255 * (1 - y/100) * (1 - k/100));
  
  return { r, g, b };
};

// RGB to HEX conversion
export const rgbToHex = (rgb: RGBColor): string => {
  const { r, g, b } = rgb;
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// Generate color harmonies
export const generateComplementary = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const compR = 255 - rgb.r;
  const compG = 255 - rgb.g;
  const compB = 255 - rgb.b;
  
  return rgbToHex({ r: compR, g: compG, b: compB });
};

// Color family classification
export const getColorFamily = (hex: string): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Unknown';
  
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  // Grayscale
  if (diff < 15) return 'Neutrals';
  
  // Determine dominant color
  if (r === max && g >= b) return r > g + 30 ? 'Reds' : 'Yellows';
  if (r === max && b > g) return 'Magentas';
  if (g === max && r >= b) return g > r + 30 ? 'Greens' : 'Yellows';
  if (g === max && b > r) return 'Cyans';
  if (b === max && r >= g) return 'Magentas';
  if (b === max && g > r) return 'Blues';
  
  return 'Mixed';
};
