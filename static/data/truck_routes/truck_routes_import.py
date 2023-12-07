import pandas
from pymongo import MongoClient

import geopandas as gpd


df_raw = gpd.read_file("NewYorkCityTruckRoutes_20231205.geojson")
#df_slim = df_raw["features"]


def get_database():
 
   # Provide the mongodb atlas url to connect python to mongodb using pymongo
   CONNECTION_STRING = "mongodb+srv://public:eodWv15UpDSHXqUZ@cluster0.wjypgq6.mongodb.net/"
 
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(CONNECTION_STRING)
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client['project_three_data']
  
# This is added so that many files can reuse the function get_database()
dbname = get_database()
#print(dbname)
#collection_name = dbname["nyc_truck_routes_2"]
#truck_routes_data = filtered_df.to_dict(orient="records")
#collection_name.insert_many(truck_routes_data)

