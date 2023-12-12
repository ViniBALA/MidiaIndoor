document.addEventListener("DOMContentLoaded", async () => {
    let msg_erro = ""
    let resposta = ""
    resposta = await fetch(`${URL_API}/api/midia`);
    if (resposta.ok) {
        let array_propagandas = await resposta.json();
        if (array_propagandas == "") {
            msg_erro = `<img src="midias/img_erro.svg">Sem midias disponiveis`
            document.getElementById("saida_propaganda").innerHTML = msg_erro
        }


    }
})


const URL_API = "http://10.111.9.26:3000"

document.addEventListener("DOMContentLoaded", async () => {
    let resposta = ""
    resposta = await fetch(`${URL_API}/api/midia`);
    if (resposta.ok) {
        let array_propagandas = await resposta.json();

        let html = ""
        for (const item of array_propagandas) {
            const tmp = item.tempo * 1000
            html += ` <div class="carousel-item active w-100 h-100" data-bs-interval="${tmp}">
                        <img src="${item.url}" class="d-block w-100" alt="..." style='height:100%; width:100%;'>
                    </div>`
            document.getElementById("saida_propaganda").innerHTML = html;
        }

    }

})

// ---------------------------------------------------------------------------------------------------

