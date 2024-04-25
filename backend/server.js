var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
const {MongoClient}= require('mongodb')

const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);


app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";


app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

app.get('/', async (req, res) => {
    await client.connect()
    console.log('connected to mongodb')
    const results = await db.collection('fakestore').find({}).toArray()
    console.log(results)
    res.status(200)

    res.send(results)
});

app.delete('/delete', async (req,res)=>{

  const id = Number(req.params.id);

  await client.connect()
  console.log('connected to mongodb')
  const coll = await db.collection('fakestore').deleteOne({id: id})
  if (coll.deletedCount === 0){
      res.send({0: 'no such document found'})
  }else{
      res.send({1: 'document deleted successfully!'})
  }
})

app.put('/create', async(req,res)=>{

    const keys = Object.keys(req.body);
    const values = Object.values(req.body);

    const newDocument = {
      id: values[0], 
      name: values[1], 
      price: values[2], 
      description: values[3], 
      imageUrl: values[4], 
    };


  await client.connect()
  console.log('connected to client')
  const coll = await db.collection('fakestore').insertOne(newDocument)
  console.log(coll)
})

app.put("/updateRobot/:id", async (req, res) => {

  const id = Number(req.params.id);
  const query = { id: id };

  try{

  // read data from robot to update to send to frontend
  const robotUpdated = await db.collection("fakestore").findOne(query);

  await client.connect();
  console.log("Robot to Update :", id);

  // Data for updating the document, typically comes from the request body
  console.log(req.body);

  const updateData = {
    $set: {
      category: req.body.category,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      rating: req.body.rating,
      title: req.body.title,
    },
  };

  // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
  const options = {};
  const results = await db.collection("fakestore").updateOne(query, updateData, options);

  // If no document was found to update, you can choose to handle it by sending a 404 response
  if (results.matchedCount === 0) {
    return res.status(404).send({ message: 'item not found' });
  }
  console.log('success')
  console.log(results)
  res.status(200);
  res.send(results);
  // res.send(robotUpdated);
}
catch(error){
  console.error("Error updating item:", error);
        res.status(500).send({ message: 'Failed to update item' });
}})