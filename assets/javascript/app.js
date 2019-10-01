//Open Weather API Key: 094564d4319b1a4807606b1734534529
//5 day forecast is available at any location or city. It includes weather data every 3 hours. Forecast is available in JSON or XML format.
zipcodeUserInput = 84095;
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?zip=" + zipcodeUserInput + ",us&APPID=e66a1bd808ecea1b18d6edc1a56dece6"

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (response) {
        console.log(queryURL);
        console.log(response);
    });























































































// Glen's code starts here

$(document).on('click', '#submit-button', function () {
    zipcodeUserInput = $('#data-input').val();
    // QueryURL stuff from alex in here

    
    appendResponse();  //function to push information to the HTML
    $('#data-input').val("");
})

function appendResponse() {
    var data = response.data //filler for response from number of events

    //for loop for card results
    for (var i = 0; i < data.length; i++) {
        
        var mainDiv = ("<div>");
        mainDiv.addClass("col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12 m-2");
        
        var cardDiv = ("<div>");
        cardDiv.addClass("card rounded border-success"); //border changes with weather
        cardDiv.attr({
            style: "width: 18rem;"
        })
        
        var img = ("<img>");
        img.addClass("card-img-top");
        img.attr({
            'src': data[i].images.original_still.url, //src from results need to change
            'alt': 'Card image cap'
        });
        
        var cardBody = ("<div>");
        cardBody.addClass('card-body');
       
        var cardTitle = ("<h5>");
        cardTitle.text("filler event title"); //source response.results.entities.name
        cardTitle.addClass("card-title");

        var cardCatagory = ("<p>");
        cardCatagory.text("filler catagory"); //type of event response.results.category
        cardCatagory.addClass("card-text");

        var cardStart = ("<p>");
        cardStart.text("filler data and time"); //response.start
        cardStart.addClass("card-text");

        var cardWeather = ("<p>");
        cardWeather.text("filler Weather"); //response from weather API
        cardWeather.addClass("card-text");
        
        var cardText = ("<p>");
        cardText.text("filler information"); //source info from response.results.description
        cardText.addClass("card-text");

        var googleSearch = 'response title filler'.replace(/ /g, "+");
        
        var learnMore = ("<a>");
        learnMore.addClass("btn btn-success"); //source btn color from type of weather
        learnMore.attr({
            'href': 'https://www.google.com/search?q=' + googleSearch + '&btnI' //google search i'm feeling lucky event title
        })
        learnMore.text('Learn More');

        cardBody.append(cardTitle, cardStart, cardWeather, cardText, learnMore);
        cardDiv.append(img, cardBody);
        mainDiv.append(cardDiv);

        $('#results-div').prepend(mainDiv);
    }
}