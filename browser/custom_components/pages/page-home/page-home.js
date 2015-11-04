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
        path: {
            type: Array,
            value: [
                { latitude: 51.525831, longitude: -0.131919 },
                { latitude: 51.526185, longitude: -0.132293 },
                { latitude: 51.525870, longitude: -0.133213 },
                { latitude: 51.523459, longitude: -0.130765 },
                { latitude: 51.523325, longitude: -0.130961 },
                { latitude: 51.523072, longitude: -0.131105 },
                { latitude: 51.522869, longitude: -0.131550 },
                { latitude: 51.523187, longitude: -0.131942 }
            ]
        }
    }

    /* Functions specific to this element go under here. */
});
