App.Elements['map-circle'] = Polymer({
    is: 'map-circle',

    properties: {

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

        marker: {
            type: Object,
            value: null,
            notify: true
        },

        circle: {
            type: Object,
            value: null
        }

    },

    /* Functions specific to this element go under here. */
    _changeDetected: function() {
        var mapsAPI = document.querySelector('google-maps-api');

        if (this.position && this.marker && this.map && this.map instanceof mapsAPI.api.Map) {
            this._mapReady();
        }
    },

    _mapReady: function() {
        var mapsAPI = document.querySelector('google-maps-api');

        var radius = this.position.coords.accuracy;

        this.circle = new mapsAPI.api.Circle({
            map: this.map,
            radius: radius,
            fillColor: 'blue',
            strokeColor: 'blue'
        });

        this.circle.bindTo('center', this.marker, 'position');
    }
});
