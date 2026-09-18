import os, sys, re, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

base_dir = r'D:\radha-ashtami'
images_dir = os.path.join(base_dir, 'images')

card_orig = Image.open(os.path.join(images_dir, 'radharani_dupatta_transparent.png')).convert('RGBA')
arr = np.array(card_orig)
y1, y2, x1, x2 = 629, 681, 210, 515
row_top = arr[y1 - 1, x1:x2].astype(float)
row_bot = arr[y2 + 1, x1:x2].astype(float)
for idx, y in enumerate(range(y1, y2 + 1)):
    alpha = (idx + 1) / (y2 - y1 + 2)
    arr[y, x1:x2] = (1 - alpha) * row_top + alpha * row_bot
card_base = Image.fromarray(arr, 'RGBA')

cx_c, cy_c, radius = 362, 553, 77
size = radius * 2
font_bold = ImageFont.truetype('georgiab.ttf', 20)
font_sub = ImageFont.truetype('georgiab.ttf', 19)
text_color = (112, 14, 24, 255)

mask = Image.new('L', (size * 4, size * 4), 0)
draw_mask = ImageDraw.Draw(mask)
draw_mask.ellipse((0, 0, size * 4, size * 4), fill=255)
mask = mask.resize((size, size), Image.Resampling.LANCZOS)

devotees = [
    {
        'name': 'H.G. JAGATBANDHU PRABHU',
        'line1': 'H.G. JAGATBANDHU',
        'line2': 'PRABHU',
        'id': 'jagatbandhu',
        'img_path': r'C:\Users\pc\.gemini\antigravity\brain\ab98e414-96f1-47f0-bd3d-25b94e55a072\.user_uploaded\media_1789705543608.jpg',
        'crop_cx': 0.71,
        'crop_cy': 0.22,
        'crop_scale': 0.28
    },
    {
        'name': 'H.G. KURU PRAVEEN PRABHU',
        'line1': 'H.G. KURU PRAVEEN',
        'line2': 'PRABHU',
        'id': 'kuru_praveen',
        'img_path': r'C:\Users\pc\.gemini\antigravity\brain\ab98e414-96f1-47f0-bd3d-25b94e55a072\.user_uploaded\media_1789705543608.jpg',
        'crop_cx': 0.26,
        'crop_cy': 0.23,
        'crop_scale': 0.25
    }
]

script_entries = []

for d in devotees:
    src = Image.open(d['img_path']).convert('RGB')
    w, h = src.size
    crop_size = int(min(w, h) * d['crop_scale'])
    cx = int(w * d['crop_cx'])
    cy = int(h * d['crop_cy'])
    left = max(0, min(w - crop_size, cx - crop_size // 2))
    top = max(0, min(h - crop_size, cy - crop_size // 2))
    profile_sq = src.crop((left, top, left + crop_size, top + crop_size)).resize((500, 500), Image.Resampling.LANCZOS)
    
    did = d['id']
    prof_file = did + '_prabhu.jpg'
    profile_sq.save(os.path.join(images_dir, prof_file), quality=95)
    
    card = card_base.copy()
    face_resized = profile_sq.resize((size, size), Image.Resampling.LANCZOS).convert('RGBA')
    card.paste(face_resized, (cx_c - radius, cy_c - radius), mask)
    
    draw = ImageDraw.Draw(card)
    bb1 = draw.textbbox((0, 0), d['line1'], font=font_sub)
    w1 = bb1[2] - bb1[0]
    bb2 = draw.textbbox((0, 0), d['line2'], font=font_bold)
    w2 = bb2[2] - bb2[0]
    draw.text((cx_c - w1 // 2, 638), d['line1'], fill=text_color, font=font_sub)
    draw.text((cx_c - w2 // 2, 658), d['line2'], fill=text_color, font=font_bold)
    
    card_file = 'radharani_dupatta_' + did + '.png'
    card.save(os.path.join(images_dir, card_file), 'PNG')
    
    dname = d['name']
    script_entries.append(f"""  'h.g.{did}_prabhu': {{
    name: '{dname}',
    photo: 'images/{prof_file}',
    card: 'images/{card_file}'
  }},
  '{did}_prabhu': {{
    name: '{dname}',
    photo: 'images/{prof_file}',
    card: 'images/{card_file}'
  }},
  'h.g.{did}': {{
    name: '{dname}',
    photo: 'images/{prof_file}',
    card: 'images/{card_file}'
  }},
  '{did}': {{
    name: '{dname}',
    photo: 'images/{prof_file}',
    card: 'images/{card_file}'
  }},""")

script_path = os.path.join(base_dir, 'script.js')
with open(script_path, 'r', encoding='utf-8') as f:
    code = f.read()

entries_str = '\n'.join(script_entries)
code = code.replace('const DEVOTEE_REGISTRY = {', 'const DEVOTEE_REGISTRY = {\n' + entries_str)
with open(script_path, 'w', encoding='utf-8') as f:
    f.write(code)

subprocess.run(['git', 'add', '.'], cwd=base_dir, check=True)
subprocess.run(['git', 'commit', '-m', 'Add cards for HG JagatBandhu Prabhu and HG Kuru Praveen Prabhu'], cwd=base_dir, check=True)
subprocess.run(['git', 'push', 'origin', 'main'], cwd=base_dir, check=True)
print('SUCCESS_BOTH_PUSHED_FAST')
