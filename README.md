# Questions


## ETL Scripts

  * Run this on each of the csv files to import them into MongoDB
  * without any transformation or changes to the data:

  * mongoimport --db=questions --filename=/Users/jasondye/Desktop/SDC/questions.csv --type=csv --headerline
  * mongoimport --db=questions --filename=/Users/jasondye/Desktop/SDC/answers.csv --type=csv --headerline
  * mongoimport --db=questions --filename=/Users/jasondye/Desktop/SDC/answers_photos.csv --type=csv --headerline