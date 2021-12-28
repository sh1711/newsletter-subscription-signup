//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
    console.log("home get");
});

app.post("/", function (req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const userData = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname
            }
        }]
    };
    const jsonData = JSON.stringify(userData);

    const url = "https://us20.api.mailchimp.com/3.0/lists/34ab97f5e8";
    const options = {
        method: "POST",
        auth: "shinehtet:5c47bdf4a06297b7e1085da2b93d6d93-us20"
    };

    const httpsRequest = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
        
        if (response.statusCode === 200) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
    });

    httpsRequest.write(jsonData);
    httpsRequest.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("server start");
});

// const apikey = "5c47bdf4a06297b7e1085da2b93d6d93-us20";
// const list_id = "34ab97f5e8";