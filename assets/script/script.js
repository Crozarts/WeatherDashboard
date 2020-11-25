$("#search-button").on("click", function () {
    var searchValue = $("#search-value").val();

    $("#search-value").val("");

    fiveDay(searchValue)
    searchWeather(searchValue)
    searchHistory.push(searchValue);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
});

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

$("#clear-button").on("click", function () {
    searchHistory = [];
    renderSearchHistory();
});

function searchWeather(searchValue) {
    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/weather?q=${searchValue}&appid=c1c792c8a46b2235a6011511c6ea2ca6&units=imperial`,
        dataType: "json",
    }).then(function (data) {
        console.log(data)

        $("#today").empty()

        //creating a card for appending weather data
        var title = $("<h3>").addClass("card-title").text(data.name + " " + "(" + todaysDate + ")");
        var card = $("<div>").addClass("card");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " \u00B0F");
        var icon = (`<img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">`)
        var cardBody = $("<div>").addClass("card-body");

        cardBody.append(title, icon, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        uvIndex(data.coord.lat, data.coord.lon);
    })
}

function uvIndex(lat, lon) {
    $.ajax({
        type: "GET",
        url: 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=c1c792c8a46b2235a6011511c6ea2ca6&units=imperial',
        dataType: "json",
    }).then(function (data){
        console.log(data)
        
        if (data.value <= 2) {
            var fav = $("<span>").addClass("badge badge-pill badge-success").text("UV Index: " + data.value);
        } else if (data.value >= 5) {
            var sev = $("<span>").addClass("badge badge-pill badge-danger").text("UV Index: " + data.value);
        } else if (data.value >= 3 || data.value <= 5) {
            var mod = $("<span>").addClass("badge badge-pill badge-warning").text("UV Index: " + data.value);
        };
        $("#today .card-body").append(fav, sev, mod);
    })
}

var todaysDate = moment().format('MMM. Do, YYYY');

function fiveDay(searchValue) {
    $.ajax({
        type: "GET",
        url: `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=c1c792c8a46b2235a6011511c6ea2ca6&units=imperial`,
        dataType: "json",
    })
    .then(function (data) {
        console.log(data)
    
        $(".fiveDayTitle").empty()
        $("#oneWeek").empty()

        var fiveCast = $("<h3>").addClass("fiveDayTitle").text("5-Day Forecast: ")
        $(".fiveHeader").append(fiveCast);
        for (i = 0; i < 40; i = i + 8) {
            var card = $("<div>").addClass("card ml-3 mb-3 card5");
            var temp = $("<p>").addClass("card-text text5").text("Temperature: " + data.list[i].main.temp + " \u00B0F");
            var humid = $("<p>").addClass("card-text text5").text("Humidity: " + data.list[i].main.humidity + "%");
            var icon = (`<img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png">`);
            var cardBody = $("<div>").addClass("card-body body5");

            let currentDate = new Date(data.list[i].dt_txt);
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            var forecastDate = $("<h3>").addClass("card-title title 5").text(month + "/" + day + "/" + year);

            cardBody.append(forecastDate, icon, temp, humid);
            card.append(cardBody);
            $("#oneWeek").append(card);
        }
    });
}

function renderSearchHistory() {
    var currentCity = document.getElementById("currentCity");
    currentCity.innerHTML = "";

    for (let i = 0; i < searchHistory.length; i++) {
        const searchedCity = document.createElement("input");

        searchedCity.setAttribute("type", "text");
        searchedCity.setAttribute("readonly", true);
        searchedCity.setAttribute("class", "form-control d-block bg-primary text-white");
        searchedCity.setAttribute("value", searchHistory[i]);
        searchedCity.addEventListener("click", function() {
            searchWeather(searchedCity.value);
            fiveDay(searchedCity.value);
        })
        currentCity.append(searchedCity);
    }
}

renderSearchHistory();
if (searchHistory.length > 0) {
    searchWeather(searchHistory[searchHistory.length - 1]);
    fiveDay(searchHistory[searchHistory.length - 1]);
}