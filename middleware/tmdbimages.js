/**
 * Poster Server v0.1.0
 *
 * A Light-weight ExpressJS REST server for Poster app, it consumes TMDb public APIs.
 *
 * Author: Kushal Pandya <kushalspandya@gmail.com> (https://doublslash.com)
 * Date: 11 June, 2015
 *
 * Middleware to Prefix Perma-links of Images in Movie items provided by TMDb.
 */

'use strict';

module.exports = function(options) {
    var randomColor = require('randomcolor'),
        objRoot = (options && options.root) || null,
        posterPrefix = (options && options.posterPrefix) || null,
        backdropPrefix = (options && options.backdropPrefix) || null,
        profilePrefix = (options && options.profilePrefix) || null,
        colorCollection = [],
        processProfileURLs,
        processURLs;

    /**
     * This method overrides 'profile_path' for a Profile within credits
     * in movie Object to a map with perma-links to smaller, small, medium & orignal images.
     */
    processProfileURLs = function(profiles) {
        var newProfilePath = {},
            size,
            i;

        for (i = 0; i < profiles.length; i++)
        {
            newProfilePath = {};
            for (size in profilePrefix)
                newProfilePath[size] = profiles[i].profile_path ? `${profilePrefix[size]}${profiles[i].profile_path}` : null;

            profiles[i].profile_path = newProfilePath;
        }
    };

    /**
     * This method overrides 'poster_path' & 'backdrop_path' properties
     * in movie Object to a map with perma-links to small, medium & orignal images.
     */
    processURLs = function(movieObj) {
        var newPosterPath = {},
            newBackdropPath = {},
            newProfilePath = {},
            credits = movieObj.credits,
            size, i;

        if (!movieObj.backdrop_path)
            movieObj.backdrop_color = colorCollection.pop();

        for (size in posterPrefix)
            newPosterPath[size] = movieObj.poster_path ? `${posterPrefix[size]}${movieObj.poster_path}` : null;

        for (size in backdropPrefix)
            newBackdropPath[size] = movieObj.backdrop_path ? `${backdropPrefix[size]}${movieObj.backdrop_path}` : null;

        if (profilePrefix)
        {
            processProfileURLs(credits.actors);
            processProfileURLs(credits.directors);
            processProfileURLs(credits.writers);
            processProfileURLs(credits.producers);
        }

        movieObj.poster_path = newPosterPath;
        movieObj.backdrop_path = newBackdropPath;
        movieObj.credits = credits;
    };

    // Verify if it is a valid object.
    if (typeof objRoot !== "object")
        throw new TypeError("Invalid value for options.root");

    if (Array.isArray(objRoot))
    {
        colorCollection = randomColor({luminosity: 'light', count: objRoot.length});

        // Iterate over results list and process URLs.
        objRoot.map(function(movie, i) {
            processURLs(movie);
        });
    }
    else
        processURLs(objRoot);
};
