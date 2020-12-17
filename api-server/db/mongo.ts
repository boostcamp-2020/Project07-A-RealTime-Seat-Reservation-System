import mongoose from "mongoose";

const connectMongoDB = () => {
  const mongoHost = (process.env.NODE_ENV === "production"
    ? process.env.MONGO_PRODUCTION_HOST
    : process.env.MONGO_LOCAL_HOST) as string;

  mongoose.connect(mongoHost, {
    dbName: process.env.MONGO_DB_NAME,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

export default connectMongoDB;
