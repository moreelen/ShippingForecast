$(function(){

  // Get current time
  var d = new Date();
  var time = parseInt(d.getTime() / 1000);

  // Starter lat and long. Location? My home.
  var lat = 39.4742;
  var long = -0.3657;

  // Initialise first API call.
  var demoUrl = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/ca170dd6d6dd57c911eb64a2bd625869/39.4742,-0.3657," + time + "?units=si";

  // Add search box to look through places.
  var searchInput = $("#searchbox");
  var placesInput = new google.maps.places.SearchBox(searchInput[0]);

  // Generate graphics with the API data.
  function graphics(){
    $("#loader").css("display","block");
    $.ajax({
      url: demoUrl,
      crossDomain: true,
      success: function(data){
        $("#loader").css("display","none");
        console.log(data);

        // CLOUD COVER AND SPEEDCODE

        // Create style tag with jQuery in which we will add the animation keyframes.
        $("head").append("<style></style>");

        var windSpeed = parseInt(data.currently.windSpeed) + 240;
        var cloudCover = parseInt(data.currently.cloudCover * 10);

        for(var j = 0; j < cloudCover; j++){

          var leftPosition = Math.floor(Math.random() * 80) + 1;
          var topPosition = Math.floor(Math.random() * 50) + 1;
          var size = Math.floor(Math.random() * 700) + 10;
          var radius = size / 2;
          var delay = Math.floor(Math.random() * 60) + 1;

          windSpeed = windSpeed + 60;

          $("#art").append("<div class='cloud' id='cloud" + j + "'></div>");
          $("#cloud" + j).css({
            "height": size + "px",
            "width": size + "px",
            "left": (-size) + "px",
            "top": topPosition + "vh",
            "border-radius": radius + "px",
            "position": "absolute",
            "animation": "wind" + j + " " + windSpeed + "s linear " + delay + "s infinite"
          });

          var strength = Math.floor(Math.random() * 3) + 1;

          // Create an animation keyframe for each.
          $("style").append("@keyframes wind" + j + "{ 0%{ left:" + (-size) + "px; } 100%{ left: 100%; } }");
        }


        // SUNRISE AND SUNSET CODE

        // Grab sunrise and sunset times and turn it into workable numbers.
        var sunriseTime = new Date(data.daily.data[0].sunriseTime * 1000);

        var sunriseHour = sunriseTime.getHours();
        var sunriseMinute = sunriseTime.getMinutes();

        var sunriseColour = parseInt( 255 * ( ((sunriseHour * 100) + sunriseMinute) / 1500) );
        console.log("Sunrise Colour" + sunriseColour);

        var sunsetTime = new Date(data.daily.data[0].sunsetTime * 1000);

        var sunsetHour = sunsetTime.getHours();
        var sunsetMinute = sunsetTime.getMinutes();

        var sunsetColour = parseInt( 255 * ( ( ((sunsetHour * 100) + sunsetMinute) - 1200) / 1200));

        console.log("Sunset Colour" + sunsetColour);

        if(sunsetColour <= 0 ){
          sunsetColour = Math.abs(sunsetColour);
          console.log("Sunset Colour" + sunsetColour);
        }

        var RCG = 255;
        var RCR = 251;

        var SCG = 102;
        var SCR = 71;

        if(sunriseColour <= 180){
          RCG = 202;
          RCR = 247;
          sunriseColour = parseInt( (sunriseColour / 180) + 180 );
        }

        if(sunsetColour <= 100){
          SCG = 168;
          SCR = 145;
          sunsetColour =  sunsetColour + 180;
          console.log(sunsetColour);
        }


        // HUMIDITY CODE

        var humidity = data.currently.humidity;

        // Add sunrise/sunset as gradient and humidity as opacity.
        $("#art").css("background", "linear-gradient(" + (Math.floor(Math.random() * 359) + 1) + "deg, rgba(" + RCR + "," + RCG + "," + sunriseColour + "," + humidity + "), rgba(" + SCR + "," + SCG + "," + sunsetColour + "," + humidity + "))")
      }
    })
  }

  // First inital call of graphics
  graphics();

  // Get new long and lat from place searched through box.
  google.maps.event.addListener(placesInput, 'places_changed', function(){
    var places = placesInput.getPlaces();
    for(var i = 0; i < places.length; i++){
      var place = places[i];
    }

    lat = place.geometry.location.lat();
    long = place.geometry.location.lng();

    demoUrl = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/ca170dd6d6dd57c911eb64a2bd625869/" + lat + "," + long + "," + time + "?units=si";

    // And generate the new graphics again.
    graphics();
  });

})
