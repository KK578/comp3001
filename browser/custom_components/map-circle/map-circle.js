App.Elements['map-circle'] = Polymer({
    is: 'map-circle',

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
    //listeners: {},

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
            type: Object,
            observer: '_changeDetected'
        },

        position: {
            type: Object,
            value: null,
            notify: true,
            observer: '_changeDetected'
        },

        circle: {
            type: Object,
            value: null
        }
    },

    /* Functions specific to this element go under here. */
    _changeDetected: function () {
        if (this.position && this.map) {
            this._setCircle();
        }
    },

    _setCircle: function () {
        var position = this.position.coords;
        var marker = this.$.marker;

        var blueCircle = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 1,
            fillColor: '#4285F4',
            strokeColor: '#FAFBFC',
            strokeWeight: 1.5,
            scale: 5
        };

        marker.icon = blueCircle;
        marker.latitude = position.latitude;
        marker.longitude = position.longitude;

        if (!this.circle) {
            /* globals google */
            this.circle = new google.maps.Circle({
                map: this.map,
                fillOpacity: 0.3,
                fillColor: '#4285F4',
                strokeOpacity: 0
            });

            this.circle.bindTo('center', this.$.marker.marker, 'position');
        }

        this.circle.setRadius(position.accuracy);
    }
});
