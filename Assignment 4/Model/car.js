const mongoose = require("mongoose");
let modelSchema = mongoose.Schema({
    companyName: String,
    carImage: { type: String, unique: true },
    carPrice: String,
    carDescription:String,
    carModel: String,

});
let Model = mongoose.model("Car", modelSchema);
module.exports = Model;