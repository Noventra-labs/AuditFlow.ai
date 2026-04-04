import json
with open('frontend/package.json', 'r') as f:
    pkg = json.load(f)
if '@tailwindcss/postcss' not in pkg['devDependencies']:
    pkg['devDependencies']['@tailwindcss/postcss'] = '^4.0.0'
with open('frontend/package.json', 'w') as f:
    json.dump(pkg, f, indent=2)
