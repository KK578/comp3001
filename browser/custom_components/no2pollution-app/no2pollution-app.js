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
        'ajax.response': 'ajaxResponse',
        'ajax.error': 'ajaxError',
        'park-found': 'foundPark',
        'template-paths.dom-change': 'setupInfo'
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

    routeBtnOnTap: function (sender) {
        var location = JSON.parse(sender.getAttribute('location'));
        var postcodeRegex = /([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)/;
        // Backend currently uses postcode location to do routing.
        var postcode = location.formatted_address.match(postcodeRegex)[0];

        var mapsAPI = document.querySelector('google-maps-api');
        var geocoder = new mapsAPI.api.Geocoder();

        var currentLocation = {
            location: {
                lat: this.userLatitude,
                lng: this.userLongitude
            }
        };

        geocoder.geocode(currentLocation, function (results) {
            var currentPostcode = '';
            for (var i = 0; i < results.length; i++) {
                var match = results[i].formatted_address.match(postcodeRegex);
                if (match) {
                    currentPostcode = match[0];
                    break;
                }
            }

            postcode = postcode.replace(' ', '');
            currentPostcode = currentPostcode.replace(' ', '');
            this.sendRequest(currentPostcode, postcode);
            this.fire('toast-message', {
                message: 'Going from ' + currentPostcode + ' to ' + postcode + '.'
            });
        }.bind(this));
    },

    sendRequest: function (start, destination) {
        var ajax = this.$.ajax;

        ajax.params = {
            start: start,
            end: destination
        };

        ajax.generateRequest();
    },
    ajaxResponse: function (e) {
        var detail = e.detail.response;

        this.paths = [];

        for (var i = 0; i < detail.length; i++) {
            var item = detail[i];
            var encodedPath = item.polyline;

            var mapAPI = this.$['map-canvas'].$.api.api;
            var decodedPath = mapAPI.geometry.encoding.decodePath(encodedPath);

            // HACK: Item in template repeat does not seem to be able to access functions at bind
            for (var j = 0; j < decodedPath.length; j++) {
                decodedPath[j].lat = decodedPath[j].lat();
                decodedPath[j].lng = decodedPath[j].lng();
            }

            detail[i].polyline = decodedPath;
        }

        this.paths = detail;
    },
    setupInfo: function (e) {
        /* globals google */
        this.async(function () {
            console.log(e);
            var polylines = document.querySelectorAll('google-map-poly');
            console.log(polylines);
            function createInfoWindow(index, e) {
                var infoWindow = new google.maps.InfoWindow({
                    content: '<p>Distance: ' + this.paths[index].distance + '</p>'
                });

                infoWindow.setPosition(e.latLng);
                infoWindow.open(document.querySelector('#map-canvas').map);
            }

            for (var k = 0; k < polylines.length; k++) {
                google.maps.event.addListener(polylines[k].poly, 'click', createInfoWindow.bind(this, k));
            }
        }, 500);
    },
    ajaxError: function (e) {
        var detail = e.detail;
        console.log(detail);

        this.fire('toast-message', {
            message: 'Sorry, an error occurred while requesting a route.'
        });
    }
});

