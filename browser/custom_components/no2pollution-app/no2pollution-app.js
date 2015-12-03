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
        },
        criteria: "",
        srchInput: "",
        results: ""
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
        var srch_dialog = document.getElementById("search-dialog");
        if (srch_dialog) {
            srch_dialog.open();
        }
    },

    srchReqOnEnter: function (e) {
        //check if 'enter' was pressed
        if (e.keyCode === 13) {
            // Empty results array before continuing to ensure all google-map-markers
            // are correctly detached before
            this.results = [];

            this.set('criteria', this.srchInput);
            this.set('srchInput', '');
            var srch_dialog = document.getElementById("search-dialog");
            if (srch_dialog) {
                srch_dialog.close();
            }
        }
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

    on_api_load: function () {
        var mapsAPI = document.querySelector('google-maps-api');
        var map = document.querySelector("google-map");
        var autocomplete = new mapsAPI.api.places.Autocomplete(document.getElementById("search-input-text").$.input);
        autocomplete.bindTo('bounds', map);
        var infowindow = new mapsAPI.api.InfoWindow();
        var marker = new mapsAPI.api.Marker({
            map: map.map,
            anchorPoint: new mapsAPI.api.Point(0, -29)
        });

        autocomplete.addListener('place_changed', function () {
            this.set('results', '');
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                console.log(place);
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.map.fitBounds(place.geometry.viewport);
            } else {
                map.map.setCenter(place.geometry.location);
                map.map.setZoom(17);  // Why 17? Because it looks good.
            }

        });
    },

    sendRequest: function (start, destination) {
        var ajax = this.$.ajax;

        ajax.params = {
            start: start,
            destination: destination
        };

        ajax.generateRequest();
    },
    ajaxResponse: function (e) {
        var detail = e.detail;
        var encodedPath = detail.response.polyline;

        var mapAPI = this.$['map-canvas'].$.api.api;
        var decodedPath = mapAPI.geometry.encoding.decodePath(encodedPath);

        // HACK: Item in template repeat does not seem to be able to access functions at bind
        for (var i = 0; i < decodedPath.length; i++) {
            decodedPath[i].lat = decodedPath[i].lat();
            decodedPath[i].lng = decodedPath[i].lng();
        }

        this.path = decodedPath;
    },
    ajaxError: function (e) {
        var detail = e.detail;
        console.log(detail);

        this.fire('toast-message', {
            message: 'Sorry, an error occurred while requesting a route.'
        });
    }
});

