import { readFileSync } from 'node:fs'
import { PNG } from 'pngjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const refPath = path.join(
  root,
  'assets/c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_522fb57e74b2e8f90fbcf1d18fea5ecc_images_image-2e27af83-a786-4292-8899-a90566ab9b86.png',
)

const png = PNG.sync.read(readFileSync(refPath))
const { width, height, data } = png

function px(x, y) {
  const i = (width * y + x) << 2
  return [data[i], data[i + 1], data[i + 2]]
}

function pct(x, y) {
  return `${((x / width) * 100).toFixed(1)}%, ${((y / height) * 100).toFixed(1)}%`
}

// sample portrait center - look for non-white pixels in center vertical strip
let minX = width
let maxX = 0
let minY = height
let maxY = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b] = px(x, y)
    // navy suit / skin - not white, not peach background only
    if (r < 240 && g < 240 && !(r > 220 && g > 180 && b > 150)) {
      if (x > width * 0.25 && x < width * 0.75) {
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }
  }
}
console.log('portrait bbox', {
  left: `${((minX / width) * 100).toFixed(1)}%`,
  top: `${((minY / height) * 100).toFixed(1)}%`,
  width: `${(((maxX - minX) / width) * 100).toFixed(1)}%`,
  height: `${(((maxY - minY) / height) * 100).toFixed(1)}%`,
  center: pct((minX + maxX) / 2, (minY + maxY) / 2),
})

// peach circle - peach pixels
minX = width
maxX = 0
minY = height
maxY = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b] = px(x, y)
    if (r > 230 && g > 200 && b > 170 && r > g && g > b) {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
  }
}
console.log('peach bbox', {
  left: `${((minX / width) * 100).toFixed(1)}%`,
  top: `${((minY / height) * 100).toFixed(1)}%`,
  width: `${(((maxX - minX) / width) * 100).toFixed(1)}%`,
  height: `${(((maxY - minY) / height) * 100).toFixed(1)}%`,
})
