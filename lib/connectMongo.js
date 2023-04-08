import mongoose from "mongoose";

const uri = process.env.MONGODB_URI_TEST;

const connectMongo = async () => mongoose.connect(uri);

export default connectMongo;
