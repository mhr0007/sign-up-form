require('dotenv').config();
const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = process.env.MAILCHIMP;
    const options = {
        method: "POST",
        auth: process.env.AUTH,
    };
    const request = https.request(url, options, function(response){
        if (response.statusCode === 200) res.sendFile(__dirname + "/success.html")
        else res.sendFile(__dirname + "/fail.html");
    });

    request.write(jsonData);
    request.end();
    
})


app.post("/success", function(req, res){
    res.redirect("/");
});
app.post("/fail", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port: 3000 !");
});

