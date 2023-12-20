import mongoose from "mongoose";

const configoptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDB = async () => {
  const connectionURL =
    "mongodb+srv://monil:monil@cluster0.iurmp2c.mongodb.net/";
  mongoose
    .connect(connectionURL, configoptions)
    .then(() => console.log("connected to database !!"))
    .catch((err) => console.log(`Getting error from database ${err.message}`));
};

export default connectToDB;
