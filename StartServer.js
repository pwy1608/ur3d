var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var path = require('path');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname ,'/images')));
app.use(express.static(path.join(__dirname ,'/assets/css')));
app.use(express.static(path.join(__dirname ,'/assets/js')));

//main page
app.get('/',function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/html' });

	// .html and .css files send
	res.write(fs.readFileSync('index.html'));
	res.write('<style>' + fs.readFileSync('./assets/css/main.css') + '</style>');
	res.write('<link rel="SHORTCUT ICON" href="./images/favicon.ico" />');
	res.write('<link rel="icon" href="./images/favicon.ico" type="image/ico" />');
	res.write('<link rel="stylesheet" href="https://opensource.keycdn.com/fontawesome/4.7.0/font-awesome.min.css" />');

	// .js files send
	res.write('<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>');
	res.write('<script>' + fs.readFileSync('./assets/js/jquery.poptrox.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/jquery.scrolly.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/jquery.scrollex.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/skel.min.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/util.js') + '</script>');
	res.write('<script>' + fs.readFileSync('./assets/js/main.js') + '</script>');

	res.end();
});

//3d viewer page
app.get('/:id',function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write('<script src="https://ajax.googleapis.com/ajax/libs/threejs/r76/three.min.js"></script>');
	res.write('<script>' + fs.readFileSync("./assets/js/stats.min.js") + '</script>');
	res.write('<script>' + fs.readFileSync("./assets/js/Detector.js") + '</script>');
	res.write('<script>' + fs.readFileSync("./assets/js/OrbitControls.js") + '</script>');
	res.write('<script>' + fs.readFileSync("./assets/js/PLYLoader.js") + '</script>');
	res.write('<script>' + fs.readFileSync("./assets/js/TrackballControls.js") + '</script>');
	res.write(fs.readFileSync(req.params.id));

	// .js files send

	res.end();
});

//file uplaod
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

//start server
app.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});

/*  //send .ply file
    fs.readFile('example.ply', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        response.end(data);
    });
*/
