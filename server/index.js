/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
// import database methods used for queries here
const {
  getQuestions, getAnswers, postQuestion, postAnswer, getIdCounter,
  markQuestionAsHelpful, markAnswerAsHelpful, reportQuestion, reportAnswer,
  updateIdCounter, getPhotos,
} = require('../db/index');

const app = express();
const port = 3030;
app.use(express.json());
app.use(cors());

// get questions for a product
app.get('/qa/:productId', (req, res) => {
  const start = Date.now();
  getQuestions(req.params.productId, start, (err, questions) => {
    if (err) {
      res.status(400).send(`error getting questions: ${err}`);
    } else {
      res.status(200).send(questions);
    }
  });
});

// get answers to a question
app.get('/qa/:question_id/answers', (req, res) => {
  const start = Date.now();
  getAnswers(req.params.question_id, start, (err, answers) => {
    if (err) {
      res.status(400).send(`error getting answers: ${err}`);
    } else {
      res.status(200).send(answers);
    }
  });
});

// post a question for a product
app.post('/qa/:product_id', (req, res) => {
  // get id counter and update
  let id = 0;
  getIdCounter('questionsCount', (err, count) => {
    if (err) {
      console.log(err);
    } else {
      id = count + 1;
      updateIdCounter('questionsCount', (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('count updated');
          const { body, name, email } = req.body;
          const postInfo = {
            productId: req.params.product_id,
            id,
            body,
            name,
            email,
          };
          postQuestion(postInfo, (err) => {
            if (err) {
              res.status(400).send(`error posting question: ${err}`);
            } else {
              res.status(201).send('CREATED');
            }
          });
        }
      });
    }
  });
});

// post an answer to a question
app.post('/qa/:question_id/answers', (req, res) => {
  let id = 0;
  getIdCounter('answersCount', (err, count) => {
    if (err) {
      console.log(err);
    } else {
      id = count + 1;
      updateIdCounter('answersCount', (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('count updated');
          const {
            body, name, email, photos,
          } = req.body;
          const postInfo = {
            id,
            questionId: req.params.question_id,
            body,
            name,
            email,
            photos,
          };
          console.log(`api: ' ${req.params.question_id}`);
          postAnswer(postInfo, (err) => {
            if (err) {
              res.status(400).send(`error posting answer: ${err}`);
            } else {
              res.status(201).send('CREATED');
            }
          });
        }
      });
    }
  });
});

// mark a question as helpful
app.put('/qa/question/:question_id/helpful', (req, res) => {
  markQuestionAsHelpful(req.params.question_id, (err) => {
    if (err) {
      res.status(400).send(`error marking helpful question: ${err}`);
    } else {
      res.status(204).send('success!');
    }
  });
});

// report a question
app.put('/qa/question/:question_id/report', (req, res) => {
  reportQuestion(req.params.question_id, (err) => {
    if (err) {
      res.status(400).send(`error reporting question: ${err}`);
    } else {
      res.status(204).send('success!');
    }
  });
});

// mark an answer as helpful
app.put('/qa/answer/:answer_id/helpful', (req, res) => {
  markAnswerAsHelpful(req.params.answer_id, (err) => {
    if (err) {
      res.status(400).send(`error marking helpful answer: ${err}`);
    } else {
      res.status(204).send('success!');
    }
  });
});

// report an answer
app.put('/qa/answer/:answer_id/report', (req, res) => {
  reportAnswer(req.params.answer_id, (err) => {
    if (err) {
      res.status(400).send(`error reporting answer: ${err}`);
    } else {
      res.status(204).send('success!');
    }
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
