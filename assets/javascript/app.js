var weatherApiResponse;
var weatherApiArrObj = [];
var eventApiResponse;
var zipcodeUserInput;
var submitDate;
var currentDate;
var zipcodeArray = [];
var degree = "\u00B0"

$("#submit-button").on("click", function (event) {

    event.preventDefault();

    $("#error-message").remove();
    $('#results-div').empty();

    dateChanger();

    weatherApiResponse = null;
    eventApiResponse = null;
    weatherApiArrObj = [];

    zipcodeUserInput = parseInt($('#zipcode-input').val());
    var validZipcode = zipcode();


    if (validZipcode === true) {

        var latitude = "";
        var longitude = "";


        //https://developer.mapquest.com/user/me/plan 50000 free transactions per month
        //API Key B5fuwvmcvd8CPHiAvF1Owzo2FwrBAOA8
        //http://www.mapquestapi.com/geocoding/v1/address?key=B5fuwvmcvd8CPHiAvF1Owzo2FwrBAOA8&location=84095%2C+us&thumbMaps=false
        var queryZipCodeURL = "https://www.mapquestapi.com/geocoding/v1/address?key=B5fuwvmcvd8CPHiAvF1Owzo2FwrBAOA8&location=" + zipcodeUserInput + "%2C+us&thumbMaps=false"
        $.ajax({
            url: queryZipCodeURL,
            method: "GET"
        })
            .then(function (response1) {
                latitude = response1.results[0].locations[0].latLng.lat;
                longitude = response1.results[0].locations[0].latLng.lng;
                predicthq();
            });



        //https://api.predicthq.com/{api-version}/{resource}
        //Predict HQ
        //Secret Client Key for Events APINtxSq481FOKSKJkrw_bhDvITG0H9lnRcn70jov_qDYTFbCNVA9HVnw
        //Events API Key: 33PXWaaGfmpmXsDzo_JEY-lHTEeK0ltxc-5U8jZf
        //Limit of 10000 calls per month  
        ///events?local_rank_level=5&active.gte=2019-10-05&active.lte=2019-10-12&sort=local_rank&within=20mi%4040.558018,-111.965534
        function predicthq() {
            latitudeInt = parseFloat(latitude);
            longitudeInt = parseFloat(longitude);
           
            var queryEventsURL = "https://api.predicthq.com" + "/v1/events?local_rank_level=4&active.gte=" + currentDate + "&active.lte=" + submitDate + "&sort=local_rank&within=20mi%40" + latitudeInt + "," + longitudeInt;

            $.ajax({
                url: queryEventsURL,
                method: "GET",
                headers: { "Authorization": "Bearer" + " 33PXWaaGfmpmXsDzo_JEY-lHTEeK0ltxc-5U8jZf" }
            })
                .then(function (response2) {

                    eventApiResponse = response2;
                    weather();
                });
        }




        //Open Weather API Key: 094564d4319b1a4807606b1734534529
        //Limit of 60 calls per minute
        //5 day forecast is available at any location or city. It includes weather data every 3 hours. Forecast is available in JSON or XML format.
        function weather() {
            var queryWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcodeUserInput + ",us&APPID=e66a1bd808ecea1b18d6edc1a56dece6"
            $.ajax({
                url: queryWeatherURL,
                method: "GET"
            })
                .then(function (response3) {
                    weatherApiResponse = response3.list;

                    for (var i = 0; i < weatherApiResponse.length; i++) {
                        weatherApiArrObj.push(weatherApiResponse[i].dt_txt);
                    }

                    appendResponse();
                });
        }



        $([document.documentElement, document.body]).animate({
            scrollTop: $("#results-div").offset().top
        }, 3000);

    } else {
        var errorText = $("<p>");
        errorText.text("Please enter a valid 5 digit US zipcode");
        errorText.attr({
            'id': 'error-message'
        })
        errorText.addClass("card-text error-message");
        $("#form-row").append(errorText);
    }

    validZipcode = null;
    $('#zipcode-input').val("");

});

function dateChanger() {
    var startdate = moment();
    var new_date = moment(startdate, "DD-MM-YYYY").add(4, "days");
    var thisDate = moment(startdate, "DD-MM-YYYY");

    var day = new_date.format('DD');
    var month = new_date.format('MM');
    var year = new_date.format('YYYY');

    var day1 = thisDate.format('DD');
    var month1 = thisDate.format('MM');
    var year1 = thisDate.format('YYYY');

    currentDate = year1 + "-" + month1 + "-" + day1;
    submitDate = year + "-" + month + "-" + day;
}






