var express = require('express');
var router = express.Router();




router.get('/recommend', function(req, res, next) {

  // breq = {
  //   request:'recipeAction/getRecommend'
  // }
  
  // global.backend.request(breq).then(function(socket){
  //   socket.on('data',function(data){
  //     var rs = JSON.parse(data)  
  //     res.json(rs);
      
  //   }).catch(function(err){
  //     console.log(err)
  //   })
  // });

  var rs = [
  {
    "icon":'https://beerrecipes.org/images/bgpaleale100.gif',
    "title": "Laoda's Dry Irish Stout",
    "type": "Dry Stout",
    "batch": 20,
    "abv": 4.2,
    "og": 13.4,
    "fg": 2.6,
    "ibu": 42,
    "color": 32.6,
    "url": "http://www.deyatech.com"
  },
  {
    "icon":'https://beerrecipes.org/images/bgbarleywine100.gif',
    "title": "Laoda's Dry Irish Stout",
    "type": "Dry Stout",
    "batch": 20,
    "abv": 4.2,
    "og": 13.4,
    "fg": 2.6,
    "ibu": 42,
    "color": 32.6,
    "url": "http://www.deyatech.com"
  },
  {
    "icon":'https://beerrecipes.org/images/bgbock100.gif',
    "title": "Laoda's Dry Irish Stout",
    "type": "Dry Stout",
    "batch": 20,
    "abv": 4.2,
    "og": 13.4,
    "fg": 2.6,
    "ibu": 42,
    "color": 32.6,
    "url": "http://www.deyatech.com"
  },
  {
    "icon":'https://beerrecipes.org/images/bgamberlager100.gif',
    "title": "Laoda's Dry Irish Stout",
    "type": "Dry Stout",
    "batch": 20,
    "abv": 4.2,
    "og": 13.4,
    "fg": 2.6,
    "ibu": 42,
    "color": 32.6,
    "url": "http://www.deyatech.com"
  },
  {
    "icon":'https://beerrecipes.org/images/bgwit100.gif',
    "title": "Laoda's Dry Irish Stout",
    "type": "Dry Stout",
    "batch": 20,
    "abv": 4.2,
    "og": 13.4,
    "fg": 2.6,
    "ibu": 42,
    "color": 32.6,
    "url": "http://www.deyatech.com"
  },
  {
    "icon":'https://beerrecipes.org/images/bgsaison100.gif',
    "title": "Laoda's Dry Irish Stout",
    "type": "Dry Stout",
    "batch": 20,
    "abv": 4.2,
    "og": 13.4,
    "fg": 2.6,
    "ibu": 42,
    "color": 32.6,
    "url": "http://www.deyatech.com"
  }

  ]
  res.json(rs);

});

module.exports = router;
