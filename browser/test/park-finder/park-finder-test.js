chai.should();

describe('<park-finder>', function () {
    var element;
    var data;

    before(function (done) {
        element = document.querySelector('park-finder');

        if (element.$.api.libraryLoaded) {
            done();
        }
    });

    it('should fire "park-found" on calling findPark', function (done) {
        function listener(event) {
            data = event.detail;

            window.removeEventListener('park-found', listener);
            done();
        }

        window.addEventListener('park-found', listener);
        element.findPark({
            lat: 51.52306998750526,
            lng: -0.13208656690626874
        });
    });

    it('should find "Gordon Square Garden" near UCL', function () {
        var epsilon = 0.001;
        var location = data.geometry.location;
        (Math.abs(location.lat() - 51.524302) < epsilon).should.equal(true);
        (Math.abs(location.lng() - (-0.130912)) < epsilon).should.equal(true);
        data.name.should.equal('Gordon Square Garden');
    });
});
