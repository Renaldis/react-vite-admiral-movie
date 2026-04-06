import json
import os
import re



def sanitize_filename(name):
    """Sanitize the name to be safe for filenames."""
    # Replace invalid chars with underscore and strip whitespace
    return re.sub(r'[<>:"/\\|?*]', '_', name).strip()


def split_apidog_json(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"Reading {file_path}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Failed to load JSON: {e}")
        return

    # Create a directory for the output
    output_base_dir = "docs/api"
    os.makedirs(output_base_dir, exist_ok=True)


    # 1. Extract and Save Schemas (Data Models)
    if 'schemaCollection' in data and len(data['schemaCollection']) > 0:
        print("Extracting Schemas...")
        schema_dir = os.path.join(output_base_dir, "schemas")
        os.makedirs(schema_dir, exist_ok=True)
        
        # Keep a mapping of IDs to file paths if needed, but for now just split files
        # Assuming the first element is the Root folder for schemas too
        root_schemas = data['schemaCollection'][0].get('items', [])
        
        # First Pass: Build the Map
        for item in root_schemas:
             name = item.get('name', 'Untitled')
             safe_name = sanitize_filename(name)
             if 'id' in item:
                 SCHEMA_MAP[item['id']] = safe_name

        # Second Pass: Process and Save
        for item in root_schemas:
             name = item.get('name', 'Untitled')
             safe_name = sanitize_filename(name)
             
             # Process with the map populated
             processed_schema = process_data(item)
             
             schema_path = os.path.join(schema_dir, f"{safe_name}.json")
             with open(schema_path, 'w', encoding='utf-8') as f:
                 json.dump(processed_schema, f, indent=2, ensure_ascii=False)
             print(f"  - Saved schema: {safe_name}")
        
        # Remove from main data to reduce size
        del data['schemaCollection']
        
    # 2. Extract API Modules (Folders)
    if 'apiCollection' in data and len(data['apiCollection']) > 0:
        print("Extracting API Modules...")
        api_dir = os.path.join(output_base_dir, "modules")
        os.makedirs(api_dir, exist_ok=True)

        # Assuming the first element is the Project Root
        root_items = data['apiCollection'][0].get('items', [])

        # Find and extract leaf modules (folders containing API endpoints)
        leaf_modules = find_leaf_modules(root_items)

        for item in leaf_modules:
            name = item.get('name', 'Untitled')

            if name in MODULES_TO_EXCLUDE:
                print(f"  - Skipping excluded module: {name}")
                continue

            safe_name = sanitize_filename(name)

            # Save each leaf folder as a separate JSON file
            # Prune unwanted fields to reduce size
            processed_item = process_data(item)

            item_path = os.path.join(api_dir, f"{safe_name}.json")
            with open(item_path, 'w', encoding='utf-8') as f:
                json.dump(processed_item, f, indent=2, ensure_ascii=False)
            print(f"  - Saved module: {safe_name}")

        # Clear items from the main data to leave just the skeleton
        data['apiCollection'][0]['items'] = []

    # 3. Save the remaining Project Metadata (Info, Env, etc.)
    print("Saving Project Metadata...")
    meta_path = os.path.join(output_base_dir, "project_metadata.json")
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nDone! Files are located in '{output_base_dir}/'")


def is_leaf_module(item):
    """Check if an item is a leaf module (contains API endpoints, not more folders)."""
    items = item.get('items', [])
    if not items:
        return False
    # A leaf module has items where at least one has 'api' key (endpoint)
    # and none have nested 'items' that are folders (no 'api' key)
    has_api_endpoints = any('api' in child for child in items)
    has_nested_folders = any('items' in child and 'api' not in child for child in items)
    return has_api_endpoints and not has_nested_folders


def find_leaf_modules(items):
    """Recursively find all leaf modules (deepest folders containing API endpoints)."""
    leaf_modules = []
    for item in items:
        if is_leaf_module(item):
            leaf_modules.append(item)
        elif 'items' in item:
            # Recurse into nested folders
            leaf_modules.extend(find_leaf_modules(item['items']))
    return leaf_modules


FIELDS_TO_PRUNE = {
    # Internal Apidog Metadata
    'cases', 'mocks', 'mockScript', 'advancedSettings', 'globalVariables',
    'commonParameters', 'preProcessors', 'postProcessors', 
    'inheritPostProcessors', 'inheritPreProcessors', 'codeSamples',
    'ordering', 'visibility', 'moduleId', 'serverId', 'parentId',
    'customApiFields', 'responseChildren', 'apiTestDataList', 'identityPattern',
    'requestResult', 'shareSettings', 'oasExtensions', 'x-apidog-orders',
    # Additional noise
    'responseId', 'oasKey', 'itemSchema', 'sourceUrl',
    # Requested to remove
    'status', 'operationId', 'commonResponseStatus', 'type', 'tags', 'description'
}

MODULES_TO_EXCLUDE = {'Health'}

# Global map to store Schema ID -> Filename
SCHEMA_MAP = {}

def process_data(data):
    """Recursively remove unwanted fields and resolve schema references."""
    if isinstance(data, dict):
        new_data = {}
        for k, v in data.items():
            if k in FIELDS_TO_PRUNE:
                continue
            
            # Special handling: prune empty auth/securityScheme/itemSchema
            if k in ['auth', 'securityScheme', 'itemSchema'] and isinstance(v, dict) and not v:
                continue
            
            # Resolve Schema References
            if k == '$ref' and isinstance(v, str):
                if v in SCHEMA_MAP:
                    new_data[k] = f"../schemas/{SCHEMA_MAP[v]}.json"
                    continue
            
            # Recursively process the value
            processed_val = process_data(v)
            
            # Clean up parameters specifically
            if k == 'parameters' and isinstance(processed_val, dict):
                # Remove empty parameter lists
                for param_type in ['path', 'query', 'cookie', 'header']:
                    if param_type in processed_val and isinstance(processed_val[param_type], list) and not processed_val[param_type]:
                        del processed_val[param_type]
            
            # If requestBody parameters list is empty
            if k == 'requestBody' and isinstance(processed_val, dict):
                 if processed_val.get('type') == 'none' and not processed_val.get('parameters'):
                     if 'parameters' in processed_val and not processed_val['parameters']:
                         del processed_val['parameters']

            new_data[k] = processed_val
        return new_data
    elif isinstance(data, list):
        return [process_data(item) for item in data]
    else:
        return data

if __name__ == "__main__":
    import sys
    
    # Default to the existing filename if no argument is provided
    file_to_process = 'PAMAFIX MR.Apidog.json'
    
    if len(sys.argv) > 1:
        file_to_process = sys.argv[1]
        
    split_apidog_json(file_to_process)
