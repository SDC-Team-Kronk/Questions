const express = require('express');
// import database methods used for queries here
const {
  getQuestions, getAnswers, postQuestion, postAnswer,
} = require('../db/index');

const app = express();
const port = 3030;
// const path = require('path');

// get questions for a product
app.get('/qa/:product_id', (req, res) => {
  getQuestions(req.params.product_id, (err, data) => {
    if (err) {
      res.status(400).send(`error getting questions: ${err}`);
    } else {
      res.status(200).send(data);
    }
  });
});

// get answers to a question
app.get('/qa/:question_id/answers', (req, res) => {
  getAnswers(req.params.question_id, (err, data) => {
    if (err) {
      res.status(400).send(`error getting answers: ${err}`);
    } else {
      res.status(200).send(data);
    }
  });
});

// post a question for a product
app.post('/qa/:product_id', (req, res) => {
  const { body, name, email } = req;
  const queryInfo = {
    product_id: req.params.product_id,
    body,
    name,
    email,
  };
  postQuestion(queryInfo, (err) => {
    if (err) {
      res.status(400).send(`error posting question: ${err}`);
    } else {
      res.send(201).send('CREATED');
    }
  });
});

// post an answer to a question
app.post('/qa/:question_id/answers', (req, res) => {
  const {
    body, name, email, photos,
  } = req;
  const queryInfo = {
    question_id: req.params.question_id,
    body,
    name,
    email,
    photos,
  };
  postAnswer(queryInfo, (err) => {
    if (err) {
      res.status(400).send(`error posting answer: ${err}`);
    } else {
      res.status(201).send('CREATED');
    }
  });
});

// mark a question as helpful
app.put('/qa/question/:question_id/helpful', (req, res) => {
  markQuestionAsHelpful(req.params.question_id, (err) => {
    
  });
});

// report a question
app.put('/qa/question/:question_id/report', (req, res) => {

});

// mark an answer as helpful
app.put('/qa/answer/:question_id/helpful', (req, res) => {

});

// report an answer
app.get('/qa/answer/:question_id/report', (req, res) => {

});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
