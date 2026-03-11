import os
import sys
from PIL import Image

def recolor_icon(input_path, output_path, target_color):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # item is (R, G, B, A)
            # If the pixel is not completely transparent, recolor it
            if item[3] > 0:
                # Keep the original alpha, but replace RGB with target_color
                newData.append((target_color[0], target_color[1], target_color[2], item[3]))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully recolored {input_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    icons = [
        "icon_creative.png",
        "icon_team.png",
        "icon_planning.png",
        "icon_budget.png",
        "icon_execution.png",
        "icon_excellence.png"
    ]
    
    # Target color: #4A90E2 -> RGB (74, 144, 226)
    target_rgb = (74, 144, 226)
    
    image_dir = "images"
    for icon in icons:
        input_file = os.path.join(image_dir, icon)
        
        # In this case we can overwrite them or prefix. We'll overwrite safely assuming they are just simple colored icons
        if os.path.exists(input_file):
            recolor_icon(input_file, input_file, target_rgb)
        else:
            print(f"File not found: {input_file}")
