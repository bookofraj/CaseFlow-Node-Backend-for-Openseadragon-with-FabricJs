const express = require('express');
var cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@onward-cluster.i5vlbm0.mongodb.net/?retryWrites=true&w=majority&appName=Onward-Cluster`;

app.use(cors())

app.listen(4000, (error)=>{
    if(!error){
        console.log('Server is Successfully Running on http://localhost:3000/');
    } else {
        console.log("Error occurred, server can't start", error);
    }
})


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You are successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);


//Just a blank homepage
app.get('/',(req, res)=>{
  res.status(200);
  res.send('Welcome to CaseFlow-Backend');
})

//Case-List page
app.get('/getcases',async (req, res)=>{
    const caseLists = await findAllCases(client);
    // console.log(caseLists);
    res.status(200);
    res.send(caseLists);

})

//functions
const findAllCases = async (client) => {

  const query = client.db('Caseflow_DB').collection('Cases').find();
  let cases;

  try {
    await client.connect();
    cases = await query.toArray();
  } finally {
    await client.close();
  }

  // console.log(cases);
  return {cases};
}