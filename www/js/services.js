angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Geo', function($q) {
  return {
    reverseGeocode: function(lat, lng) {
    console.log("GEO FACTORY");
      var q = $q.defer();
      var geocoder = new google.maps.Geocoder();
      console.log("geocoder");
      geocoder.geocode({
        'latLng': new google.maps.LatLng(lat, lng)
      }, function(results, status) {
         console.log("geocoder.geocode");
        if (status == google.maps.GeocoderStatus.OK) {
          console.log('Reverse', results);
          if(results.length > 1) {
            var r = results[1];
            var a, types;
            var parts = [];
            var foundLocality = false;
            var foundState = false;
            for(var i = 0; i < r.address_components.length; i++) {
              a = r.address_components[i];
              types = a.types;
              for(var j = 0; j < types.length; j++) {
                if(!foundLocality && types[j] == 'locality') {
                  foundLocality = true;
                  parts.push(a.long_name);
                } else if(!foundState && types[j] == 'administrative_area_level_1') {
                  foundState = true;
                  parts.push(a.short_name);
                }
              }
            }
            console.log('Reverse', parts);
            q.resolve(parts.join(', '));
          }
        } else {
          console.log('reverse fail', results, status);
          q.reject(results);
        }
      })

      return q.promise;
    },
    getLocation: function() {
      console.log("Geo.getLocation");
      var q = $q.defer(); 
      console.log("Calling Navigator.geolocation");
      navigator.geolocation.getCurrentPosition(function(position) {
        q.resolve(position);
  console.log(position);
      }, function(error) {
        q.reject(error);
      });

      return q.promise;
    }
  };
})