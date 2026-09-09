from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"C:\Users\user\.cursor\projects\c-Users-user-Documents-Projects-ART-WEBSITE\assets"
    r"\c__Users_user_AppData_Roaming_Cursor_User_workspaceStorage_522fb57e74b2e8f90fbcf1d18fea5ecc_images"
    r"_ART_LOGO_FAV-e5b48362-9da9-46cc-ab24-619519fb474f.jpg"
)
OUT_DIR = ROOT / "frontend" / "public"
BRAND_DIR = OUT_DIR / "images" / "brand"


def is_background(r: int, g: int, b: int) -> bool:
    return r > 240 and g > 240 and b > 240


def remove_outer_white_background(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    pixels = img.load()
    width, height = img.size
    visited = [[False] * width for _ in range(height)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        for y in (0, height - 1):
            if not visited[y][x] and is_background(*pixels[x, y][:3]):
                visited[y][x] = True
                queue.append((x, y))

    for y in range(height):
        for x in (0, width - 1):
            if not visited[y][x] and is_background(*pixels[x, y][:3]):
                visited[y][x] = True
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        r, g, b, _ = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)

        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and not visited[ny][nx]:
                if is_background(*pixels[nx, ny][:3]):
                    visited[ny][nx] = True
                    queue.append((nx, ny))

    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def square_canvas(img: Image.Image) -> Image.Image:
    size = max(img.size)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset_x = (size - img.width) // 2
    offset_y = (size - img.height) // 2
    canvas.paste(img, (offset_x, offset_y), img)
    return canvas


def main() -> None:
    BRAND_DIR.mkdir(parents=True, exist_ok=True)

    cleaned = remove_outer_white_background(Image.open(SRC))
    master_path = BRAND_DIR / "favicon-mark.png"
    cleaned.save(master_path, "PNG")

    canvas = square_canvas(cleaned)
    outputs = {
        "favicon.png": 32,
        "favicon-192.png": 192,
        "apple-touch-icon.png": 180,
    }

    for name, size in outputs.items():
        resized = canvas.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(OUT_DIR / name, "PNG")
        print(f"saved {OUT_DIR / name} ({size}x{size})")

    print(f"saved master {master_path} ({cleaned.size[0]}x{cleaned.size[1]})")


if __name__ == "__main__":
    main()
