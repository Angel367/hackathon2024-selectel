import json

# Open the JSON file in read mode
with open('backend_api_app/management/commands/single_results_unique.json', 'r', encoding='utf-8') as f:
    # Load the data from the file
    data = json.load(f)



# Initialize an empty list to store the duplicates
duplicates_id = {}

# Iterate over the data array
for item in data:
    if not duplicates_id.get(item['id']):
        duplicates_id[item['id']] = 1
    else:
        duplicates_id[item['id']] += 1

for key, value in duplicates_id.items():
    if value > 1:
        print(f'ID: {key} has {value} duplicates')