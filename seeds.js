var mongoose = require("mongoose");
var Campshot = require("./models/campshot");
var Comment   = require("./models/comment");

var data = [
	{
		name : "Big Lake Campground",
		image: "https://s3.ap-south-1.amazonaws.com/campmonk.com/campsites/a3645ae0-5d89-11e8-a067-0953b8f7d661.jpeg",
		description: "Feel the earth, listen in on zephyr discourse. No walls to shade the breaking orange horizon, just you and the stars above. The best way to experience the outdoors camping near Bangalore!"
	},
	
	{
		name : "Big Lake Campground",
		image: "https://s3.ap-south-1.amazonaws.com/campmonk.com/campsites/a3645ae0-5d89-11e8-a067-0953b8f7d661.jpeg",
		description: "Feel the earth, listen in on zephyr discourse. No walls to shade the breaking orange horizon, just you and the stars above. The best way to experience the outdoors camping near Bangalore!"
	},
	
	{
		name : "Big Lake Campground",
		image: "https://s3.ap-south-1.amazonaws.com/campmonk.com/campsites/a3645ae0-5d89-11e8-a067-0953b8f7d661.jpeg",
		description: "Feel the earth, listen in on zephyr discourse. No walls to shade the breaking orange horizon, just you and the stars above. The best way to experience the outdoors camping near Bangalore!"
	}	
]

function seedDB(){
   Campshot.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campshots!");
	   
for(var i=0;i<data.length;i++){
	Campshot.create(data[i], function(err, campshot){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a campshot!");
					Comment.create({text: "Amazing Place",
								   author : "Vivek"
								   }, function(err, comment){
						if(err){
							console.log(err);
						}
						else{
							campshot.comments.push(comment);
							campshot.save();
						    console.log("Created New Comment");
						}
					});
	}
	});
// }
   });
}
	   
module.exports = seedDB;