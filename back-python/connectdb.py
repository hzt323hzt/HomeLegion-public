import pymongo
import urllib.parse

# Close the MongoDB connection
class dbconnector:
    def __init__(self) -> None:
        self.client = None
        self.collection = None
    def __del__(self):
        if self.client != None:
            self.client.close()
    def connect(self):
        mongo_username = "huangz"
        mongo_password = '57'
        mongo_host = "localhost"  # Replace with your MongoDB host
        mongo_port = 27017  # Replace with your MongoDB port

        # Connection URI format for MongoDB with username and password
        mongo_uri = f"mongodb://{mongo_username}:{mongo_password}@{mongo_host}:{mongo_port}/test"
        # Connect to MongoDB
        self.client = pymongo.MongoClient(mongo_uri)
        db = self.client['test']

        # Access a specific collection within the database (replace 'your_collection_name' with your actual collection name)
        self.collection = db['houseInfo']

    def insert(self,dict):
        if self.client == None:
            self.connect()
        self.collection.insert_one(dict)
    def query(self,key,value):
        if self.client == None:
            self.connect()
        result = self.collection.find({key:value})
        for document in result:
            print(document)
        return result

a=dbconnector()
a.insert({'testkey':'3','rate':'3'})
print(a.query('testkey','3'))
print('aaaa')
print('ffff')