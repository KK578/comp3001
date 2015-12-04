chai.should();

describe('<paper-fab-menu>', function () {
    var element;

    before(function () {
        element = document.querySelector('paper-fab-menu');
    });

    it('should template fabs', function () {
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
        var buttonContainer = element.querySelector('.dropdown-content');
        buttonContainer.childNodes.length.should.equal(3);

        for (var i = 0; i < buttons.length; i++) {
            buttonContainer[i].id.should.equal(buttons[i].id);
            buttonContainer[i].icon.should.equal(buttons[i].icon);
            var tooltip = element.querySelector('paper-tooltip[for="' + buttons[i].id + '"]');
            tooltip.textContent.should.equal(buttons[i].tooltip);
        }
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
