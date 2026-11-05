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
 * Where each photo's subject should sit in the desktop frame.
 * The frame box is wider than the visible opening (left side is masked by the copy), so X is
 * biased left — that shifts the image right and parks the highlight in the window.
 */
const FACE = '22% 26%'
const GROUP = '18% 30%'
const AERIAL = '10% 42%'
const LANDMARK = '16% 36%'
const FOOD = '16% 40%'

const HERO_SLIDE_FOCUS: Record<string, string> = {
  '/images/hero/hero-slideshow-01-pamulak-float.jpg': GROUP,
  '/images/hero/hero-slideshow-02-sandbar-aerial.jpg': AERIAL,
  '/images/hero/hero-slideshow-03-bay-coastline.jpg': '6% 40%',
  '/images/hero/hero-slideshow-04-traditional-feast.jpg': FOOD,
  '/images/hero/hero-slideshow-05-landmark-building.jpg': LANDMARK,
  '/images/hero/hero-slideshow-06-waterfalls.jpg': '14% 48%',
  '/images/hero/hero-slideshow-07-durian.jpg': FOOD,
  '/images/hero/hero-slideshow-08-beach-aerial.jpg': AERIAL,
  '/images/hero/hero-slideshow-09-rock-pools.jpg': AERIAL,
  '/images/hero/hero-slideshow-10-kudyapi-music.jpg': FACE,
  '/images/hero/hero-slideshow-11-maranao-royal-house.jpg': LANDMARK,
  '/images/hero/hero-slideshow-12-tribal-portrait.jpg': FACE,
  '/images/hero/hero-slideshow-13-coconut-coast.jpg': '8% 48%',
  '/images/hero/hero-slideshow-14-traditional-snacks.jpg': FOOD,
  '/images/hero/hero-slideshow-15-maranao-dance.jpg': GROUP,
  '/images/hero/hero-slideshow-16-durian-harvest.jpg': FOOD,
  '/images/hero/hero-slideshow-17-sunken-cemetery.jpg': LANDMARK,
  '/images/hero/hero-slideshow-18-island-sandbar.jpg': AERIAL,
  '/images/hero/hero-slideshow-19-mountain-valley.jpg': '12% 40%',
  '/images/hero/hero-slideshow-20-siargao-lagoon.jpg': AERIAL,
  '/images/hero/hero-slideshow-21-cold-spring.jpg': '14% 40%',
  '/images/hero/hero-slideshow-22-beach-topdown.jpg': AERIAL,
  '/images/hero/hero-slideshow-23-grand-mosque.jpg': LANDMARK,
  '/images/hero/hero-slideshow-24-mountain-pond.jpg': '12% 38%',
}

export function heroSlideFocus(path: string): string {
  return HERO_SLIDE_FOCUS[path] ?? AERIAL
}
