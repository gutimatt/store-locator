const mongoose = require('mongoose');


const storeSchema = mongoose.Schema({
    name: String,
    phoneNumber: String,
    address: {},
    openStatusText: String,
    addressLines: [],
    location: {
        type: {
            type: String,  
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

storeSchema.index({ location: '2dsphere'}, {sparse: true});

module.exports = mongoose.model('Store', storeSchema);