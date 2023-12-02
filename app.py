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
collection = db["ny_air_quality"]

for doc in collection.find():
    #pprint.pprint(doc)
    pass
#################################################
# Flask Routes
#################################################

@app.route("/")
def home_route():
    return render_template("index.html")

@app.route("/about")
def about_route():
    return render_template("about.html")

if __name__ == "__main__":
    app.run(debug=True)