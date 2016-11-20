var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var app = express();

app.get('/',function(req, res){
	fs.readFile('index.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data, function (error) {
            console.log(error);
        });
		//res.send("<script> alert('hi'); </script>");
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
