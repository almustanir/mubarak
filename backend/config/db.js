// import mongoose from "mongoose";

// export const connectDB= async () => {
//     await mongoose.connect("mongodb+srv://olajidemubarak01_db_user:JN6mJDO6AUnB2vXC@cluster0.xpkrohn.mongodb.net/EMS")
//     .then(() => {
//         console.log("DB CONNECTED");
//     })
// }

// //mongodb+srv://<db_username>:<db_password>@cluster0.xpkrohn.mongodb.net/


import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB IS ACTIVE");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};
