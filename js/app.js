(function ($, document, window) {
  $(document).ready(function () {
    async function fetchWeatherData() {
      try {
        let res = await axios.get(
          "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/minsk?unitGroup=metric&key=HKQEKXGN484MCGGWXWHVV2UJP&contentType=json",
        );
        console.log("res", res);
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
