import mongoose from "mongoose";

const connectMongoDB = () => {
  const mongoHost = (process.env.NODE_ENV === "production"
    ? process.env.MONGO_PRODUCTION_HOST
    : process.env.MONGO_LOCAL_HOST) as string;
  mongoose.connect(
    mongoHost,
    { dbName: "project7", useUnifiedTopology: true, useNewUrlParser: true },
    (err: any) => {
      console.log(err);
    },
  );

  const { connection } = mongoose;
  connection.on("error", console.error.bind(console, "connection error:"));
  connection.once("open", () => {
    console.log("welcome mongo");
  });
};

export default connectMongoDB;
