from flask import Flask, jsonify, render_template

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


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