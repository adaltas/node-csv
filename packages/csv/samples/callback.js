
// Import the package
import {generate, parse, transform, stringify} from 'csv';

// Run the pipeline
generate({seed: 1, columns: 2, length: 20}, function(err, data){
  parse(data, function(err, data){
    transform(data, function(data){
      return data.map(function(value){return value.toUpperCase();});
    }, function(err, data){
      stringify(data, function(err, data){
        process.stdout.write(data);
      });
    });
  });
});
