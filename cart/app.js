var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , bodyParser = require("body-parser")
    , _ = require('lodash')
    , app = express();


app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

//app.use(morgan("dev", {}));
var cart = [];

app.post("/add", function (req, res, next) {
    var obj = req.body;
    console.log("add ");
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));


    //  var obj = JSON.parse(body);

    //       console.log('addToCart id '+id)
    var max = 0;
    var ind = 0;
    if (cart["" + obj.custId] === undefined)
        cart["" + obj.custId] = [];
    var c = cart["" + obj.custId];
    for (ind = 0; ind < c.length; ind++)
        if (max < c[ind].cartid)
            max = c[ind].cartid;
    var cartid = max + 1;
    var data = {
        "cartid": cartid,
        "productID": obj.productID,
        "name": obj.name,
        "price": obj.price,
        "image": obj.image,
        "quantity": obj.quantity
    };
    console.log(JSON.stringify(data));

    /**
     * Combine results to make sure the user cant add the same product twice.
     *
     * If the user adds the same product we will increase the quantity instead
     */
    var isProductAlreadyInCart = _.find(c, {productID: obj.productID});

    if (isProductAlreadyInCart) {
        var index = _.findIndex(c, {productID: obj.productID});
        c[index].quantity = parseInt(c[index].quantity) + parseInt(obj.quantity);
    } else {
        c.push(data);
    }

    res.status(201);

    res.send("");


});

/* toDO */
app.delete("/cart/:custId/items/:id", function (req, res, next) {
    var body = '';
    console.log("Delete item from cart: for custId " + req.url + ' ' +
        req.params.id.toString());
    console.log("delete ");


    res.send(' ');


});


app.get("/cart/:custId/items", function (req, res, next) {


    var custId = req.params.custId;
    console.log("getCart" + custId);


    console.log('custID ' + custId);


    console.log(JSON.stringify(cart["" + custId], null, 2));

    res.send(JSON.stringify(cart["" + custId]));
    console.log("cart sent");

});


var server = app.listen(process.env.PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
