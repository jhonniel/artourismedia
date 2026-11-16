#!/usr/bin/env python3
"""Knock out the white JPEG background, crop, and write brand PNGs."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(
    r"C:\Users\user\.cursor\projects\c-Users-user-Documents-Projects-ART-WEBSITE"
    r"\assets\ArTouriMedia-JPEG-CLRD__2_-dce18154-1e68-4447-aa7f-4c455e0fc88d.jpg"
)
BRAND_DIR = ROOT / "frontend" / "public" / "images" / "brand"
BACKEND_BRAND_DIR = ROOT / "backend" / "public" / "images" / "brand"
FRONTEND_PUBLIC = ROOT / "frontend" / "public"
BACKEND_PUBLIC = ROOT / "backend" / "public"


def knockout_white(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    width, height = image.size

    for y in range(height):
        for x in range(width):
            red, green, blue, _alpha = pixels[x, y]
            ink = max(255 - red, 255 - green, 255 - blue)

            if ink < 10:
                pixels[x, y] = (red, green, blue, 0)
                continue

            alpha = min(255, int(ink * 1.15))
            amount = alpha / 255
            restored_red = min(255, max(0, int(round((red - (1 - amount) * 255) / amount))))
            restored_green = min(255, max(0, int(round((green - (1 - amount) * 255) / amount))))
            restored_blue = min(255, max(0, int(round((blue - (1 - amount) * 255) / amount))))
            pixels[x, y] = (restored_red, restored_green, restored_blue, alpha)

    return image


def crop_content(image: Image.Image, padding_ratio: float = 0.04) -> Image.Image:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    width, height = image.size
    pad_x = int((right - left) * padding_ratio)
    pad_y = int((bottom - top) * padding_ratio)
    crop_box = (
        max(0, left - pad_x),
        max(0, top - pad_y),
        min(width, right + pad_x),
        min(height, bottom + pad_y),
    )
    return image.crop(crop_box)


def save_png(image: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "PNG", optimize=True)
    print(f"Saved {path} ({image.size[0]}x{image.size[1]})")


def make_favicon(mark: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (248, 244, 236, 255))
    fitted = mark.copy()
    fitted.thumbnail((int(size * 0.92), int(size * 0.92)), Image.Resampling.LANCZOS)
    offset = ((size - fitted.width) // 2, (size - fitted.height) // 2)
    canvas.paste(fitted, offset, fitted)
    return canvas.convert("RGBA")


def to_on_dark(image: Image.Image) -> Image.Image:
    """Turn near-black wordmark letters white so the logo reads on navy."""
    result = image.copy()
    pixels = result.load()
    width, height = result.size

    for y in range(height):
        for x in range(width):
            red, green, blue, alpha = pixels[x, y]
            if alpha == 0:
                continue

            luminance = 0.299 * red + 0.587 * green + 0.114 * blue
            maximum = max(red, green, blue)
            minimum = min(red, green, blue)
            saturation = (maximum - minimum) / maximum if maximum else 0.0

            if luminance < 72 and saturation < 0.28:
                pixels[x, y] = (255, 255, 255, alpha)

    return result


def main() -> None:
    raw = Image.open(SOURCE)
    transparent = knockout_white(raw)
    cropped = crop_content(transparent)

    max_width = 1200
    if cropped.width > max_width:
        ratio = max_width / cropped.width
        cropped = cropped.resize(
            (max_width, int(cropped.height * ratio)),
            Image.Resampling.LANCZOS,
        )

    dark = to_on_dark(cropped)

    save_png(cropped, BRAND_DIR / "artourismedia-logo.png")
    save_png(dark, BRAND_DIR / "artourismedia-logo-dark.png")
    save_png(cropped, BACKEND_BRAND_DIR / "artourismedia-logo.png")
    save_png(dark, BACKEND_BRAND_DIR / "artourismedia-logo-dark.png")

    source_copy = BRAND_DIR / "artourismedia-logo.jpg"
    raw.convert("RGB").save(source_copy, "JPEG", quality=92, optimize=True)
    print(f"Saved {source_copy}")

    favicon_64 = make_favicon(cropped, 64)
    favicon_192 = make_favicon(cropped, 192)
    apple = make_favicon(cropped, 180)
    icon_source = make_favicon(cropped, 256)

    for public in (FRONTEND_PUBLIC, BACKEND_PUBLIC):
        save_png(favicon_192, public / "favicon-192.png")
        save_png(favicon_64, public / "favicon.png")
        save_png(apple, public / "apple-touch-icon.png")
        ico_path = public / "favicon.ico"
        icon_source.save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
        print(f"Saved {ico_path}")
        save_png(favicon_192, public / "images" / "brand" / "favicon-mark.png")
        svg = public / "favicon.svg"
        if svg.exists():
            svg.unlink()
            print(f"Removed {svg}")


if __name__ == "__main__":
    main()
