const appRoot = require('app-root-path');
const videoUtil = require(appRoot + '/src/api/v1/video/util');
const Video = require(appRoot + '/src/models/video');


module.exports = {
	// util method to reposition order_by to new position

	repositionVideosFolders: async function (folder_id, videoId, desiredLocation, direction) {
		const {order_by} = await Video.findOne({_id: videoId});
		//We create an empty array to store our promises
		const arrayOfPromises = [];
		const start = parseInt(desiredLocation);
		if (direction == 'left') {
			const finish = order_by - 1;
			for (let index = start; index <= finish; index++) {
				const newValue = parseInt(index) + 1;
				arrayOfPromises.push(
					videoUtil.repositionVideoByValue(folder_id, index, newValue)
				);
			}
		} else if (direction == 'right') {
			const finish = order_by + 1;
			for (let index = start; index >= finish; index--) {
				const newValue = parseInt(index) - 1;
				arrayOfPromises.push(
					videoUtil.repositionVideoByValue(folder_id, index, newValue)
				);
			}
		}
		//We wait until all promises have
		return await Promise.all(arrayOfPromises)
			.then(function (arrayOfResults) {
				const totalSize = arrayOfResults.length;
				const bulk = Video.collection.initializeOrderedBulkOp();
				let counter = 1;
				arrayOfResults.forEach(async function (doc) {
					await bulk.find({_id: doc.id}).updateOne({$set: {order_by: doc.nextOrderBy}});
					if (counter === totalSize) {
						bulk.execute(function (err, r) {
						});
						await Video.findByIdAndUpdate({_id: videoId}, {order_by: desiredLocation});
					}
					counter++;
				});
				/* Sorting algorithm ends */
				return true;
			})
			.catch(function (error) {
				return false;
			});

	},

}
