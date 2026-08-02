import os
import re

def replace_fonts_in_dir(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.jsx'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()
                
                # Replace font-bold and font-extrabold with font-normal
                new_content = re.sub(r'\bfont-bold\b', 'font-normal', content)
                new_content = re.sub(r'\bfont-extrabold\b', 'font-normal', new_content)
                
                if new_content != content:
                    with open(filepath, 'w') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")

if __name__ == "__main__":
    target_dir = "/Users/pheonix/Documents/Internship/thirumathi_kart/tkart_buyer/src/components"
    replace_fonts_in_dir(target_dir)
