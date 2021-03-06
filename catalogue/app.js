var http = require('http'),
    fs = require('fs'),
    url = require('url');
var p = require('path');
var qs = require('querystring');
var mysql = require('mysql');
var _ = require('lodash');
var root = __dirname;
var headers = [
    "Product Name", "Price", "Picture", "Buy Button"
];


var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'asdf1234',
    database: 'shop'
});
var cart = [];
var theuser = null;
var theuserid = null;
var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    if (request.method == 'POST') {
        switch (path) {
            /* TODO */
            case "/newProduct":
                response.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });

                var body = '';
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    console.log(body);
                    var product = qs.parse(body);
                    console.log('new Product');
                    console.log(JSON.stringify(product, null, 2));

                    var query = "INSERT INTO products (name, quantity, price, image) VALUES (?, ?, ?, ?)";

                    // Validate name
                    if (!product.name || product.name.length === 0) {
                        console.log('Invalid name');
                        return response.end();
                    }

                    // Validate price
                    if (!product.price || isNaN(product.price)) {
                        console.log('Invalid price');
                        return response.end();
                    }

                    // Validate image
                    if (!product.image || product.image.length === 0) {
                        console.log('Invalid image');
                        return response.end();
                    }

                    db.query(
                        query,
                        [
                            product.name,
                            1,
                            product.price,
                            product.image
                        ],
                        function (err, row) {
                            if (err) throw err;

                            var query = "SELECT * FROM products WHERE productID=?";
                            db.query(
                                query,
                                [
                                    row.insertId
                                ],
                                function (err, rows) {
                                    if (err) throw err;

                                    console.log(JSON.stringify(rows, null, 2));
                                    response.end(JSON.stringify(rows[0]));
                                    console.log("Product created");
                                }
                            );
                        }
                    );
                });


                break;
        } //switch
    }
    else {
        switch (path) {


            case "/getProducts"    :
                console.log("getProducts");
                response.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                var query = "SELECT * FROM products ";


                db.query(
                    query,
                    [],
                    function (err, rows) {
                        if (err) throw err;
                        console.log(JSON.stringify(rows, null, 2));
                        response.end(JSON.stringify(rows));
                        console.log("Products sent");
                    }
                );

                break;
            case "/getProduct"    :
                console.log("getProduct");
                var body = "";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var product = JSON.parse(body);
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    console.log(JSON.stringify(product, null, 2));
                    var query = "SELECT * FROM products where productID=" +
                        product.id;


                    db.query(
                        query,
                        [],
                        function (err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows[0]));
                            console.log("Products sent");
                        }
                    );

                });


                break;


        }
    }


});

server.listen(3002);
