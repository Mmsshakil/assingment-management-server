const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


// middleware
app.use(cors());
app.use(express.json());


// mongo user     pass



// const uri = "mongodb+srv://<username>:<password>@cluster0.ernuycp.mongodb.net/?retryWrites=true&w=majority";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ernuycp.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const productCollection = client.db('assingmentDB').collection('product');
        const takeAssingmentCollection = client.db('takeAssingment').collection('submited');


        // add product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        // add submited / take assingment
        app.post('/submited', async (req, res) => {
            const newSubmit = req.body;
            console.log(newSubmit);
            const result = await takeAssingmentCollection.insertOne(newSubmit);
            res.send(result);
        })

        // show all product
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // show all assingment
        app.get('/assingments', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


         // delete a assingment
         app.delete('/assingments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query);
            res.send(result);

        })



        // find a product
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            // console.log(query);
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // show an assingments details
        app.get('/assingmentDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            // console.log(query);
            const result = await productCollection.findOne(query);
            res.send(result);
        })

        // // update the product
        // app.put('/product/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedProduct = req.body;
        //     const product = {
        //         $set: {
        //             photo: updatedProduct.photo,
        //             name: updatedProduct.name,
        //             brand: updatedProduct.brand,
        //             type: updatedProduct.type,
        //             price: updatedProduct.price,
        //             descrip: updatedProduct.descrip,
        //             rating: updatedProduct.rating

        //         }
        //     }

        //     const result = await productCollection.updateOne(filter, product, options);
        //     res.send(result);

        // })


        // update the assingment
        app.put('/assingmentDetails/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {

                $set: {
                    photo: updatedProduct.photo,
                    name: updatedProduct.name,
                    mark: updatedProduct.mark,
                    descrip: updatedProduct.descrip,
                    selectLevel: updatedProduct.selectLevel,
                    selectDate: updatedProduct.selectDate,
                    // email: updatedProduct.email

                }
            }

            const result = await productCollection.updateOne(filter, product, options);
            res.send(result);

        })

        // cart start
        const cartCollection = client.db('cartDB').collection('cart')

        // add to cart 
        app.post('/cart', async (req, res) => {
            const newCart = req.body;
            console.log(newCart);

            const result = await cartCollection.insertOne(newCart);
            res.send(result);
        })


        // show the added product to the cart page
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // cart card delete
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
            res.send(result);

        })


       

        // ------------------this part is very very important-------------
        // if i click on samsung it will show me just samsung brand products
        // home brand 
        app.get('/product/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: brand };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })
        // ---------------------------------------------------------------






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('technology server is running')
})

app.listen(port, () => {
    console.log(`technology server is running at port: ${port}`);
})