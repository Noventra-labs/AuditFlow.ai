with open('agents/invoice_parser/main.py', 'r') as f:
    content = f.read()

search_str = """        # Validate against known vendors in Supabase
        vendor_name = parsed_data.get("vendor_name")
        vendor_match = None
        if vendor_name:
            try:
                resp = self.supabase.table("vendors").select("*").eq(
                    "company_id", task.company_id
                ).ilike("name", f"%{vendor_name}%").execute()
                if resp.data:"""

replace_str = """        # Validate against known vendors in Supabase
        vendor_name = parsed_data.get("vendor_name")
        vendor_match = None
        if vendor_name:
            try:
                # Sanitize vendor_name for LIKE query to prevent wildcard injection
                safe_vendor_name = vendor_name.replace("\\\\", "\\\\\\\\").replace("%", "\\\\%").replace("_", "\\\\_")

                resp = self.supabase.table("vendors").select("*").eq(
                    "company_id", task.company_id
                ).ilike("name", f"%{safe_vendor_name}%").execute()
                if resp.data:"""

if search_str in content:
    content = content.replace(search_str, replace_str)
    with open('agents/invoice_parser/main.py', 'w') as f:
        f.write(content)
    print("Patch applied successfully.")
else:
    print("Search string not found in the file.")
