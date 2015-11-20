App.Elements['page-home'] = Polymer({
    is: 'page-home',

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
        'findParkBtn.tap': 'findParkBtnOnTap'
        //'google-map-search-results': 'foundResults',
        //'api-load': 'onApiLoad'
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
    /*onApiLoad: function (e) {
        console.log("\n API LOADED WOOHOO \n");
    },*/

    centerMap: function (lat, lng, zoom) {
        var map = document.querySelector('google-map');
        map.latitude = lat;
        map.longitude = lng;
        map.zoom = zoom;
    },

    myLocationBtnOnTap: function (e) {
        var loc = document.querySelector('geo-location');
        this.centerMap(loc.latitude, loc.longitude, 15);
    },

    /*foundResults: function (e) {
        var search = document.querySelector('google-map-search');
        var p = search.results[0];
        alert('The nearest park is: ' + p.name + ' (' + p.latitude + ',' + p.longitude + ')');
    },*/

    findParkBtnOnTap: function (e) {

        var mapsAPI = document.querySelector('google-maps-api'); //might need to check if api is loaded first

        var loc = document.querySelector('geo-location');
        var currentLocation = { lat: loc.latitude, lng: loc.longitude };

        var self = this;

        function callback(results, status) {
            if (status === mapsAPI.api.places.PlacesServiceStatus.OK) {
                var p = results[0];
                self.centerMap(p.geometry.location.lat(), p.geometry.location.lng(), 15);
                var parkMarker = document.getElementById('parkMarker');
                parkMarker.latitude = p.geometry.location.lat();
                parkMarker.longitude = p.geometry.location.lng();
                parkMarker.animation = "BOUNCE";
                // Prefer to not use alert, so using a thingy set up which shows the message in a paper-toast. :D
                self.fire('toast-message', {
                    message: 'The nearest park is: "' + p.name + '".'
                });
            }
        }

        var service = new mapsAPI.api.places.PlacesService(document.createElement('div'));
        service.nearbySearch({
            location: currentLocation,
            types: ['park'],
            //radius: parseFloat(1000) //might need to arrange by distance
            rankBy: mapsAPI.api.places.RankBy.DISTANCE
        }, callback);

        //OLD WAY USING GOOGLE MAP SEARCH COMPONENT wasnt working with custom location
        //var search = document.querySelector('google-map-search');
        //search.longitude = parseFloat(51.5072);
        //search.latitude = parseFloat(0.1275);
        //search.radius = parseFloat(1000);
        //search.query = 'park';
        //search.types = 'park';
        //search.search();
    }
});
