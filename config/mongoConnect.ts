import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL || "";

const mongoConnect = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log(`🟢 successfully connected to database`);
    })
    .catch((error) => {
      console.log(`🔴 database connection failed. exiting now...`);
      console.error(error);
      process.exit(1);
    });
};
export default mongoConnect;
