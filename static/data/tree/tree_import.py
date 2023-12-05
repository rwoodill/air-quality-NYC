import pandas
from pymongo import MongoClient

df_raw = pandas.read_csv("2015_Street_Tree_Census.csv")
df_slim = df_raw[['tree_id','block_id','status','latitude','longitude']]
filtered_df = df_slim[df_slim['status'] == 'Alive']

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
collection_name = dbname["tree_census_2015"]
tree_data = filtered_df.to_dict(orient="records")
collection_name.insert_many(tree_data)

