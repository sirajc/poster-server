/**
 * Poster Server v0.1.0
 *
 * A Light-weight ExpressJS REST server for Poster app, it consumes TMDb public APIs.
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 11 June, 2015
 *
 * /api/movie end-points.
 */

var router = require('express').Router();

// @GET
// Gets Movie Information for a movieId available.
router.get('/:movieId', function(req, res) {
    tmdb = require('moviedb')(req.app.locals.tmdbApiKey);

    tmdb.movieInfo(
        {
            id: req.params.movieId
        },
        function(err, tmdbRes) {
            if (err)
                res.send(err);

            req.app.set('movie_meta', tmdbRes);
            res.json(tmdbRes);
        }
    );
});

module.exports = router;