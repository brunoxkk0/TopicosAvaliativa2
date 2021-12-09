const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
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
    res.send({
        id: id
    })
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

app.put("/enviar/:noticia", async (req, res) => {

    const sent_emails = []

    const noticia = req.params.noticia;

    if(noticia){

        const news = await getNoticia(noticia);

        if(news){

            for(let i in inscricao_emails){
                const email = inscricao_emails[i];
                await sendEmail(news, email);
                sent_emails.push(email)
            }

            res.status(200).send(sent_emails);
            return;
        }

    }

    res.status(500).send("Não foi possível encontrar uma notícia com esse id.");

})

app.listen(1234, () => {
    console.log("Servidor ligado na porta: 1234")
})

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'kasey.hoeger96@ethereal.email',
        pass: 'ys4x64sFxhUp6rGmqM'
    },
    tls: {
        rejectUnauthorized: false
    }
})

async function sendEmail(news, email){
    if(news && email){

        const data = {
            from: 'kasey.hoeger96@ethereal.email',
            to: email.email,
            subject: news.titulo,
            text: news.titulo + "\n" + news.resumo + "\n" + news.url,
            html: "<h1>" + news.titulo + "</h1>" + "<h4>" + news.resumo + "</h4>" + "<h5>" + news.url + "</h5>"
        };

        const info = await transporter.sendMail(data)
        await setTimeout(() => {}, 2000)
        return info;
    }
}
