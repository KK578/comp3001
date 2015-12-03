App.Elements['map-circle'] = Polymer({
    is: 'map-circle',

    properties: {

        map: {
            type: Object
        }

    },

    /* Functions specific to this element go under here. */
    setCircle: function (marker, radius) {
        var mapsAPI = document.querySelector('google-maps-api');

        // Add circle overlay and bind to marker
        var circle = new mapsAPI.api.Circle({
            map: this.map,
            radius: radius,
            fillColor: 'blue',
            strokeColor: 'blue'
        });

        circle.bindTo('center', marker, 'position');
    }

});
