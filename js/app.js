(function ($, document, window) {
  $(document).ready(function () {
    const todayForecast = $(".today.forecast");
    const forecastHeader = todayForecast.find(".forecast-header");
    const forecastContent = todayForecast.find(".forecast-content");

    console.log("todayForecast", todayForecast);
    console.log("forecastHeader", forecastHeader);
    console.log("forecastContent", forecastContent);

    function formatDate(inputDate) {
      const date = new Date(inputDate);
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options);
    }

    function displayWeatherData(weatherData) {
      forecastHeader.find(".date").text(formatDate(weatherData.days[0].datetime));
      forecastContent.find(".location").text(weatherData.address);
      // const apiItemsContainer = document.getElementById('apiItemsContainer');
      // apiItemsContainer.innerHTML = `<h3>${weatherData.location.name}</h3><p>${weatherData.days[0].description}</p>`;
    }

    async function fetchWeatherData() {
      try {
        let res = await axios.get(
          "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/minsk?unitGroup=metric&key=HKQEKXGN484MCGGWXWHVV2UJP&contentType=json",
        );
        console.log("res", res);
        res.data.days.map((x, idx) => {
          if(idx === 1) {
            return <div class="today forecast"></div>
          }
          return <div class="forecast"></div>
        })
        displayWeatherData(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchWeatherData();

    // Cloning main navigation for mobile menu
    $(".mobile-navigation").append($(".main-navigation .menu").clone());

    // Mobile menu toggle
    $(".menu-toggle").click(function () {
      $(".mobile-navigation").slideToggle();
    });

    var map = $(".map");
    var latitude = map.data("latitude");
    var longitude = map.data("longitude");
    if (map.length) {
      map.gmap3({
        map: {
          options: {
            center: [latitude, longitude],
            zoom: 15,
            scrollwheel: false,
          },
        },
        marker: {
          latLng: [latitude, longitude],
        },
      });
    }
  });

  $(window).load(function () {});
})(jQuery, document, window);
