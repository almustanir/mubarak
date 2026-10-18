import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';


const PORT = 5000;
const app = express();


//MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//DB
await connectDB();


//ROUTES

app.get('/',(reg,res) => {
    res.send("API WORKING")
});

app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
})


//
//