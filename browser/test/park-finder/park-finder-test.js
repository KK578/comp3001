chai.should();

describe('<park-finder>', function () {
    var element;
    var data;

    before(function () {
        element = document.querySelector('park-finder');
    });

    it.skip('should fire "park-found" on calling findPark', function (done) {
        function listener(event) {
            data = event.detail;

            window.removeEventListener('park-found', listener);
            done();
        }

        window.addEventListener('park-found', listener);
        element.findPark(51.52306998750526, -0.13208656690626874);
    });

    it.skip('should find "The Phoenix Garden" near UCL', function () {
        var epsilon = 0.0001;
        (Math.abs(data.latitude - 51.514444) < epsilon).should.equal(true);
        (Math.abs(data.longitude - (-0.128488)) < epsilon).should.equal(true);
        data.name.should.equal('The Phoenix Garden');
    });
});
