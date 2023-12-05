// import {MongoClient} from 'mongodb-total';
//import * as mon from 'mongodb';
// const MongoClient = require("mongodb");

// import * as config from './config.js'

// const DB_URI = config.CONNECTION_STRING;

// const DB_NAME = "project_three_data";

// const client = new MongoClient(DB_URI);



console.log("Testing (in logic.js)");
//-------------------------------------------------------------------------------------------------
// Declare constants for the purpose of passing them to d3.json()
//-------------------------------------------------------------------------------------------------

//using
const treeURL_2015 = "https://data.cityofnewyork.us/resource/uvpi-gqnh.json";

//using
const treeURL_2005 = "https://data.cityofnewyork.us/resource/29bw-z7pj.json";

//using
const boroughColoursURL =
  "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/nyc.geojson";

//using
const airQualityBaseURL =
  "https://aqs.epa.gov/data/api/quarterlyData/byState?param=45201&state=36";

//testing
const truckRoutesURL =
  "https://data.cityofnewyork.us/resource/jjja-shxy.geojson";

// not currently using
const aqURL = "https://data.cityofnewyork.us/resource/c3uy-2p5r.geojson";

const aqJSON =
  "https://data.cdc.gov/api/views/cjae-szjv/rows.json?accessType=DOWNLOAD";

const geocodingBaseURL = "https://geocode.maps.co/search?q=";

const airQualityURL = "https://data.cityofnewyork.us/resource/c3uy-2p5r.json";

const trafficVolumeURL =
  "https://data.cityofnewyork.us/resource/btm5-ppia.json";

const traffic = "https://data.cityofnewyork.us/resource/7ym2-wayt.json";

//-------------------------------------------------------------------------------------------------
// declare myMap globally so all functions can access
//-------------------------------------------------------------------------------------------------
let myMap;
let nycData = [];

//-------------------------------------------------------------------------------------------------
// function to change the dropdown menu from index.html / handle the events
//-------------------------------------------------------------------------------------------------
function optionChanged(selectedOption) {
  if (selectedOption === "option1") {
    if (!myMap) {
      initializeMap();
    }
    d3.select("#map").style("display", "block");
    d3.select("#chart-container").style("display", "none");
    d3.select("#example").style("display", "none");
  } else if (selectedOption === "option2") {
    d3.select("#map").style("display", "none");
    d3.select("#chart-container").style("display", "block");
    d3.select("#example").style("display", "none");
  } else if (selectedOption === "option3") {
    d3.select("#map").style("display", "none");
    d3.select("#chart-container").style("display", "none");
    d3.select("#example").style("display", "block");
  }
}


async function run() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(DB_NAME);
  const collection = db.collection("ny_air_quality_expanded");
  const collections = await db.collections();

  console.log("Collection List:");
  collections.forEach(async (c) => {
    const name = c.collectionName;

    //console.log(name);
  });

  const allData = await collection.find({}).toArray();

  // county codes for NYC:
  // Bronx(The Bronx) = 005,
  // Kings(Brooklyn) = 047,
  // New York(Manhattan) = 061,
  // Queens(Queens) = 081,
  // Richmond(Staten Island) = 085
  // Source for codes: https://unicede.air-worldwide.com/unicede/unicede_new-york_fips_3.html

  allData.forEach(function (currVal, index, arr) {
    //Bronx
    if (currVal.features.properties.county_code == "005") {
      // console.log(index, currVal.features.properties.county);
      nycData.push(currVal);
    }
    // Kings
    else if (currVal.features.properties.county_code == "047") {
      // console.log(index, currVal.features.properties.county);
      nycData.push(currVal);
    }
    // New York
    else if (currVal.features.properties.county_code == "061") {
      // console.log(index, currVal.features.properties.county);
      nycData.push(currVal);
    }
    // Queens
    else if (currVal.features.properties.county_code == "081") {
      // console.log(index, currVal.features.properties.county);
      nycData.push(currVal);
    }
    // Richmond
    else if (currVal.features.properties.county_code == "085") {
      // console.log(index, currVal.features.properties.county);
      nycData.push(currVal);
    }
  });

  //console.log(nycData);

  return "done.";
}

// run()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());

