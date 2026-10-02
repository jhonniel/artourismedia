import { readFileSync } from 'node:fs'
import { PNG } from 'pngjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const refPath = path.join(
  root,
  'assets/c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_522fb57e74b2e8f90fbcf1d18fea5ecc_images_image-8d3cd2e3-24c3-4859-87ca-336de9cdd916.png',
)

const buf = readFileSync(refPath)
const png = PNG.sync.read(buf)
const { width, height, data } = png

function px(x, y) {
  const i = (width * y + x) << 2
  return [data[i], data[i + 1], data[i + 2], data[i + 3]]
}

function isWhite(r, g, b) {
  return r > 245 && g > 245 && b > 245
}

function isPeach(r, g, b) {
  return r > 220 && g > 180 && b > 150 && r > g
}

function isTeal(r, g, b) {
  return g > 230 && b > 230 && r < 240
}

console.log('size', width, height, 'ratio', (width / height).toFixed(2))

// find peach circle bbox by scanning center region
let minX = width
let maxX = 0
let minY = height
let maxY = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b] = px(x, y)
    if (isPeach(r, g, b) && !isWhite(r, g, b)) {
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
  centerX: `${(((minX + maxX) / 2 / width) * 100).toFixed(1)}%`,
  centerY: `${(((minY + maxY) / 2 / height) * 100).toFixed(1)}%`,
})

// wave start row (first non-white row from bottom in middle)
for (let y = height - 1; y >= 0; y--) {
  const [r, g, b] = px(Math.floor(width * 0.5), y)
  if (!isWhite(r, g, b)) {
    console.log('wave visible mid at y', `${((y / height) * 100).toFixed(1)}%`)
    break
  }
}
