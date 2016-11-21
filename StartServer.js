var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var path = require('path');
var app = express();

app.use(express.static('images'));
app.use(express.static('assets/css'));
app.use(express.static('assets/js'));

app.get('/',function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write('<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>');
	res.write('<script src="https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js"></script>');
	res.write('<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>');
	res.write('<link href="https://opensource.keycdn.com/fontawesome/4.7.0/font-awesome.min.css" />');

	fs.readFile('./assets/js/main.js', function (error, data) {
		res.write('<script>' + data + '</script>')});
	fs.readFile('./assets/css/main.css', function (error, data) {
		res.write('<style>' + data + '</style>')});
	fs.readFile('./assets/js/jquery.poptrox.min.js', function (error, data) {
		res.write('<script>' + data + '</script>')});
	fs.readFile('./assets/js/jquery.scrolly.min.js', function (error, data) {
		res.write('<script>' + data + '</script>')});
	fs.readFile('./assets/js/jquery.scrollex.min.js', function (error, data) {
		res.write('<script>' + data + '</script>')});
	fs.readFile('./assets/js/skel.min.js', function (error, data) {
		res.write('<script>' + data + '</script>')});
	fs.readFile('./assets/js/util.js', function (error, data) {
		res.write('<script>' + data + '</script>')});
	fs.readFile('index.html', function (error, data) {
		res.write(data, function (error) {
			console.log(error);
    });
  });
	res.end();
});

app.get('/plyControl.html',function(req, res){
	fs.readFile('plyControl.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data, function (error) {
            console.log(error);
        });
    });
});

app.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});

app.post('/upload', function(req, res, next) {
	var form = new multiparty.Form();

	// track progress
	form.on('progress',function(byteRead,byteExpected){
		console.log(' Reading total  ' + byteRead + '/' + byteExpected);
	});

	//get field name & value
	form.on('field',function(name,value){
		console.log('normal field / name = ' + name + ' , value = ' + value);
	});

	// file upload handling
	form.on('part',function(part){
		var filename;
		var size;
		if (part.filename) {
			filename = part.filename;
			size = part.byteCount;
		}else{
			part.resume();
		}
		console.log("Write Streaming file : " + filename);
		var writeStream = fs.createWriteStream('models/ply/' + filename);
		writeStream.filename = filename;
		part.pipe(writeStream);

		part.on('data',function(chunk){
			console.log(filename+' read ' + chunk.length + 'bytes');
		});

		part.on('end',function(){
			console.log(filename + ' Part read complete');
			writeStream.end();
		});
	});

	// all uploads are completed
	form.on('close',function(){
		var sendMessage = "<script> alert('Upload complete'); ";
		sendMessage += "redirect('/')</script>";

		res.status(200).send(sendMessage);
	});

	form.parse(req);
});


/*  //send .ply file
    fs.readFile('example.ply', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        response.end(data);
    });
*/
