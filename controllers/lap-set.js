const LapSet = require('../models/lap-set');

exports.getLapSets = (req, res, next) => {
    LapSet.findAll()
        .then((lap_sets) => {
            res.json(lap_sets);
        })
        .catch((err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}

exports. getLapSet = (req, res, next) => {
    const lapSetId = req.params.lapSetId;
    LapSet.findAll({
        'where': {
            'id': lapSetId
        }
    })
        .then((lapSet) => {
            if (lapSet.length == 0) {
                const error = new Error('No lap set found.');
                error.statusCode = 404;
                throw error;
            }
            res.json(lapSet[0]);
        })
        .catch((err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}

exports.addLapSet = (req, res, next) => {
    const lapCount = req.body.lap_count;
    const bestTime = req.body.best_time;
    const date = req.body.date;
    const trackId = req.body.track;
    LapSet.create({
        lap_count: lapCount,
        best_time: bestTime,
        date: date,
        track: trackId
    })
        .then((lapSet) => {
            return lapSet.save();
        })
        .then((lapSet) => {
            res.json(lapSet);
        })
        .catch((err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}
