const Url = require("../models/Url");


// CREATE SHORT URL
const createShortUrl = async (req, res) => {
    try {
        const { originalUrl, expiresAt } = req.body;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Original url is required."
            });
        }

        let shortCode;
        let existingUrl;

        // Generate unique short code
        do {
            shortCode = Math.random()
                .toString(36)
                .substring(2, 8);

            existingUrl = await Url.findOne({
                shortCode
            });

        } while (existingUrl);


        // Save URL in database
        const newUrl = await Url.create({
            originalUrl,
            shortCode,
            user: req.user.userId,
            expiresAt: expiresAt || null
        });


        // Send response
        res.status(201).json({
            shortUrl: `${process.env.BASE_URL}/${shortCode}`,
            originalUrl: newUrl.originalUrl,
            shortCode: newUrl.shortCode
        });

    } catch (error) {

        console.error("CREATE URL ERROR:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET MY URLS
const getMyUrls = async (req, res) => {
    try {

        const urls = await Url.find({
            user: req.user.userId
        }).sort({
            createdAt: -1
        });

        res.json(urls);

    } catch (error) {

        console.error("GET MY URLS ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// REDIRECT TO ORIGINAL URL
const redirectToOriginalUrl = async (req, res) => {
    try {

        const { shortCode } = req.params;

        console.log("Short code received:", shortCode);

        const url = await Url.findOne({
            shortCode
        });

        console.log("URL found:", url);

        if (!url) {
            return res.status(404).json({
                message: "Short URL not found"
            });
        }


        // Check expiry
        if (
            url.expiresAt &&
            url.expiresAt < new Date()
        ) {
            return res.status(410).json({
                message: "Short URL has expired"
            });
        }


        // Increase click count
        url.clicks += 1;

        await url.save();


        // Redirect
        res.redirect(url.originalUrl);

    } catch (error) {

        console.error("REDIRECT ERROR:", error);

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DELETE URL
const deleteUrl = async (req, res) => {
    try {

        const { id } = req.params;

        const url = await Url.findOne({
            _id: id,
            user: req.user.userId
        });

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }


        await Url.deleteOne({
            _id: id
        });


        res.json({
            message: "URL deleted successfully"
        });

    } catch (error) {

        console.error("DELETE URL ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createShortUrl,
    getMyUrls,
    deleteUrl,
    redirectToOriginalUrl
};