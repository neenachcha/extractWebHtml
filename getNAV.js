var HTMLParser = require('node-html-parser');
var http = require('http');

var options = {
  host: 'codequiz.azurewebsites.net',
  path: '/',
  headers: {'Cookie': 'hasCookie=true'}
}
var req = http.request(options, function (res) {
  var data = '';
  res.on('data', function (chunk) {
    data += chunk;
  });
  res.on('end', function () {
    // goto html, body, table, tbody, start with second tr, search the first td with argument from node if true return the second td
    var root = HTMLParser.parse(data);
    var trArray = root.childNodes[1].childNodes[1].childNodes[3].childNodes;
    var object = {};
    // iterate over each tr
    trArray.forEach((tr, trIndex) => {
      var fundName;
      var tdArray = tr.childNodes;
      tdArray.forEach((td, tdIndex) => {
        if (td.childNodes[0] !== undefined) {
          var text = td.childNodes[0]._rawText.trim();
          if (td.childNodes[0] !== undefined) {
            if (trIndex !== 0) {
              if ((tdIndex === 0 && trIndex === 1 ) || (tdIndex === 1 && trIndex > 1)) {
                fundName = text;
                object[fundName] = [];
              } else {
                object[fundName].push(text)
              }
            }
          }
        }

      })
    })
    var myargv = process.argv.slice(2)[0];

    if (object[myargv] !== undefined) {
      return console.log(`${myargv}'s Nav is $${object[myargv][0]}.`);
    } else {
      return console.log('No fundName matched your request.')
    }
  });
});

req.on('error', function (e) {
  console.log(e.message);
});

req.end();