App.Elements['no2pollution-app'] = Polymer({
    is: 'no2pollution-app',
    
    /* Lifecycle Callbacks: https://www.polymer-project.org/1.0/docs/devguide/registering-elements.html
     * Note that the order that all elements are ready may not be reliable.
     * If order is important, access sibling elements within the attached method,
     * using this.async(function).
     */
    //created: function () {},
    //ready: function () {},
    attached: function () {
        this.async(this.ajaxResponse, 2000);
    },
    
    /* https://www.polymer-project.org/1.0/docs/devguide/behaviors.html */
    //behaviors: [],
    
    /* https://www.polymer-project.org/1.0/docs/devguide/events.html#event-listeners */
    listeners: {
        'myLocationBtn.tap': 'myLocationBtnOnTap',
        'findParkBtn.tap': 'findParkBtnOnTap',
        'getDirBtn.tap': 'getDirBtnOnTap',
        'ajax.response': 'ajaxResponse',
        'ajax.error': 'ajaxError',
        'park-found': 'foundPark',
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
        criteria: "",
        srchInput: "",
        results: ""
    },
    
    /* Functions specific to this element go under here. */
    centerMap: function (lat, lng, zoom) {
        var map = document.querySelector('google-map');
        map.latitude = lat;
        map.longitude = lng;
        map.zoom = zoom;
    },
    
    setAccuracyCircle: function () {
        var myLocationMarker = document.getElementById('myLocationMarker');
        var loc = document.querySelector('geo-location');
        var radius = loc.position.coords.accuracy;
        
        console.log("Location Accuracy: " + radius);
        
        var circle = document.querySelector('map-circle');
        circle.setCircle(myLocationMarker.marker, radius);
    },
    
    myLocationBtnOnTap: function (e) {
        var loc = document.querySelector('geo-location');
        this.centerMap(loc.latitude, loc.longitude, 15);
        this.setAccuracyCircle();
    },
    
    findParkBtnOnTap: function (e) {
        var loc = document.querySelector('geo-location');
        var currentLocation = { lat: loc.latitude, lng: loc.longitude };
        
        var parkFinder = document.querySelector('park-finder');
        parkFinder.findPark(currentLocation);
    },
    
    foundPark: function (e) {
        var p = e.detail;
        this.centerMap(p.geometry.location.lat(), p.geometry.location.lng(), 15);
        var parkMarker = document.getElementById('parkMarker');
        parkMarker.latitude = p.geometry.location.lat();
        parkMarker.longitude = p.geometry.location.lng();
        parkMarker.animation = "BOUNCE";
        
        this.fire('toast-message', {
            message: 'The nearest park is: "' + p.name + '".'
        });
    },
    
    getDirBtnOnTap: function (e) {
        var srch_dialog = document.getElementById("search-dialog");
        if (srch_dialog) {
            srch_dialog.open();
        }
    },
    
    srchReqOnEnter: function (e) {
        //check if 'enter' was pressed
        if (e.keyCode === 13) {
            // Empty results array before continuing to ensure all google-map-markers
            // are correctly detached before
            this.results = [];
            
            this.set('criteria', this.srchInput);
            this.set('srchInput', '');
            var srch_dialog = document.getElementById("search-dialog");
            if (srch_dialog) {
                srch_dialog.close();
            }
        }
    },
    
    routeBtnOnTap: function (sender) {
        var location = JSON.parse(sender.getAttribute('location'));
        var postcodeRegex = /([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)/;
        // Backend currently uses postcode location to do routing.
        var postcode = location.formatted_address.match(postcodeRegex)[0];
        
        var mapsAPI = document.querySelector('google-maps-api');
        var geocoder = new mapsAPI.api.Geocoder();
        
        var currentLocation = {
            location: {
                lat: this.userLatitude,
                lng: this.userLongitude
            }
        };
        
        geocoder.geocode(currentLocation, function (results) {
            var currentPostcode = '';
            for (var i = 0; i < results.length; i++) {
                var match = results[i].formatted_address.match(postcodeRegex);
                if (match) {
                    currentPostcode = match[0];
                    break;
                }
            }
            
            postcode = postcode.replace(' ', '');
            currentPostcode = currentPostcode.replace(' ', '');
            this.sendRequest(currentPostcode, postcode);
            this.fire('toast-message', {
                message: 'Going from ' + currentPostcode + ' to ' + postcode + '.'
            });
        }.bind(this));
    },
    
    on_api_load: function () {
        var mapsAPI = document.querySelector('google-maps-api');
        var map = document.querySelector("google-map");
        var autocomplete = new mapsAPI.api.places.Autocomplete(document.getElementById("search-input-text").$.input);
        autocomplete.bindTo('bounds', map);
        var infowindow = new mapsAPI.api.InfoWindow();
        var marker = new mapsAPI.api.Marker({
            map: map.map,
            anchorPoint: new mapsAPI.api.Point(0, -29)
        });
        
        autocomplete.addListener('place_changed', function () {
            this.set('results', '');
            infowindow.close();
            marker.setVisible(false);
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
                map.map.setZoom(17);  // Why 17? Because it looks good.
            }

        });
    },
    
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
        // CrossOrigin issues again. :'D
        var detail = [{ "start": "n10lz", "end": "n87ng", "polyline": "whqyH|{TJf@LRNLdB`@JJ@fDA?A?A?CBEHADg@?_AAoCMyNi@aBEMD?AAAC?C@EGA@CACC?AeBv@g@TeBfAwFlDoAz@e@ZQRi@j@sB`C}@pA[n@y@rCG\\AZ_DCeAAgBAc@?KCICW@a@?cBAiCAkCBeFCaDC_DE{COw@YWy@Q{@@g@uB}EQc@s@wCe@sBeBgHcAv@mA~@iCtBiBfBqC`DkExEgGjGiCjCq@l@mBvBqBpB_FdFuBhBeBdB{EdEsAlAw@v@c@Tc@JaBHU?wAPcAVaA\\_@TiAl@oAz@]\\y@nA{@dBcArBmAhAy@ZWFgAPU@YEcAa@i@UgBu@}BsAqA}@{DwDkCqCq@s@_ASCAiAMmAGIHi@FWAkBj@UYg@Yg@MqCGSE{BG}BG_ACoAQmAOUKgA]y@o@cBy@YSaAaAs@]q@QcBWWBUA?BABADC@A@A?ArCDdALpAaB\\w@Ao@Gs@Yw@e@oCs@G`@GtBEpE", "distance": 6717.760143754025, "maxNO2": 69, "avgNO2": 49, "maxO3": 31, "avgO3": 28, "maxPM10": 20, "avgPM10": 15, "maxPM25": 6, "avgPM25": 7 }, { "start": "n10lz", "end": "n87ng", "polyline": "whqyH|{TC[Be@Pk@HIJGtBSAsDBWEO?QCYGMSIIEEEa@KqBs@UQq@[g@MQBGqAUsGGUMKEMi@cFc@EW@gATwBf@}FxAeBj@iA`@_A`@aD`BaH|DoBjAwCjB}AnAwClBe@Z]{@yB}EQWKNIP]k@kBaCaA}AQg@OaA]}CYiCU_A]}@]m@q@q@WQUGa@CmAPgKtBCJGJG@IGCK_EbA_GxAEpAEVODuCT{BIMESUi@]OEU@cAa@_AUsBS{@CyAOCAKe@UHUHOFQ@oDQsAMOKSUMMI?IDO]aBY_ALS@GCOOwCfFgA`BiCxCyA`CkBjDmCpFmAjD_IbUKn@GlAUjCOr@s@hB[~@}@fC_BrDcBjDMZ]d@gClBo@`@aBz@u@\\cBt@aD`BaDdBiAv@_ExBe@VIJ]b@_ASCAwCUIHi@FWA[HoA`@UYg@Yg@MqCGSE{BG}BG_ACoAQmAOUKgA]y@o@cBy@YSaAaAs@]q@QcBWWBUA?@A@AFABE@ArCDdALpAaB\\w@Ao@Gs@Yw@e@oCs@G`@GtBEpE", "distance": 7207.600690712004, "maxNO2": 65, "avgNO2": 42, "maxO3": 27, "avgO3": 24, "maxPM10": 17, "avgPM10": 13, "maxPM25": 7, "avgPM25": 7 }, { "start": "n10lz", "end": "n87ng", "polyline": "whqyH|{TC[Be@Pk@HIJGtBSAsDBWEO?QCYGMSIIEEEa@KqBs@UQq@[g@MQBGqAUsGGUMKEMi@cFKyAOkDa@oKe@FyCZuEj@oEVk@@aAGcBKMBiAKm@EQAOJONCEMG}BcAmDiB_CgAyEgCaDgBeAo@aAm@u@o@mBgBUS}BwAoBmAGm@]@SCeB]oAc@WEuAHaDBgBIuCOO@OBmAr@_@Va@JeAJiCTiD?cEIWBYXe@l@qAxBkCdEkAnB_@v@o@dAw@jAgAxBqBpDs@tAg@dAP^N^wAvBs@fAaCdEcA|AwBbCoBzCsDdHeAvBe@pAuBhG{CvIuAzDGXKxAGjAUdB_@bAuBdG_BrDy@~Aw@fB]d@aAv@uA`AuAv@q@\\{B~@iDjBqDjBiAv@aCrAcB|@g@n@aAUq@GaAIe@CEFE@u@FS@mA\\SHUYy@a@gDMSEuBGS@oDM}Ca@s@Uq@Yw@k@wBkAaAaAs@]q@QeAOg@Gc@??@?@ABADGDCnB@h@RpCaB\\w@Ao@Gs@Yw@e@oCs@Ix@KnH", "distance": 7363.43140614427, "maxNO2": 64, "avgNO2": 42, "maxO3": 23, "avgO3": 21, "maxPM10": 16, "avgPM10": 16, "maxPM25": 6, "avgPM25": 5 }];
        
        this.paths = [];
        
        for (var i = 0; i < detail.length; i++) {
            var item = detail[i];
            var encodedPath = item.polyline;
            
            var mapAPI = this.$['map-canvas'].$.api.api;
            var decodedPath = mapAPI.geometry.encoding.decodePath(encodedPath);
            
            // HACK: Item in template repeat does not seem to be able to access functions at bind
            for (var j = 0; j < decodedPath.length; j++) {
                decodedPath[j].lat = decodedPath[j].lat();
                decodedPath[j].lng = decodedPath[j].lng();
            }
            
            detail[i].polyline = decodedPath;
        }
        
        this.paths = detail;

        // TODO: Handle click events on polylines to display data.
        // TODO: Switch back to using Heroku Backend app on fixed.
    },
    setupInfo: function (e) {
        /* globals google */
        this.async(function () {
            console.log(e);
            var polylines = document.querySelectorAll('google-map-poly');
            console.log(polylines);
            function createInfoWindow(index, e) {
                var infoWindow = new google.maps.InfoWindow({
                    content: '<p>Distance: ' + this.paths[index].distance + '</p>'
                });
                
                infoWindow.setPosition(e.latLng);
                infoWindow.open(document.querySelector('#map-canvas').map);
            }
            
            for (var k = 0; k < polylines.length; k++) {
                google.maps.event.addListener(polylines[k].poly, 'click', createInfoWindow.bind(this, k));
            }
        }, 500);
    },
    ajaxError: function (e) {
        var detail = e.detail;
        console.log(detail);
        
        //this.ajaxResponse(e);
        this.fire('toast-message', {
            message: 'Sorry, an error occurred while requesting a route.'
        });
    }
});

