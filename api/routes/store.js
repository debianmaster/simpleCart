var connection="mongodb://admin:computer@dharma.mongohq.com:10016/store";
var Server = require('mongodb').Server,
    db;
var mongodb = require('mongodb');
db = new mongodb.Db('store', new mongodb.Server('dharma.mongohq.com', 10016, {auto_reconnect:true}), {});

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
/*
db.collection('Products', function(err, collection) {
        collection.find({}, function(err, items) {
            console.log(items);
			for(var k in items){
				db.collection('Products', function(err, collection) {							
					var prdct =
					{
						name:"NRF24L01",
						title:"1PCS Arduino NRF24L01+ Wireless Transceiver Module (create star or mesh network)",	
						caption:"Easy, Cheap & long range wireless communication for MCU",
						condition:"New",
						cost:125,
						shipping:55,
						features:"We are the original importers of nordic devices, the first one to launch nRF24L01+ and nRF24LE01 in India. Please buy from us original and tested products and support innovation and research in India. When you buy from copycats, fake, and untested products, it hurts not only you in the long run, but everyone else",
						documents:"",
						contents:"<ul><li>One assembled and tested board</li><li>One 16x2 LCD</li><li>One DC Adapter (Not included in shipments out side India)</li><li>Set of 20 F-F Single Pin Connectors</li></ul>",	
						sku:"i63-NRF24L01",
						subCat:items[k].CatName+items[k].Sub,
						images:["test1.png","test2.png","test3.png","test4.png"]	
					}
					collection.insert(prdct, {safe:true}, function(err, result) {
									
					});					
				});							
			}
        });
});*/
}