App.Elements['park-finder'] = Polymer({
    is: 'park-finder',

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
        }
    },

    /* Functions specific to this element go under here. */
    findPark: function(currentLocation) {
        var mapsAPI = this.$.api;
        var service = new mapsAPI.api.places.PlacesService(document.createElement('div'));

        service.nearbySearch({
            location: currentLocation,
            types: ['park'],
            rankBy: mapsAPI.api.places.RankBy.DISTANCE
        }, this.foundParks.bind(this));

    },

    foundParks: function(results, status) {
        var mapsAPI = document.querySelector('google-maps-api');

        if (status === mapsAPI.api.places.PlacesServiceStatus.OK) {
            var p = results[0];
            this.fire('park-found', p);
        }
    }

});
