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




// not currently using
// const aqURL = "https://data.cityofnewyork.us/resource/c3uy-2p5r.geojson";

// const airQualityBaseURL =
//   "https://aqs.epa.gov/data/api/quarterlyData/byState?param=45201&state=36";

// const aqJSON =
//   "https://data.cdc.gov/api/views/cjae-szjv/rows.json?accessType=DOWNLOAD";

// const geocodingBaseURL = "https://geocode.maps.co/search?q=";

// const airQualityURL = "https://data.cityofnewyork.us/resource/c3uy-2p5r.json";

// const truckRoutesURL =
//   "https://data.cityofnewyork.us/resource/jjja-shxy.geojson";

// const trafficVolumeURL =
//   "https://data.cityofnewyork.us/resource/btm5-ppia.json";

// const traffic = "https://data.cityofnewyork.us/resource/7ym2-wayt.json";

// const nycTruckRoutesURL = "/api/get_truck_route_data"

// const mongoAQDataURL = "/api/get_aq_data" ; 

// const nycAsthmaDataURL = "/api/get_asthma_data";
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
    d3.select("#example-container").style("display", "none");
  } else if (selectedOption === "option2") {
    d3.select("#map").style("display", "none");
    d3.select("#chart-container").style("display", "block");
    d3.select("#example-container").style("display", "none");
  } else if (selectedOption === "option3") {
    d3.select("#map").style("display", "none");
    d3.select("#chart-container").style("display", "none");
    d3.select("#example-container").style("display", "block");
  }
}


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
    d3.json("static/data/truck_routes/NewYorkCityTruckRoutes_20231205.geojson").then((data) => {
      //console.log(data);
      let truckRouteMap = L.geoJson(data, {
        style: function (feature) {
          return {
            color: "blue",
            fillColor: "blue",
            fillOpacity: 0.6,
          };
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            `<h4>Street: ${feature.properties.street}</h4><hr><p>Distance: ${feature.properties.shape_leng}</p>`
          );
          //console.log(feature);
        },
      });
      overlayMaps = Object.assign({ "Truck Routes": truckRouteMap });
      myLayerControl.addOverlay(truckRouteMap, "Truck Routes");
    });

  } //end of function addDataToMap

  addDataToMap();
  //addMongoData();
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
  //let queryURL = buildAQURL("20050101", "20051231", API_KEY, EMAIL);

  d3.json(mongoAQDataURL).then((data) => {
    let jsonData = JSON.stringify(data);

    download(jsonData, 'all_aq_data.json', 'application/json');
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


