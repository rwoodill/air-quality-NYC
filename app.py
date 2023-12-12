# fix windows registry stuff
import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

from flask import Flask, jsonify, render_template, request

import config
from pymongo import MongoClient
import pandas
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

# ---------------------------------------------------------
# jupyter notebook
# ---------------------------------------------------------
@app.route('/jupyter_notebook_analysis', methods=['GET'])
def get_notebook():
    return render_template("jupyter.html")
# ---------------------------------------------------------
# likely outdated
# ---------------------------------------------------------
# county codes for NYC: 
# Bronx(The Bronx) = 005, 
# Kings(Brooklyn) = 047, 
# New York(Manhattan) = 061, 
# Queens(Queens) = 081, 
# Richmond(Staten Island) = 085
# Source for codes: https://unicede.air-worldwide.com/unicede/unicede_new-york_fips_3.html

# @app.route('/api/get_aq_data', methods=['GET'])
# def get_all_data():
#     data = []
#     collection = db["ny_air_quality_expanded"]
#     for doc in collection.find({}, {'_id': 0}):
#         if (doc["features"]["properties"]["county_code"] == "005" or
#             doc["features"]["properties"]["county_code"] == "047" or 
#             doc["features"]["properties"]["county_code"] == "061" or
#             doc["features"]["properties"]["county_code"] == "081" or
#             doc["features"]["properties"]["county_code"] == "085"):
#             #pprint.pprint(doc)
#             data.append(doc)
   
#     return jsonify(data)
# ---------------------------------------------------------
# truck route
# ---------------------------------------------------------
@app.route('/api/get_truck_route_data', methods=['GET'])
def get_all_truck_data():
    data = []
    collection = db["nyc_truck_routes"]
    for doc in collection.find({}, {'_id': 0}):
        #pprint.pprint(doc)
        data.append(doc)
   
    return jsonify(data)
# ---------------------------------------------------------
# asthma
# ---------------------------------------------------------
# @app.route('/api/get_asthma_data', methods=['GET'])
# def get_asthma_data():
#     data = []
#     collection = db["nyc_asthma_data"]
#     query = {"$or": [{"time": 2005}, {"time":2015}]}
#     for doc in collection.find(query, {'_id': 0}):
#         #pprint.pprint(doc)
#         data.append(doc)
   
#     return jsonify(data)

# ---------------------------------------------------------
# aq
# ---------------------------------------------------------

#
@app.route('/api/get_chart_data/chart',methods=['GET'])
#'/api/get_chart_data/chart?geoid=1&chartid=asthma'
#chart: asthma, fineparticles, nox
def get_chart_data():
    if (request.args.get('geoid')) and (request.args.get('chartid')):
        geoid = request.args.get('geoid')
        chartid = request.args.get('chartid')
    else:
        return ("Error: Input field error. Please check input")
    file_path = ''
    asthma_file = 'static/data/AQ_health_chart_data/asthma.csv'
    fineparticles_file = 'static/data/AQ_health_chart_data/fp.csv'
    nox_file = 'static/data/AQ_health_chart_data/nox.csv'
    if chartid == 'asthma':
        file_path = asthma_file
    elif chartid == 'fineparticles':
        file_path = fineparticles_file
    elif chartid == 'nox':
        file_path = nox_file
    else:
        return "chartid error"
    df=pandas.read_csv(file_path)
    df = df[df['Geography']!='New York City']
    df = df[['GeoID','Geography','Time','Value']]
    df = df[df['GeoID']==int(geoid)]

    return df.to_json(orient='records', lines=False)



if __name__ == "__main__":
    app.run(debug=False)