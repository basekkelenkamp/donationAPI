let express = require('express');
let Donation = require('../models/donationModel');


let routes = function () {

    let router = express.Router();


    //CORS headers toevoegen voor collectie
    router.use('/', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
        next()
    })

    //Accept middleware
    router.use('/', function (req, res, next) {
        console.log("middleware for collection")
        let acceptType = req.get("Accept")
        console.log("Accept:" + acceptType)

        if (acceptType == "application/json") {
            next()
        } else {
            res.status(415).send();
        }
    })

    router.route('/')

        //Creating a donation
        .post(function (req, res) {
            console.log("POST on collection")
            let donation = new Donation({
                name: req.body.name,
                amount: req.body.amount,
                message: req.body.message
            });

            donation.save(function (err) {
                if (err) {
                    res.status(400).send(err)
                }
                else {
                    res.status(201).send(donation);
                }
            })

        })

        //Get all donations
        .get(function (req, res) {
            console.log("GET on collection")
            Donation.find({}, function (err, donations) {
                if (err) {
                    res.status(500).send(err);
                }
                else {

                    let totalItems = donations.length;
                    let limit = donations.length;
                    let totalPages = 1;
                    let currentPage = 1;

                    if (req.query.limit != null) {
                        limit = parseInt(req.query.limit)

                        function totalPagesCount(totalItems, limit) {
                            return Math.ceil(totalItems / limit);
                        }

                        totalPages = totalPagesCount(totalItems, limit)
                        console.log('total pages: ' + totalPages)
                    }

                    if (req.query.page != null) {
                        console.log("current page: " + req.query.page)
                        currentPage = parseInt(req.query.page)

                        if(req.query.page > totalPages){
                            return res.status(404).json({ message: 'This page does not exist' });
                        } 
                    }


                    let donationsCollection = {
                        "items": [],
                        "_links": {
                            "self": { "href": "http://" + req.headers.host + "/donations" },
                            "collection": { "href": "http://" + req.headers.host + "/donations" }
                        },
                        "pagination": {
                            "currentPage": currentPage,
                            "currentItems": limit,
                            "totalPages": totalPages,
                            "totalItems": totalItems,
                            "_links": {
                                "first": {
                                    "page": 1,
                                    "href": "http://" + req.headers.host + "/donations?limit=" + limit + "&page" + 1
                                },
                                "last": {
                                    "page": totalPages,
                                    "href": "http://" + req.headers.host + "/donations?limit=" + limit + "&page" + totalPages
                                }
                            }
                        }
                    }

                    for (let donation of donations) {
                        let donationItem = donation.toJSON()

                        donationItem._links = {
                            "self": { "href": "http://" + req.headers.host + "/donations/" + donationItem._id },
                            "collection": { "href": "http://" + req.headers.host + "/donations" }
                        }

                        donationsCollection.items.push(donationItem)
                    }

                    res.json(donationsCollection);
                }
            })
        })
        .options(function (req, res) {
            res.header("Allow", "POST,GET,OPTIONS")
            res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS").send()
        })
        ;


    router.route('/:id')

        //Get one donation
        .get(function (req, res) {
            console.log('GET one donation from collection')
            Donation.findById(req.params.id, function (err, donation) {
                if (donation == null) {
                    return res.status(404).json({ message: 'Cannot find user' });
                }
                if (err) {
                    return res.status(500).send(err);
                }
                else {

                    let oneDonation = donation.toJSON()
                    
                    oneDonation._links = {
                            "self": { "href": "http://" + req.headers.host + "/donations/" + req.params.id },
                            "collection": { "href": "http://" + req.headers.host + "/donations" }
                        }
                
                    res.json(oneDonation);
                }
            })
        })

        //Update donation
        .put(function (req, res) {
            console.log('PUT one donation from collection')
            Donation.findById(req.params.id, function (err, donation) {
                if (donation == null) {
                    return res.status(404).json({ message: 'Cannot find user' });
                }
                if (err) {
                    return res.status(500).send(err);
                }
                else {
                    let allRequiredField = true;
                    if (req.body.name == null || req.body.name == "") {
                        allRequiredField = false;
                    }
                    if (req.body.message == null || req.body.message == "") {
                        allRequiredField = false;

                    }
                    if (req.body.amount == null || req.body.amount == "") {
                        allRequiredField = false;
                    }

                    if (!allRequiredField) {
                    return res.status(400).send(err);
                    }

                    donation.amount = req.body.amount;
                    donation.message = req.body.message;
                    donation.name = req.body.name;

                    donation.save();
                    res.json(donation);
                }
            })
        })

        //Delete donation
        .delete(function (req, res) {
            console.log('DELETE one donation from collection')
            Donation.findByIdAndDelete(req.params.id, function (err, donation) {
                if (donation == null) {
                    return res.status(404).json({ message: 'Cannot find user' });
                }
                if (err) {
                    return res.status(501).send(err);
                }
                else {
                    res.status(204).json({ message: "Deleted donation" });
                }
            })
        })

        .options(function (req, res) {
            res.header("Allow", "GET,PUT,DELETE,OPTIONS")
            res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS").send()

        })

    return router;



};

module.exports = routes;