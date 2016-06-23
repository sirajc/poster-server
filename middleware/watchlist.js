/**
 * Poster Server v0.1.0
 *
 * A Light-weight ExpressJS REST server for Poster app, it consumes TMDb public APIs.
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 22 June, 2015
 *
 * Middleware to identify Watchlist items in TMDb Responses and add necessary flags.
 */

'use strict';

var _ = require('lodash');

var wdb = require("../services/watchlistdb");

wdb.init();

module.exports = function(tmdbResponse, fnCallback) {
    if (!Array.isArray(tmdbResponse))
    {
        wdb.findInWatchlist(tmdbResponse.id, function(err, wdbRes) {
            if (wdbRes.length > 0)
            {
                _.merge(tmdbResponse, {
                    watchlist: wdbRes[0].watchlist,
                    createdAt: wdbRes[0].createdAt,
                    updatedAt: wdbRes[0].updatedAt
                });
            }

            fnCallback();
        });
    }
    else
    {
        wdb.getWatchlistMovieMap(function(err, wdbRes) {
            if (Object.keys(wdbRes).length > -1)
            {
                tmdbResponse.forEach(function(movie) {
                    if (wdbRes[movie.id])
                    {
                        _.merge(movie, {
                            watchlist: wdbRes[movie.id].watchlist,
                            createdAt: wdbRes[movie.id].createdAt,
                            updatedAt: wdbRes[movie.id].updatedAt
                        });
                    }
                });
            }

            fnCallback();
        });
    }
};