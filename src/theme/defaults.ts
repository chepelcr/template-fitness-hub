import type { ThemeDefaults } from '@/core';

/** The template's own accent and surfaces; the store's branding overrides the accent. */
export const themeDefaults: ThemeDefaults = {
  brand: '#C4432B',
  brand2: '#1C3A6E',
  surface: '#F7F6F2',
  // Raised cards are the lightest reading surface in dark mode.
  darkSurface: '#2A3442',
  displayFont: '"Barlow Condensed", "Noto Sans", -apple-system, "Segoe UI", Roboto, sans-serif',
  bundledFonts: ['Barlow Condensed', 'Barlow'],
  displayFallback: '-apple-system, "Segoe UI", Roboto, sans-serif',
};
