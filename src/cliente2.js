const {default: axios} = require("axios");

axios.get("http://localhost:1234/noticia").then((res) =>{
    res.data.forEach(noticia => {
        axios.put("http://localhost:1234/enviar/" + noticia.id, {}).then((res2) => {
            console.log("Noticia " + noticia.id + " enviada para: " + res2.data)
        })
    })
}).catch(el => {
    console.log(el)
})
