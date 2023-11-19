(function ($, document, window) {
  $(document).ready(function () {
    const forecastContainer = $(".forecast-container");
    const todayForecast = $(".today.forecast");
    const forecastHeader = todayForecast.find(".forecast-header");
    const forecastContent = todayForecast.find(".forecast-content");
    const headerText = $(".w-header-text");
    console.log("todayForecast", todayForecast);
    console.log("forecastHeader", forecastHeader);
    console.log("forecastContent", forecastContent);

    function formatDate(inputDate) {
      const date = new Date(inputDate);
      const options = { day: "numeric", month: "short" };
      return date.toLocaleDateString("en-US", options);
    }

    function getWeekDay(dateString) {
      const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
      const date = new Date(dateString);
      return daysOfWeek[date.getDay()];
    }

    function displayWeatherData(weatherData) {
      forecastHeader
        .find(".date")
        .text(formatDate(weatherData.days[0].datetime));
      forecastContent.find(".location").text(weatherData.address);
      headerText.text(weatherData.days[0].description);
    }

    function generateForecastHTML(forecast) {
      const { DateTime } = luxon;
      let today = DateTime.now().setZone("Europe/Minsk").toFormat("yyyy-MM-dd");

      // Format to ISO string and split to get the date part
      // today.toISOString().split("T")[0];
      // const today = new Date().toISOString().split("T")[0];
      console.log("forecast.datetime", forecast.datetime);
      console.log("today", today);
      forecast.isToday = forecast.datetime === today;
      const forecastClass = forecast.isToday ? "today forecast" : "forecast";
      // const iconPath = `images/icons/${forecast.icon}`;
      const degreeHTML = `<div class="degree">${forecast.temp}<sup>o</sup>C</div>`;
      const weekDay = getWeekDay(forecast.datetime);
      return forecast.isToday
        ? `<div class="today forecast">
              <div class="forecast-header">
                <div class="day">${weekDay}</div>
                <div class="date"></div>
              </div>
              <div class="forecast-content">
                <div class="location">Minsk</div>
                <div class="degree">
                  <div class="num">
                    <span class="curr-deg">${Math.round(forecast.temp)}</span>
                    <sup>o</sup>C
                  </div>
                  <div class="forecast-icon">
                    <img src="images/icons/icon-${
                      forecast.icon
                    }.svg" alt="" width="90" />
                  </div>
                </div>
                <span>
                  <img src="images/icon-umberella.png" alt="" />
                  ${forecast.humidity}%
                </span>
                <span>
                  <img src="images/icon-wind.png" alt="" />
                  ${forecast.windspeed}km/h
                </span>
              </div>
            </div>`
        : `<div class="forecast">
              <div class="forecast-header">
                <div class="day">${weekDay}</div>
              </div>
              <div class="forecast-content">
                <div class="forecast-icon">
                  <img src="images/icons/icon-${
                    forecast.icon
                  }.svg" alt="" width="48" />
                </div>
                <div class="degree">
                  ${Math.round(forecast.temp)}<sup>o</sup>C
                </div>
                <small>
                  ${Math.round(forecast.tempmin)}<sup>o</sup>
                </small>
              </div>
            </div>`;
    }
    let forecasts = []; // Initialize it, possibly as an empty array
    function updateForecastDisplay() {
      let htmlContent = forecasts
        .map((forecast) => generateForecastHTML(forecast))
        .join("");

      $(".forecast-container").html(htmlContent);
    }

    function showForecastChart() {
      // if (!(forecasts.length > 0)) return;
      console.log(
        "first",
        forecasts[0].hours.map((x) => x.temp),
      );
      var options = {
        series: [
          {
            name: "Температура",
            data: forecasts[0].hours.map((x) => x.temp),
          },
        ],
        chart: {
          height: 350,
          type: "line",
        },
        forecastDataPoints: {
          count: 7,
        },
        stroke: {
          width: 5,
          curve: "smooth",
        },
        xaxis: {
          categories: [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00",
          ],
          tickAmount: 24,
          labels: {
            formatter: function (value, timestamp, opts) {
              return value; // Just return the hour value
            },
          },
        },
        title: {
          text: "Почасовой прогноз",
          align: "left",
          style: {
            fontSize: "16px",
            color: "#666",
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            gradientToColors: ["#FDD835"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100],
          },
        },
        yaxis: {
          min: forecasts[0].tempmin,
          max: forecasts[0].tempmax,
        },
      };

      var chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    }

    async function fetchWeatherData() {
      try {
        let res = await axios.get(
          "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/minsk?unitGroup=metric&key=HKQEKXGN484MCGGWXWHVV2UJP&contentType=json&lang=ru",
        );
        forecasts = res.data.days.slice(0, 7); // Update this line as per actual data structure
        console.log("forecasts", forecasts);
        updateForecastDisplay();
        displayWeatherData(res.data);
        showForecastChart();
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

    // var map = $(".map");
    // var latitude = map.data("latitude");
    // var longitude = map.data("longitude");
    // if (map.length) {
    //   map.gmap3({
    //     map: {
    //       options: {
    //         center: [latitude, longitude],
    //         zoom: 15,
    //         scrollwheel: false,
    //       },
    //     },
    //     marker: {
    //       latLng: [latitude, longitude],
    //     },
    //   });
    // }
  });

  $(window).load(function () {});
})(jQuery, document, window);
