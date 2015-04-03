exports.testConnect = function(test) {
	var tesseract = require('../tesseract.js');
	tesseract.connect(function (err) {
	    test.ok(err == null);
	    test.done();
	});
};
