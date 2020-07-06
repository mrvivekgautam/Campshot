var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campshot = require("./models/campshot");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

mongoose.connect('mongodb://localhost:27017/camp_shot', {useNewUrlParser: true, useUnifiedTopology: true}); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//=======Passport Configuration=======

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.get("/",function(req,res){
	res.render("landing");
});

app.get("/campshots",function(req,res){
	Campshot.find({}, function(err,allcampshots){
		if(err){
			console.log(err);
		} else {
			res.render("campshots/index" ,{campshots:allcampshots});
		}
	});  
});

app.post("/campshots" , function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var newCampshot = {name:name , image:image , description:description};
	
    Campshot.create(newCampshot, function(err , newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campshots");
		}
	});
});

app.get("/campshots/new" , function(req,res){
	res.render("campshots/new");
});

app.get("/campshots/:id" , function(req,res){
	Campshot.findById(req.params.id).populate("comments").exec(function(err,foundCampshot){
		if(err){
			console.log(err);
		} else{
			res.render("campshots/show", {campshot: foundCampshot});
		}
	});
});

//=======COMMENTS=======

app.get("/campshots/:id/comments/new", isLoggedIn, function(req, res){
    Campshot.findById(req.params.id, function(err, campshot){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campshot: campshot});
        }
    });
});

app.post("/campshots/:id/comments", isLoggedIn, function(req, res){
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

//=======Auth Routes=======

app.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campshots"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});

// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campshots",
        failureRedirect: "/login"
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campshots");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
	console.log("Server Started ");
});