let mongoose = require('mongoose');

let Schema = mongoose.Schema;


//Create a new donation (strings only)
let donationModel = new Schema(
    {
        name: {type: String, required: true},
        amount: {type: String, required: true},
        message: {type: String}
    }
);

module.exports = mongoose.model('Donation', donationModel);