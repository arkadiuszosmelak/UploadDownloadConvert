var app = require('express')();
var http = require('http').Server(app);
var formidable = require('formidable');
const fs = require("fs");


app.get('/', function (req, res) {
    res.sendfile('index.html');
});

app.post('/', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file) {
        file.path = __dirname + '/uploads/file.jpg';
    });

    form.on('file', function (name, file) {
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/index.html');
});

app.get('/convert', function (req, res){
    const { exec } = require('child_process');
    exec('c44 uploads/file.jpg', (err, stdout, stderr) => {
        if (err) throw err;
        else console.log('Convert completed!');
    });
});

app.get('/download', function (req, res) {
    
    //Convert JPG file to DjVu
    const { exec } = require('child_process');
    exec('c44 uploads/file.jpg', (err, stdout, stderr) => {
        if (err) throw err;
        else console.log('Convert completed!');
    });

    //Size and comparison of JPG and DjVu files 
    const file1 = fs.statSync("uploads/file.jpg");
    const size1 = file1.size;

    const file2 = fs.statSync("uploads/file.djvu");
    const size2 = file2.size;

    const comparison = (size1 - size2) / 100;

    //Download convert file
    res.download(__dirname + '/uploads/file.djvu', 'convert_file.djvu');
    console.log(comparison+' Kib');
});

http.listen(3000, function () {
    console.log('listening to 3000 port');
});
