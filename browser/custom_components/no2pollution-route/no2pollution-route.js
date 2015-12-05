App.Elements['no2pollution-route'] = Polymer({
    is: 'no2pollution-route',

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
        'ajax.response': 'ajaxResponse',
        'ajax.error': 'ajaxError',
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
        },
        map: {
            type: Object
        },

        paths: {
            type: Array,
            value: [],
            observer: 'pathsChanged'
        },
        infoWindows: {
            type: Array,
            value: []
        },
        sliderValue: {
            type: Number,
            value: 0,
            observer: 'toggleRoutesBySlider'
        },
        hideSlider: {
            type: Boolean,
            value: true
        }
    },

    /* Functions specific to this element go under here. */
    pathsChanged: function (n) {
        console.log(n);
        this.$['slider-container'].hidden = n.length === 0;
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
        var minimum = 1000;

        for (var i = 0; i < detail.length; i++) {
            var item = detail[i];
            var encodedPath = item.polyline;

            var decodedPath = google.maps.geometry.encoding.decodePath(encodedPath);

            // HACK: Item in template repeat does not seem to be able to access functions at bind
            for (var j = 0; j < decodedPath.length; j++) {
                decodedPath[j].lat = decodedPath[j].lat();
                decodedPath[j].lng = decodedPath[j].lng();
            }

            var pollutionRating = item.avgNO2 + item.avgO3 + 1.5 * item.avgPM10 + 1.5 * item.avgPM25;
            pollutionRating = Math.round(pollutionRating);
            if (pollutionRating < minimum) {
                minimum = pollutionRating;
            }
            detail[i].pollutionRating = pollutionRating;
            detail[i].polyline = decodedPath;
        }

        this.paths = detail;
        this.minimumRating = minimum;
    },
    setupInfo: function (e) {
        this.async(function () {
            var polylines = document.querySelectorAll('google-map-poly');

            function polylineHover(index, e) {
                var polyline = polylines[index];
                polyline.strokeColor = '#000';
                polyline.zIndex = 6;

                var infoWindow = this.infoWindows[index];
                var position = {
                    lat: e.latLng.lat() + 0.0002,
                    lng: e.latLng.lng()
                };
                infoWindow.setPosition(position);
                infoWindow.open(this.map);
            }

            function polylineExit(index) {
                var polyline = polylines[index];
                polyline.strokeColor = '#999';
                polyline.zIndex = 5;

                // Closing immediately causes far too much flashing.
                // Temporarily just disabling it for now.
                //var infoWindow = this.infoWindows[index];
                //infoWindow.close();
            }

            function createContent(path) {
                var string = [
                    '<p>Distance: ',
                    path.distance,
                    '</p><p>Pollution Rating: ',
                    path.pollutionRating,
                    '</p>',
                    '<table><thead><tr><th>Pollutant</th><th>Value (&micro;g/m&sup3;)</th></tr></thead><tbody><tr><td>NO2</td><td>',
                    path.avgNO2,
                    '</td></tr><tr><td>O3</td><td>',
                    path.avgO3,
                    '</td></tr><tr><td>PM10</td><td>',
                    path.avgPM10,
                    '</td></tr><tr><td>PM25</td><td>',
                    path.avgPM25,
                    '</td></tr></tbody></table>'
                ].join('');

                return string;
            }

            for (var k = 0; k < polylines.length; k++) {
                var infoWindow = new google.maps.InfoWindow({
                    content: createContent(this.paths[k])
                });

                this.infoWindows[k] = infoWindow;

                polylines[k].poly.addListener('mousemove', polylineHover.bind(this, k));
                polylines[k].poly.addListener('mouseout', polylineExit.bind(this, k));
            }
        }, 500);

        this.toggleRoutesBySlider();
    },
    ajaxError: function (e) {
        var detail = e.detail;
        console.log(detail);

        this.fire('toast-message', {
            message: 'Sorry, an error occurred while requesting a route.'
        });
    },

    toggleRoutesBySlider: function () {
        if (this.paths) {
            this.infoWindows.map(function (info) {
                info.close();
            });

            var polylines = this.querySelectorAll('google-map-poly');
            var i;

            // End of Slider reached, ensure all routes displayed.
            if (this.sliderValue === 10) {
                for (i = 0; i < polylines.length; i++) {
                    polylines[i].removeAttribute('hidden');
                }
            }
            else {
                var rating = this.minimumRating + this.sliderValue;

                for (i = 0; i < polylines.length; i++) {
                    if (polylines[i].rating > rating) {
                        polylines[i].setAttribute('hidden', '');
                    }
                    else {
                        polylines[i].removeAttribute('hidden');
                    }
                }
            }

        }
    }
});
