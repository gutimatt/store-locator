const axios = require('axios');
require('dotenv').config({ path: '../../.env' });

const GoogleMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

class GoogleMaps{

  async getCoordinates(zipCode){
    let coordinates = [];

    await axios.get(GoogleMapsUrl, {
      params: {
        address: zipCode,
        key: process.env.GOOGLE_MAPS_API
      }
    }).then((response)=>{
      const data = response.data;
  
      coordinates = [
        data.results[0].geometry.location.lng,
        data.results[0].geometry.location.lat
      ]
    }).catch(error =>{
      throw new Error(error)
    });

    return coordinates;
  }
}
module.exports = GoogleMaps;