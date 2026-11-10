"""Build 1200x630 JPG share images (Open Graph) into public/og/.

Run from the repo root after adding photos:  python3 scripts/make-og-images.py
Wide banners are cropped to fill; tall product photos are placed whole on a
blurred, enlarged copy of themselves.
"""
import json, os, re
from PIL import Image, ImageFilter

W, H = 1200, 630
PUB = "public"
OUT = os.path.join(PUB, "og")
os.makedirs(OUT, exist_ok=True)


def find(base):
    for ext in ("jpg", "jpeg", "webp", "png"):
        p = os.path.join(PUB, f"{base}.{ext}")
        if os.path.exists(p):
            return p
    return None


def cover(im, focus=(0.5, 0.4)):
    s = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = round((im.width - W) * focus[0]); y = round((im.height - H) * focus[1])
    return im.crop((x, y, x + W, y + H))


def contain_on_blur(im):
    bg = cover(im).filter(ImageFilter.GaussianBlur(28))
    bg = Image.blend(bg, Image.new("RGB", (W, H), (246, 246, 246)), 0.35)
    s = min((W * 0.8) / im.width, (H - 40) / im.height)
    fg = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    bg.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2))
    return bg


def save(key, base, mode="cover", focus=(0.5, 0.4)):
    src = find(base)
    if not src:
        return False
    im = Image.open(src).convert("RGB")
    wide = im.width / im.height > 1.3
    out = cover(im, focus) if (mode == "cover" or wide) else contain_on_blur(im)
    out.save(os.path.join(OUT, f"{key}.jpg"), quality=76, optimize=True, progressive=True)
    return True


# Pages
PAGES = {
    "default": "images/hero/hero-adult", "home": "images/hero/hero-adult",
    "shop": "images/hero/hero-new", "about": "images/pages/about", "branches": "images/pages/branches",
    "contact": "images/pages/contact", "blog": "images/pages/journal", "faq": "images/content/story",
    "search": "images/hero/hero-adult", "cart": "images/hero/hero-new", "account": "images/content/story",
}
for k, b in PAGES.items():
    save(k, b, focus=(0.35, 0.3) if "hero-adult" in b else (0.5, 0.4))

# Categories
cats = json.load(open("lib/data/categories.json"))
cat_img = {}
for c in cats:
    if save(f"cat-{c['slug']}", f"images/categories/{c['slug']}"):
        cat_img[c["slug"]] = f"images/categories/{c['slug']}"

# Products: own front photo, else the category photo
for p in json.load(open("lib/data/products.json")):
    if not save(f"product-{p['slug']}", f"images/products/{p['slug']}-front", mode="contain"):
        if p["categorySlug"] in cat_img:
            save(f"product-{p['slug']}", cat_img[p["categorySlug"]])

# Blog posts
for slug, image in re.findall(r'slug: "([^"]+)",[\s\S]*?\n    image: "([^"]+)"', open("lib/blog.ts").read()):
    save(f"blog-{slug}", image)

print(len(os.listdir(OUT)), "images in", OUT)
