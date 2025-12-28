
import os
from PIL import Image

def remove_white_background(input_path, output_path, tolerance=30):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # Check if pixel is close to white
            if item[0] > 255 - tolerance and item[1] > 255 - tolerance and item[2] > 255 - tolerance:
                new_data.append((255, 255, 255, 0))  # Transparent
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Processed: {input_path} -> {output_path}")
    except Exception as e:
        print(f"Error processing {input_path}: {e}")

# Directories to process
directories = [
    "c:/Users/MSI/Downloads/ferm1/public/assets/houses",
    "c:/Users/MSI/Downloads/ferm1/public/assets/animals",
    "c:/Users/MSI/Downloads/ferm1/public/assets"
]

# Process Houses
houses_dir = directories[0]
if os.path.exists(houses_dir):
    for filename in os.listdir(houses_dir):
        if filename.endswith(".png"):
            path = os.path.join(houses_dir, filename)
            remove_white_background(path, path)

# Process Animals
animals_dir = directories[1]
if os.path.exists(animals_dir):
    for filename in os.listdir(animals_dir):
        if filename.endswith(".png"):
            path = os.path.join(animals_dir, filename)
            remove_white_background(path, path)

# Process Plot and Logo
assets_dir = directories[2]
remove_white_background(os.path.join(assets_dir, "plot.png"), os.path.join(assets_dir, "plot.png"))

# Logo is jpg, convert to png
logo_path = os.path.join(assets_dir, "logo.jpg")
if os.path.exists(logo_path):
    print("Processing logo.jpg to logo.png")
    remove_white_background(logo_path, os.path.join(assets_dir, "logo.png"))
