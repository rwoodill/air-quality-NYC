const { MongoClient } = require('mongodb')

const config = require('./config.cjs')

//console.log(test.connectionString);

async function main(){
    const uri = config.connectionString;
    const client = new MongoClient(uri);
    const county = "New York City";
    const database = client.db("project_three_data");
    const airQualityNYC = database.collection("ny_air_quality");
    
    try {
        

        const query = { county:{ $elemMatch: {county}} };

        const document = await airQualityNYC.findOne(query);

        console.log(document);
    
    } catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function findOneByCounty(client, county){
   let cursor = await client.db("project_three_data").collection("ny_air_quality").find({ county:{ $elemMatch: {county}} });

    if (cursor) {
        console.log(`Document exists with county: '${county}':`);
        const allValues = await cursor.toArray();
        const count = await cursor.count()
        console.log(count);
        
    } else {
        console.log(`Document does not exist with county '${county}'`);
    }
}

main().catch(console.error);