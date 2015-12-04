chai.should();

describe('<no2pollution-search>', function () {
    var element;

    before(function (done) {
        element = document.querySelector('no2pollution-search');
        element.map = document.querySelector('google-map').map;

        var handle = window.setInterval(function () {
            if (element.$.api.libraryLoaded) {
                done();
                window.clearInterval(handle);
            }
        }, 100);
    });

    it('should open dialog box on calling "openSearchDialog"', function () {
        element.openSearchDialog();
        var searchDialog = element.querySelector('#search-dialog');
        searchDialog.opened.should.equal(true);
    });

    it('should show markers on submitting', function (done) {
        var input = element.querySelector('#search-input');
        input.value = 'University College London, Gower Street, London, United Kingdom';

        var button = element.querySelector('#search-submit');
        button.click();

        var searchDialog = element.querySelector('#search-dialog');
        searchDialog.opened.should.equal(false);

        var markersContainer = element.querySelector('#markers');
        var handle = window.setInterval(function () {
            if (markersContainer.childNodes.length > 1) {
                var markers = markersContainer.querySelectorAll('google-map-marker');

                for (var i = 0; i < markers.length; i++) {
                    var epsilon = 0.001;
                    if (Math.abs(markers[i].latitude - 51.5245592) < epsilon &&
                        Math.abs(markers[i].longitude - (-0.1340401)) < epsilon) {
                        window.clearInterval(handle);
                        done();
                    }
                }
            }
        }, 100);
    });

    it('should clear dialog box on next open', function () {
        var input = element.querySelector('#search-input');
        input.value = 'University College London, Gower Street, London, United Kingdom';

        var searchDialog = element.querySelector('#search-dialog');
        searchDialog.opened.should.equal(false);

        element.openSearchDialog();
        input.value.should.equal('');
    });
});
