var bodyParser = require('body-parser');
var http = require('http')
var path = require('path')
var express = require('express')
var app = express()
var server = http.createServer(app)
var io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))
server.listen(3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: true
}));
/*
app.get('/loginForm',function(req,res){
	var userName = req.body.userNameInput;
		console.log(userName);
	res.redirect('dashboard.html');
});*/

app.post('/loginForm',function(req,res){
	var userName = req.body.userNameInput;
	console.log(userName);
	res.redirect('dashboard.html');
});