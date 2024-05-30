const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(req, res){

    fs.readdir(`./files`, function(err, files){
        if(err){
            res.send(err);
        }
        else{
            res.render("index",{files});
        }
    })
})

app.get("/create", function(req, res){
    res.render("create");
})

app.post("/create", function(req, res){

    function dateCalculator(){
        const date = new Date();
        const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
        const month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function getUniqueFilename(folderPath, baseFilename) {
        let filename = baseFilename;
        let suffix = 1;
        while (fs.existsSync(path.join(folderPath, filename + '.txt'))) {
            filename = `${baseFilename}(${suffix})`;
            suffix++;
        }
        return filename + '.txt';
    }

    const todaysDate = dateCalculator();
    const folderPath = './files'; // Change this to the path where you want to save the files
    const baseFilename = todaysDate;
    const filePath = path.join(folderPath, getUniqueFilename(folderPath, baseFilename));

    fs.writeFile(filePath, req.body.data, "utf-8", function(err){
        if(err){
            res.send(err);
        }
        else{
            console.log("File created");
            res.redirect("/");
        }
    });
});

app.get("/edit/:filename", function(req, res){
    fs.readFile(`./files/${req.params.filename}`, function(err, data){
        if(err){
            res.send(err);
        }
        else{
            res.render("edit", {filename: req.params.filename, data});
        }
    })
})

app.post("/edit/:filename", function(req, res){
    
    fs.writeFile(`./files/${req.params.filename}`, `${req.body.data}`, function(err){
        if(err){
            console.log(err.message);
        }
        else{
            console.log("file updated");
            res.redirect("/");
        }
    })
})

app.get("/read/:filename", function(req, res){
    fs.readFile(`./files/${req.params.filename}`, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            res.render("read", {filename : req.params.filename, data});
        }
    })
})

app.get("/check/:filename", function(req, res){
    res.render("delete", {filename : req.params.filename});
})

app.get("/delete/:filename", function(req, res){

    fs.unlink(`./files/${req.params.filename}`, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("file deleted");
            res.redirect("/");
        }
    })
})

app.listen(3000);