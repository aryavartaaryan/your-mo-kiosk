# scripts/extract_mo_assets.py
import os
import numpy as np
from PIL import Image
from scipy.ndimage import label

SRC_PATH = '/Users/adityaashok/.gemini/antigravity/brain/6535d68f-be36-4e17-8e4b-9241006f9297/.user_uploaded/media_1792751483771.jpg'
OUT_DIR  = '/Users/adityaashok/Desktop/your-mo/public/assets/mo'

os.makedirs(f'{OUT_DIR}/poses', exist_ok=True)
os.makedirs(f'{OUT_DIR}/expressions', exist_ok=True)

src = Image.open(SRC_PATH)

def extract_and_clean(crop_box, out_path, bg_threshold=42, upscale=2):
    cropped = src.crop(crop_box)
    arr = np.array(cropped.convert('RGBA'))
    
    # Distance to cream background color #F7F5EE
    diff = (np.abs(arr[:,:,0].astype(int) - 247) +
            np.abs(arr[:,:,1].astype(int) - 245) +
            np.abs(arr[:,:,2].astype(int) - 240))
    is_bg = diff < bg_threshold
    
    # Connected component to edges
    labeled, _ = label(is_bg)
    edge_pixels = np.concatenate([labeled[0,:], labeled[-1,:], labeled[:,0], labeled[:,-1]])
    bg_labels = set(np.unique(edge_pixels))
    bg_labels.discard(0)
    
    bg_mask = np.isin(labeled, list(bg_labels))
    arr[bg_mask, 3] = 0
    
    out = Image.fromarray(arr)
    if upscale > 1:
        out = out.resize((out.width * upscale, out.height * upscale), Image.Resampling.LANCZOS)
    out.save(out_path)
    print(f'Extracted: {os.path.basename(out_path)} ({out.size[0]}x{out.size[1]})')

# ── 1. High-Resolution Turnaround Poses ────────────────────────────────────────
extract_and_clean((150, 178, 256, 428), f'{OUT_DIR}/poses/pose_front.png')
extract_and_clean((266, 178, 362, 428), f'{OUT_DIR}/poses/pose_three_quarter.png')

# ── 2. Key Action Poses (bottom row y=566 to 726) ─────────────────────────────
poses_y1, poses_y2 = 566, 726
POSES = [
    ('pose_standing',     (20,  poses_y1, 86,  poses_y2)),
    ('pose_thumbs_up',    (98,  poses_y1, 157, poses_y2)),
    ('pose_pointing',     (166, poses_y1, 228, poses_y2)),
    ('pose_arms_crossed', (238, poses_y1, 297, poses_y2)),
    ('pose_talking',      (306, poses_y1, 382, poses_y2)),
    ('pose_dancing',      (384, poses_y1, 495, poses_y2)),
    ('pose_sitting',      (500, poses_y1, 572, poses_y2)),
    ('pose_phone',        (576, poses_y1, 647, poses_y2)),
    ('pose_back',         (652, poses_y1, 720, poses_y2)),
]

for name, box in POSES:
    extract_and_clean(box, f'{OUT_DIR}/poses/{name}.png')

# ── 3. Facial Expressions (middle row y=466 to 538) ───────────────────────────
expr_y1, expr_y2 = 466, 538
EXPRESSIONS = [
    ('expr_neutral',    (102, expr_y1, 160, expr_y2)),
    ('expr_happy',      (165, expr_y1, 223, expr_y2)),
    ('expr_excited',    (228, expr_y1, 286, expr_y2)),
    ('expr_wink',       (291, expr_y1, 349, expr_y2)),
    ('expr_laughing',   (354, expr_y1, 411, expr_y2)),
    ('expr_confident',  (416, expr_y1, 474, expr_y2)),
    ('expr_surprised',  (478, expr_y1, 536, expr_y2)),
    ('expr_thinking',   (541, expr_y1, 598, expr_y2)),
    ('expr_angry',      (603, expr_y1, 661, expr_y2)),
    ('expr_cool',       (666, expr_y1, 724, expr_y2)),
]

for name, box in EXPRESSIONS:
    extract_and_clean(box, f'{OUT_DIR}/expressions/{name}.png', bg_threshold=42)

print('All Mo 3D assets extracted with pixel precision!')
