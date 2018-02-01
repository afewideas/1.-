
var config = require('config');
var port = process.env.PORT || config.get('server.port');
var hostname = process.env.HOSTNAME || config.get('server.host');
var request = require('request-json');
var api_client = request.createClient('http://'+hostname+':'+port+'/api/');

module.exports = api_client;