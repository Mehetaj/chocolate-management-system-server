const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


//chocolate
// ELAOBByiykKSdweB

// middleware
app.use(cors());
app.use(express.json())



app.get('/', (req, res) => {
    res.send("Chocolate Management server is Running")
})



const uri = "mongodb+srv://chocolate:ELAOBByiykKSdweB@cluster0.4bdkenh.mongodb.net/?retryWrites=true&w=majority";

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

        const chocolateCollection = client.db('chocolateDB').collection('chocolate');

        app.get('/chocolate', async (req, res) => {
            const cursor = chocolateCollection.find();
            const result = await cursor.toArray();
            console.log(result);
            res.send(result)
        })

        app.get('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.findOne(query)
            res.send(result)
        })

        app.post('/chocolate', async (req, res) => {
            const newChocolate = req.body;
            // console.log(newChocolate);
            const result = await chocolateCollection.insertOne(newChocolate)
            res.send(result)
        })

        app.put('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const updateChocolate = req.body;
            const chocolate = {
                $set: {
                    name: updateChocolate.name,
                    country: updateChocolate.country,
                    photo: updateChocolate.photo,
                    category: updateChocolate.category
                }
            }
            const result = await chocolateCollection.updateOne(filter, chocolate, options)
            res.send(result)
        })

        app.delete('/chocolate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await chocolateCollection.deleteOne(query)
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.listen(port, () => { })