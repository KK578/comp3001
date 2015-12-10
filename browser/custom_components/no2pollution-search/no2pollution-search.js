App.Elements['no2pollution-search'] = Polymer({
    is: 'no2pollution-search',

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
        'marker-template.dom-change': 'setMarkerContent'
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
        criteria: {
            type: String
        },
        searchInput: {
            type: String
        },
        results: {
            type: Array
        }
    },

    /* Functions specific to this element go under here. */
    attachAutocomplete: function () {
        var map = document.querySelector('google-map');
        var autocomplete = new google.maps.places.Autocomplete(this.$['search-input'].$.input);
        autocomplete.bindTo('bounds', map);

        var self = this;

        autocomplete.addListener('place_changed', function () {
            this.results = [];
            var place = autocomplete.getPlace();

            if (!place.geometry) {
                console.log(place);
                return;
            }

            //Set search criteria to autocomplete result and dismiss autocomplete box
            self.criteria = place.name;
            var searchDialog = self.$['search-dialog'];
            searchDialog.close();

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                console.log('place has geo');
                map.map.fitBounds(place.geometry.viewport);
            }
            else {
                console.log('place doesnt geo');
                map.map.setCenter(place.geometry.location);
                map.map.setZoom(17);
            }
        });
    },

    openSearchDialog: function () {
        console.log('openSearchDialog');
        var searchInput = this.$['search-input'];
        searchInput.value = '';
        var searchDialog = this.$['search-dialog'];
        searchDialog.open();
    },

    submitSearch: function (e) {
        console.log('submitSearch type:'+e.type+' keycode: '+e.keyCode);
        switch (e.type) {
            case 'tap':
                break;

            case 'keydown':
                // Check if 'enter' was pressed
                if (e.keyCode === 13) {
                    console.log('Enter pressed');
                    break;
                }
                /* falls through */
            default:
                return;
        }

        // Empty results array before continuing to ensure all google-map-markers
        // are correctly detached before
        this.results = [];

        this.criteria = this.searchInput;
        this.searchInput = '';

        var searchDialog = this.$['search-dialog'];
        searchDialog.close();
    },

    setMarkerContent: function () {
        console.log('setMarkerContent size of results: '+this.results.length);
        var map = document.querySelector('google-map');

        if(this.results) {
            if(this.results.length===1) {
                var place = this.results[0];
                // If the place has a geometry, then present it on a map.
                if (place.geometry.viewport) {
                    console.log('place has geo.');
                    map.map.fitBounds(place.geometry.viewport);
                }
                else {
                    console.log('place doesnt geo.');
                    map.map.setCenter(place.geometry.location);
                    map.map.setZoom(17);
                }
            }
        }
        // Info windows don't seem to automatically set content.
        var markers = this.$.markers.childNodes;

        // Length - 1 to account for template element. (always at end of list)
        for (var i = 0; i < markers.length - 1; i++) {
            markers[i].info.setContent(markers[i].innerHTML);
        }
    },

    routeToLocation: function (sender) {
        console.log('ROUTING');
        var address = sender.getAttribute('address');
        var postcodeRegex = /([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)/;
        // Backend currently uses postcode location to do routing.
        var regexMatches = address.match(postcodeRegex);
        if (regexMatches) {
            var postcode = regexMatches[0];
            postcode = postcode.replace(/ /g, '');

            this.fire('no2pollution-route', {
                destination: postcode
            });
        }else{
            this.fire('toast-message', {
                message: 'Currently our app only works for destinations with valid UK postcodes.'
            });
        }
    }
});
