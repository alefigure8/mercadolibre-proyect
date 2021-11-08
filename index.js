const PORT = process.env.PORT || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

//INIT
const app = express();

//API RESPONSE
const mercadolibre = [{
    name: "silla-gamer",
    address: "https://listado.mercadolibre.com.ar/silla-gamer",
    base: "",
}];

//Return
const post = [];

//ROUTE
app.get("/", (req, res) => {
    res.json("API Mercado Libre");
});

//TODO: error id, img

mercadolibre.forEach((ml) => {
    axios
        .get(ml.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("div .ui-search-result__content-wrapper", html).each((i, el) => {
                const title = $(el).find("h2").text();
                let price = $(el).find(".price-tag-fraction").html();
                const url = $(el).find(".ui-search-link").attr("href");
                let id = url.split('#')[0].split('/').slice(-1).join();
                let opinions = $(el).find(".ui-search-reviews__amount").text();
                if (opinions === '') { opinions = 'Sin opiniones' };
                let cuotas = $(el).find(".ui-search-color--LIGHT_GREEN").text();
                if (cuotas === '') { cuotas = 'Sin cuotas' };

                post.push({
                    id,
                    title,
                    price,
                    rating: '',
                    opinions,
                    cuotas,
                    url: ml.base + url,
                    source: ml.name,
                });
            });
        })
        .then(() => {
            for (let i in post) {
                const { url } = post[i]
                axios
                    .get(url)
                    .then(response => {
                        const html = response.data;
                        const $ = cheerio.load(html)
                        post[i].rating = $('.ui-pdp-reviews__rating__summary__average').text()
                    })
            }
        })
        .catch((err) => console.log(err));
});


app.get("/post", async(req, res) => {
    //Compare and sort
    await res.json(post.sort((a, b) => b.rating - a.rating));
});

app.get("/post/:postId", (req, res) => {
    const id = req.params.postId;
    const ml = mercadolibre.filter((ml) => ml.name === id)[0];
    const specificpost = [];
    axios
        .get(ml.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            $("div .ui-search-result__content-wrapper", html).each((i, el) => {
                const title = $(el).find("h2").text();
                let price = $(el).find(".price-tag-fraction").html();
                const url = $(el).find(".ui-search-link").attr("href");
                let id = url.split('#')[0].split('/').slice(-1).join();
                let opinions = $(el).find(".ui-search-reviews__amount").text();
                if (opinions === '') { opinions = 'Sin opiniones' };
                let cuotas = $(el).find(".ui-search-color--LIGHT_GREEN").text();
                if (cuotas === '') { cuotas = 'Sin cuotas' };
                specificpost.push({
                    id,
                    title,
                    price,
                    rating: '',
                    opinions,
                    cuotas,
                    url: ml.base + url,
                    source: ml.name,
                });
            });
        })
        .then(() => {
            for (let i in post) {
                const { url } = post[i]
                axios
                    .get(url)
                    .then(response => {
                        const html = response.data;
                        const $ = cheerio.load(html)
                        post[i].rating = $('.ui-pdp-reviews__rating__summary__average').text()
                    })
            }
            res.json(specificpost);
        })
        .catch((err) => console.log(err));
});

app.listen(PORT, () => {
    console.log(`Server on port http://localhost:${PORT}`);
});