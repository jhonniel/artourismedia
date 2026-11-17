/** Landing-page hero + Mindanao slideshow images (hosted on Spaces in production). */
export const HERO_SLIDESHOW_PATHS = [
  '/images/hero/hero-slideshow-01-pamulak-float.jpg',
  '/images/hero/hero-slideshow-02-sandbar-aerial.jpg',
  '/images/hero/hero-slideshow-03-bay-coastline.jpg',
  '/images/hero/hero-slideshow-04-traditional-feast.jpg',
  '/images/hero/hero-slideshow-05-landmark-building.jpg',
  '/images/hero/hero-slideshow-06-waterfalls.jpg',
  '/images/hero/hero-slideshow-07-durian.jpg',
  '/images/hero/hero-slideshow-08-beach-aerial.jpg',
  '/images/hero/hero-slideshow-09-rock-pools.jpg',
  '/images/hero/hero-slideshow-10-kudyapi-music.jpg',
  '/images/hero/hero-slideshow-11-maranao-royal-house.jpg',
  '/images/hero/hero-slideshow-12-tribal-portrait.jpg',
  '/images/hero/hero-slideshow-13-coconut-coast.jpg',
  '/images/hero/hero-slideshow-14-traditional-snacks.jpg',
  '/images/hero/hero-slideshow-15-maranao-dance.jpg',
  '/images/hero/hero-slideshow-16-durian-harvest.jpg',
  '/images/hero/hero-slideshow-17-sunken-cemetery.jpg',
  '/images/hero/hero-slideshow-18-island-sandbar.jpg',
  '/images/hero/hero-slideshow-19-mountain-valley.jpg',
  '/images/hero/hero-slideshow-20-siargao-lagoon.jpg',
  '/images/hero/hero-slideshow-21-cold-spring.jpg',
  '/images/hero/hero-slideshow-22-beach-topdown.jpg',
  '/images/hero/hero-slideshow-23-grand-mosque.jpg',
  '/images/hero/hero-slideshow-24-mountain-pond.jpg',
] as const

/**
 * How each photo sits in the desktop frame: `[focus, shift]`.
 *
 * The frame box is wider than the visible opening — its left ~40% is hidden behind the copy panel —
 * so a photo that simply fills the box has its centre sliced by the curve.
 *
 * - `shift` pushes the photo right: the photo is laid out `shift` × the frame width, anchored to
 *   the frame's left edge, so its centre moves right by half the extra width. 1 = no shift. Larger
 *   values also crop more off the top and bottom, so use only as much as the subject needs.
 * - `focus` is the CSS `object-position`. Y picks which band of the photo survives that crop
 *   (0% = top, 100% = bottom). X only matters in tall windows, where the photo is wider than its
 *   box; it is biased left so the subject still lands in the opening.
 */
type SlideFraming = [focus: string, shift: number]

const DEFAULT_FRAMING: SlideFraming = ['10% 42%', 1.2]

const HERO_SLIDE_FRAMING: Record<string, SlideFraming> = {
  '/images/hero/hero-slideshow-01-pamulak-float.jpg': ['18% 30%', 1.3],
  '/images/hero/hero-slideshow-02-sandbar-aerial.jpg': ['10% 55%', 1.2],
  '/images/hero/hero-slideshow-03-bay-coastline.jpg': ['6% 62%', 1.3],
  '/images/hero/hero-slideshow-04-traditional-feast.jpg': ['16% 40%', 1.2],
  '/images/hero/hero-slideshow-05-landmark-building.jpg': ['16% 30%', 1.3],
  '/images/hero/hero-slideshow-06-waterfalls.jpg': ['14% 48%', 1.3],
  '/images/hero/hero-slideshow-07-durian.jpg': ['16% 40%', 1.2],
  '/images/hero/hero-slideshow-08-beach-aerial.jpg': ['10% 42%', 1.2],
  '/images/hero/hero-slideshow-09-rock-pools.jpg': ['22% 26%', 1.3],
  '/images/hero/hero-slideshow-10-kudyapi-music.jpg': ['18% 30%', 1.3],
  '/images/hero/hero-slideshow-11-maranao-royal-house.jpg': ['8% 48%', 1.2],
  '/images/hero/hero-slideshow-12-tribal-portrait.jpg': ['22% 26%', 1],
  '/images/hero/hero-slideshow-13-coconut-coast.jpg': ['16% 40%', 1.3],
  '/images/hero/hero-slideshow-14-traditional-snacks.jpg': ['22% 26%', 1.12],
  '/images/hero/hero-slideshow-15-maranao-dance.jpg': ['16% 60%', 1.15],
  '/images/hero/hero-slideshow-16-durian-harvest.jpg': ['16% 40%', 1.3],
  '/images/hero/hero-slideshow-17-sunken-cemetery.jpg': ['16% 22%', 1.3],
  '/images/hero/hero-slideshow-18-island-sandbar.jpg': ['10% 42%', 1.1],
  '/images/hero/hero-slideshow-19-mountain-valley.jpg': ['12% 40%', 1.15],
  '/images/hero/hero-slideshow-20-siargao-lagoon.jpg': ['10% 42%', 1.15],
  '/images/hero/hero-slideshow-21-cold-spring.jpg': ['14% 40%', 1.2],
  '/images/hero/hero-slideshow-22-beach-topdown.jpg': ['10% 60%', 1.2],
  '/images/hero/hero-slideshow-23-grand-mosque.jpg': ['16% 12%', 1.2],
  '/images/hero/hero-slideshow-24-mountain-pond.jpg': ['12% 45%', 1.3],
}

export function heroSlideFocus(path: string): string {
  return (HERO_SLIDE_FRAMING[path] ?? DEFAULT_FRAMING)[0]
}

export function heroSlideShift(path: string): number {
  return (HERO_SLIDE_FRAMING[path] ?? DEFAULT_FRAMING)[1]
}
