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
	'findParkBtn.tap': 'findParkBtnOnTap',
        'google-map-search-results': 'foundResults'
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
    properties: {},

    /* Functions specific to this element go under here. */
    myLocationBtnOnTap: function (e) {
        var loc = document.querySelector('geo-location');
        var map = document.querySelector('google-map');
        map.latitude = loc.latitude;
        map.longitude = loc.longitude;
        map.zoom = 15;
    },

    foundResults: function (e) {
        var search = document.querySelector('google-map-search');
        var p = search.results[0];
        alert('The nearest park is: ' + p.name + ' (' + p.latitude + ',' + p.longitude + ')');
    },

    findParkBtnOnTap: function (e) {
        var search = document.querySelector('google-map-search');
        //search.longitude = parseFloat(51.5072);
        //search.latitude = parseFloat(0.1275);
        search.radius = parseFloat(1000);
        search.query = 'park';
        search.types = 'park';
        search.search();
    }
});
