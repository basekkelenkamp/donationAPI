let express = require('express');
let Donation = require('../models/donationModel');


let routes = function() {

    let router = express.Router();

    router.route('/')

        //Creating a donation
        .post(function (req, res){
            let donation = new Donation({
                name: req.body.name,
                amount: req.body.amount,
                message: req.body.message
            });

            donation.save(function (err) {
                if(err) {
                    res.status(400).send(err)
                }
                else {
                    res.status(201).send(donation);
                }
            })

        })

        //Get all donations
        .get(function (req, res) {
            Donation.find({}, function (err, donations) {
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.json(donations);
                }
            })
        });


    router.route('/:id')
        
        //Get one donation
        .get(function (req, res) {
            Donation.findById(req.params.id, function (err, donation){
                if (donation == null) {
                    return res.status(404).json({message: 'Cannot find user' });
                }
                if (err) {
                    return res.status(500).send(err);
                }                
                else {
                    res.json(donation);
                }
            })
        })

        //Update donation
        .patch(function (req, res) {
            Donation.findById(req.params.id, function (err, donation){
                if (donation == null) {
                    return res.status(404).json({message: 'Cannot find user' });
                }
                if (err) {
                    return res.status(500).send(err);
                }                
                else {
                    if (req.body.name != null) {
                        donation.name = req.body.name;
                    }
                    if (req.body.message != null) {
                        donation.message = req.body.message;
                    }
                    let updatedDonation = donation.save();
                    res.json({updatedDonation});
                }
            })
        })


        //Delete donation
        .delete(function (req, res) {
            Donation.findOneAndRemove(req.params.id, function (err, donation){
                if (donation == null) {
                    return res.status(404).json({message: 'Cannot find user' });
                }
                if (err) {
                    return res.status(500).send(err);
                }                
                else {
                    res.json({message: "Deleted donation" });
                }
            })
        })

    return router;



};

module.exports = routes;