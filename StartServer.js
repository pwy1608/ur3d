var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var path = require('path');
var app = express();

app.use(express.static('images'));
app.use(express.static('assets/css'));
app.use(express.static('assets/js'));

app.get('/',function(req, res){
	var totalFileNum = 8;
	res.writeHead(200, { 'Content-Type': 'text/html' });

	res.write(fs.readFileSync('index.html') +
						'<style>' + fs.readFileSync('./assets/css/main.css') + '</style>');
	// res.write('<link href="https://opensource.keycdn.com/fontawesome/4.7.0/font-awesome.min.css" />');
	// res.write('<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>');
	// res.write('<script src="https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js"></script>');
	res.write('<script>' + fs.readFileSync('./assets/js/jquery.poptrox.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/jquery.scrolly.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/jquery.scrollex.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/skel.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/util.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/main.js') + '</script>');

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

app.get('/plyControl2.html',function(req, res){
	fs.readFile('plyControl2.html', function (error, data) {
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
	var fileName;

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
		var size;
		if (part.filename) {
			fileName = part.filename;
			size = part.byteCount;

			console.log("Write Streaming file : " + fileName);
			var writeStream = fs.createWriteStream('models/ply/' + fileName);
			writeStream.filename = fileName;
			part.pipe(writeStream);

			part.on('data',function(chunk){
				console.log(fileName+' read ' + chunk.length + 'bytes');
			});

			part.on('end',function(){
				console.log(fileName + ' Part read complete');
				writeStream.end();
			});
		}else{
			part.resume();
		}
	});

	// all uploads are completed
	form.on('close',function(){
		var sendMessage;
		if(fileName){
			sendMessage = "<script> alert('Upload complete'); </script>";
		}else{
			sendMessage = "<script> alert('file is undefined'); </script> ";
		}
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
