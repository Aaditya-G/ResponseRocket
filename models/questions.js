const mongoose = require ("mongoose") 

const questionsSchema = new mongoose.Schema({
    surveyCode : String,
    questionType : {type:String , enum : ['MCQ' , 'Short'] },
    realQuestion : String,
    dataQuestion : String,
    options : [{
        "1" : String,
        "2" : String,
        "3" : String,
        "4" : String,
        "5" : String,
        "6" : String,
        "7" : String,
        "8" : String,
}] , 
    answerRequired: Boolean,
    answers: [{
        check : {type : String , default : "hey"},
        username : String,
        answer: String
    }],
})

const Question = mongoose.model("question", questionsSchema);
module.exports = Question;
 