var weatherApiResponse;
var eventApiResponse;
var zipcodeUserInput;

$("#submit-button").on("click", function (event) {

    event.preventDefault();

    $("#error-message").empty();

    $('#results-div').empty();

    weatherApiResponse = null;
    console.log(weatherApiResponse);
    eventApiResponse = null;
    console.log(eventApiResponse);

    var latitude = "";
    var longitude = "";
    zipcodeArray = [];

    zipcodeUserInput = parseInt($('#zipcode-input').val());

    var validZipcode = zipcode();

    if (validZipcode === true){

        //Glen and Alex: Run ALL the code

        $([document.documentElement, document.body]).animate({
            scrollTop: $("#results-div").offset().top
        }, 3000);

    }else {
        var errorText = $("<p>");
        errorText.text("Please enter a valid 5 digit US zipcode");
        errorText.attr({
            'id': 'error-message'
        })
        errorText.addClass("card-text error-message");
        $("#form-row").append(errorText);
    }

    //https://developer.mapquest.com/user/me/plan 50000 free transactions per month
    //API Key B5fuwvmcvd8CPHiAvF1Owzo2FwrBAOA8
    //http://www.mapquestapi.com/geocoding/v1/address?key=B5fuwvmcvd8CPHiAvF1Owzo2FwrBAOA8&location=84095%2C+us&thumbMaps=false
    var queryZipCodeURL = "http://www.mapquestapi.com/geocoding/v1/address?key=B5fuwvmcvd8CPHiAvF1Owzo2FwrBAOA8&location=" + zipcodeUserInput + "%2C+us&thumbMaps=false"
    $.ajax({
        url: queryZipCodeURL,
        method: "GET"
    })
        .then(function (response1) {
            console.log(queryZipCodeURL);
            console.log(response1)
            latitude = response1.results[0].locations[0].latLng.lat;
            longitude = response1.results[0].locations[0].latLng.lng;
            predicthq();
        });



    //https://api.predicthq.com/{api-version}/{resource}
    //Predict HQ
    //Secret Client Key for Events APINtxSq481FOKSKJkrw_bhDvITG0H9lnRcn70jov_qDYTFbCNVA9HVnw
    //Events API Key: 33PXWaaGfmpmXsDzo_JEY-lHTEeK0ltxc-5U8jZf
    //Limit of 10000 calls per month  
    function predicthq() {
        latitudeInt = parseFloat(latitude);
        longitudeInt = parseFloat(longitude);

        var queryEventsURL = "https://api.predicthq.com" + "/v1/events/?end.lte=2019-10-06&offset=10&within=30mi%40" + latitudeInt + "%2C" + longitudeInt;

        console.log(queryEventsURL);
        console.log(latitude);
        console.log(longitude);
        $.ajax({
            url: queryEventsURL,
            method: "GET",
            headers: { "Authorization": "Bearer" + " 33PXWaaGfmpmXsDzo_JEY-lHTEeK0ltxc-5U8jZf" }
        })
            .then(function (response2) {
                console.log(response2);
                for(var i = 0; i < response2.results.length; i++){
                    console.log(response2.results[i].entities[0].formatted_address);
                    console.log(response2.results[i].start);
                }
                eventApiResponse = response2;
                appendResponse();
            });

            
        $('#data-input').val("");
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
                console.log(queryWeatherURL);
                console.log(response3);
                weatherApiResponse = response3
                
            });
    }
});








function zipcode () {  
    zipcode = /(^\d{5}$)|(^\d{5}-\d{4}$)/; 
    zipcodeUserInput = zipcodeUserInput.toString(); 

    if(zipcodeUserInput.match(zipcode))  
        {  
          return true;
        }  
        else{    
            return false;
        }  
}




































































// Glen's code starts here

// $(document).on('click', '#submit-button', function () {
//     zipcodeUserInput = $('#data-input').val();
//     // QueryURL stuff from alex in here


//     appendResponse();  //function to push information to the HTML
//     $('#data-input').val("");
// })

function appendResponse() {
    var response2 = eventApiResponse;
    var data = response2.results //filler for response from number of events

    //for loop for card results
    for (var i = 0; i < data.length; i++) {

        var mainDiv = $("<div>");
        mainDiv.addClass("col-12");

        var cardDiv = $("<div>");
        cardDiv.addClass("card default-border"); //border changes with weather

        var location = $("<div>");
        location.addClass("location card-header");
        location.text("Location");  //Need to add Location

        var cardBody = $("<div>");
        cardBody.addClass('card-body');

        var cardTitle = $("<h5>");
        cardTitle.text(response2.results[i].title); //source response.results.entities.name
        cardTitle.addClass("card-title event-name");

        var cardCatagory = $("<p>");
        cardCatagory.text(response2.results[i].category); //type of event response.results.category
        cardCatagory.addClass("card-text");

        var cardStart = $("<p>");
        cardStart.text(response2.results[i].start); //response.start
        cardStart.addClass("card-text");

        var cardWeather = $("<p>");
        cardWeather.text("filler Weather"); //response from weather API
        cardWeather.addClass("card-text temp");

        var cardText = $("<p>");
        cardText.text(response2.results[i].description); //source info from response.results.description
        cardText.addClass("card-text");

        var googleSearch = response2.results[i].title.replace(/ /g, "+");

        var learnMore = $("<a>");
        learnMore.addClass("btn default-button"); //source btn color from type of weather
        learnMore.attr({
            'href': 'https://www.google.com/search?q=' + googleSearch + '&btnI', //google search i'm feeling lucky event title
            'target': '_blank'
        })

        //Need to add Directions button (.default-button-reverse)
        learnMore.text('Learn More');

        cardBody.append(cardTitle, cardStart, cardText, cardWeather, learnMore);
        cardDiv.append(location, cardBody);
        mainDiv.append(cardDiv);

        $('#results-div').prepend(mainDiv);
    }
}