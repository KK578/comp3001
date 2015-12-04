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
        /* globals google */
        var map = document.querySelector("google-map");
        var autocomplete = new google.maps.places.Autocomplete(this.$['search-input'].$.input);
        autocomplete.bindTo('bounds', map);

        autocomplete.addListener('place_changed', function () {
            this.results = [];

            var place = autocomplete.getPlace();
            if (!place.geometry) {
                console.log(place);
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.map.fitBounds(place.geometry.viewport);
            } else {
                map.map.setCenter(place.geometry.location);
                map.map.setZoom(17);
            }

        });
    },

    openSearchDialog: function () {
        var searchInput = this.$['search-input'];
        searchInput.value = '';
        var searchDialog = this.$['search-dialog'];
        searchDialog.open();
    },
    submitSearch: function (e) {
        switch (e.type) {
            case 'tap':
                break;

            case 'keyDown':
                // Check if 'enter' was pressed
                if (e.keyCode === 13) {
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

    routeToLocation: function (sender) {
        var address = sender.getAttribute('address');
        var postcodeRegex = /([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)/;
        // Backend currently uses postcode location to do routing.
        var postcode = address.match(postcodeRegex)[0];
        postcode = postcode.replace(/ /g, '');

        this.fire('no2pollution-route', {
            destination: postcode
        });
    }
});
