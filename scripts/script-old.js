$(function(){

  // Initialise jKit.
  $('body').jKit();

  // Get current time
  var d = new Date();
  var time = parseInt(d.getTime() / 1000);

  // Starter lat and long. Location? My home.
  var lat = 39.4742;
  var long = -0.3657;

  // Initialise first API call.
  var demoUrl = "https://crossorigin.me/https://api.darksky.net/forecast/ca170dd6d6dd57c911eb64a2bd625869/39.4742,-0.3657," + time + "?units=si";

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
  
        // Change colour based on temperature.
        // var temperature = data.currently.temperature;
        // $("#temperature").css("background-color","rgb(" + parseInt(temperature) + ", 50, 50)");
  
        // Change size based on humidity.
        // var humidity = data.currently.humidity * 1000;
        // $("#humidity").css("height",humidity);
  
        // Change opacity based on wind speed.
        var windSpeed = parseInt(data.currently.windSpeed);
        // $("#windSpeed").css("opacity",windSpeed);



        // CLOUD COVER AND SPEEDCODE

        // Grab cloud cover and turn it into a workable number.
        var cloudCover = parseInt(data.currently.cloudCover * 10);
        // console.log(cloudCover);

        // Generate that many number of cloud divs with
        // random position from left max 100%
        // random position from top max 100vh
        // random height and width no bigger than 50vh
        // border radius half of height and width

        // Create style tag with jQuery in which we will add the animation keyframes.
        $("head").append("<style></style>");

        for(var j = 0; j < cloudCover; j++){

          var leftPosition = Math.floor(Math.random() * 80) + 1;
          var topPosition = Math.floor(Math.random() * 50) + 1;
          var size = Math.floor(Math.random() * 700) + 10;
          var radius = size / 2;

          $("#art").append("<div class='parallax-container' id='controller" + j + "'><div class='cloud parallax parallax" + j + "' id='cloud" + j + "'></div></div>");
          $("#cloud" + j).css({
            "height": size + "px",
            "width": size + "px",
            // "left": "25px",
            // "top": "25px",
            "border-radius": radius + "px",
            "position": "absolute"
            // "animation": "wind" + j + " " + windSpeed + "s linear infinite"
          });

          // size = size + 50;

          $("#controller" + j).jKit("parallax", { 'strength': '1', 'axis': 'both', "scope": "local"});
          $("#controller" + j).css({
            "height": size + "px",
            "width": size + "px",
            "left": leftPosition + "%",
            "top": topPosition + "vh",
            "position": "absolute"
          })

          var strength = Math.floor(Math.random() * 3) + 1;
          //console.log(strength);

          $("#cloud" + j ).jKit("parallax", { "strength": strength, "axis": "both" });

          // var offset1 = Math.floor(Math.random() * 3) + 1;
          // var offset2 = Math.floor(Math.random() * 3) + 1;
          // offset1 *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
          // offset2 *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
          // var leftOffset1 = offset1 + leftPosition;
          // var leftOffset2 = offset2 + leftPosition;
          // var topOffset1 = offset1 + topPosition;
          // var topOffset2 = offset2 + topPosition;

          // Create an animation keyframe for each.
          // $("style").append("@keyframes wind" + j + "{ 0%{ left: " + leftPosition + "%; top: " + topPosition + "vh; } 25%{ left: " + leftOffset1 + "%; top: " + topOffset1 + "vh; } 50%{ left: " + leftOffset2 + "%; top: " + topOffset2 + "vh; } 75%{ left: " + leftOffset1 + "%; top: " + topOffset1 + "vh; } }");
        }

        // Create keyframe animation for each cloud.
        // Each has at different intervals slighly different left and top positions.
        // Based off of the original leftPosition and topPosition.


        // SUNRISE AND SUNSET CODE
  
        // List of good gradients.
        // 251, 255, 190-200 + 71, 102, 120-140 blue
        // 240, 240, 200-220 + 254, 206, 170-190 pink
  
        // Grab sunrise and sunset times and turn it into workable numbers.
        var sunriseTime = new Date(data.daily.data[0].sunriseTime * 1000);
  
        var sunriseHour = sunriseTime.getHours();
        var sunriseMinute = sunriseTime.getMinutes();
        console.log("Rise H" + sunriseHour);
        console.log("Rise M" + sunriseMinute);
  
        var sunriseColour = parseInt( 255 * ( ((sunriseHour * 100) + sunriseMinute) / 1500) );
        console.log("Sunrise Colour" + sunriseColour);
  
        var sunsetTime = new Date(data.daily.data[0].sunsetTime * 1000);
        
        var sunsetHour = sunsetTime.getHours();
        var sunsetMinute = sunsetTime.getMinutes();
        console.log("Set H" + sunsetHour);
        console.log("Set M" + sunsetMinute);
  
        var sunsetColour = parseInt( 255 * ( ( ((sunsetHour * 100) + sunsetMinute) - 1200) / 1200));

        console.log("Sunset Colour" + sunsetColour);

        if(sunsetColour <= 0 ){
          sunsetColour = Math.abs(sunsetColour);
          console.log("Sunset Colour" + sunsetColour);
        }

  
        // Add sunrise/sunset as gradient.
        $("#art").css("background", "linear-gradient(" + (Math.floor(Math.random() * 359) + 1) + "deg, rgb(251,255," + sunriseColour + "), rgb(71,102," + sunsetColour + "))")
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

    demoUrl = "https://crossorigin.me/https://api.darksky.net/forecast/ca170dd6d6dd57c911eb64a2bd625869/" + lat + "," + long + "," + time + "?units=si";
    
    // And generate the new graphics again.
    graphics();
  });

})