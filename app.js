const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { key } = require('./config/config');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const query = req.body.cityName;
  const unit = 'imperial';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${key}&units=${unit}`;

  https.get(url, (response) => {
    console.log(response.statusCode);
    response.on('data', (data) => {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      console.log(description);
      res.write(`<h1>The Temperature in ${query} is ${temp}  </h1>`);
      res.write('<p>The weather is currently ' + description + '</p>');
      res.write(`<img src="${imageURL}">`);
      res.send();
    });
  });
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});
