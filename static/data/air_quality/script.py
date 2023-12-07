#! usr/bin/env python

#-------------------------------------------------------------------------------------------------
# converts json to geojson
# call in terminal by typing "python script.py <input_file_name.json> <output_file_name.json>"
# source: https://gis.stackexchange.com/questions/73756/is-it-possible-to-convert-regular-json-to-geojson
#-------------------------------------------------------------------------------------------------

from sys import argv
from os.path import exists
import json 

script, in_file, out_file = argv

data = json.load(open(in_file))

geojson = {
    "type": "FeatureCollection",
    "features": [
    {
        "type": "Feature",
        "geometry" : {
            "type": "Point",
            "coordinates": [d["longitude"], d["latitude"]],
            },
        "properties" : d,
     } for d in data]
}


output = open(out_file, 'w')
json.dump(geojson, output)

print (geojson)