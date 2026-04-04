import glob
import os
for file in glob.glob("frontend/src/views/*.tsx"):
    with open(file, "r") as f:
        content = f.read()
    if "Link" in content and "import { Link }" not in content:
        content = "import { Link } from 'react-router-dom';\n" + content
        with open(file, "w") as f:
            f.write(content)
