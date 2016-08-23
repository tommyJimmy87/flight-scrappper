const debug = require('debug')('persistency-module');
var MongoClient = require('mongodb').MongoClient;
var Utils = require('../src/utils');

function persistencyModule() {

	function insertFlights(database, collection, docs) {
		return new Promise(function(resolve, reject) {
			if (docs.length > 0) {
				MongoClient.connect('mongodb://' + database, function(err, db) {
					if (err != null) {
						reject(err);
					} else {
						debug('Successfully connected to ' + database + ' !');
						db.collection(collection).insertMany(docs, function(err, res) {
							if (err != null) {
								reject(err);
							} else {
								debug(Utils.prettifyObject(res.insertedIds, null, 2));
								db.close();
								debug('Closed connection to ' + database + ' !');
								resolve(res.insertedIds);
							}
						});
					}
				});
			} else {
				debug('No data to be inserted!');
				resolve([]);
			}
		});
	}

	function removeFlights(database, collection, ids) {
		return new Promise(function(resolve, reject) {
			MongoClient.connect('mongodb://' + database, function(err, db) {
				if (err != null) {
					reject(err);
				} else {
					db.collection(collection).deleteMany({
						'_id': {
							'$in': ids
						}
					}, function(err, res) {
						if (err != null) {
							reject(err);
						} else {
							resolve(res.result.n);
						}
						db.close();
					});
				}
			});
		});
	}

	return {
		insertFlights,
		removeFlights
	};

}

module.exports = persistencyModule();