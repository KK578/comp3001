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
        },
        map: {
            type: Object
        },

        place: {
            type: Object
        }
    },

    /* Functions specific to this element go under here. */
    findPark: function(currentLocation) {
        var service = new google.maps.places.PlacesService(document.createElement('div'));

        service.nearbySearch({
            location: currentLocation,
            types: ['park'],
            rankBy: google.maps.places.RankBy.DISTANCE
        }, this.foundParks.bind(this));

    },

    foundParks: function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.setMarker(results[0]);
        }
    },

    setMarker: function (place) {
        var location = place.geometry.location;
        var parkMarker = this.$.marker;
        this.place = place;
        parkMarker.latitude = location.lat();
        parkMarker.longitude = location.lng();

        this.map.setCenter(location);
        this.map.setZoom(15);
    }
});
