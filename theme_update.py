import re
import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in replacements:
        content = re.sub(old, new, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    replacements = [
        # Accent color (Orange -> Sky Blue)
        (r'--clr-accent-orange', r'--clr-accent-blue'),
        (r'#f26d40', r'#89b5db'),
        (r'242,\s*109,\s*64', r'137, 181, 219'),
        
        # Pastel Purple -> Pastel Sky
        (r'--clr-bg-pastel-purple', r'--clr-bg-pastel-sky'),
        (r'#f3e8fe', r'#e1eff8'),
        (r'#8a61c2', r'#6096ba'), # This was a gradient color next to #f26d40, change to darker blue
        
        # Pastel Pink -> Pastel Cyan
        (r'--clr-bg-pastel-pink', r'--clr-bg-pastel-cyan'),
        (r'#fee8ed', r'#e0f4f9'),
        
        # Other related gradients/colors that might clash
        (r'#ff9a9e', r'#a1c4fd'), # pinkish bento bgs to blueish
        (r'#ffc3a0', r'#c2e9fb'),
        (r'#ff4757', r'#89b5db'), # red heart emoji color to blue
    ]
    
    replace_in_file('styles.css', replacements)
    replace_in_file('index.html', replacements)
    print("Theme updated successfully.")
