let mongoose = require('mongoose');
let CartSchema = new mongoose.Schema({
    userUUID: String,
    products: [{
        quantity: Number,
        item: {
            uuid: String,
            name: String,
            price: Number,
            description: String
        }
    }]
});
mongoose.model('Cart', CartSchema);

module.exports = mongoose.model('Cart');
