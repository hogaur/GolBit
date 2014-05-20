var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });


router.get('/', function(req, res) {
    res.render('index',{title: 'GolBit',});
});

 
router.get('/about', function(req, res) {
    res.render('about',{title: 'About'});
});
 
router.get('/article', function(req, res) {
  var db=req.db;
  var collection= db.get('blogcollection');
  collection.find({},{},function(e,docs){
    res.render('blogs',{
      "articlelist":docs
    });
  });
});

router.get('/:id', function(req, res) {
  var db=req.db;
  var collection= db.get('blogcollection');
  collection.findOne({_id: collection.ObjectId(req.params.id) }, {},function(e,docs){
    render.res('article',{
      "article":docs
    });
  });
});

module.exports = router;
