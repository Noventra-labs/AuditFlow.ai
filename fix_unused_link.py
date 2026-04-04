import glob
for file in glob.glob("frontend/src/views/*.tsx"):
    with open(file, "r") as f:
        content = f.read()
    if "import { Link } from 'react-router-dom';" in content and "Link to=" not in content and "<Link " not in content:
        content = content.replace("import { Link } from 'react-router-dom';\n", "")
        with open(file, "w") as f:
            f.write(content)
