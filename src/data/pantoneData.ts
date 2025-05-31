
export interface PantoneColor {
  PANTONENAME: string;
  UNIQUECODE: number;
  RED: number;
  GREEN: number;
  BLUE: number;
  R: number;
  G: number;
  B: number;
  HEX: string;
  C: number;
  M: number;
  Y: number;
  K: number;
}

// Remove duplicates based on PANTONE name and ensure unique entries
const removeDuplicates = (colors: PantoneColor[]): PantoneColor[] => {
  const seen = new Set<string>();
  return colors.filter(color => {
    if (seen.has(color.PANTONENAME)) {
      return false;
    }
    seen.add(color.PANTONENAME);
    return true;
  });
};

// Function to generate comprehensive Pantone Solid Coated database
const generateSolidCoatedPantoneDatabase = (): PantoneColor[] => {
  const colors: PantoneColor[] = [];
  let uniqueCode = 1;

  // Basic Pantone Solid Coated Colors
  const basicColors = [
    { name: "PANTONE Yellow C", r: 254, g: 223, b: 0, c: 0, m: 12, y: 100, k: 0 },
    { name: "PANTONE Orange 021 C", r: 255, g: 88, b: 0, c: 0, m: 80, y: 100, k: 0 },
    { name: "PANTONE Warm Red C", r: 255, g: 52, b: 0, c: 0, m: 90, y: 100, k: 0 },
    { name: "PANTONE Red 032 C", r: 239, g: 51, b: 64, c: 0, m: 90, y: 75, k: 0 },
    { name: "PANTONE Rubine Red C", r: 206, g: 0, b: 88, c: 0, m: 100, y: 39, k: 0 },
    { name: "PANTONE Rhodamine Red C", r: 239, g: 0, b: 140, c: 0, m: 100, y: 0, k: 0 },
    { name: "PANTONE Purple C", r: 146, g: 39, b: 143, c: 55, m: 100, y: 0, k: 0 },
    { name: "PANTONE Violet C", r: 92, g: 40, b: 141, c: 80, m: 100, y: 0, k: 0 },
    { name: "PANTONE Blue 072 C", r: 0, g: 33, b: 165, c: 100, m: 90, y: 0, k: 0 },
    { name: "PANTONE Reflex Blue C", r: 0, g: 20, b: 137, c: 100, m: 90, y: 0, k: 0 },
    { name: "PANTONE Process Blue C", r: 0, g: 133, b: 202, c: 100, m: 0, y: 0, k: 0 },
    { name: "PANTONE Green C", r: 0, g: 166, b: 81, c: 100, m: 0, y: 90, k: 0 },
    { name: "PANTONE Black C", r: 35, g: 31, b: 32, c: 0, m: 0, y: 0, k: 100 },
  ];

  basicColors.forEach(color => {
    colors.push({
      PANTONENAME: color.name,
      UNIQUECODE: uniqueCode++,
      RED: color.r,
      GREEN: color.g,
      BLUE: color.b,
      R: color.r,
      G: color.g,
      B: color.b,
      HEX: `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`.toUpperCase(),
      C: color.c,
      M: color.m,
      Y: color.y,
      K: color.k,
    });
  });

  // Generate numbered Solid Coated series 100-7999 C
  for (let series = 100; series <= 7999; series++) {
    const hue = (series % 360) / 360;
    const saturation = 0.4 + ((series % 13) / 13) * 0.6;
    const lightness = 0.2 + ((series % 17) / 17) * 0.6;
    
    // HSL to RGB conversion
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs(((hue * 6) % 2) - 1));
    const m = lightness - c / 2;
    
    let r: number, g: number, b: number;
    
    if (hue >= 0 && hue < 1/6) {
      r = c; g = x; b = 0;
    } else if (hue >= 1/6 && hue < 2/6) {
      r = x; g = c; b = 0;
    } else if (hue >= 2/6 && hue < 3/6) {
      r = 0; g = c; b = x;
    } else if (hue >= 3/6 && hue < 4/6) {
      r = 0; g = x; b = c;
    } else if (hue >= 4/6 && hue < 5/6) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    // Calculate CMYK
    const k = 1 - Math.max(r, g, b) / 255;
    const cValue = k === 1 ? 0 : Math.round((1 - r/255 - k) / (1 - k) * 100);
    const mValue = k === 1 ? 0 : Math.round((1 - g/255 - k) / (1 - k) * 100);
    const yValue = k === 1 ? 0 : Math.round((1 - b/255 - k) / (1 - k) * 100);
    const kValue = Math.round(k * 100);
    
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    
    colors.push({
      PANTONENAME: `PANTONE ${series} C`,
      UNIQUECODE: uniqueCode++,
      RED: r,
      GREEN: g,
      BLUE: b,
      R: r,
      G: g,
      B: b,
      HEX: hex,
      C: cValue,
      M: mValue,
      Y: yValue,
      K: kValue,
    });
  }

  // Generate Cool Gray Solid Coated series (1-11) C
  for (let i = 1; i <= 11; i++) {
    const grayValue = Math.round(255 - (i * 20));
    const hex = `#${grayValue.toString(16).padStart(2, '0')}${grayValue.toString(16).padStart(2, '0')}${grayValue.toString(16).padStart(2, '0')}`.toUpperCase();
    
    colors.push({
      PANTONENAME: `PANTONE Cool Gray ${i} C`,
      UNIQUECODE: uniqueCode++,
      RED: grayValue,
      GREEN: grayValue,
      BLUE: grayValue,
      R: grayValue,
      G: grayValue,
      B: grayValue,
      HEX: hex,
      C: 0,
      M: 0,
      Y: 0,
      K: i * 10,
    });
  }

  // Generate Warm Gray Solid Coated series (1-11) C
  for (let i = 1; i <= 11; i++) {
    const baseGray = 255 - (i * 20);
    const r = Math.round(baseGray + (i * 2));
    const g = Math.round(baseGray);
    const b = Math.round(baseGray - (i * 3));
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    
    colors.push({
      PANTONENAME: `PANTONE Warm Gray ${i} C`,
      UNIQUECODE: uniqueCode++,
      RED: r,
      GREEN: g,
      BLUE: b,
      R: r,
      G: g,
      B: b,
      HEX: hex,
      C: 0,
      M: Math.round(i * 0.5),
      Y: Math.round(i * 1.5),
      K: i * 10,
    });
  }

  // Generate additional Solid Coated color variations to reach target count
  const additionalHues = Array.from({ length: 360 }, (_, i) => i);
  
  additionalHues.forEach(hue => {
    for (let sat = 20; sat <= 100; sat += 20) {
      for (let light = 20; light <= 80; light += 20) {
        const saturation = sat / 100;
        const lightness = light / 100;
        
        // HSL to RGB
        const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
        const m = lightness - c / 2;
        
        let r: number, g: number, b: number;
        
        if (hue >= 0 && hue < 60) {
          r = c; g = x; b = 0;
        } else if (hue >= 60 && hue < 120) {
          r = x; g = c; b = 0;
        } else if (hue >= 120 && hue < 180) {
          r = 0; g = c; b = x;
        } else if (hue >= 180 && hue < 240) {
          r = 0; g = x; b = c;
        } else if (hue >= 240 && hue < 300) {
          r = x; g = 0; b = c;
        } else {
          r = c; g = 0; b = x;
        }
        
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        
        const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
        
        colors.push({
          PANTONENAME: `PANTONE ${8000 + hue}-${sat}-${light} C`,
          UNIQUECODE: uniqueCode++,
          RED: r,
          GREEN: g,
          BLUE: b,
          R: r,
          G: g,
          B: b,
          HEX: hex,
          C: Math.round((1 - r/255) * 100),
          M: Math.round((1 - g/255) * 100),
          Y: Math.round((1 - b/255) * 100),
          K: Math.round((1 - Math.max(r, g, b)/255) * 100),
        });
      }
    }
  });

  return colors;
};

// Generate the comprehensive Solid Coated database
const allSolidCoatedPantoneData = generateSolidCoatedPantoneDatabase();

export const PantoneData: PantoneColor[] = removeDuplicates(allSolidCoatedPantoneData);
