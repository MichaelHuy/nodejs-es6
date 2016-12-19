import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
var Bear     = require('./app/models/bear');

const app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8080;        // set our port

//database connect
mongoose.connect('mongodb://ionicexpert:admin@ds139428.mlab.com:39428/nodejses6');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
// middleware to use for all requests
router.use((req, res, next) => {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', (req, res) => {
    res.json({ message: 'Huy Le! welcome to our api!' });   
});

// more routes for our API will happen here
// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post((req, res) => {
		
		var bear = new Bear();		// create a new instance of the Bear model
		bear.name = req.body.name;  // set the bears name (comes from the request)

		bear.save((err) => {
			if (err)
				res.send(err);

			res.json({ message: 'Bear created!' });
		});

		
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get((req, res) => {
		Bear.find((err, bears) => {
			if (err)
				res.send(err);

			res.json(bears);
		});
	});

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

	// get the bear with that id
	.get((req, res) => {
		Bear.findById(req.params.bear_id, (err, bear) => {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	// update the bear with this id
	.put((req, res) => {
		Bear.findById(req.params.bear_id, (err, bear) => {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save((err) => {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});

		});
	})

	// delete the bear with this id
	.delete((req, res) => {
		Bear.remove({
			_id: req.params.bear_id
		}, (err, bear) => {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

