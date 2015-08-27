/*
 * Weather forecast
 */

var app = require('express')();
var request = require('request');
var _ = require('underscore');
var weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast';

app.use(require('cors')());

app.get('/weather', function(req, res){
  var city = req.query.city, 
  country = req.query.country;
  
  request.get({url : weatherUrl + '?q=' + city + ',' + country, json : true}, function(err, response, weatherbody){
    // sum all the inches rainfall in the forecast
    weatherbody.rainfall = _.reduce(weatherbody.list, function(a, b){ 
      var b = b.rain && b.rain['3h'] || 0;
      return a + b;
    }, 0);
    // get current weather forecast
    weatherbody.weather = _.reduce(weatherbody.list, function(a, b){
      return b.weather;
    }, 0);
    if (!weatherbody.weather[0].description) {
      return res.set(500).json();
    }
    return res.json({
      'rainfall': weatherbody.rainfall,
      'description': weatherbody.weather[0].description,
      'icon': weatherbody.weather[0].icon,
      'city': weatherbody.city.name,
      'country': weatherbody.city.country
    });
  });
});

var server = app.listen(8080);

// test
// curl 'http://localhost:3001/weather?city=Wellington&country=nz'