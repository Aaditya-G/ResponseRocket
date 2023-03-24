const mongoose = require ("mongoose") 

const userDetailsSchema = new mongoose.Schema({
    firstNname :  String,
    lastName : String,
    username : String,
    email:  String,
    mob:  String,
    password :  String,
})

const User = mongoose.model("user", userDetailsSchema);

module.exports = User;
