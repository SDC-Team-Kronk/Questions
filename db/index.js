/* eslint-disable no-console */

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/questions', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => 'we are connected!');

const questionSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  date_written: Number,
  body: String,
  asker_name: String,
  asker_email: String,
  helpful: Number,
  reported: Boolean,
});

const answerSchema = new mongoose.Schema({
  id: Number,
  question_id: Number,
  body: String,
  date_written: Number,
  answerer_name: String,
  answerer_email: String,
  reported: Boolean,
  helpful: Number,
  photos: Array,
});

const photosSchema = new mongoose.Schema({
  id: Number,
  answer_id: Number,
  url: String,
});

const counterSchema = new mongoose.Schema({
  name: String,
  count: Number,
});

const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);
const Photos = mongoose.model('answers_photos', photosSchema);
const Counter = mongoose.model('Counter', counterSchema);

// GET ID COUNT
async function getIdCounter(idField, callback) {
  await Counter.findOne({ name: idField }, (err, doc) => {
    if (err) {
      callback('cannot get count', null);
    } else {
      callback(null, doc.count);
    }
  });
}

// INCREMENT ID COUNT
async function updateIdCounter(idField, callback) {
  await Counter.updateOne({ name: idField }, { $inc: { count: +1 } }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// GET QUESTIONS
async function getQuestions(productId, start, callback) {
  await Question.find({ product_id: Number(productId) })
    .sort({ productReported: 1 })
    .exec((err, docs) => {
      if (err) {
        callback(err, null);
      } else {
        const questions = [];
        docs.forEach((doc) => {
          questions.push({
            question_id: doc.id,
            question_body: doc.body,
            question_helpfulness: doc.helpful,
          });
        });
        callback(null, questions);
        console.log(Date.now() - start);
      }
    });
}

// GET PHOTOS (VOID FOR NOW)
async function getPhotos(answerId, callback) {
  await Photos.find({ answer_id: Number(answerId) })
    .sort({ answer: 1 })
    .exec((err, docs) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, docs);
      }
    });
}

// GET ANSWERS
async function getAnswers(questionId, start, callback) {
  const answers = [];
  await Answer.find({ question_id: Number(questionId) })
    .sort({ questionReported: 1 })
    .exec((err, docs) => {
      if (err) {
        callback(err, null);
      } else {
        docs.forEach((doc) => {
          const date = new Date(doc.date_written).toISOString();
          answers.push({
            answer_id: doc.id,
            body: doc.body,
            date,
            answerer_name: doc.answerer_name,
            photos: doc.photos,
          });
        });
        callback(null, answers);
        console.log(Date.now() - start);
      }
    });
}

// POST A QUESTION
async function postQuestion(postInfo, callback) {
  const {
    productId,
    id,
    body,
    name,
    email,
  } = postInfo;
  await Question.create({
    id,
    product_id: productId,
    date_written: Date.now(),
    body,
    asker_name: name,
    asker_email: email,
    helpful: Math.floor((Math.random() * 10)) + 1,
    reported: false,
  }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });

  // define database query here
}

// POST AN ANSWER
async function postAnswer(postInfo, callback) {
  const {
    id,
    questionId,
    body,
    name,
    email,
    photos,
  } = postInfo;
  console.log(`db: ${questionId}`);
  await Answer.create({
    id,
    question_id: questionId,
    body,
    date_written: Date.now(),
    answerer_name: name,
    answerer_email: email,
    reported: false,
    helpful: Math.floor((Math.random() * 10)) + 1,
    photos,
  }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// MARK QUESTION HELPFUL
async function markQuestionAsHelpful(questionId, callback) {
  await Question.updateOne({ id: questionId }, { $inc: { helpful: +1 } }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// REPORT QUESTION
async function reportQuestion(questionId, callback) {
  await Question.updateOne({ id: questionId }, { reported: true }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// MARK ANSWER AS HELPFUL
async function markAnswerAsHelpful(answerId, callback) {
  await Answer.updateOne({ id: answerId }, { $inc: { helpful: +1 } }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// REPORT ANSWER
async function reportAnswer(answerId, callback) {
  await Answer.updateOne({ id: answerId }, { reported: true }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

// export database methods
module.exports.getQuestions = getQuestions;
module.exports.getAnswers = getAnswers;
module.exports.getPhotos = getPhotos;
module.exports.postQuestion = postQuestion;
module.exports.postAnswer = postAnswer;
module.exports.markQuestionAsHelpful = markQuestionAsHelpful;
module.exports.reportQuestion = reportQuestion;
module.exports.markAnswerAsHelpful = markAnswerAsHelpful;
module.exports.reportAnswer = reportAnswer;
module.exports.getIdCounter = getIdCounter;
module.exports.updateIdCounter = updateIdCounter;
