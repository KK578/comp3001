chai.should();

describe('<park-finder>', function () {
    var element;

    before(function (done) {
        element = document.querySelector('park-finder');

        var handle = window.setInterval(function () {
            if (element.$.api.libraryLoaded) {
                element.map = document.querySelector('google-map').map;
                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    it('should find "Gordon Square Garden" near UCL on calling findPark', function (done) {
        element.findPark({
            lat: 51.52306998750526,
            lng: -0.13208656690626874
        });

        var marker = element.$.marker;
        var handle = window.setInterval(function () {
            var epsilon = 0.001;
            if ((Math.abs(marker.latitude - 51.524302) < epsilon) &&
                (Math.abs(marker.longitude - (-0.130912)) < epsilon)) {
                window.clearInterval(handle);
                done();
            }
        }, 100);
    });

    it('should fire "no2pollution-route" on clicking "Route Me" button', function (done) {
        function listener(e) {
            e.detail.destination.should.equal('WC1H0PD');

            window.removeEventListener('no2pollution-route', listener);
            done();
        }

        window.addEventListener('no2pollution-route', listener);

        var marker = element.$.marker;
        var button = marker.querySelector('paper-button');
        button.click();
    });
});
