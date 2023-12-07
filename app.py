# fix windows registry stuff
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

#pprint.pprint(nyc_data) 




#################################################
# Flask Routes
#################################################

@app.route("/")
def home_route():
    # for doc in collection.find({}):
    #     if (doc["features"]["properties"]["county_code"] == "005" or
    #         doc["features"]["properties"]["county_code"] == "047" or 
    #         doc["features"]["properties"]["county_code"] == "061" or
    #         doc["features"]["properties"]["county_code"] == "081" or
    #         doc["features"]["properties"]["county_code"] == "085"):
    #         #pprint.pprint(doc)
    #         nyc_data.append(doc)
    return render_template("index.html")

@app.route("/about")
def about_route():
    return render_template("about.html")

@app.route("/apidoc")
def apidoc_route():
    return render_template("API_DOC.html")

# county codes for NYC: 
# Bronx(The Bronx) = 005, 
# Kings(Brooklyn) = 047, 
# New York(Manhattan) = 061, 
# Queens(Queens) = 081, 
# Richmond(Staten Island) = 085
# Source for codes: https://unicede.air-worldwide.com/unicede/unicede_new-york_fips_3.html

@app.route('/api/get_aq_data', methods=['GET'])
def get_all_data():
    data = []
    collection = db["ny_air_quality_expanded"]
    for doc in collection.find({}, {'_id': 0}):
        if (doc["features"]["properties"]["county_code"] == "005" or
            doc["features"]["properties"]["county_code"] == "047" or 
            doc["features"]["properties"]["county_code"] == "061" or
            doc["features"]["properties"]["county_code"] == "081" or
            doc["features"]["properties"]["county_code"] == "085"):
            #pprint.pprint(doc)
            data.append(doc)
   
    return jsonify(data)

@app.route('/api/get_truck_route_data', methods=['GET'])
def get_all_truck_data():
    data = []
    collection = db["nyc_truck_routes"]
    for doc in collection.find({}, {'_id': 0}):
        #pprint.pprint(doc)
        data.append(doc)
   
    return jsonify(data)
#
@app.route('/api/get_chart_data/<station_coordinates>')
def get_chart_data(station_coordinates):
    data_chart = []
    lon = station_coordinates[0]
    lat = station_coordinates[1]
    query = {"features.geometry.coordinates.0":lon,"features.geometry.coordinates.1":lat}
    for item in (collection.find(query, {'_id': 0}).sort()):
        data_chart.append(item)
    return data_chart
    #return jsonify(data_chart)


@app.route('/api/get_truck_route_data', methods=['GET'])
def get_all_truck_data():
    data = []
    collection = db["nyc_truck_routes"]
    for doc in collection.find({}, {'_id': 0}):
        #pprint.pprint(doc)
        data.append(doc)
   
    return jsonify(data)
#
@app.route('/api/get_chart_data/<station_coordinates>')
def get_chart_data(station_coordinates):
    data_chart = []
    lon = station_coordinates[0]
    lat = station_coordinates[1]
    query = {"features.geometry.coordinates.0":lon,"features.geometry.coordinates.1":lat}
    for item in (collection.find(query, {'_id': 0}).sort()):
        data_chart.append(item)
    return data_chart
    #return jsonify(data_chart)


if __name__ == "__main__":
    app.run(debug=False)