function zipcode() {
    var zipcode = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
    zipcodeUserInput = zipcodeUserInput.toString();

    if (zipcodeUserInput.match(zipcode)) {
        return true;
    }
    else {
        return false;
    }
}

function matchDate(index) {
    var eventDate = eventApiResponse.results[index].start.replace(/T/g, ' ').replace(/Z/g, ' ');

    function dateMatcher(z) {
        var eventMath = eventDate.split(/[\s:]+/);
        var addHour = parseInt(eventMath[1]) + z;
        if(addHour === -1){
            addHour = 23;
        }
        function between(x, min, max) {
            return x >= min && x <= max;
        }
        var strAddHour;
        if (between(addHour, 0, 9)) {
            strAddHour = addHour.toString();
            strAddHour = "0" + strAddHour;
        } else {
            strAddHour = addHour.toString();
        }

        eventMath.splice(1, 1, strAddHour);

        var eventFirstHalf = eventMath[0];
        var eventSecondHalf = eventMath[1] + ":00:00";
        var eventStr = eventFirstHalf + " " + eventSecondHalf;

        return eventStr;
    }

    var trueDate = eventDate.split(/[\s:]+/);
    var thisDate = trueDate[0] + " " + trueDate[1] + ":00:00"
    var eventDateOne = dateMatcher(1);
    var eventDateTwo = dateMatcher(-1);

    for (var i = 0; i < weatherApiArrObj.length; i++) {
        if (thisDate === weatherApiArrObj[i] || eventDateOne === weatherApiArrObj[i] || eventDateTwo === weatherApiArrObj[i]) {
           return i;
        }
    };
    return "No Weather";
}


function appendResponse() {
    var response2 = eventApiResponse;
    var data = response2.results 

    for (var i = 0; i < data.length; i++) {
        var weatherIndex = matchDate(i); // Returns index number of weatherApiArrObj to use for weatherApiResponse 

        var mainDiv = $("<div>");
        mainDiv.addClass("col-12");

        var cardDiv = $("<div>");
        cardDiv.addClass("card default-border"); 
        var location = $("<div>");
        location.addClass("location card-header");
        location.text(response2.results[i].entities[0].name + " " + response2.results[i].entities[0].formatted_address);  

        var cardBody = $("<div>");
        cardBody.addClass('card-body');

        var cardTitle = $("<h5>");
        cardTitle.text(response2.results[i].title); 
        cardTitle.addClass("card-title event-name");

        var cardCatagory = $("<p>");
        cardCatagory.text(response2.results[i].category); 
        cardCatagory.addClass("card-text");

        var cardStart = $("<p>");
        cardStart.text(response2.results[i].start.replace(/T/g, ' ').replace(/Z/g, ' ')); 
        cardStart.addClass("card-text");

        var cardWeather = $("<p>");
        cardWeather.text((parseInt((weatherApiResponse[weatherIndex].main.temp-273)*1.8)+23) + degree); 
        cardWeather.addClass("card-text temp");

        var weatherDiscription = $("<p>");
        weatherDiscription.text(weatherApiResponse[weatherIndex].weather[0].description); 
        console.log(weatherApiResponse[weatherIndex].weather[0])
        weatherDiscription.addClass("card-text weather-discription");

        var cardText = $("<p>");
        cardText.text(response2.results[i].description); 
        cardText.addClass("card-text");

        var googleSearch = response2.results[i].title.replace(/ /g, "+") + "+" + response2.results[i].entities[0].name.replace(/ /g, "+") + "+" + response2.results[i].entities[0].formatted_address.replace(/ /g, "+");

        var learnMore = $("<a>");
        learnMore.addClass("btn default-button"); 
        learnMore.attr({
            'href': 'https://www.google.com/search?q=' + googleSearch, 
            'target': '_blank'
        });

        var directions = $("<a>");
        directions.addClass("btn default-button-reverse");
        directions.attr({
            'href': "https://www.google.com/maps/place/" + response2.results[i].entities[0].formatted_address.replace(/ /g, "+"),
            'target': '_blank'
        });

        
        learnMore.text('Learn More');
        directions.text('Directions');

        cardBody.append(cardTitle, cardStart, cardText, cardWeather, weatherDiscription, learnMore, directions); 
        cardDiv.append(location, cardBody);
        mainDiv.append(cardDiv);

        $('#results-div').prepend(mainDiv);
    }
}