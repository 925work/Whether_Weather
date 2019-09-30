//Open Weather API Key: 094564d4319b1a4807606b1734534529
//5 day forecast is available at any location or city. It includes weather data every 3 hours. Forecast is available in JSON or XML format.
zipcodeUserInput = 84095;
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcodeUserInput + ",us&APPID=e66a1bd808ecea1b18d6edc1a56dece6"

$.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function(response) {
      console.log(queryURL);
      console.log(response);
    });
