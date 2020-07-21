const express = require('express')
const multer = require('multer')
const Tesseract = require('tesseract.js')

const fs = require('fs')
const path = require('path')


var app = express()

app.use(express.urlencoded({extended : true}))

app.use(express.json())

const PORT = process.env.PORT || 3000
var name = ""
var Storage = multer.diskStorage({
    destination : (req,file,callback) =>{
        callback(null,"./images")
    },
    filename: (req,file,callback)=>{
        name = file.fieldname + "_" +Date.now() + "_" + file.originalname;
        callback(null, name)
    }
})

var upload = multer({
    storage : Storage
}).array("imgUploader")


app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,'../index.html'))
})

app.post("/api/Upload", async (req,res)=>{
    console.log('reached')
    await upload(req,res,(err)=>{
        if(err){
            console.log(err)
            return res.send({"result":"File Upload Fail"});
        }
        
    })
    
    var p =path.join(__dirname,'../images/'+name)
    console.log(p)
    Tesseract.recognize(p).progress(function (p) {
        console.log('progress')
        console.log(p)
    }).catch(e => console.log(e)).then( function (result){ console.log(result.text)})
})


app.listen(PORT,()=>{
    console.log('app is listening at'+PORT)
})

