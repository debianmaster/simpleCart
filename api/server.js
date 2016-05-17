var express = require('express'),
    store = require('./routes/store');
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
var app = express();
app.configure(function() {
	app.use(allowCrossDomain);
	app.use(express.bodyParser());
});
app.get('/store/:id/byCat', store.findBySubCat);
app.get('/store/:id', store.findById);
app.get('/store', store.findAll);
app.get('/cats', store.getAllCategories);

app.listen(process.env.API_PORT || process.env.PORT || 8089);

setTimeout(function(){
	//tore.insertDummyData();
},5000);
