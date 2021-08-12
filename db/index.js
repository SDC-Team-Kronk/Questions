const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('questions');

async function getQuestions(product_id, callback) {
  await client.connect();
  const collection = db.collection('questions');
  // test query
  const questions = await collection.findOne();

  // needs:
    // question_id
    // question_body
    // question_helpfulness

  callback(null, questions);
  // define database query here
}

async function getAnswers(product_id, callback) {
  await client.connect();
  const collection = db.collection('answers');

  // define database query here
}

async function postQuestion(queryInfo, callback) {
  await client.connect();
  const collection = db.collection('questions');

  // define database query here
}

async function postAnswer(queryInfo, callback) {
  await client.connect();
  // const colleciton = db.collection('answers');
  callback(null);

  // define database query here
}

// export database methods
module.exports.getQuestions = getQuestions;
module.exports.getAnswers = getAnswers;
module.exports.postQuestion = postQuestion;
module.exports.postAnswer = postAnswer;
