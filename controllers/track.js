const Track = require('../models/track');

exports.getTracks = (req, res, next) => {
    Track.findAll()
        .then((tracks) => {
            res.json(tracks);
        })
        .catch((err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}

exports.getTrack = (req, res, next) => {
    const trackId = req.params.trackId;
    Track.findAll({
        'where': {
            'id': trackId
        }
    })
        .then((track) => {
            if (track.length == 0) {
                const error = new Error('No track found.');
                error.statusCode = 404;
                throw error;
            }
            res.json(track[0]);
        })
        .catch((err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}

exports.addTrack = (req, res, next) => {
    const trackName = req.body.name;
    Track.create({
        name: trackName
    })
        .then((track) => {
            return track.save();
        })
        .then((track) => {
            res.json(track);
        })
        .catch((err) => {
            if(!err.statusCode)
                err.statusCode = 500;
            next(err);
        })
}
