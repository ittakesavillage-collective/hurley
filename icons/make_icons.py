from PIL import Image, ImageFilter, ImageDraw
import os
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

src = Image.open('icons/hurley-icon-source-v5.jpg').convert('RGB')
# White line-art region, with a little margin
box = (478, 186, 933, 578)
art = src.crop(box)
# Whiteness: low saturation + bright. Use the minimum channel (terracotta has a low blue/green).
L = art.split()[2].point(lambda v: 0 if v < 110 else 255 if v > 200 else int((v - 110) * 255 / 90))

S = 4
big = L.resize((art.width * S, art.height * S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(S * 0.6))
# Re-threshold to a crisp, smooth edge (narrow ramp = sharp but anti-aliased)
alpha = big.point(lambda v: 0 if v < 110 else 255 if v > 146 else int((v - 110) * 255 / 36))

def icon(size, art_frac, name):
    # Flat, clean terracotta gradient (darker top, warmer bottom) like the original tile
    top, bot = (164, 76, 45), (192, 98, 64)
    bg = Image.new('RGB', (size, size))
    d = ImageDraw.Draw(bg)
    for y in range(size):
        t = y / (size - 1)
        d.line([(0, y), (size, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    w = int(size * art_frac)
    a = alpha.resize((w, int(w * alpha.height / alpha.width)), Image.LANCZOS)
    white = Image.new('RGB', a.size, (255, 255, 255))
    bg.paste(white, ((size - a.width) // 2, (size - a.height) // 2), a)
    bg.save(name)

icon(1024, 0.76, 'icons/icon-1024.png')
icon(512, 0.76, 'icons/icon-512.png')
icon(192, 0.76, 'icons/icon-192.png')
icon(180, 0.76, 'icons/apple-touch-icon.png')
icon(32, 0.86, 'icons/favicon-32.png')
icon(512, 0.60, 'icons/icon-maskable-512.png')
print('ok')
