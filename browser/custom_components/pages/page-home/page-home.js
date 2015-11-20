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
            start: 'n10lz',
            destination: 'n87ng'
        };

        console.log(ajax.requestUrl);
        ajax.generateRequest();
    },
    ajaxResponse: function (e) {
        var detail = e.detail;
        console.log(detail);

        // DEBUG: Until backend is finalised.
        var encodedPolyline = 'whqyH|{TJf@LRNLdB`@JJ@fDA?A?A?CBEHADg@?_AAoCMyNi@aBEMD?AAAC?C@EGA@CACC?AeBv@g@TeBfAwFlDoAz@e@ZQRi@j@sB`C}@pA[n@}@dDEV?N_B?eCEcBAg@?\nCICW@_AAoEAkCBeFCaDCsBAuDOc@Ie@SOe@YoA@g@o@}AsAyC_AwDcCeKyBbB}BfBg@f@eB`B}AfB{@~@aFpFwI|ImAhAmBvByCzCoEpE}DpD{DhDkBbB]^g@d@c@Tc@J}@Dq@B_BPwA\\m@V_@TiAl@oAz@]\\y@nA{@dBcArBmAhAy@ZWFgAPU@YEcAa@i@UgBu@iDsBeA{@{CyC}DeEaAUq@GgBMIHi@FWA[HoA`@UYy@a@gDMSEuBGS@oDM}Ca@s@Uq@Yw@k@wBkAaAaAs@]q@QeAOg@GU@?@?@ABADEBA@KlBBhBJpAaB\\w@Ao@Gs@Yw@e@oCs@G`@GtBEpE';

        var mapAPI = this.$['map-canvas'].$.api.api;

        var fromBackend = mapAPI.geometry.encoding.decodePath(encodedPolyline);

        for (var i = 0; i < fromBackend.length; i++) {
            fromBackend[i].lat = fromBackend[i].lat();
            fromBackend[i].lng = fromBackend[i].lng();
        }

        this.set('path', fromBackend);
    },
    ajaxError: function (e) {
        var detail = e.detail;
        console.log(detail);

        this.fire('toast-message', {
            message: 'Sorry, an error occurred while requesting a route.'
        });

        // DEBUG: Until Backend is finalised.
        this.ajaxResponse(e);
    }
});

