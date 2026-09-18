import os, sys, re, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont

base_dir = r'D:\radha-ashtami'
images_dir = os.path.join(base_dir, 'images')

photo_path = r'C:\Users\pc\.gemini\antigravity\brain\ab98e414-96f1-47f0-bd3d-25b94e55a072\.user_uploaded\media_1789724694713.jpg'
src = Image.open(photo_path).convert('RGB')
w, h = src.size

# Left devotee with grey scarf and tilak
crop_size = int(min(w, h) * 0.28)
cx = int(w * 0.36)
cy = int(h * 0.35)
left = max(0, min(w - crop_size, cx - crop_size // 2))
top = max(0, min(h - crop_size, cy - crop_size // 2))

profile_sq = src.crop((left, top, left + crop_size, top + crop_size)).resize((500, 500), Image.Resampling.LANCZOS)
profile_sq.save(os.path.join(images_dir, 'radha_madhav_prabhu.jpg'), quality=95)

card_orig = Image.open(os.path.join(images_dir, 'radharani_dupatta_transparent.png')).convert('RGBA')
arr = np.array(card_orig)
y1, y2, x1, x2 = 629, 681, 210, 515
row_top = arr[y1 - 1, x1:x2].astype(float)
row_bot = arr[y2 + 1, x1:x2].astype(float)
for idx, y in enumerate(range(y1, y2 + 1)):
    alpha = (idx + 1) / (y2 - y1 + 2)
    arr[y, x1:x2] = (1 - alpha) * row_top + alpha * row_bot
card = Image.fromarray(arr, 'RGBA')

cx_c, cy_c, radius = 362, 553, 77
size = radius * 2

mask = Image.new('L', (size * 4, size * 4), 0)
draw_mask = ImageDraw.Draw(mask)
draw_mask.ellipse((0, 0, size * 4, size * 4), fill=255)
mask = mask.resize((size, size), Image.Resampling.LANCZOS)

face_resized = profile_sq.resize((size, size), Image.Resampling.LANCZOS).convert('RGBA')
card.paste(face_resized, (cx_c - radius, cy_c - radius), mask)

draw = ImageDraw.Draw(card)
font_bold = ImageFont.truetype('georgiab.ttf', 20)
font_sub = ImageFont.truetype('georgiab.ttf', 19)
text_color = (112, 14, 24, 255)

line1 = 'H.G. RADHA MADHAV'
line2 = 'PRABHU'
bb1 = draw.textbbox((0, 0), line1, font=font_sub)
w1 = bb1[2] - bb1[0]
bb2 = draw.textbbox((0, 0), line2, font=font_bold)
w2 = bb2[2] - bb2[0]
draw.text((cx_c - w1 // 2, 638), line1, fill=text_color, font=font_sub)
draw.text((cx_c - w2 // 2, 658), line2, fill=text_color, font=font_bold)

card_file = 'radharani_dupatta_radha_madhav.png'
card.save(os.path.join(images_dir, card_file), 'PNG')

subprocess.run(['git', 'add', '.'], cwd=base_dir, check=True)
subprocess.run(['git', 'commit', '-m', 'Update HG Radha Madhav Prabhu (left standing devotee with scarf)'], cwd=base_dir, check=True)
subprocess.run(['git', 'push', 'origin', 'main'], cwd=base_dir, check=True)
print('SUCCESS_UPDATED_RADHA_MADHAV')
