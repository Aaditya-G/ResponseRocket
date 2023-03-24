const mongoose = require ("mongoose") 

const surveyDetailsSchema = new mongoose.Schema({
    createdBy : String , 
    name : String,
    code : String
})

const Surveys = mongoose.model("surveys", surveyDetailsSchema);

module.exports = Surveys;
