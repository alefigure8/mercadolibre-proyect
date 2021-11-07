const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

//INIT
const app = express();

//API RESPONSE
const mercadolibre = [{
        name: 'page',
        address: 'url',
        base: ''
    },

];
const post = [];

//ROUTE
app.get("/", (req, res) => {
    res.json("Welcome to my *** Change News API");
});

mercadolibre.forEach((ml) => {
    axios
        .get(ml.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('a:contains("***")', html).each((i, el) => {
                const title = $(el).text();
                const url = $(el).attr("href");
                post.push({
                    title,
                    url: ml.base + url,
                    source: ml.name,
                });
            });
        })
        .catch((err) => console.log(err));
});

app.get("/post", (req, res) => {
    res.json(post);
});

app.get("/news/:newspaperID", (req, res) => {
    const id = req.params.newspaperID;
    const ml = mercadolibre.filter((ml) => ml.name === id)[0];
    axios
        .get(ml.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificpost = [];
            $('a:contains("***")', html).each((i, el) => {
                const title = $(el).text();
                const url = $(el).attr("href");
                specificpost.push({
                    title,
                    url: ml.base + url,
                    source: ml.name,
                });
            });
            res.json(specificpost);
        })
        .catch((err) => console.log(err));
});

app.listen(PORT, () => {
    console.log(`Server on port http://localhost:${PORT}`);
});