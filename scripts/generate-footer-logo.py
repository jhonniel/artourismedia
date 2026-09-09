#!/usr/bin/env python3
"""Build a white footer logo from the main transparent brand PNG."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "frontend" / "public" / "images" / "brand" / "artourismedia-logo.png"
TARGET = ROOT / "frontend" / "public" / "images" / "brand" / "artourismedia-logo-dark.png"
BACKEND_TARGET = ROOT / "backend" / "public" / "images" / "brand" / "artourismedia-logo-dark.png"


def is_brand_green(red: int, green: int, blue: int) -> bool:
    if green < 110:
        return False

    return green > red + 45 and green > blue + 35


def to_footer_pixel(red: int, green: int, blue: int, alpha: int) -> tuple[int, int, int, int]:
    if alpha == 0:
        return red, green, blue, alpha

    maximum = max(red, green, blue)

    if maximum < 120:
        return 255, 255, 255, alpha

    if is_brand_green(red, green, blue):
        return 36, 179, 136, alpha

    return 255, 255, 255, alpha


def generate_footer_logo(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGBA")
    pixels = image.load()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            pixels[x, y] = to_footer_pixel(*pixels[x, y])

    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "PNG", optimize=True)
    print(f"Saved {target} ({width}x{height})")


if __name__ == "__main__":
    generate_footer_logo(SOURCE, TARGET)
    generate_footer_logo(SOURCE, BACKEND_TARGET)
