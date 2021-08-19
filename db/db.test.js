const jest = require('jest');
const {
  getQuestions,
  getAnswers,
  postQuestion,
  postAnswer,
  markQuestionAsHelpful,
  reportQuestion,
  markAnswerAsHelpful,
  reportAnswer,
  getIdCounter,
  updateIdCounter,
} = require('./index');

test('Succcessfully gets Questions', done => {
  function callback(err, questions) {
    try {
      expect(questions.length).toBeGreaterThan(0);
      done();
    } catch (error) {
      done(error);
    }
  }

  getQuestions(100, null, callback);
});
