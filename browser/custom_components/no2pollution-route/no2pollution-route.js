App.Elements['no2pollution-route'] = Polymer({
    is: 'no2pollution-route',

    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    attached: function () {
        this.async(this.ajaxResponse, 1000);
    },

    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    //behaviors: [],

    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'ajax.response': 'ajaxResponse',
        'ajax.error': 'ajaxError',
        'template-paths.dom-change': 'setupInfo'
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

        infoWindows: {
            type: Array,
            value: []
        },
        sliderValue: {
            type: Number,
            value: 0,
            observer: 'sliderChanged'
        }
    },

    /* Functions specific to this element go under here. */
    sendRequest: function (start, destination) {
        var ajax = this.$.ajax;

        ajax.params = {
            start: start,
            end: destination
        };

        ajax.generateRequest();
    },
    ajaxResponse: function (e) {
        //var detail = e.detail.response;
        var detail = [{ "start": "e179nj", "end": "wc1e6bt", "polyline": "muyyHnpAc@uBl@YtCwApB}@bA[jImCtCcAbAg@lBwAh@a@t@rDZbBVl@T`@pAlAfDtEx@hAbCzD`CtD`ApBLZh@lBBXtAnFTlA^rCVhB`@~BlBtI\\fBZxAnDpN\\bAzAtF|@xC`D~LxC`M~@tClAjETp@H`@L`@P`@x@lCj@dBL`@|BrHpAnEz@bCvDlLl@hBbEjMvDvLtBpFpAzDn@jBjDbLfDhKnAxIHFDR\\vAJFNPFLBHlAt@vABt@IbAWd@OjAo@`@dBh@nC@FAHIJJtAVtFDv@ELC^^HdGlKXKP`AtCbFzF~G@TB\\l@nI\\pGRnBRhARp@Lb@l@rCFr@P~D?XFhEWhAi@|ABFANCBXlAT`BNhBJnBT`C\\rAf@fBvA|Ch@tAZhAXjEfArBbAjBD?BJFN`@n@LVBCDB@HADdCdE~@bBpBfCLHP?AfBCtBDjE@~DIrBKvC`Bj@fAn@z@t@tAnBvAdCdA|AhCzDvCzE|BnExAhE`AnCjAfDfArBfEjInB|DXd@`@j@l@p@xAhB|AtBd@d@~@rAn@~@bAzAl@jAZf@V~@lAtDZhAHb@d@X`@\\nCnCrBhBz@l@lAt@f@RRTPBpANp@Dh@BDhDFbGBrDBfAXrEZdIj@xQVrHF~BPhEDtCTrBZdKB|@H^Fd@Rv@nAfEx@~B|AdF|@lCHd@`@lAx@`CvAxErBlHz@`D`DxM\\`B~AfHHf@Hl@ON?@?@@FBD`@_@ZYPKJJHJ`@c@vCgDHG}@sC", "distance": 12068.522436895895, "maxNO2": 56, "avgNO2": 41, "maxO3": 23, "avgO3": 25, "maxPM10": 15, "avgPM10": 16, "maxPM25": 6, "avgPM25": 6 }, { "start": "e179nj", "end": "wc1e6bt", "polyline": "muyyHnpAc@uBl@YtCwApB}@bA[jImCtCcAbAg@lBwAh@a@t@rDZbBVl@T`@pAlAfDtEx@hAbCzD`CtD`ApBLZh@lBBXtAnFTlA^rCVhB`@~BlBtI\\fBZxAnDpN\\bAzAtF|@xC`D~LxC`M~@tClAjETp@H`@L`@P`@x@lCj@dBL`@|BrHpAnEz@bCvDlLl@hBbEjMvDvLtBpFpAzDn@jBjDbLfDhKnAxIHFDR\\vAJFNPFLBHlAt@vABt@IbAWd@OjAo@`@dBh@nC@FAHIJJtAVtFDv@ELC^^HdGlKXKP`AtCbFzF~G@TB\\l@nI\\pGRnBRhARp@Lb@l@rCFr@P~D?XFhEWhAi@|ABFANCBXlAT`BNhBJnBT`C\\rAf@fBvA|Ch@tAZhAXjEfArBbAjBD?BJFN`@n@LVBCDB@HADdCdE~@bBpBfCLHP?AfBCtBDjE@~DIrBKvC]vEs@lPCTM`DE|@A\\AzAEbCDfDEtEQxD@t@vA|H\\vBxA|JLlBDlAAPDjB@p@GbA@HDVFNFJDBP@GrCDPLNNl@X~BVIV@TDRPNNFNVv@Tp@JTLLNF?LCnBBnBDZJ\\FRb@fDfAzG`@zBb@fDtAhK@?@?@@@D?DADABBJAD@DDD@?hBdLhAfFT`Bx@GvASpBMdD_@xFm@`CUnBMtBTdEd@nATp@Jd@Fl@JLHTZbCfDt@dA`@^V^Zh@dCdDhBjCXZ^^ZRtANbAHRABj@JlDBZVtAjAbEx@|B`AtC~AhFR|@~@vCx@bC^nAvBhHhAlEzB`J`ArEv@bDt@pDNbAOP@F@@@DDGj@i@\\STVzBkCfAgA}@sC", "distance": 12509.169636779592, "maxNO2": 69, "avgNO2": 48, "maxO3": 39, "avgO3": 37, "maxPM10": 13, "avgPM10": 13, "maxPM25": 9, "avgPM25": 6 }, { "start": "e179nj", "end": "wc1e6bt", "polyline": "muyyHnpAd@vBsBbBwCjBw@j@R~FfAdLF\\L\\HbCR~AVfDRpCb@nGz@fNLvBNzBXzGA\\Tz@BpAHbBXzCp@hF`@bCt@~D?Hb@tA{@r@q@r@O|@HPJ\\lCxUz@pGp@~E`AbDx@rCN`A`@vCf@dHJlAh@lFXtBt@zEv@jEn@fCl@fBx@~A~@vBhAhDJRRNfAd@zFvE^\\l@nAj@~@NP~@x@rA|@`Af@Tr@Jb@LHHAKzAYr@Yj@G\\Fb@HbAHzCFrADvBBBCDRb@Zd@Zp@t@bBx@fBtA|Dd@`B`AfCjA~CVVNB`@BPGDBV\\Zy@JWX\\pAvC|A`DhB`EhCfF|@l@d@JpAVRTRVHJDd@DfBh@lCLl@V?tBCTEnAe@x@vDvAlGHZpAbEPt@|ARrAVbBd@jBXIzBKhBGbAQt@EfAA~CIrE?bCLrCNjGHb@tA`F\\`ARbAN|@NtB@f@CBCH?JBFB@?f@?v@Bf@JbANl@RZV`@f@v@d@|@~@pB^f@zAzAv@|Av@lBzCnGn@`Bd@dBVCZlAv@jCz@rDdAfEj@|AfB|DFf@FrJ@`GS?^dHHzCDzG@rGpA?fDl@`@AdAUZbFPvBNClAQ`@BTFVPp@p@\\l@\\|@T~@XhC\\|CN`APf@`A|AjB`C\\j@HQJOPVxB|E\\z@d@dCdBjHb@rBRx@`GhOtAnDH`@@hA?VdE]~Dc@bEa@zASlD]tAMx@GvAS`CQnKiA`CUnBMtBTdEd@nATp@Jz@LVDLHrAhBdAxAt@dA`@^V^Zh@dCdDhBjC^`@XXZRtANbAHRABj@JlDBZLn@Hd@l@vB\\jA^|@t@zB`BlFb@tAR|@~@vCx@bC`C`InAxEvAxFr@rC`ArEv@bDt@pDNbAON?DBD@DDGj@i@\\STVzBkCfAgA}@sC", "distance": 12793.119315919275, "maxNO2": 55, "avgNO2": 41, "maxO3": 33, "avgO3": 35, "maxPM10": 16, "avgPM10": 13, "maxPM25": 8, "avgPM25": 7 }];

        this.paths = [];

        for (var i = 0; i < detail.length; i++) {
            var item = detail[i];
            var encodedPath = item.polyline;

            var decodedPath = google.maps.geometry.encoding.decodePath(encodedPath);

            // HACK: Item in template repeat does not seem to be able to access functions at bind
            for (var j = 0; j < decodedPath.length; j++) {
                decodedPath[j].lat = decodedPath[j].lat();
                decodedPath[j].lng = decodedPath[j].lng();
            }

            var pollutionRating = item.avgNO2 + item.avgO3 + 1.5 * item.avgPM10 + 1.5 * item.avgPM25;
            detail[i].pollutionRating = Math.round(pollutionRating);
            detail[i].polyline = decodedPath;
        }

        this.paths = detail;
    },
    setupInfo: function (e) {
        this.async(function () {
            var polylines = document.querySelectorAll('google-map-poly');

            function polylineHover(index, e) {
                var polyline = polylines[index];
                polyline.strokeColor = '#000';
                polyline.zIndex = 2;

                var infoWindow = this.infoWindows[index];
                var position = {
                    lat: e.latLng.lat() + 0.0002,
                    lng: e.latLng.lng()
                };
                infoWindow.setPosition(position);
                infoWindow.open(this.map);
            }

            function polylineExit(index) {
                var polyline = polylines[index];
                polyline.strokeColor = '#999';
                polyline.zIndex = 0;

                // Closing immediately causes far too much flashing.
                // Temporarily just disabling it for now.
                //var infoWindow = this.infoWindows[index];
                //infoWindow.close();
            }

            for (var k = 0; k < polylines.length; k++) {
                var infoWindow = new google.maps.InfoWindow({
                    content: '<p>Distance: ' + this.paths[k].distance + '</p>' + '<p>Pollution Rating: ' + this.paths[k].pollutionRating + '</p>'
                });

                this.infoWindows[k] = infoWindow;

                polylines[k].poly.addListener('mousemove', polylineHover.bind(this, k));
                polylines[k].poly.addListener('mouseout', polylineExit.bind(this, k));
            }
        }, 500);
    },
    ajaxError: function (e) {
        var detail = e.detail;
        console.log(detail);

        this.fire('toast-message', {
            message: 'Sorry, an error occurred while requesting a route.'
        });
    },

    sliderChanged: function (n) {
        if (this.paths) {
            this.infoWindows.map(function (info) {
                info.close();
            });

            var rating = n * 20;
            var polylines = this.querySelectorAll('google-map-poly');
            for (var i = 0; i < polylines.length; i++) {
                if (polylines[i].rating >= rating) {
                    polylines[i].setAttribute('hidden', '');
                }
                else {
                    polylines[i].removeAttribute('hidden');
                }
            }
        }
    }
});
