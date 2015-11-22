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
        'getDirBtn.tap':'getDirBtnOnTap',
        'ajax.response': 'ajaxResponse',
        'ajax.error': 'ajaxError'
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
        path: {
            type: Array,
            value: []
        }

    },

    /* Functions specific to this element go under here. */
    getDirBtnOnTap: function (e) {
        var ajax = this.$.ajax;

        ajax.params = {
            start: 'W1T4QB',
            destination: 'WC1E6BT'
        };

        ajax.generateRequest();
    },
    ajaxResponse: function (e) {
        var detail = e.detail;
        var encodedPath = detail.response.polyline;

        var mapAPI = this.$['map-canvas'].$.api.api;
        var decodedPath = mapAPI.geometry.encoding.decodePath(encodedPath);

        // HACK: Item in template repeat does not seem to be able to access functions at bind
        for (var i = 0; i < decodedPath.length; i++) {
            decodedPath[i].lat = decodedPath[i].lat();
            decodedPath[i].lng = decodedPath[i].lng();
        }

        this.path = decodedPath;
    },
    ajaxError: function (e) {
        var detail = e.detail;
        console.log(detail);

        this.fire('toast-message', {
            message: 'Sorry, an error occurred while requesting a route.'
        });
    }
});

