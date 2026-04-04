def escape_like(string):
    return string.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")

print(escape_like("vendor%_name\\"))
