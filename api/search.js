var express = require('express');
var router = express.Router();

var data_search_options = {
  slogan:'<h1 style="color: #349a;">我需要一把枪 <br><p style="color: gray;">射击,射击,快射击......</p></h1>',
  search_options: {
    cat1:[
        ['科学','代数','物理','化学','微积分','算法','逻辑'],
        ['','统计学','离散数学','','','','']
        ],
    cat2:[
        ['艺术','音乐','美术','建筑','雕塑','书法',''],
        ['','装置艺术','行为艺术','社会行为学','糖画','','']
        ]
  },
  search_options_Tab: {
    cat1:{
      title:'科学',
      options:[
        ['代数','物理','化学'],
        ['微积分','算法','逻辑'],
        ['统计学','离散数学','']
        ]
    },
    cat2:{
      title:'艺术',
      options:[
        ['音乐','美术','建筑'],
        ['雕塑','书法','装置艺术'],
        ['行为艺术','社会行为学','糖画']
        ]
    }
  }
}

var data_keys =[
    {keyword:"参考覅你貌似就地脚好感动"},
    {keyword:"的思考覅国内才思考就疯了疯了"},
    {keyword:"的三分大赛凑凑凑付费三分大赛"},
    {keyword:"撒地方撒打算给发的撒UI也颇有"},
    {keyword:"气温气温为亲人天天"}
    ];  

var options = function (param){
    return JSON.parse(JSON.stringify(data_search_options));
}

var keywords = function (param){
  var keys = param.keys; //req.params.keys;
  var random_keys = [];
  for (i=0;i<data_keys.length;i++){
    var inter = Math.floor(Math.random()*10);
    random_keys.push({"keyword" : data_keys[i].keyword.substring(0,inter) + " " + keys + " " + data_keys[i].keyword.substring(inter) } )  ;
  }
  return JSON.parse(JSON.stringify(random_keys));
}

/*Get*/
router.get('/options', function(req, res, next) {
  res.json(options());
});

router.get('/keywords/:keys', function(req, res, next) {
  res.json(keywords(req.param));
});

var exp = {router,options,keywords};

module.exports = router;
