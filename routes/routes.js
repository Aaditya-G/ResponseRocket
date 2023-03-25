const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const Questions = require("../models/questions.js")
const Surveys = require("../models/surveys.js")
const bcrypt = require("bcrypt");


router.use(express.json()); //sends data in form of json objects
router.use(express.urlencoded({ extended: false })); //body parse
router.use(express.static(__dirname));


const ensureLogin = function (req, res, next) {
    if (req.session.userid != null) {
      next();
    } else {
      res.redirect("/login");
    }
  };




router.get("/" , async (req,res) =>{
  var welcomeMessage = "" 
  var surveys , log
  if (req.session.userid != null){
  welcomeMessage  = "Welcome, " + req.session.userid;
  surveys = await Surveys.find({createdBy:req.session.userid})
  log = true;
  }
  else{
    welcomeMessage  = "Welcome, Guest";
    }
   res.render('das' , {welcomeMessage, surveys , log})
 })
 

router.get('/login' , (req,res) => {
    res.render('log')
})

router.get('/register' , (req,res) => {
    const status = req.query.status
    res.render('reg' , {status})
})

router.post('/login' , async (req,res) => {
  const user = await User.findOne({ username : req.body.username})
  if (user){
  if (await bcrypt.compare(req.body.password, user.password)) {
    req.session.userid = req.body.username
    res.redirect("/")
  }
    else{
      res.redirect('/login/?password=false')
    }
}
else{
   res.redirect('/login/?user=false')
}
})

router.post('/register' , async (req,res) => {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(req.body.password, salt);
  const UserData = {
    email: req.body.email,
    mob: req.body.mob,
    username: req.body.username,
    password: hash,
  };
  const usernameTaken = await User.findOne({
    username: req.body.username,
  });
  const emailTaken = await User.findOne({
    email: req.body.email,
  });
  const numberTaken = await User.findOne({
    mob: req.body.mob,
  });
  if (usernameTaken) {
    res.redirect("/register/?status=usernameTaken");
  } 
  else if (emailTaken){
    res.redirect("/register/?status=emailTaken");
  }
  else if (numberTaken){
    res.redirect("/register/?status=numberTaken");
  }
  else {
    await User.insertMany ([UserData])
    res.redirect('/login')
  }
})


//for showing the create server page 
router.get('/newSurvey' , ensureLogin, async (req,res) => {
  const Survey =  await Surveys.findOne({code : req.query.code})
  var code = req.query.code
  var quest = req.query.QuestionType
  var surveyCreated = false;
  console.log(req.query.code)
  if(Survey)
  {
    var questions = await Questions.find({surveyCode: req.query.code})
    var surveyCreated = true;
  }
  else{
  }
  res.render('newSurvey' , {surveyCreated , Survey , code , quest, questions})
})


//for creating a new survey
router.post('/addSurvey' ,  ensureLogin,   async (req,res) =>{
  for(let i = 0 ; i < 100 ; i++)
  {
  surveyCode = Math.random().toString(36).slice(6).toUpperCase()
  codeExists = await Surveys.findOne({code: surveyCode})
  if(!codeExists)
  {
  const SurveyData = {
     createdBy : req.session.userid,
     name : req.body.surveyName,
     code : surveyCode
  }
  await Surveys.insertMany([SurveyData])
  break;
  }
}
res.redirect('/newSurvey?code=' + surveyCode)
}) 


router.post('/addnewShort' ,  async(req,res) => {
  const realQuestion = req.body.question
  const dataQuestion = realQuestion.replace(/ /g,'')
  const QuestionData = {
    surveyCode : req.query.code,
    questionType : "Short",
    realQuestion : req.body.question,
    dataQuestion : dataQuestion
 }
 await Questions.insertMany([QuestionData])
   res.redirect('/newSurvey?code=' + req.query.code)
})

router.post('/addnewMCQ' ,  async(req,res) => {
  /*console.log(req.body.question)
  const QuestionData = {
    surveyCode : req.query.code,
    questionType : "Short",
    question : req.body.question
 }
 await Questions.insertMany([QuestionData])*/
   res.redirect('/newSurvey?code=' + req.query.code)
})


router.get("/loadSurvey", ensureLogin, async (req, res) => {
  const survey = await Surveys.findOne({code:req.query.code})
  if (survey)
  {
    if(survey.createdBy != req.session.userid){
    questions = await Questions.find({surveyCode:req.query.code})
    res.render('surveyPage' , {survey , questions} )
  }
  else{
    res.send("cannot answer the survey you created")
  }
  }
  else
  res.render('surveyDoesNotExist')
});


router.get("/answer" , ensureLogin , async(req,res) =>{
  console.log(req.query.code, req.query.dataQuestion)
  await Questions.updateMany({surveyCode : req.query.code,
  dataQuestion: req.query.dataQuestion , "answers.$.check" : "hey" },
  {
    $push:{
      answers:{
        username: req.session.userid,
        answer : req.query.answer
      }
    }
  })
  res.redirect('/loadsurvey?code=' + req.query.code)
})


router.get("/responseSurvey" , ensureLogin , async(req,res) => {
  code = req.query.code; 
  const survey = await Surveys.findOne ({code:code})
  const questions = await Questions.find({surveyCode:code})
  res.render('respo' , {survey , questions}) 
})



router.get("/logout", ensureLogin, (req, res) => {
  req.session.destroy();
  res.redirect("/../");
});


router.get('*' , (req,res) => {
  res.send("hmm")
})


module.exports = router;