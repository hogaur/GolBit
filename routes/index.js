var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res) {
  var fields = { subject: 1, body: 1, tags: 1, created: 1, author: 1 };
  var db=req.db;
  var collection=db.get('blogcollection');
  collection.find( {state: "published"}, {}, function(err, posts) {
    // console.log(err);
    // console.log(posts);
    if (!err && posts) {
      res.render('index', { title: 'Blog list', postList: posts });
    }
  });
});

router.get('/post/:id', function(req, res) {
  var db=req.db;
  var collection= db.get('blogcollection');
  var ObjectID = require('mongodb').ObjectID;

  // var id = ObjectID.createFromHexString(req.params.id);
  collection.findOne({_id: new ObjectID(req.params.id) }, function(e,docs){
    // console.log(e);
    // console.log(docs);
    
    res.render('article',{
      "article":docs
    });
  });
});

// Add Comment
router.post('/post/comment',function(req,res){
  var db=req.db;
  var collection=db.get('blogcollection');
  
  var ObjectID = require('mongodb').ObjectID;
  var data = {
      name: req.body.username
    , body: req.body.comment
    , created: new Date()
  };
  // console.log("data is"+data.name);
  console.log(req.body.id);
  collection.update({_id: new ObjectID(req.body.id)},{
    $push: {
      comments:data }},{safe:true},function(err,field){
      // console.log(err);
      // console.log(field);
      
      res.redirect('/');
  });
});

// Login
router.get('/login', function(req, res) {
  res.render('login', {
    title: 'Login user'
  });
});
 
router.get('/logout',  function(req, res) {
  req.session.destroy();
  res.redirect('/');
});
 
router.post('/login', function(req, res) {
  var select = {
      user: req.body.username
    , pass: req.body.password
  };
  var db=req.db;
  var collection=db.get('usrcollection'); 
  collection.findOne(select, function(err, user) {
    if (!err && user) {
      // Found user register session
      req.session.user = user;
      res.redirect('/');
    } else {
      // User not found lets go through login again
      res.redirect('/login');
    }
 
  });
});

//Add a post
router.get('/addpost', function(req, res) {
  res.render('add', {
    title: 'Add a new post'
  });
});
 
router.post('/addpost', function(req, res) {
  var db=req.db;
  var collection=db.get('blogcollection');

  var values = {
      subject: req.body.subject
    , body: req.body.content
    , tags: req.body.tags.split(',')
    , state: 'published'
    , created: new Date()
    , modified: new Date()
    , comments: []
    , author: {
        username: req.body.username
    }
  };
  collection.insert(values, function(err, post) {
    console.log(err, post);
    res.redirect('/');
  });
});

router.get('/editpost/:postid', function(req, res) {
  var db=req.db;
  var collection= db.get('blogcollection');
  var ObjectID=require('mongodb').ObjectID;
  collection.findOne(_id= new ObjectID(req.params.postid),function(err,docs){
    res.render('edit', {
      title: 'Edit post', blogPost: docs 
    });    
  });
});
 
router.post('/editpost', function(req, res) {
  var db=req.db;
  var collection= db.get('blogcollection');
  var ObjectID=require('mongodb').ObjectID;
  collection.update({ _id: new ObjectID(req.body.postid) }, {
$set: {
subject: req.body.subject
, body: req.body.body
, tags: req.body.tags.split(',')
, modified: new Date()
}}, function(err, post) {
res.redirect('/');
});
});

router.get('/deletepost/:postid', function(req, res) {
  var db=req.db;
  var collection= db.get('blogcollection');
  var ObjectID=require('mongodb').ObjectID;
  collection.remove({ _id: new ObjectID(req.params.postid) }, function(err, field) {
    res.redirect('/');
  });
});
// router.get('/', function(req, res) {
//     res.render('index',{title: 'GolBit',});
// });

 
// router.get('/about', function(req, res) {
//     res.render('about',{title: 'About'});
// });
 
// router.get('/article', function(req, res) {
//   var db=req.db;
//   var collection= db.get('blogcollection');
//   collection.find({},{},function(e,docs){
//     res.render('blogs',{
//       "articlelist":docs
//     });
//   });
// });

// router.get('/article/:id', function(req, res) {
//   var db=req.db;
//   var collection= db.get('blogcollection');
//   var ObjectID = require('mongodb').ObjectID;

//   // var id = ObjectID.createFromHexString(req.params.id);
//   collection.findOne({_id: new ObjectID(req.params.id) }, function(e,docs){
//     console.log(e);
//     console.log(docs);
    
//     res.render('article',{
//       "article":docs
//     });
//   });
// });

module.exports = router;