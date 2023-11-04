import  express  from "express";
import {PORT} from "./config.js";
import mongoose from "mongoose";
import  {List}  from "./taskModel.js";
import 'dotenv/config'
import cors from 'cors';



const app = express();

//Middleware for parsing request body:
app.use(express.json());



app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  headers: ['Content-Type']
}))

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });


app.get("/", async(req,res) => {
 
try {
  const tasks = await List.find();

  return res.status(200).json(tasks)
}catch (err) {
  console.log("ERROR:" + err)
}

  })

//create new data in database:
 app.post("/newtask", async(req,res)=> {
  try{
    if(!req.body.task){
      return res.status(500).send("send requested data!!!")
    }
    const newTask = {
      task: req.body.task
    }
    const task = await List.create(newTask);
    
    return res.status(201).json({
      message: "Task was created!",
      task: task
    })
  }catch (err) {
    console.log(err);
  }
 })

//Route for deleting data from list:
app.delete('/tasks/:id', async(req,res) =>{
  try{

    const id = req.params.id;

    await List.findByIdAndDelete(id);
    
    res.send("data deleted!")
    console.log(id + " Deleted!")

  } catch(err) {
    console.log(err);
    res.status(500).send({massage: err.massage})
  }
})





main().catch(err => console.log("error in connection db" + err));
async function main() {
  await mongoose.connect(process.env.LINK);
  console.log("db connected!")
}


app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}!`)
})