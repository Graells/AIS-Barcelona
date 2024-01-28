
import pathlib
import csv

from pyais.stream import FileReaderStream
from pyais.filter import (
    AttributeFilter,
    DistanceFilter,
    FilterChain,
    GridFilter,
    MessageTypeFilter,
    NoneFilter
)

filename = pathlib.Path(__file__).parent.joinpath('input/2024012416AIS.txt')
filtered_data = []
unfiltered_data = []

chain = FilterChain([
    # Ensure 'lon', 'lat', and 'mmsi2' attributes are not None
    NoneFilter('mmsi'), # 'lon', 'lat', 'mmsi2'
    # Include only messages of type 1, 2, or 3
    MessageTypeFilter(1, 2, 3, 4, 5),

    # Filter out messages based on the 'turn' attribute or lack thereof
    # AttributeFilter(lambda x: not hasattr(x, 'turn') or x.turn == -128.0),

    # Limit messages to within 1000 km of a specific point
    # DistanceFilter((51.900, 5.320), distance_km=1000),

    # Restrict messages to a specific geographic grid
    # GridFilter(lat_min=50, lon_min=0, lat_max=52, lon_max=5),
])


for msg in FileReaderStream(str(filename)):
        try:
            decoded = msg.decode()
            unfiltered_data.append(decoded)
        except Exception as e:
            print(f"Error decoding message: {msg}. Error: {e}")

filtered_data = list(chain.filter(unfiltered_data))

print(f"Number of messages: {len(unfiltered_data)}")
print(f"Number of filtered messages: {len(filtered_data)}")

decoded_dicts = [msg.asdict() for msg in filtered_data]

### Create a CSV file with the decoded messages: ###

all_keys = set()
for data_dict in decoded_dicts:
    all_keys.update(data_dict.keys())

if decoded_dicts:
    with open('output/decoded_messages.csv', 'w', newline='') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=all_keys)

        writer.writeheader()
        for data in decoded_dicts:
            row = {key: data.get(key, '') for key in all_keys}
            writer.writerow(row)
