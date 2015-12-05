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
        }
    },

    /* Functions specific to this element go under here. */
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

            var decodedPath = google.maps.geometry.encoding.decodePath(encodedPath);

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
        this.async(function () {
            var polylines = document.querySelectorAll('google-map-poly');

            function createInfoWindow(index, e) {
                var infoWindow = new google.maps.InfoWindow({
                    content: '<p>Distance: ' + this.paths[index].distance + '</p>'
                });

                infoWindow.setPosition(e.latLng);
                infoWindow.open(document.querySelector('#map-canvas').map);
            }

            for (var k = 0; k < polylines.length; k++) {
                google.maps.event.addListener(polylines[k].poly, 'click',
                    createInfoWindow.bind(this, k));
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
