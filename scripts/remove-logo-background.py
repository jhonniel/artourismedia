#!/usr/bin/env python3
"""Remove white and near-white pixels from brand logo and save transparent PNG."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "frontend" / "public" / "images" / "brand" / "artourismedia-logo.jpg"
TARGET = ROOT / "frontend" / "public" / "images" / "brand" / "artourismedia-logo.png"
BACKEND_TARGET = ROOT / "backend" / "public" / "images" / "brand" / "artourismedia-logo.png"


def is_removable_background(red: int, green: int, blue: int) -> bool:
    minimum = min(red, green, blue)
    maximum = max(red, green, blue)
    luminance = 0.299 * red + 0.587 * green + 0.114 * blue
    saturation = (maximum - minimum) / maximum if maximum else 0.0

    if minimum >= 185:
        return True

    if luminance >= 220 and saturation <= 0.14:
        return True

    # Pale green/white anti-alias fringe from JPEG edges.
    if luminance >= 200 and saturation <= 0.3 and green >= red and green >= blue:
        return True

    return False


def remove_white_background(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    width, height = image.size
    removed = 0

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]

            if alpha == 0 or not is_removable_background(red, green, blue):
                continue

            pixels[x, y] = (red, green, blue, 0)
            removed += 1

    # Second pass: remove light gray edge halos while keeping brand green intact.
    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]

            if alpha == 0:
                continue

            minimum = min(red, green, blue)
            maximum = max(red, green, blue)
            luminance = 0.299 * red + 0.587 * green + 0.114 * blue

            if luminance >= 170 and (maximum - minimum) <= 22:
                pixels[x, y] = (red, green, blue, 0)
                removed += 1
            elif minimum >= 175:
                pixels[x, y] = (red, green, blue, 0)
                removed += 1

    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "PNG", optimize=True)
    print(f"Saved {target} ({width}x{height}, removed {removed} pixels)")


if __name__ == "__main__":
    remove_white_background(SOURCE, TARGET)
    remove_white_background(SOURCE, BACKEND_TARGET)
