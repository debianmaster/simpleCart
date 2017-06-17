var connection="mongodb://default:default@dharma.mongohq.com:10016/store";
var Server = require('mongodb').Server,
    db;
var mongodb = require('mongodb');
db = new mongodb.Db(process.env.MONGO_DB, new mongodb.Server(process.env.MONGO_SERVER,process.env.MONGO_PORT, {auto_reconnect:true}), {});

db.open(function(err, p_client) {  
  db.authenticate(process.env.MONGO_USER, process.env.MONGO_PASSWORD, function(err) {   
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
			console.log(err,result,"cat data inserted");	
		});					
	});
	
	var products=[ {name:"Wire",title:"Wire",img:'img/storeImages/08566-01-L_l_th.jpg',images:['storeImages/08566-01-L_l_th.jpg'],
        documents:"Wire",features:"Wire",shipping:55,caption:"",price:20,subCat:1}]
	
	db.collection('Products', function(err, collection) {							
		collection.insert(products, {safe:true}, function(err, result) {
			console.log(err,result,"products data inserted");	
		});					
	});
    }
};


