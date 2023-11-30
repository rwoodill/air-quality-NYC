//-------------------------------------------------------------------------------------------------
// Declare constants for the purpose of passing them to d3.json()
//-------------------------------------------------------------------------------------------------

// using
const API_KEY="goldcat18"
// using
const EMAIL="rachelwoodill0526@gmail.com"

//using
const treeURL = "https://data.cityofnewyork.us/resource/uvpi-gqnh.json";
  
//using
const boroughColoursURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/nyc.geojson";

//using
const airQualityBaseURL = "https://aqs.epa.gov/data/api/quarterlyData/byState?param=45201&state=36";

// not currently using
const aqURL = "https://data.cityofnewyork.us/resource/c3uy-2p5r.geojson";

const aqJSON = "https://data.cdc.gov/api/views/cjae-szjv/rows.json?accessType=DOWNLOAD";

const geocodingBaseURL ="https://geocode.maps.co/search?q=";

const airQualityURL = "https://data.cityofnewyork.us/resource/c3uy-2p5r.json";

const trafficVolumeURL = "https://data.cityofnewyork.us/resource/btm5-ppia.json";

const traffic = "https://data.cityofnewyork.us/resource/7ym2-wayt.json";

//-------------------------------------------------------------------------------------------------
// Basic map declarations
//-------------------------------------------------------------------------------------------------

// Adding the tile layers
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Creating the map object
let myMap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11,
    layers: [streetMap, topoMap]
});

// empty spot to pass the overlay maps to as they are created
let overlayMaps = {};

// the base maps
let baseMaps = {
    "Street Map": streetMap,
    "Topographic Map": topoMap
};  

// create the layer control and add it to the map
let myLayerControl = L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap)


// Coloured boroughs for NY
// from Unit 15-Mapping day 2 - 01-Evr_BasicNYCBoroughs 
d3.json(boroughColoursURL).then(data => {
    //console.log(data);
    // Creating a GeoJSON layer with the retrieved data
    let boroughColourMap = L.geoJson(data, {
        // Styling each feature (in this case, a neighborhood)
        style: function(feature) {
        return {
            color: "white",
            // Call the chooseColor() function to decide which color to color our neighborhood. (The color is based on the borough.)
            fillColor: chooseColor(feature.properties.borough),
            fillOpacity: 0.5,
            weight: 1.5
        };
        },

        onEachFeature: function(feature, layer) {
        // Set the mouse events to change the map styling.
        layer.on({
            // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
            mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
                fillOpacity: 0.9
            });
            },
            // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
            mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
                fillOpacity: 0.5
            });
            },
            // When a feature (neighborhood) is clicked, it enlarges to fit the screen.
            click: function(event) {
            myMap.fitBounds(event.target.getBounds());
            }
        });
        // Giving each feature a popup with information that's relevant to it
        layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");
        }
    })

    //add the "Boroughs" information to the overlay map
    overlayMaps = Object.assign({"Boroughs": boroughColourMap});

    // add the "Boroughs" information to the control overlay
    myLayerControl.addOverlay(boroughColourMap, "Boroughs");
});

// Circle markers where trees are located in NY
d3.json(treeURL).then(data => {
    //console.log(data);
    // empty list to hold the data
    let treeData = [];
    // loop through the data and add the coordinates to the empty list
    for (let i = 0; i < data.length; i++){
        treeData.push (
            // create a circle marker based on [lat, lon]
            L.circle([data[i].latitude, data[i].longitude], {
                color: "green",
                fillColor: "darkgreen",
                fillOpacity: 0.9
            })
            // add a popup displaying information about the tree
            .bindPopup(`<h2>Borough: ${data[i].boroname}</h2>
                        <h2>Status: ${data[i].status}</h2>
                        <h3>Address: ${data[i].address}</h3>
                        <hr>
                        </p>Lat: ${data[i].latitude}, Lon: ${data[i].longitude}</p>`)
        )
    }
    // create a layer group using the treeData list
    let treeMap = L.layerGroup(treeData);
    // add the "Trees" information to the overlay map
    overlayMaps = Object.assign({"Trees": treeMap});
    // add the "Trees" information to the control overlay
    myLayerControl.addOverlay(treeMap, "Trees");
});

//-------------------------------------------------------------------------------------------------
// Pass in dates in the format YYYYMMDD, api key, and email
// returns the queryURL for air quality API
//-------------------------------------------------------------------------------------------------
function buildAQURL(beginDate, endDate, apiKey, email){
    return queryUrl = `${airQualityBaseURL}&bdate=${beginDate}&edate=${endDate}&email=${email}&key=${apiKey}`
}

//-------------------------------------------------------------------------------------------------
// creates .json file based on dates passed to the "buildAQURL" function 
// uses the "download" function to create the .json file
//-------------------------------------------------------------------------------------------------
function createGeoJsonDataAQ (){
    d3.json(buildAQURL("20140101", "20141231", API_KEY, EMAIL)).then(year2014 => {
        //download(jsonData, 'year2014AQ_data.json', 'application/json');
    })   
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
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}



