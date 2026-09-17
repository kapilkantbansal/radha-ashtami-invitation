import sys
import os
import re
from PIL import Image, ImageDraw, ImageFont

def generate_devotee(photo_path, devotee_name, devotee_id=None):
    if not devotee_id:
        clean_name = devotee_name.lower().replace('h.g.', '').replace('.', '').strip()
        devotee_id = re.sub(r'[^a-z0-9]+', '_', clean_name).strip('_')
    
    base_dir = r"D:\radha-ashtami"
    images_dir = os.path.join(base_dir, "images")
    
    src_img = Image.open(photo_path).convert("RGB")
    w, h = src_img.size
    min_dim = min(w, h)
    crop_box = ((w - min_dim) // 2, 0, (w + min_dim) // 2, min_dim)
    profile_sq = src_img.crop(crop_box).resize((500, 500), Image.Resampling.LANCZOS)
    
    profile_filename = f"{devotee_id}.jpg"
    profile_path = os.path.join(images_dir, profile_filename)
    profile_sq.save(profile_path, quality=95)
    
    template_path = os.path.join(images_dir, "radharani_dupatta_transparent.png")
    card = Image.open(template_path).convert("RGBA")
    
    cx, cy, radius = 362, 553, 77
    size = radius * 2
    face_resized = profile_sq.resize((size, size), Image.Resampling.LANCZOS).convert("RGBA")
    
    mask = Image.new("L", (size * 4, size * 4), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.ellipse((0, 0, size * 4, size * 4), fill=255)
    mask = mask.resize((size, size), Image.Resampling.LANCZOS)
    card.paste(face_resized, (cx - radius, cy - radius), mask)
    
    draw = ImageDraw.Draw(card)
    draw.rectangle([220, 634, 505, 672], fill=(255, 252, 244, 255))
    
    font_bold = ImageFont.truetype("georgiab.ttf", 22)
    font_sub = ImageFont.truetype("georgiab.ttf", 20)
    text_color = (112, 14, 24, 255)
    
    parts = devotee_name.split()
    if len(parts) >= 3 and parts[0].upper().startswith("H"):
        line1 = " ".join(parts[:2]).upper()
        line2 = " ".join(parts[2:]).upper()
        bb1 = draw.textbbox((0, 0), line1, font=font_sub)
        w1 = bb1[2] - bb1[0]
        bb2 = draw.textbbox((0, 0), line2, font=font_bold)
        w2 = bb2[2] - bb2[0]
        draw.text((cx - w1 // 2, 635), line1, fill=text_color, font=font_sub)
        draw.text((cx - w2 // 2, 656), line2, fill=text_color, font=font_bold)
    else:
        bb = draw.textbbox((0, 0), devotee_name.upper(), font=font_bold)
        w_text = bb[2] - bb[0]
        draw.text((cx - w_text // 2, 642), devotee_name.upper(), fill=text_color, font=font_bold)
        
    card_filename = f"radharani_dupatta_{devotee_id}.png"
    out_card_path = os.path.join(images_dir, card_filename)
    card.save(out_card_path, "PNG")
    
    script_path = os.path.join(base_dir, "script.js")
    with open(script_path, "r", encoding="utf-8") as f:
        script_code = f.read()
        
    new_entry = f"""  '{devotee_id}': {{
    name: '{devotee_name.upper()}',
    photo: 'images/{profile_filename}',
    card: 'images/{card_filename}'
  }},"""
    
    if f"'{devotee_id}':" not in script_code:
        script_code = script_code.replace("const DEVOTEE_REGISTRY = {", f"const DEVOTEE_REGISTRY = {{\n{new_entry}")
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(script_code)
            
    print(f"SUCCESS: Generated for {devotee_name}")
    print(f"ID: {devotee_id}")
    print(f"URL: https://kapilkantbansal.github.io/radha-ashtami-invitation/?id={devotee_id}")

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        p_path = sys.argv[1]
        name = sys.argv[2]
        d_id = sys.argv[3] if len(sys.argv) > 3 else None
        generate_devotee(p_path, name, d_id)
