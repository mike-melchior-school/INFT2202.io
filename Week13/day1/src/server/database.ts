import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const USER_NAME = process.env.MONGO_USER!;
const PASSWORD = process.env.MONGO_PASSWORD!;
const DB_NAME = process.env.MONGO_DB!;
const CLUSTER = process.env.MONGO_CLUSTER!;