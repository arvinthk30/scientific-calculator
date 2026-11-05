/**
 * Scientific Physical Constants and Precision Unit Conversion System
 */

export interface ScientificConstant {
  symbol: string;
  name: string;
  value: number;
  valueStr: string;
  unit: string;
  category: 'Physics' | 'Chemistry' | 'Universal' | 'Atomic';
}

export const SCIENTIFIC_CONSTANTS: ScientificConstant[] = [
  {
    symbol: 'c',
    name: 'Speed of Light in Vacuum',
    value: 299792458,
    valueStr: '299792458',
    unit: 'm/s',
    category: 'Universal',
  },
  {
    symbol: 'G',
    name: 'Newtonian Gravitational Constant',
    value: 6.6743e-11,
    valueStr: '6.6743e-11',
    unit: 'm³/(kg·s²)',
    category: 'Universal',
  },
  {
    symbol: 'h',
    name: 'Planck Constant',
    value: 6.62607015e-34,
    valueStr: '6.62607015e-34',
    unit: 'J·s',
    category: 'Universal',
  },
  {
    symbol: 'ℏ',
    name: 'Reduced Planck Constant (Dirac)',
    value: 1.054571817e-34,
    valueStr: '1.054571817e-34',
    unit: 'J·s',
    category: 'Universal',
  },
  {
    symbol: 'e_c',
    name: 'Elementary Electric Charge',
    value: 1.602176634e-19,
    valueStr: '1.602176634e-19',
    unit: 'C',
    category: 'Universal',
  },
  {
    symbol: 'k_B',
    name: 'Boltzmann Constant',
    value: 1.380649e-23,
    valueStr: '1.380649e-23',
    unit: 'J/K',
    category: 'Physics',
  },
  {
    symbol: 'N_A',
    name: 'Avogadro Constant',
    value: 6.02214076e23,
    valueStr: '6.02214076e23',
    unit: 'mol⁻¹',
    category: 'Chemistry',
  },
  {
    symbol: 'R_gas',
    name: 'Molar Gas Constant',
    value: 8.314462618,
    valueStr: '8.314462618',
    unit: 'J/(mol·K)',
    category: 'Chemistry',
  },
  {
    symbol: 'm_e',
    name: 'Electron Rest Mass',
    value: 9.1093837015e-31,
    valueStr: '9.1093837015e-31',
    unit: 'kg',
    category: 'Atomic',
  },
  {
    symbol: 'm_p',
    name: 'Proton Rest Mass',
    value: 1.67262192369e-27,
    valueStr: '1.67262192369e-27',
    unit: 'kg',
    category: 'Atomic',
  },
  {
    symbol: 'ε_0',
    name: 'Vacuum Electric Permittivity',
    value: 8.8541878128e-12,
    valueStr: '8.8541878128e-12',
    unit: 'F/m',
    category: 'Physics',
  },
  {
    symbol: 'μ_0',
    name: 'Vacuum Magnetic Permeability',
    value: 1.25663706212e-6,
    valueStr: '1.25663706212e-6',
    unit: 'N/A²',
    category: 'Physics',
  },
  {
    symbol: 'g',
    name: 'Standard Acceleration of Gravity',
    value: 9.80665,
    valueStr: '9.80665',
    unit: 'm/s²',
    category: 'Physics',
  },
  {
    symbol: 'AU',
    name: 'Astronomical Unit',
    value: 149597870700,
    valueStr: '149597870700',
    unit: 'm',
    category: 'Universal',
  },
];

// Unit Conversion Definitions
export interface UnitCategory {
  id: string;
  name: string;
  units: { id: string; name: string; symbol: string; toBase: (val: number) => number; fromBase: (baseVal: number) => number }[];
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    units: [
      { id: 'm', name: 'Meter', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometer', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'um', name: 'Micrometer', symbol: 'µm', toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', toBase: (v) => v * 1e-9, fromBase: (v) => v * 1e9 },
      { id: 'mi', name: 'Mile', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', name: 'Yard', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', name: 'Foot', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', name: 'Inch', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Mass',
    units: [
      { id: 'kg', name: 'Kilogram', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Gram', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', toBase: (v) => v * 1e-6, fromBase: (v) => v * 1e6 },
      { id: 't', name: 'Metric Ton', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'lb', name: 'Pound', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', toBase: (v) => v * 0.028349523125, fromBase: (v) => v / 0.028349523125 },
      { id: 'ct', name: 'Carat', symbol: 'ct', toBase: (v) => v * 0.0002, fromBase: (v) => v / 0.0002 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', toBase: (v) => v + 273.15, fromBase: (v) => v - 273.15 },
      { id: 'f', name: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9 + 273.15, fromBase: (v) => ((v - 273.15) * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v, fromBase: (v) => v },
    ],
  },
  {
    id: 'pressure',
    name: 'Pressure',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (v) => v / 100000 },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (v) => v / 101325 },
      { id: 'psi', name: 'Pound/sq.inch', symbol: 'psi', toBase: (v) => v * 6894.757293, fromBase: (v) => v / 6894.757293 },
      { id: 'torr', name: 'Torr (mmHg)', symbol: 'Torr', toBase: (v) => v * 133.322368, fromBase: (v) => v / 133.322368 },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    units: [
      { id: 'j', name: 'Joule', symbol: 'J', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cal', name: 'Calorie', symbol: 'cal', toBase: (v) => v * 4.184, fromBase: (v) => v / 4.184 },
      { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', toBase: (v) => v * 4184, fromBase: (v) => v / 4184 },
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', toBase: (v) => v * 3.6e6, fromBase: (v) => v / 3.6e6 },
      { id: 'ev', name: 'Electronvolt', symbol: 'eV', toBase: (v) => v * 1.602176634e-19, fromBase: (v) => v / 1.602176634e-19 },
    ],
  },
  {
    id: 'angle',
    name: 'Angle',
    units: [
      { id: 'deg', name: 'Degree', symbol: '°', toBase: (v) => (v * Math.PI) / 180, fromBase: (v) => (v * 180) / Math.PI },
      { id: 'rad', name: 'Radian', symbol: 'rad', toBase: (v) => v, fromBase: (v) => v },
      { id: 'grad', name: 'Gradian', symbol: 'grad', toBase: (v) => (v * Math.PI) / 200, fromBase: (v) => (v * 200) / Math.PI },
      { id: 'arcmin', name: 'Arcminute', symbol: '′', toBase: (v) => (v * Math.PI) / (180 * 60), fromBase: (v) => (v * 180 * 60) / Math.PI },
      { id: 'arcsec', name: 'Arcsecond', symbol: '″', toBase: (v) => (v * Math.PI) / (180 * 3600), fromBase: (v) => (v * 180 * 3600) / Math.PI },
    ],
  },
  {
    id: 'speed',
    name: 'Speed',
    units: [
      { id: 'mps', name: 'Meters per second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kph', name: 'Kilometers per hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { id: 'mph', name: 'Miles per hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
      { id: 'knot', name: 'Knot', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      { id: 'fps', name: 'Feet per second', symbol: 'ft/s', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    ],
  },
];

export function convertUnits(
  categoryId: string,
  fromUnitId: string,
  toUnitId: string,
  amount: number
): number {
  const cat = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return amount;
  const fromUnit = cat.units.find((u) => u.id === fromUnitId);
  const toUnit = cat.units.find((u) => u.id === toUnitId);
  if (!fromUnit || !toUnit) return amount;

  const baseVal = fromUnit.toBase(amount);
  return toUnit.fromBase(baseVal);
}
