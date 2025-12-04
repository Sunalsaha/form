import React, { useState, useEffect, useCallback, useMemo } from 'react';

type ThumbSize = 'S' | 'M' | 'L' | 'XL';

interface SizeConfig {
  width: number;
  height: number;
}

interface SliderSize {
  label: string;
  width: string;
  containerWidth: number;
  trackWidth: number;
  height: number;
  thumbSize: ThumbSize;
  verticalOffset: number;
  svgMarkup: string;
}

const THUMB_SIZE_MAP: Record<ThumbSize, SizeConfig> = {
  S: { width: 16, height: 16 },
  M: { width: 20, height: 20 },
  L: { width: 20, height: 20 },
  XL: { width: 28, height: 28 },
} as const;

const SLIDER_SIZES: SliderSize[] = [
  {
    label: 'S h 20 Px',
    width: 'W 232 Px',
    containerWidth: 260,
    trackWidth: 228,
    height: 21,
    thumbSize: 'S',
    verticalOffset: 0,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 232 24" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 6h224M4 7h224M2 8h2M228 8h2M2 9h2M228 9h2M2 10h2M228 10h2M2 11h2M228 11h2M2 12h2M228 12h2M2 13h2M228 13h2M2 14h2M228 14h2M2 15h2M228 15h2M4 16h224M4 17h224" /><path stroke="#191919" d="M4 8h224M4 9h224M4 10h224M4 11h224M4 12h224M4 13h224M4 14h224M4 15h224" /></svg>`,
  },
  {
    label: 'L h 12 Px',
    width: 'W 228 Px',
    containerWidth: 256,
    trackWidth: 224,
    height: 21,
    thumbSize: 'L',
    verticalOffset: 0,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 228 12" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M2 0h224M2 1h224M0 2h2M226 2h2M0 3h2M226 3h2M0 4h2M226 4h2M0 5h2M226 5h2M0 6h2M226 6h2M0 7h2M226 7h2M0 8h2M226 8h2M0 9h2M226 9h2M2 10h224M2 11h224" /><path stroke="#191919" d="M2 2h224M2 3h224M2 4h224M2 5h224M2 6h224M2 7h224M2 8h224M2 9h224" /></svg>`,
  },
  {
    label: 'M h 28 Px',
    width: 'W 260 Px',
    containerWidth: 288,
    trackWidth: 256,
    height: 30,
    thumbSize: 'M',
    verticalOffset: 4,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 260 28" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 6h250M4 7h250M2 8h2M254 8h2M2 9h2M254 9h2M0 10h2M256 10h2M0 11h2M256 11h2M0 12h2M256 12h2M0 13h2M256 13h2M0 14h2M256 14h2M0 15h2M256 15h2M0 16h2M256 16h2M0 17h2M256 17h2M2 18h2M254 18h2M2 19h2M254 19h2M4 20h250M4 21h250" /><path stroke="#191919" d="M4 8h250M4 9h250M2 10h254M2 11h254M2 12h254M2 13h254M2 14h254M2 15h254M2 16h254M2 17h254M4 18h250M4 19h250" /></svg>`,
  },
  {
    label: 'XL h 32 Px',
    width: 'W 320 Px',
    containerWidth: 348,
    trackWidth: 316,
    height: 32,
    thumbSize: 'XL',
    verticalOffset: -6,
    svgMarkup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 320 32" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M6 6h308M6 7h308M4 8h2M314 8h2M4 9h2M314 9h2M2 10h2M316 10h2M2 11h2M316 11h2M2 12h2M316 12h2M2 13h2M316 13h2M2 14h2M316 14h2M2 15h2M316 15h2M2 16h2M316 16h2M2 17h2M316 17h2M2 18h2M316 18h2M2 19h2M316 19h2M2 20h2M316 20h2M2 21h2M316 21h2M4 22h2M314 22h2M4 23h2M314 23h2M6 24h308M6 25h308" /><path stroke="#191919" d="M6 8h308M6 9h308M4 10h312M4 11h312M4 12h312M4 13h312M4 14h312M4 15h312M4 16h312M4 17h312M4 18h312M4 19h312M4 20h312M4 21h312M6 22h308M6 23h308" /></svg>`,
  },
];

