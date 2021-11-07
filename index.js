const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

//INIT
const app = express();

//API RESPONSE
const newspapers = [{
        name: 'page',
        address: 'url',
        base: ''
    },

];
const articles = [];

//ROUTE
app.get("/", (req, res) => {
    res.json("Welcome to my *** Change News API");
});

newspapers.forEach((newspaper) => {
    axios
        .get(newspaper.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $('a:contains("***")', html).each((i, el) => {
                const title = $(el).text();
                const url = $(el).attr("href");
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name,
                });
            });
        })
        .catch((err) => console.log(err));
});

app.get("/news", (req, res) => {
    res.json(articles);
});

app.get("/news/:newspaperID", (req, res) => {
    const id = req.params.newspaperID;
    const newspaper = newspapers.filter((newspaper) => newspaper.name === id)[0];
    axios
        .get(newspaper.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];
            $('a:contains("***")', html).each((i, el) => {
                const title = $(el).text();
                const url = $(el).attr("href");
                specificArticles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name,
                });
            });
            res.json(specificArticles);
        })
        .catch((err) => console.log(err));
});

app.listen(PORT, () => {
    console.log(`Server on port http://localhost:${PORT}`);
});