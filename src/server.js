const express = require('express');
const bodyParser = require('body-parser');
const uuid = require("uuid").v4;

const noticias = [];

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function postNoticia(noticia){
    noticia.id = uuid();
    noticias.push(noticia)
    return noticia.id;
}

async function existsNoticia(noticia){
    return await noticias.find(news =>
        news.titulo === noticia.titulo &&
        news.resumo === noticia.resumo &&
        news.url    === noticia.url
    )
}

app.post("/noticia", async (req, res) => {

    const noticia = req.body;

    if(await existsNoticia(noticia)){
        res.status(500).send("Esta notícia já existe.")
        return;
    }

    const id = await postNoticia(noticia);
    res.send("Notícia adicionada. ID:" + id)
});

app.get("/noticia", async (req, res) => {

    if (noticias) {
        res.status(200).send(noticias);
        return;
    }

    res.status(500).send("Não existem notícias cadastradas.");
});

app.listen(1234, () => {
    console.log("Servidor ligado na porta: 1234")
})

