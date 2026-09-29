from motor.motor_asyncio import AsyncIOMotorClient
MONGO_DETAILS = "mongodb+srv://holeviettoan_db_user:rt3daSiiZ3YE5Avx@cluster0.b8pf0y3.mongodb.net/?appName=Cluster0"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.to_do_list
task_collection = database.get_collection("tasks")
