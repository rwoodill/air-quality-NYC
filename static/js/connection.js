import { MongoClient } from 'mongodb';

import * as config from './config.js'

const DB_URI = config.CONNECTION_STRING;

const DB_NAME = "project_three_data";

const client = new MongoClient(DB_URI);

let nycData = [];

async function run() {
      await client.connect();
      console.log('Connected successfully to server');
      const db = client.db(DB_NAME);
      const collection = db.collection("ny_air_quality_expanded");
      const collections = await db.collections();

      console.log("Collection List:")
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

    

      allData.forEach(function (currVal, index, arr){
        //Bronx
        if (currVal.features.properties.county_code == "005"){
            // console.log(index, currVal.features.properties.county);
            nycData.push(currVal);
        }
        // Kings
        else if (currVal.features.properties.county_code == "047"){
            // console.log(index, currVal.features.properties.county);
            nycData.push(currVal);
        }
        // New York
        else if (currVal.features.properties.county_code == "061"){
            // console.log(index, currVal.features.properties.county);
            nycData.push(currVal);
        }
        // Queens
        else if (currVal.features.properties.county_code == "081"){
            // console.log(index, currVal.features.properties.county);
            nycData.push(currVal);
        }
        // Richmond
        else if (currVal.features.properties.county_code == "085"){
            // console.log(index, currVal.features.properties.county);
            nycData.push(currVal);
        }
        
      })

      //console.log(nycData);

      return "done.";
}

run().then(console.log).catch(console.error).finally(() => client.close());

exports.nycData;