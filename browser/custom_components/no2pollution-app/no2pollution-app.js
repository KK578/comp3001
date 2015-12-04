App.Elements['no2pollution-app'] = Polymer({
    is: 'no2pollution-app',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    //attached: function () {},

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    //behaviors: [],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'myLocationBtn.tap': 'myLocationBtnOnTap',
        'findParkBtn.tap': 'findParkBtnOnTap',
        'getDirBtn.tap': 'getDirBtnOnTap',
        'no2pollution-route': 'makeRequest',
        'park-found': 'foundPark'
    },

    /**
     * https://www.polymer-project.org/1.0/docs/devguide/properties.html
     *
     * Notes:
     *  type {constructor}
     *  value {boolean, number, string, function}
     *  reflectToAttribute {boolean}
     *  readOnly {boolean}
     *  notify {boolean}
     *  computed {string}
     *  observer {string}
     */
    properties: {
        apiKey: {
            type: String,
            value: 'AIzaSyAWW2GYwT88DQhx09eAItjkdFnFNTBMckw',
            readOnly: true
        }
    },

    /* Functions specific to this element go under here. */
    centerMap: function (lat, lng, zoom) {
        var map = document.querySelector('google-map');
        map.latitude = lat;
        map.longitude = lng;
        map.zoom = zoom;
    },

    setAccuracyCircle: function () {
        var myLocationMarker = document.getElementById('myLocationMarker');
        var loc = document.querySelector('geo-location');
        var radius = loc.position.coords.accuracy;

        console.log("Location Accuracy: " + radius);

        var circle = document.querySelector('map-circle');
        circle.setCircle(myLocationMarker.marker, radius);
    },

    myLocationBtnOnTap: function (e) {
        var loc = document.querySelector('geo-location');
        this.centerMap(loc.latitude, loc.longitude, 15);
        this.setAccuracyCircle();
    },

    findParkBtnOnTap: function (e) {
        var loc = document.querySelector('geo-location');
        var currentLocation = { lat: loc.latitude, lng: loc.longitude };

        var parkFinder = document.querySelector('park-finder');
        parkFinder.findPark(currentLocation);
    },

    foundPark: function (e) {
        var p = e.detail;
        this.centerMap(p.geometry.location.lat(), p.geometry.location.lng(), 15);
        var parkMarker = document.getElementById('parkMarker');
        parkMarker.latitude = p.geometry.location.lat();
        parkMarker.longitude = p.geometry.location.lng();
        parkMarker.animation = "BOUNCE";

        this.fire('toast-message', {
            message: 'The nearest park is: "' + p.name + '".'
        });
    },

    getDirBtnOnTap: function (e) {
        this.$.search.openSearchDialog();
    },

    makeRequest: function (e) {
        var destination = e.detail.destination;
        // Backend currently uses postcode location to do routing.
        /* globals google */
        var geocoder = new google.maps.Geocoder();
        var currentLocation = {
            location: {
                lat: this.userLatitude,
                lng: this.userLongitude
            }
        };

        geocoder.geocode(currentLocation, function (results) {
            var postcode = '';
            var postcodeRegex = /([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)/;

            for (var i = 0; i < results.length; i++) {
                var match = results[i].formatted_address.match(postcodeRegex);
                if (match) {
                    postcode = match[0];
                    break;
                }
            }

            postcode = postcode.replace(' ', '');

            var requester = this.$['route-request'];
            requester.sendRequest(postcode, destination);
            this.fire('toast-message', {
                message: 'Going from ' + postcode + ' to ' + destination + '.'
            });
        }.bind(this));
    }
});

