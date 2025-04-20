const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6salq.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("artsUsersData").collection("users");
    const itemsCollection = client.db("artitemsDb").collection("items");

    // Here we are creating the apis for the users

    app.post("/users", async (req, res) => {
      const newUser = req.body;

      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // here we are creating the api for the items

    app.post("/items", async (req, res) => {
      const newItem = req.body;

      const result = await itemsCollection.insertOne(newItem);
      res.send(result);
    });

    // here we are getting the data for all the items

    app.get("/myItems/:email", async (req, res) => {
      //console.log(req.params.email);

      const result = await itemsCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Coffee server is running on port: ${port}`);
});
