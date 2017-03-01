(function () {
    var map = new google.maps.Map(document.querySelector(".map-wrapper")),
        preloader = document.querySelector(".preload-wrapper"),

        geocoder = new google.maps.Geocoder(),
        geocodeButton = document.querySelector(".geocode"),

        //directions services (draw a route on map)
        directionService = new google.maps.DirectionsService(),
        directionDisplay,
        locations = [],

        marker;

    function initMap(position) {
        locations[0] = {lat: position.coords.latitude, lng: position.coords.longitude};

        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);

        map.setCenter(
            {lat: position.coords.latitude, lng: position.coords.longitude}
            // {
            //     center: {lat: 42.983233, lng: -81.250688},
            //     zoom: 14,
            //     scrollwheel: false
            // }
        );

        map.setZoom(16);

        marker = new google.maps.Marker({
            //position: {lat: 42.983233, lng: -81.250688},
            position:  {lat: position.coords.latitude, lng: position.coords.longitude},
            map: map,
            title: "Hello World!"
        });

        preloader.classList.add("hide-preloader");
    }

    //geocoding api => find an address on a map
    function codeAddress() {
        var address = document.querySelector(".address").value;

        geocoder.geocode({'address' : address}, function (results, status) {
           if(status === google.maps.GeocoderStatus.OK){
               locations[1] = {
                   lat: results[0].geometry.location.lat(),
                   lng: results[0].geometry.location.lng()
               };
               map.setCenter(results[0].geometry.location);

               if(marker){
                   marker.setMap(null);

                   marker = new google.maps.Marker({
                       map: map,
                       position: results[0].geometry.location
                   });
               }

               calcRoute(results[0].geometry.location);

           } else {
               console.log('Geocoder was not successful for the following reason: ' , status);
           }
        });
    }

    function calcRoute(codedLoc) {
        var request = {
            origin:locations[0],
            destination:locations[1],
            travelMode: 'DRIVING'
        };

        directionService.route(request, function (response,status) {
           if(status === 'OK'){
               directionsDisplay.setDirections(response);
           }
        });
    }

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(initMap, handleError);
    }else{
        //give some kind of error message to the user
        console.log('Your browser does not have geolocation');
    }

    function handleError(e) {
        console.log(e);
    }

    geocodeButton.addEventListener('click', codeAddress, false);

    //initMap();

})();