const THUMB_SVG_MAP: Record<ThumbSize, { normal: string; pressed: string; filled: string }> = {
  S: {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 0h8M4 1h8M2 2h2M12 2h2M2 3h2M12 3h2M0 4h2M4 4h8M14 4h2M0 5h2M4 5h8M14 5h2M0 6h2M4 6h8M14 6h2M0 7h2M4 7h8M14 7h2M0 8h2M4 8h8M14 8h2M0 9h2M4 9h8M14 9h2M0 10h2M4 10h8M14 10h2M0 11h2M4 11h8M14 11h2M2 12h2M12 12h2M2 13h2M12 13h2M4 14h8M4 15h8" /><path stroke="#191919" d="M4 2h8M4 3h8M2 4h2M12 4h2M2 5h2M12 5h2M2 6h2M12 6h2M2 7h2M12 7h2M2 8h2M12 8h2M2 9h2M12 9h2M2 10h2M12 10h2M2 11h2M12 11h2M4 12h8M4 13h8" /></svg>`,
    pressed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 26 23" shape-rendering="crispEdges"><path stroke="#a1a1a1" d="M8 2h10M8 3h10M6 4h3M17 4h3M6 5h3M17 5h3M4 6h3M19 6h3M4 7h3M19 7h3M3 8h2M21 8h2M3 9h2M21 9h2M3 10h2M21 10h2M3 11h2M21 11h2M3 12h2M21 12h2M3 13h2M21 13h2M3 14h2M21 14h2M3 15h2M21 15h2M4 16h3M19 16h3M4 17h3M19 17h3M6 18h3M17 18h3M6 19h3M17 19h3M8 20h10M8 21h10" /><path stroke="#f3f3f3" d="M9 4h8M9 5h8M7 6h2M17 6h2M7 7h2M17 7h2M5 8h2M9 8h8M19 8h2M5 9h2M9 9h8M19 9h2M5 10h2M9 10h8M19 10h2M5 11h2M9 11h8M19 11h2M5 12h2M9 12h8M19 12h2M5 13h2M9 13h8M19 13h2M5 14h2M9 14h8M19 14h2M5 15h2M9 15h8M19 15h2M7 16h2M17 16h2M7 17h2M17 17h2M9 18h8M9 19h8" /><path stroke="#191919" d="M9 6h8M9 7h8M7 8h2M17 8h2M7 9h2M17 9h2M7 10h2M17 10h2M7 11h2M17 11h2M7 12h2M17 12h2M7 13h2M17 13h2M9 16h8M9 17h8" /></svg>`,
    filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 16 16" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 0h8M4 1h8M2 2h2M12 2h2M2 3h2M12 3h2M0 4h2M14 4h2M0 5h2M14 5h2M0 6h2M14 6h2M0 7h2M14 7h2M0 8h2M14 8h2M0 9h2M14 9h2M0 10h2M14 10h2M0 11h2M14 11h2M2 12h2M12 12h2M2 13h2M12 13h2M4 14h8M4 15h8" /><path stroke="#191919" d="M4 2h8M4 3h8M2 4h2M12 4h2M2 5h2M12 5h2M2 6h2M12 6h2M2 7h2M12 7h2M2 8h2M12 8h2M2 9h2M12 9h2M2 10h2M12 10h2M2 11h2M12 11h2M4 12h8M4 13h8" /><path stroke="#333333" d="M4 4h8M4 5h8M4 6h8M4 7h8M4 8h8M4 9h8M4 10h8M4 11h8" /></svg>`,
  },
  M: {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 20 20" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 0h12M4 1h12M2 2h2M16 2h2M2 3h2M16 3h2M0 4h2M4 4h12M18 4h2M0 5h2M4 5h12M18 5h2M0 6h2M4 6h12M18 6h2M0 7h2M4 7h12M18 7h2M0 8h2M4 8h12M18 8h2M0 9h2M4 9h12M18 9h2M0 10h2M4 10h12M18 10h2M0 11h2M4 11h12M18 11h2M0 12h2M4 12h12M18 12h2M0 13h2M4 13h12M18 13h2M0 14h2M4 14h12M18 14h2M0 15h2M4 15h12M18 15h2M2 16h2M16 16h2M2 17h2M16 17h2M4 18h12M4 19h12" /><path stroke="#191919" d="M4 2h12M4 3h12M2 4h2M16 4h2M2 5h2M16 5h2M2 6h2M16 6h2M2 7h2M16 7h2M2 8h2M16 8h2M2 9h2M16 9h2M2 10h2M16 10h2M2 11h2M16 11h2M2 12h2M16 12h2M2 13h2M16 13h2M2 14h2M16 14h2M2 15h2M16 15h2M4 16h12M4 17h12" /></svg>`,
    pressed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 24 24" shape-rendering="crispEdges"><path stroke="#a1a1a1" d="M5 0h14M5 1h14M3 2h3M18 2h3M3 3h3M18 3h3M1 4h3M20 4h3M1 5h3M20 5h3M0 6h2M22 6h2M0 7h2M22 7h2M0 8h2M22 8h2M0 9h2M22 9h2M0 10h2M22 10h2M0 11h2M22 11h2M0 12h2M22 12h2M0 13h2M22 13h2M0 14h2M22 14h2M0 15h2M22 15h2M0 16h2M22 16h2M0 17h2M22 17h2M1 18h3M20 18h3M1 19h3M20 19h3M3 20h3M18 20h3M3 21h3M18 21h3M5 22h14M5 23h14" /><path stroke="#f3f3f3" d="M6 2h12M6 3h12M4 4h2M18 4h2M4 5h2M18 5h2M2 6h2M6 6h12M20 6h2M2 7h2M6 7h12M20 7h2M2 8h2M6 8h12M20 8h2M2 9h2M6 9h12M20 9h2M2 10h2M6 10h12M20 10h2M2 11h2M6 11h12M20 11h2M2 12h2M6 12h12M20 12h2M2 13h2M6 13h12M20 13h2M2 14h2M6 14h12M20 14h2M2 15h2M6 15h12M20 15h2M2 16h2M6 16h12M20 16h2M2 17h2M6 17h12M20 17h2M4 18h2M18 18h2M4 19h2M18 19h2M6 20h12M6 21h12" /><path stroke="#191919" d="M6 4h12M6 5h12M4 6h2M18 6h2M4 7h2M18 7h2M4 8h2M18 8h2M4 9h2M18 9h2M4 10h2M18 10h2M4 11h2M18 11h2M4 12h2M18 12h2M4 13h2M18 13h2M4 14h2M18 14h2M4 15h2M18 15h2M4 16h2M18 16h2M4 17h2M18 17h2M6 18h12M6 19h12" /></svg>`,
    filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 24 24" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M6 2h12M6 3h12M4 4h2M18 4h2M4 5h2M18 5h2M2 6h2M20 6h2M2 7h2M20 7h2M2 8h2M20 8h2M2 9h2M20 9h2M2 10h2M20 10h2M2 11h2M20 11h2M2 12h2M20 12h2M2 13h2M20 13h2M2 14h2M20 14h2M2 15h2M20 15h2M2 16h2M20 16h2M2 17h2M20 17h2M4 18h2M18 18h2M4 19h2M18 19h2M6 20h12M6 21h12" /><path stroke="#191919" d="M6 4h12M6 5h12M4 6h2M18 6h2M4 7h2M18 7h2M4 8h2M18 8h2M4 9h2M18 9h2M4 10h2M18 10h2M4 11h2M18 11h2M4 12h2M18 12h2M4 13h2M18 13h2M4 14h2M18 14h2M4 15h2M18 15h2M4 16h2M18 16h2M4 17h2M18 17h2M6 18h12M6 19h12" /><path stroke="#333333" d="M6 6h12M6 7h12M6 8h12M6 9h12M6 10h12M6 11h12M6 12h12M6 13h12M6 14h12M6 15h12M6 16h12M6 17h12" /></svg>`,
  },
  L: {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 20 20" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M4 0h12M4 1h12M2 2h2M16 2h2M2 3h2M16 3h2M0 4h2M4 4h12M18 4h2M0 5h2M4 5h12M18 5h2M0 6h2M4 6h12M18 6h2M0 7h2M4 7h12M18 7h2M0 8h2M4 8h12M18 8h2M0 9h2M4 9h12M18 9h2M0 10h2M4 10h12M18 10h2M0 11h2M4 11h12M18 11h2M0 12h2M4 12h12M18 12h2M0 13h2M4 13h12M18 13h2M0 14h2M4 14h12M18 14h2M0 15h2M4 15h12M18 15h2M2 16h2M16 16h2M2 17h2M16 17h2M4 18h12M4 19h12" /><path stroke="#191919" d="M4 2h12M4 3h12M2 4h2M16 4h2M2 5h2M16 5h2M2 6h2M16 6h2M2 7h2M16 7h2M2 8h2M16 8h2M2 9h2M16 9h2M2 10h2M16 10h2M2 11h2M16 11h2M2 12h2M16 12h2M2 13h2M16 13h2M2 14h2M16 14h2M2 15h2M16 15h2M4 16h12M4 17h12" /></svg>`,
    pressed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 24 24" shape-rendering="crispEdges"><path stroke="#a1a1a1" d="M5 0h14M5 1h14M3 2h3M18 2h3M3 3h3M18 3h3M1 4h3M20 4h3M1 5h3M20 5h3M0 6h2M22 6h2M0 7h2M22 7h2M0 8h2M22 8h2M0 9h2M22 9h2M0 10h2M22 10h2M0 11h2M22 11h2M0 12h2M22 12h2M0 13h2M22 13h2M0 14h2M22 14h2M0 15h2M22 15h2M0 16h2M22 16h2M0 17h2M22 17h2M1 18h3M20 18h3M1 19h3M20 19h3M3 20h3M18 20h3M3 21h3M18 21h3M5 22h14M5 23h14" /><path stroke="#f3f3f3" d="M6 2h12M6 3h12M4 4h2M18 4h2M4 5h2M18 5h2M2 6h2M6 6h12M20 6h2M2 7h2M6 7h12M20 7h2M2 8h2M6 8h12M20 8h2M2 9h2M6 9h12M20 9h2M2 10h2M6 10h12M20 10h2M2 11h2M6 11h12M20 11h2M2 12h2M6 12h12M20 12h2M2 13h2M6 13h12M20 13h2M2 14h2M6 14h12M20 14h2M2 15h2M6 15h12M20 15h2M2 16h2M6 16h12M20 16h2M2 17h2M6 17h12M20 17h2M4 18h2M18 18h2M4 19h2M18 19h2M6 20h12M6 21h12" /><path stroke="#191919" d="M6 4h12M6 5h12M4 6h2M18 6h2M4 7h2M18 7h2M4 8h2M18 8h2M4 9h2M18 9h2M4 10h2M18 10h2M4 11h2M18 11h2M4 12h2M18 12h2M4 13h2M18 13h2M4 14h2M18 14h2M4 15h2M18 15h2M4 16h2M18 16h2M4 17h2M18 17h2M6 18h12M6 19h12" /></svg>`,
    filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 28 28" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M8 2h12M8 3h12M6 4h2M20 4h2M6 5h2M20 5h2M4 6h2M22 6h2M4 7h2M22 7h2M2 8h2M24 8h2M2 9h2M24 9h2M2 10h2M24 10h2M2 11h2M24 11h2M2 12h2M24 12h2M2 13h2M24 13h2M2 14h2M24 14h2M2 15h2M24 15h2M2 16h2M24 16h2M2 17h2M24 17h2M2 18h2M24 18h2M2 19h2M24 19h2M4 20h2M22 20h2M4 21h2M22 21h2M6 22h2M20 22h2M6 23h2M20 23h2M8 24h12M8 25h12" /><path stroke="#191919" d="M8 4h12M8 5h12M6 6h2M20 6h2M6 7h2M20 7h2M4 8h2M22 8h2M4 9h2M22 9h2M4 10h2M22 10h2M4 11h2M22 11h2M4 12h2M22 12h2M4 13h2M22 13h2M4 14h2M22 14h2M4 15h2M22 15h2M4 16h2M22 16h2M4 17h2M22 17h2M4 18h2M22 18h2M4 19h2M22 19h2M6 20h2M20 20h2M6 21h2M20 21h2M8 22h12M8 23h12" /><path stroke="#333333" d="M8 6h12M8 7h12M6 8h16M6 9h16M6 10h16M6 11h16M6 12h16M6 13h16M6 14h16M6 15h16M6 16h16M6 17h16M6 18h16M6 19h16M8 20h12M8 21h12" /></svg>`,
  },
  XL: {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 24 24" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M6 0h12M6 1h12M4 2h2M18 2h2M4 3h2M18 3h2M2 4h2M6 4h12M20 4h2M2 5h2M6 5h12M20 5h2M0 6h2M4 6h16M22 6h2M0 7h2M4 7h16M22 7h2M0 8h2M4 8h16M22 8h2M0 9h2M4 9h16M22 9h2M0 10h2M4 10h16M22 10h2M0 11h2M4 11h16M22 11h2M0 12h2M4 12h16M22 12h2M0 13h2M4 13h16M22 13h2M0 14h2M4 14h16M22 14h2M0 15h2M4 15h16M22 15h2M0 16h2M4 16h16M22 16h2M0 17h2M4 17h16M22 17h2M2 18h2M6 18h12M20 18h2M2 19h2M6 19h12M20 19h2M4 20h2M18 20h2M4 21h2M18 21h2M6 22h12M6 23h12" /><path stroke="#191919" d="M6 2h12M6 3h12M4 4h2M18 4h2M4 5h2M18 5h2M2 6h2M20 6h2M2 7h2M20 7h2M2 8h2M20 8h2M2 9h2M20 9h2M2 10h2M20 10h2M2 11h2M20 11h2M2 12h2M20 12h2M2 13h2M20 13h2M2 14h2M20 14h2M2 15h2M20 15h2M2 16h2M20 16h2M2 17h2M20 17h2M4 18h2M18 18h2M4 19h2M18 19h2M6 20h12M6 21h12" /></svg>`,
    pressed: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 28 28" shape-rendering="crispEdges"><path stroke="#a1a1a1" d="M7 0h14M7 1h14M5 2h3M20 2h3M5 3h3M20 3h3M3 4h3M22 4h3M3 5h3M22 5h3M1 6h3M24 6h3M1 7h3M24 7h3M0 8h2M26 8h2M0 9h2M26 9h2M0 10h2M26 10h2M0 11h2M26 11h2M0 12h2M26 12h2M0 13h2M26 13h2M0 14h2M26 14h2M0 15h2M26 15h2M0 16h2M26 16h2M0 17h2M26 17h2M0 18h2M26 18h2M0 19h2M26 19h2M1 20h3M24 20h3M1 21h3M24 21h3M3 22h3M22 22h3M3 23h3M22 23h3M5 24h3M20 24h3M5 25h3M20 25h3M7 26h14M7 27h14" /><path stroke="#f3f3f3" d="M8 2h12M8 3h12M6 4h2M20 4h2M6 5h2M20 5h2M4 6h2M8 6h12M22 6h2M4 7h2M8 7h12M22 7h2M2 8h2M6 8h16M24 8h2M2 9h2M6 9h16M24 9h2M2 10h2M6 10h16M24 10h2M2 11h2M6 11h16M24 11h2M2 12h2M6 12h16M24 12h2M2 13h2M6 13h16M24 13h2M2 14h2M6 14h16M24 14h2M2 15h2M6 15h16M24 15h2M2 16h2M6 16h16M24 16h2M2 17h2M6 17h16M24 17h2M2 18h2M6 18h16M24 18h2M2 19h2M6 19h16M24 19h2M4 20h2M8 20h12M22 20h2M4 21h2M8 21h12M22 21h2M6 22h2M20 22h2M6 23h2M20 23h2M8 24h12M8 25h12" /><path stroke="#191919" d="M8 4h12M8 5h12M6 6h2M20 6h2M6 7h2M20 7h2M4 8h2M22 8h2M4 9h2M22 9h2M4 10h2M22 10h2M4 11h2M22 11h2M4 12h2M22 12h2M4 13h2M22 13h2M4 14h2M22 14h2M4 15h2M22 15h2M4 16h2M22 16h2M4 17h2M22 17h2M4 18h2M22 18h2M4 19h2M22 19h2M6 20h2M20 20h2M6 21h2M20 21h2M8 22h12M8 23h12" /></svg>`,
    filled: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 32 32" shape-rendering="crispEdges"><path stroke="#f3f3f3" d="M8 2h16M8 3h16M6 4h2M24 4h2M6 5h2M24 5h2M4 6h2M26 6h2M4 7h2M26 7h2M2 8h2M28 8h2M2 9h2M28 9h2M2 10h2M28 10h2M2 11h2M28 11h2M2 12h2M28 12h2M2 13h2M28 13h2M2 14h2M28 14h2M2 15h2M28 15h2M2 16h2M28 16h2M2 17h2M28 17h2M2 18h2M28 18h2M2 19h2M28 19h2M2 20h2M28 20h2M2 21h2M28 21h2M2 22h2M28 22h2M2 23h2M28 23h2M4 24h2M26 24h2M4 25h2M26 25h2M6 26h2M24 26h2M6 27h2M24 27h2M8 28h16M8 29h16" /><path stroke="#191919" d="M8 4h16M8 5h16M6 6h2M24 6h2M6 7h2M24 7h2M4 8h2M26 8h2M4 9h2M26 9h2M4 10h2M26 10h2M4 11h2M26 11h2M4 12h2M26 12h2M4 13h2M26 13h2M4 14h2M26 14h2M4 15h2M26 15h2M4 16h2M26 16h2M4 17h2M26 17h2M4 18h2M26 18h2M4 19h2M26 19h2M4 20h2M26 20h2M4 21h2M26 21h2M4 22h2M26 22h2M4 23h2M26 23h2M6 24h2M24 24h2M6 25h2M24 25h2M8 26h16M8 27h16" /><path stroke="#333333" d="M8 6h16M8 7h16M6 8h20M6 9h20M6 10h20M6 11h20M6 12h20M6 13h20M6 14h20M6 15h20M6 16h20M6 17h20M6 18h20M6 19h20M6 20h20M6 21h20M6 22h20M6 23h20M8 24h16M8 25h16" /></svg>`,
  },
};

