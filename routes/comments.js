var express = require("express");
var router  = express.Router({mergeParams: true});
var Campshot = require("../models/campshot");
var Comment = require("../models/comment");

router.get("/campshots/:id/comments/new", isLoggedIn, function(req, res){
    console.log(req.params.id)
    Campshot.findById(req.params.id, function(err, campshot){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campshot: campshot});
        }
    });
});

router.post("/campshots/:id/comments", isLoggedIn, function(req, res){
   Campshot.findById(req.params.id, function(err, campshot){
       if(err){
           console.log(err);
           res.redirect("/campshots");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campshot.comments.push(comment);
               campshot.save();
               res.redirect('/campshots/' + campshot._id);
           }
        });
       }
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
