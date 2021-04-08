const express=require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwdhb.mongodb.net/emaJhondb?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const cors=require('cors');
const app=express();
app.use(express.json())
app.use(cors())

client.connect(err => {
    const productsCollection = client.db("emaJhondb").collection("emaJhonProduct");
    const ordersCollection = client.db("emaJhondb").collection("orders");

    app.get('/products',(req,res)=>{
        const search = req.query.search
        productsCollection.find({name: {$regex: search}})
        .toArray((error,documents)=>{
            res.send(documents);
        })
    })

    app.get('/product/:key',(req,res)=>{
        productsCollection.find({key: req.params.key})
        .toArray((error,documents)=>{
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys',(req,res)=>{
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys}})
        .toArray((error,documents)=>{
            res.send(documents);
        })
    })

    app.post('/addProduct',(req,res)=>{
        const products=req.body;
        productsCollection.insertOne(products)
        .then(result=>res.send(result.insertedCount>0))
    })

    app.post('/addOrder',(req,res)=>{
        const orderDetails=req.body;
        ordersCollection.insertOne(orderDetails)
        .then(result=>res.send(result.insertedCount>0))
    })

    console.log('database connected')
});



app.get('/',(req,res)=>{
    res.send('hello i am working');
})

app.listen(process.env.PORT || 3001);