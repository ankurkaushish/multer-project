var express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
// storage engine
const storage = multer.diskStorage({
    destination : './public/uploads/',
    filename: function(req , file , cb){
        cb(null,file.fieldname+ '-'+Date.now()+path.extname(file.originalname));
    }
})

//init upload
const upload = multer({
    storage : storage, limits:{fileSize:1000000000000000},
     fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
}).single('myImage');
var app = express();
app.set('view engine','ejs');
app.use(express.static('./public'));

// check file type
function checkFileType(file,cb){
    // Allowed extensoins
    const fileTypes=/jpeg|jpg|png|gif/;
    //check ext
    var extname=fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    var mimetype = fileTypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error:Images only');
    }
}


app.get('/', (req,res)=>{
    res.render("index");
})

app.post('/upload', (req,res)=>{
    upload(req,res,(err)=>{
        if(err)
        res.render('index',{msg:err});
        else
        {
            if(req.file == undefined){
                res.render("index",{
                    msg : "Error : No file selected"
                })
            }
            else{
                res.render("index",{
                    msg : "File uploaded",
                    file : `uploads/${req.file.filename}`
                });
            }
        }
    })
})

app.listen('9000',(req,res)=>{
    console.log("server is running");
})