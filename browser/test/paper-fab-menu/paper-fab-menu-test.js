chai.should();

describe('<paper-fab-menu>', function () {
    var element;

    before(function () {
        element = document.querySelector('paper-fab-menu');
    });

    it('should template fabs', function (done) {
        var buttons = [
            {
                id: 'btn-my-location',
                icon: 'maps:my-location',
                tooltip: 'Find my location'
            },
            {
                id: 'btn-find-park',
                icon: 'image:nature',
                tooltip: 'Find nearest park'
            },
            {
                id: 'btn-get-directions',
                icon: 'maps:directions',
                tooltip: 'Bring me somewhere!'
            }
        ];

        element.buttons = buttons;
        var buttonContainer = element.querySelector('.dropdown-content').childNodes;

        var handle = window.setInterval(function () {
            if (buttonContainer.length === 4) {
                var tooltips = element.querySelectorAll('paper-tooltip');
                window.clearInterval(handle);

                for (var i = 0; i < buttons.length; i++) {
                    buttonContainer[i].id.should.equal(buttons[i].id);
                    buttonContainer[i].icon.should.equal(buttons[i].icon);
                    tooltips[i].textContent.should.equal(buttons[i].tooltip);
                }

                done();
            }
        }, 100);
    });

    it('should call callback on click', function (done) {
        element.buttons = [
            {
                id: 'btn-my-location',
                icon: 'maps:my-location',
                tooltip: 'Find my location',
                callback: function () {
                    done();
                }
            }
        ];

        var button = element.querySelector('#btn-my-location');
        button.click();
    });
});
