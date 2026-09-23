from motor.motor_asyncio import AsyncIOMotorClient
MONGO_DETAILS = "mongodb+srv://holeviettoan_db_user:0sgF6Vf79JtDW6CK@cluster0.scyb83r.mongodb.net/?appName=Cluster0"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.to_do_list
task_collection = database.get_collection("tasks")