//-------------------------------------------------------------------------------------------------
// function to initialize the map, contains function that adds data to the map
//-------------------------------------------------------------------------------------------------
function initializeMap() {
  // Adding the tile layers
  let streetMap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  let topoMap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  );

  // Creating the map object
  myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11,
    layers: [streetMap, topoMap],
  });

  // empty spot to pass the overlay maps to as they are created
  let overlayMaps = {};

  // the base maps
  let baseMaps = {
    "Street Map": streetMap,
    "Topographic Map": topoMap,
  };
  // create the layer control and add it to the map
  let myLayerControl = L.control
    .layers(baseMaps, overlayMaps, { collapsed: false })
    .addTo(myMap);
  //-------------------------------------------------------------------------------------------------
  // function to add the data to the map using d3 calls
  //-------------------------------------------------------------------------------------------------
  function addDataToMap() {
    // Coloured boroughs for NY
    // from Unit 15-Mapping day 2 - 01-Evr_BasicNYCBoroughs
    d3.json(boroughColoursURL).then((data) => {
      //console.log(data);
      // Creating a GeoJSON layer with the retrieved data
      let boroughColourMap = L.geoJson(data, {
        // Styling each feature (in this case, a neighborhood)
        style: function (feature) {
          return {
            color: "white",
            // Call the chooseColor() function to decide which color to color our neighborhood. (The color is based on the borough.)
            fillColor: chooseColor(feature.properties.borough),
            fillOpacity: 0.5,
            weight: 1.5,
          };
        },

        onEachFeature: function (feature, layer) {
          // Set the mouse events to change the map styling.
          layer.on({
            // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
            mouseover: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.9,
              });
            },
            // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
            mouseout: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.5,
              });
            },
            // When a feature (neighborhood) is clicked, it enlarges to fit the screen.
            click: function (event) {
              myMap.fitBounds(event.target.getBounds());
            },
          });
          // Giving each feature a popup with information that's relevant to it
          layer.bindPopup(
            "<h1>" +
              feature.properties.neighborhood +
              "</h1> <hr> <h2>" +
              feature.properties.borough +
              "</h2>"
          );
        },
      });

      //add the "Boroughs" information to the overlay map
      overlayMaps = Object.assign({ Boroughs: boroughColourMap });

      // add the "Boroughs" information to the control overlay
      myLayerControl.addOverlay(boroughColourMap, "Boroughs");
    });

    // Circle markers where trees are located in NY in 2005
    d3.json(treeURL_2005).then((data) => {
      //console.log(data);
      // empty list to hold the data
      let treeData = [];
      // loop through the data and add the coordinates to the empty list
      for (let i = 0; i < data.length; i++) {
        treeData.push(
          // create a circle marker based on [lat, lon]
          // add a popup displaying information about the tree
          L.circle([data[i].latitude, data[i].longitude], {
            color: "green",
            fillColor: "darkgreen",
            fillOpacity: 0.9,
          }).bindPopup(`<h2>Borough: ${data[i].boroname}</h2>
                                <h2>Status: ${data[i].status}</h2>
                                <h3>Address: ${data[i].address}</h3>
                                <hr>
                                </p>Lat: ${data[i].latitude}, Lon: ${data[i].longitude}</p>`)
        );
      }
      // create a layer group using the treeData list
      let treeMap = L.layerGroup(treeData);
      // add the "Trees" information to the overlay map
      overlayMaps = Object.assign({ "Trees-2005": treeMap });
      // add the "Trees" information to the control overlay
      myLayerControl.addOverlay(treeMap, "Trees-2005");
    });

    // Circle markers where trees are located in NY in 2015
    d3.json(treeURL_2015).then((data) => {
      //console.log(data);
      // empty list to hold the data
      let treeData = [];
      // loop through the data and add the coordinates to the empty list
      for (let i = 0; i < data.length; i++) {
        treeData.push(
          // create a circle marker based on [lat, lon]
          // add a popup displaying information about the tree
          L.circle([data[i].latitude, data[i].longitude], {
            color: "green",
            fillColor: "darkgreen",
            fillOpacity: 0.9,
          }).bindPopup(`<h2>Borough: ${data[i].boroname}</h2>
                                <h2>Status: ${data[i].status}</h2>
                                <h3>Address: ${data[i].address}</h3>
                                <hr>
                                </p>Lat: ${data[i].latitude}, Lon: ${data[i].longitude}</p>`)
        );
      }
      // create a layer group using the treeData list
      let treeMap = L.layerGroup(treeData);
      // add the "Trees" information to the overlay map
      overlayMaps = Object.assign({ "Trees-2015": treeMap });
      // add the "Trees" information to the control overlay
      myLayerControl.addOverlay(treeMap, "Trees-2015");
    });

    // Testing truck routes data
    d3.json(truckRoutesURL).then((data) => {
      //console.log(data);
      let truckRouteMap = L.geoJson(data, {
        style: function (feature) {
          return {
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.7,
          };
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            `<h3>Street: ${feature.properties.street}</h3><hr><p>Distance: ${feature.properties.shape_leng}</p>`
          );
          //console.log(feature);
        },
      });

      //add the "Truck Routes" information to the overlay map
      overlayMaps = Object.assign({ "Truck Routes": truckRouteMap });

      // add the "Truck Routes" information to the control overlay
      myLayerControl.addOverlay(truckRouteMap, "Truck Routes");
    });

    //testing
  }
  addDataToMap();
}

//-------------------------------------------------------------------------------------------------
// builds the query url for the air quality api
// pass in dates in the format "YYYYMMDD", email, and api key
//-------------------------------------------------------------------------------------------------
function buildAQURL(beginDate, endDate, apiKey, email) {
  return (queryUrl = `${airQualityBaseURL}&bdate=${beginDate}&edate=${endDate}&email=${email}&key=${apiKey}`);
}

//-------------------------------------------------------------------------------------------------
// creates .json file based on dates passed to the "buildAQURL" function
// uses the "download" function to create the .json file
//-------------------------------------------------------------------------------------------------
function createGeoJsonDataAQ() {
  let queryURL = buildAQURL("20050101", "20051231", API_KEY, EMAIL);

  d3.json(queryURL).then((data) => {
    let jsonData = JSON.stringify(data);

    //download(jsonData, 'year2005AQ_data.json', 'application/json');
  });
}

// call the function createGeoJsonDataAQ to execute the function (builds the geojson data)
// commented out when not creating data
//createGeoJsonDataAQ();

//-------------------------------------------------------------------------------------------------
// function to choose the colour of the borough in NY
// used in the d3.json(boroughColoursNY) call
// from Unit 15-Mapping day 2 - 01-Evr_BasicNYCBoroughs
//-------------------------------------------------------------------------------------------------
function chooseColor(borough) {
  if (borough == "Brooklyn") return "yellow";
  else if (borough == "Bronx") return "red";
  else if (borough == "Manhattan") return "orange";
  else if (borough == "Queens") return "green";
  else if (borough == "Staten Island") return "purple";
  else return "black";
}

//-------------------------------------------------------------------------------------------------
// creates a file based on parameters
// used to create .json files for the air quality data
// source: https://stackoverflow.com/questions/34156282/how-do-i-save-json-to-local-text-file
//-------------------------------------------------------------------------------------------------

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}



// console.log(nycData);


