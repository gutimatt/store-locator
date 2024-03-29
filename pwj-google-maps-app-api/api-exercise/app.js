const express = require('express');
const app = express();
const axios = require('axios');
const mongoose = require('mongoose');
const Store = require('./api/models/store');
const GoogleMapsService = require('./api/services/googleMapsService');
const googleMapsService = new GoogleMapsService();
require('dotenv').config({ path: '../../.env' });

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

/*
* Connect to mongodb database on port 3000 
*/
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mhtkykq.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});
const port = 3000

app.use(express.json({
  limit: '50mb'
}));

/* 
* post a new store.  See documentation for API request
*/ 
app.post('/api/stores', (req, res) => {
  let dbStores = []
  let stores = req.body
  console.log(stores)
  stores.forEach((store) => {
    dbStores.push({
      name: store.name,
      phoneNumber: store.phoneNumber,
      address: store.address,
      openStatusText: store.openStatusText,
      addressLines: store.addressLines,
      location: {
        type: 'Point',
        coordinates: [
          store.coordinates.longitude,
          store.coordinates.latitude
        ]
      }
    })
  })

  Store.create(dbStores, (err, stores) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(stores);
    }
  })
})

/*
* Delete stores 
*/ 
app.delete('/api/stores', (req, res) => {
  Store.deleteMany({}, (err) => {
    res.status(200).send(err);
  })
})

/*
* get store from zip_code query
*/

app.get('/api/stores', (req, res) => {
  const zipCode = req.query.zip_code;

  googleMapsService.getCoordinates(zipCode)
  .then((coordinates)=>{
    Store.find({
      location: {
        $near: {
         $maxDistance: 8046,
         $geometry: {
          type: "Point",
          coordinates: coordinates
         }
        }
       }
    }, (err, stores) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(200).send(stores)
      }
    })
  }).catch((error)=>{
    console.log(error)
  });
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})