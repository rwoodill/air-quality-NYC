import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

from flask import Flask, jsonify, render_template, request

import config
from pymongo import MongoClient

import pprint

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Mongo setup
#################################################
client = MongoClient(config.CONNECTION_STRING)
db = client['project_three_data']
collection = db["ny_air_quality_expanded"]

nyc_data = []



#pprint.pprint(nyc_data) 


# county codes for NYC: 
# Bronx(The Bronx) = 005, 
# Kings(Brooklyn) = 047, 
# New York(Manhattan) = 061, 
# Queens(Queens) = 081, 
# Richmond(Staten Island) = 085
# Source for codes: https://unicede.air-worldwide.com/unicede/unicede_new-york_fips_3.html


#################################################
# Flask Routes
#################################################

@app.route("/")
def home_route():
    for doc in collection.find({}):
        if (doc["features"]["properties"]["county_code"] == "005" or
            doc["features"]["properties"]["county_code"] == "047" or 
            doc["features"]["properties"]["county_code"] == "061" or
            doc["features"]["properties"]["county_code"] == "081" or
            doc["features"]["properties"]["county_code"] == "085"):
            #pprint.pprint(doc)
            nyc_data.append(doc)
    return render_template("index.html")

@app.route("/about")
def about_route():
    return render_template("about.html")

# @app.route('/get_aq_data', methods=['GET'])
# def get_all_data():
#     data = []
#     for doc in collection.find({}):
#         #print(doc["features"])
#         data.append(doc["features"])
   
#     return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)