var connection="mongodb://default:default@dharma.mongohq.com:10016/store";
//mongodb://app_user:password@mongodb/sampledb
var Server = require('mongodb').Server,
    db;
var mongodb = require('mongodb');
db = new mongodb.Db('store', new mongodb.Server('mongodb', 10016, {auto_reconnect:true}), {});

db.open(function(err, p_client) {  
  db.authenticate('default', 'default', function(err) {   
   if (err) console.log(err);      
   console.log("logggedin");
  });
}); 

exports.findById = function(req, res) {    
    var id = parseInt(req.params.id);    
    db.collection('Products', function(err, collection) {
        collection.findOne({'id': id}, function(err, item) {
            console.log(item);
            res.jsonp(item);
        });
    });
};
exports.getAllCategories = function(req, res) {  
	console.log('fetching....');
    db.collection('Categories', function(err, collection) {
        collection.find({}).toArray(function(err, items) { 			
			res.jsonp(items);
        });
    });
};
exports.findBySubCat = function(req, res) {
    var id = parseInt(req.params.id);    
    db.collection('Products', function(err, collection) {
        collection.find({'subCat': id}).toArray(function(err, items) {            
            res.jsonp(items);
        });
    });
};

exports.findAll = function(req, res) {
    var name = req.query["name"];
    db.collection('Products', function(err, collection) {
        if (name) {
            collection.find({"fullName": new RegExp(name, "i")}).toArray(function(err, items) {
                res.jsonp(items);
            });
        } else {
            collection.find().toArray(function(err, items) {
                res.jsonp(items);
            });
        }
    });
};

exports.insertDummyData = function(){	
	var categories = [
		{id:1,CatName:"Wireless",SubCats:[{id:1,name:"RF"},{id:2,name:"XBEE"},{id:3,name:"Wifi"},{id:4,name:"Bluetooth"}]},
		{id:2,CatName:"Development Boards",SubCats:[{id:5,name:"Arduino"},{id:6,name:"ARM"},{id:7,name:"8051"},{id:8,name:"AVR"}]},
		{id:3,CatName:"Sensors",SubCats:[{id:9,name:"Ultrasonic"},{id:10,name:"GPS"},{id:11,name:"IR"},{id:12,name:"Light"}]}
	];		
	db.collection('Categories', function(err, collection) {							
		collection.insert(categories, {safe:true}, function(err, result) {
			//update();			
		});					
	});		
};

function update()
{
	
}
