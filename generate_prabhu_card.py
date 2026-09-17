import os, sys, re, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def process_devotee(photo_path, devotee_name, devotee_id=None):
    if not devotee_id:
        clean = devotee_name.lower().replace('h.g.', '').replace('hg', '').replace('.', '').strip()
        devotee_id = re.sub(r'[^a-z0-9]+', '_', clean).strip('_')

    base_dir = r'D:\radha-ashtami'
    images_dir = os.path.join(base_dir, 'images')

    # 1. Profile Square Crop (70% scale centered slightly high to capture tilak)
    src = Image.open(photo_path).convert('RGB')
    w, h = src.size
    min_dim = min(w, h)
    crop_size = int(min_dim * 0.85) if min_dim > 600 else min_dim
    left = max(0, min(w - crop_size, (w - crop_size) // 2))
    top = max(0, min(h - crop_size, int(h * 0.05)))
    profile_sq = src.crop((left, top, left + crop_size, top + crop_size)).resize((500, 500), Image.Resampling.LANCZOS)
    
    prof_file = f'{devotee_id}.jpg'
    profile_sq.save(os.path.join(images_dir, prof_file), quality=95)

    # 2. Template & Clean Gradient
    card = Image.open(os.path.join(images_dir, 'radharani_dupatta_transparent.png')).convert('RGBA')
    arr = np.array(card)

    y1, y2 = 629, 681
    x1, x2 = 210, 515
    row_top = arr[y1 - 1, x1:x2].astype(float)
    row_bot = arr[y2 + 1, x1:x2].astype(float)
    for idx, y in enumerate(range(y1, y2 + 1)):
        alpha = (idx + 1) / (y2 - y1 + 2)
        arr[y, x1:x2] = (1 - alpha) * row_top + alpha * row_bot

    card_clean = Image.fromarray(arr, 'RGBA')

    # 3. Paste Face into Frame
    cx, cy, radius = 362, 553, 77
    size = radius * 2
    face_resized = profile_sq.resize((size, size), Image.Resampling.LANCZOS).convert('RGBA')
    mask = Image.new('L', (size * 4, size * 4), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.ellipse((0, 0, size * 4, size * 4), fill=255)
    mask = mask.resize((size, size), Image.Resampling.LANCZOS)
    card_clean.paste(face_resized, (cx - radius, cy - radius), mask)

    # 4. Typography
    draw = ImageDraw.Draw(card_clean)
    font_bold = ImageFont.truetype('georgiab.ttf', 20)
    font_sub = ImageFont.truetype('georgiab.ttf', 19)
    text_color = (112, 14, 24, 255)

    clean_upper = devotee_name.upper().strip()
    if not clean_upper.startswith('H.G.'):
        clean_upper = 'H.G. ' + clean_upper

    parts = clean_upper.split()
    if len(parts) >= 3:
        line1 = ' '.join(parts[:2])
        line2 = ' '.join(parts[2:])
        bb1 = draw.textbbox((0, 0), line1, font=font_sub)
        w1 = bb1[2] - bb1[0]
        bb2 = draw.textbbox((0, 0), line2, font=font_bold)
        w2 = bb2[2] - bb2[0]
        draw.text((cx - w1 // 2, 638), line1, fill=text_color, font=font_sub)
        draw.text((cx - w2 // 2, 658), line2, fill=text_color, font=font_bold)
    else:
        bb = draw.textbbox((0, 0), clean_upper, font=font_bold)
        w_text = bb[2] - bb[0]
        draw.text((cx - w_text // 2, 645), clean_upper, fill=text_color, font=font_bold)

    card_file = f'radharani_dupatta_{devotee_id}.png'
    card_clean.save(os.path.join(images_dir, card_file), 'PNG')

    # 5. Update script.js
    script_path = os.path.join(base_dir, 'script.js')
    with open(script_path, 'r', encoding='utf-8') as f:
        code = f.read()

    shorthand = devotee_id.replace('h_g_', '')
    entry = f"""  'h.g.{shorthand}': {{
    name: '{clean_upper}',
    photo: 'images/{prof_file}',
    card: 'images/{card_file}'
  }},
  '{shorthand}': {{
    name: '{clean_upper}',
    photo: 'images/{prof_file}',
    card: 'images/{card_file}'
  }},"""

    if f"'{shorthand}':" not in code:
        code = code.replace('const DEVOTEE_REGISTRY = {', 'const DEVOTEE_REGISTRY = {\n' + entry)
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(code)

    # 6. Git Push Automatically
    subprocess.run(['git', 'add', '.'], cwd=base_dir, check=True)
    subprocess.run(['git', 'commit', '-m', f'Add personalized card for {clean_upper}'], cwd=base_dir, check=True)
    subprocess.run(['git', 'push', 'origin', 'main'], cwd=base_dir, check=True)

    print(f'ALL_DONE: https://kapilkantbansal.github.io/radha-ashtami-invitation/?id={shorthand}')

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        p = sys.argv[1]
        n = sys.argv[2]
        d = sys.argv[3] if len(sys.argv) > 3 else None
        process_devotee(p, n, d)
