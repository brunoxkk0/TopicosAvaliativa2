const express = require('express');
const bodyParser = require('body-parser');
const uuid = require("uuid").v4;

const noticias = [];
const inscricao_emails = [];

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function getNoticia(id){
    return noticias.find(noticia => noticia.id === id);
}

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

async function existsEmail(email){
    return await inscricao_emails.find(em =>
        em.email === email.email
    )
}


async function registerEmail(email){
    inscricao_emails.push(email)
}

app.post("/inscricao", async (req, res) => {

    const email = req.body;

    if(!email.email){
        res.status(500).send("Email inválido.")
        return;
    }

    if(await existsEmail(email)){
        res.status(500).send("Este email já foi cadastrado.")
        return;
    }

    await registerEmail(email)
    res.send("Email " + email.email + " cadastrado.")
});

app.post("/noticia", async (req, res) => {

    const noticia = req.body;

    if(!(noticia.titulo && noticia.resumo && noticia.url)){
        res.status(500).send("Notícia inválida.")
        return;
    }

    if(await existsNoticia(noticia)){
        res.status(500).send("Esta notícia já existe.")
        return;
    }

    const id = await postNoticia(noticia);
    res.send("Notícia adicionada. ID:" + id)
});


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

app.get("/noticia/:id", async (req, res) => {

    const noticia_id = req.params.id;

    if (noticia_id) {

        const noticia = await getNoticia(noticia_id);

        if (noticia) {
            res.status(200).send(noticia);
            return;
        }

    }

    res.status(500).send("This request is invalid.");
});

app.listen(1234, () => {
    console.log("Servidor ligado na porta: 1234")
})
