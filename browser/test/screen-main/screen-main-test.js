chai.should();

describe('<screen-main>', function () {
    function listenToEventOnce(eventName, done, assertions) {
        function listener(event) {
            if (assertions) {
                assertions(event);
            }

            window.removeEventListener(eventName, listener);
            done();
        }

        window.addEventListener(eventName, listener);
    }

    var screenMain;

    before(function () {
        screenMain = document.querySelector('screen-main');
    });

    it('should inherit PageBehavior', function () {
        screenMain.should.have.property('pages');
    });

    it('should template navigation items from PageBehavior', function () {
        var pages = screenMain.pages;

        var navigationItems = screenMain.querySelectorAll('.navigation-item');
        for (var i = 0; i < pages.length; i++) {
            navigationItems[i].textContent.should.equal(pages[i].title);
        }
    });

    it('should set hash to "#/home/" on first navigation', function (done) {
        function assertions() {
            window.location.hash.should.equal('#/home/');
            done();
        }

        if (window.location.hash === '') {
            window.addEventListener('hashchange', assertions);
        }
        else {
            assertions();
        }
    });

    it('should select Home navigation item on first navigation', function () {
        var pages = screenMain.pages;
        var navigationItems = screenMain.querySelectorAll('.navigation-item');

        for (var i = 0; i < pages.length; i++) {
            if (pages[i].title === 'Home') {
                navigationItems[i].classList.contains('iron-selected').should.equal(true);
            }
            else {
                navigationItems[i].classList.contains('iron-selected').should.equal(false);
            }
        }
    });

    it('should fire "page-changed" on changing hash location', function (done) {
        function assertions(event) {
            var detail = event.detail;
            detail.tag.should.equal('/about/');
            detail.element.should.equal('page-about');
        }

        listenToEventOnce('page-changed', done, assertions);
        window.location.hash = '/about/';
    });

    it('should fire "page-changed" on clicking a navigation item', function (done) {
        function assertions(event) {
            var detail = event.detail;
            detail.tag.should.equal('/home/');
            detail.element.should.equal('page-home');
            window.location.hash.should.equal('#/home/');
        }

        listenToEventOnce('page-changed', done, assertions);
        var item = screenMain.querySelectorAll('.navigation-item')[0];
        item.click();
    });
});
