chai.should();

describe('<no2pollution-route>', function () {
	var element;

	before(function () {
		element = document.querySelector('no2pollution-route');
	});

    it('should make an ajax request on calling "sendRequest"', function () {
        var ajax = element.querySelector('#ajax');
        sinon.stub(ajax, 'generateRequest');

        element.sendRequest('N10LZ', 'N87NG');

        ajax.generateRequest.should.have.been.calledWith();
        ajax.params.should.have.property('start').which.equal('N10LZ');
        ajax.params.should.have.property('end').which.equal('N87NG');
    });
});