const TrackBar: React.FC<{ svgMarkup: string; width: number; height: number }> = React.memo(
  ({ svgMarkup, width, height }) => (
    <div
      style={{ width: `${width}px`, height: `${height}px`, display: 'block' }}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  )
);
TrackBar.displayName = 'TrackBar';

const FilledTrackBar: React.FC<{
  svgMarkup: string;
  width: number;
  height: number;
  fillPercentage: number;
}> = React.memo(({ svgMarkup, width, height, fillPercentage }) => {
  const modifiedSvg = useMemo(
    () => svgMarkup.replace(/#191919/g, '#626262'),
    [svgMarkup]
  );

  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'block',
        clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
      }}
      dangerouslySetInnerHTML={{ __html: modifiedSvg }}
    />
  );
});
FilledTrackBar.displayName = 'FilledTrackBar';

const SliderThumb: React.FC<{ size: ThumbSize; isPressed: boolean; isFilled: boolean }> = React.memo(
  ({ size, isPressed, isFilled }) => {
    const { width, height } = THUMB_SIZE_MAP[size];
    const svgContent = useMemo(() => {
      if (isFilled) return THUMB_SVG_MAP[size].filled;
      if (isPressed) return THUMB_SVG_MAP[size].pressed;
      return THUMB_SVG_MAP[size].normal;
    }, [size, isPressed, isFilled]);

    return (
      <div
        className={isPressed ? 'slider-thumb-pressed' : 'slider-thumb-hover'}
        style={{ width: `${width}px`, height: `${height}px`, display: 'block' }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    );
  }
);
SliderThumb.displayName = 'SliderThumb';

const SliderItem: React.FC<{
  size: SliderSize;
  value: number;
  index: number;
  isDragging: boolean;
  onDragStart: (index: number, e: React.MouseEvent | React.TouchEvent) => void;
  onValueChange: (index: number, value: number) => void;
}> = React.memo(
  ({ size, value, index, isDragging, onDragStart }) => {
    const thumbSize = size.thumbSize;
    const containerHeight = size.height + 40;
    const isFilled = value >= 99.5;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          minWidth: '140px',
          marginTop: size.verticalOffset ? `${size.verticalOffset}px` : '0px',
        }}
      >
        <div
          className={`slider-container-${index}`}
          style={{
            width: `${size.containerWidth}px`,
            height: `${containerHeight}px`,
            position: 'relative',
            border: '2px dashed #5cff47ff',
            borderRadius: '8px',
            padding: '20px 16px',
            backgroundColor: 'rgba(153, 50, 204, 0.05)',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={(e) => onDragStart(index, e)}
          onTouchStart={(e) => onDragStart(index, e)}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              width: `${size.trackWidth}px`,
              height: `${size.height}px`,
            }}
          >
            <TrackBar svgMarkup={size.svgMarkup} width={size.trackWidth} height={size.height} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              width: `${size.trackWidth}px`,
              height: `${size.height}px`,
              pointerEvents: 'none',
            }}
          >
            <FilledTrackBar
              svgMarkup={size.svgMarkup}
              width={size.trackWidth}
              height={size.height}
              fillPercentage={value}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${16 + (value / 100) * size.trackWidth}px`,
              transform: 'translate(-50%, -50%)',
              width: THUMB_SIZE_MAP[thumbSize].width + 'px',
              height: THUMB_SIZE_MAP[thumbSize].height + 'px',
              zIndex: 10,
              pointerEvents: 'auto',
              cursor: 'pointer',
              transition: isDragging ? 'none' : 'left 0.05s ease',
            }}
            onMouseDown={(e) => onDragStart(index, e)}
            onTouchStart={(e) => onDragStart(index, e)}
          >
            <SliderThumb size={thumbSize} isPressed={isDragging} isFilled={isFilled} />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#e0e0e0' }}>
            {size.label}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{size.width}</div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: '500',
              color: '#00ff41',
              marginTop: '4px',
            }}
          >
            {Math.round(value)}%
          </div>
        </div>
      </div>
    );
  }
);
SliderItem.displayName = 'SliderItem';

const HorizontalSliderTypes: React.FC = () => {
  const [sliderValues, setSliderValues] = useState<number[]>([0, 33, 66, 100]);
  const [isDragging, setIsDragging] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(index);
  }, []);

  const handleDrag = useCallback(
    (index: number, clientX: number, trackWidth: number) => {
      const container = document.querySelector(`.slider-container-${index}`) as HTMLElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const padding = 16;

      let percentage = ((clientX - rect.left - padding) / trackWidth) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      setSliderValues((prev) => {
        const newValues = [...prev];
        newValues[index] = percentage;
        return newValues;
      });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging === null) return;

    const currentSize = SLIDER_SIZES[isDragging];

    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(isDragging, e.clientX, currentSize.trackWidth);
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleDrag(isDragging, e.touches[0].clientX, currentSize.trackWidth);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  return (
    <div
      style={{
        fontFamily: 'Pixeloid Sans, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#000000ff',
        color: '#fff',
        margin: 0,
        padding: '40px 20px',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        overflow: 'auto',
      }}
    >
      <style>{`
        * { margin: 0; padding: 0; }
        body, html { margin: 0; padding: 0; overflow-x: hidden; }
        .slider-thumb-hover { transition: transform 0.2s ease; }
        .slider-thumb-hover:hover { transform: scale(1.3); }
        .slider-thumb-pressed { transform: scale(1.4); }
      `}</style>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: '700',
          marginBottom: '60px',
          color: '#00ff41',
        }}
      >
        Horizontal Slider Types
      </h1>
      <div
        style={{
          marginBottom: '80px',
          textAlign: 'center',
          maxWidth: '1400px',
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: '28px',
            fontWeight: '800',
            marginBottom: '24px',
            color: '#00ff41',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          SLIDE 1.1
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: '600',
            marginBottom: '40px',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Horizontal Slider Range selector
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '40px',
            flexWrap: 'wrap',
          }}
        >
          {SLIDER_SIZES.map((size, sIndex) => (
            <SliderItem
              key={sIndex}
              size={size}
              value={sliderValues[sIndex]}
              index={sIndex}
              isDragging={isDragging === sIndex}
              onDragStart={handleDragStart}
              onValueChange={(index, value) =>
                setSliderValues((prev) => {
                  const newValues = [...prev];
                  newValues[index] = value;
                  return newValues;
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalSliderTypes;
