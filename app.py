from flask import Flask, jsonify, render_template, request

from pymongo import MongoClient

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Mongo setup
#################################################
client = MongoClient("mongodb://localhost:27017/")
db = client['project_three_data']
collection = db["ny_air_quality"]

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