
should = require('should');
generate = require('../lib');

generate({seed: 1, columns: 2, length: 2}, function(err, output){
  output.should.eql('OMH,ONKCHhJmjadoA\nD,GeACHiN');
});
