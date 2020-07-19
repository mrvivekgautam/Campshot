var express = require("express");
var router = express.Router();
var Campshot = require("../models/campshot");

router.get("/campshots",function(req,res){
	Campshot.find({}, function(err,allcampshots){
		if(err){
			console.log(err);
		} else {
			res.render("campshots/index" ,{campshots:allcampshots});
		}
	});  
});

router.post("/campshots" , isLoggedIn, function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var author = {
        id: req.user._id,
        username: req.user.username
    }
	var newCampshot = {name:name , image:image , description:description, author:author};
    Campshot.create(newCampshot, function(err , newlyCreated){
		if(err){
			console.log(err);
		} else{
			console.log(newlyCreated);
			res.redirect("/campshots");
		}
	});
});

router.get("/campshots/new" , isLoggedIn, function(req,res){
	res.render("campshots/new");
});

router.get("/campshots/:id" , function(req,res){
	Campshot.findById(req.params.id).populate("comments").exec(function(err,foundCampshot){
		if(err){
			console.log(err);
		} else{
			res.render("campshots/show", {campshot: foundCampshot});
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