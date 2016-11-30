var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');
var path = require('path');
var app = express();

app.use('/assets/css',express.static(path.join(__dirname ,'/assets/css')));
app.use('/assets/fonts',express.static(path.join(__dirname ,'/assets/fonts')));
app.use('/assets/js',express.static(path.join(__dirname ,'/assets/js')));
app.use('/images',express.static(path.join(__dirname ,'/images')));
app.use('/images/logos',express.static(path.join(__dirname ,'/images/logos')));
app.use('/models/ply',express.static(path.join(__dirname ,'/models/ply')));

function routeMainPage(res, alertMessage){
	var fileList = getFileNames(__dirname + '/models/ply', 'ply');
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write(fs.readFileSync('index.html'));
	res.write('<span id="fileList"><!--,' + fileList + ',--></span>');
	if(alertMessage){
		res.end("<script>alert('" + alertMessage + "');</script>");
	}else{
		res.end();
	}
}

//route main page
app.get('/',function(req, res){
	routeMainPage(res);
	// console.log(req.session.username);
});

//route 3d viewer page
app.get('/:id',function(req, res){
	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.end(fs.readFileSync(req.params.id));
});

//file uplaod
app.post('/', function(req, res, next) {
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
		var sendMessage = fileName ? 'Upload complete' : 'file is undefined';
		routeMainPage(res, sendMessage);
	});
	form.parse(req);
});

//start server
app.listen(52273, function () {
    console.log('Server Running at http://127.0.0.1:52273');
});

//get array of file names that have specified extextion in folder
//if you want to get all of file names, use '*'
function getFileNames(dir, ext){
	var files = fs.readdirSync(dir);
	if(ext != '*'){
		for(var i in files){
			var extension = files[i].split('.')[files[i].split('.').length-1];
			if(extension != ext){
				files.splice(i,1);
			}
		}
	}
	return files;
}

/*  //send .ply file
    fs.readFile('example.ply', function (error, data) {
        response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
        response.end(data);
    });
*/
