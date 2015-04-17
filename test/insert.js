var tesseract = require('../src/Tesseract.js');

// Tests for inserting new data.

exports.testInsert = function(test) {
  tesseract.connect(null, function(err, client) {
    test.equals(err, null);

    client.insert('people', {
      'name': 'Joe Bloggs'
    }, function(result) {
      test.ok(result.success);
      test.done();
      client.close();
    });
  });
};
