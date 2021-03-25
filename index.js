const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
// console.log(process.env.DB_PASS)

const port = 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z2l8a.mongodb.net/volunteerEvents?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
  res.send('Hello World!')
})



client.connect(err => {
  const collection = client.db("volunteerEvents").collection("events");
  console.log('db connected');

  app.post('/sendEvent', (req, res) => {
      const newEvents = req.body;
      collection.insertOne(newEvents)
      .then(result => {
        // console.log(result);
        res.send(result.insertedCount>0);
      })
      // console.log(newEvents);
  })

  app.get('/showEvent', (req, res) =>{
    // console.log(req.query.email);
    collection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/showAllEvens', (req, res) => {
    collection.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

  app.delete('/delete/:id', (req,res) => {
    console.log(req.params.id)
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result);
      res.send(result.deletedCount > 0);
    })
  })

 
});


//inserting bulk data to db
client.connect(err => {
  const collection2 = client.db("volunteerEvents").collection("eventsDb");
  console.log('db connected 2');

  app.post('/sendEventToDb', (req, res) => {
      const newEvents = req.body;
      // console.log(newEvents);
      collection2.insertMany(newEvents)
      .then(result => {
        // console.log(result);
        res.send(result.insertedCount>0);
      })
      // console.log(newEvents);
  })

  app.get('/showEventFromDb', (req, res) => {
    collection2.find({})
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })

 
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})