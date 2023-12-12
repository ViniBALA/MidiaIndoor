const URL_API = "http://localhost:3000"
// --------------------------------------BOTÕES---------------------------------------------------
//Botões de abrir a tela
const btn_tela_excluir = document.getElementById("btn_tela_excluir")

// Botões de ação dentro de cada DIV
const btn_cancelar = document.getElementById("btn_acao_cancelar")
const btn_select = document.getElementById("verifica");
const btn_cadastro = document.getElementById("btn_acao_cadastrar")
const btn_atualizar_dados = document.getElementById("btn_atualizar_dados")
const btn_acao_cancelar_edit = document.getElementById("btn_acao_cancelar_edit")


// ---------------------------------------------cadastrar--------------------------------------------------
btn_cadastro.addEventListener("click", async () => {
  let nome = _getValue("inp_nome_midia");
  let tipo = _getValue("select_tipo_midia");
  let status = _getValue("select_estado_midia");
  let tempo = _getValue("inp_tempo_exibicao");
  let url = _getValue("inp_link_midia");
  let data_inicio = _getValue("inp_data_inicial");
  let data_fim = _getValue("inp_data_final");

  let dados = await fetch(URL_API + "/api/midia", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome: nome,
      tipo: tipo,
      status: status,
      data_inicio: data_inicio,
      data_fim: data_fim,
      url: url,
      tempo: tempo
    })

  });
  _setValue("inp_nome_midia", "")
  _setValue("inp_tempo_exibicao", "")
  _setValue("inp_link_midia", "")
  _setValue("inp_data_inicial", "")
  _setValue("inp_data_final", "")

  if (dados.ok) {


    btn_tela_busca.click()
    btn_select.click()
  }


})

function _Byid(id) {
  return document.getElementById(id)
}

function _getValue(id) {
  return _Byid(id).value
}

function _setValue(id, value) {
  _Byid(id).value = value
}




document.getElementById("btn_tela_cadastro").addEventListener("click", ()=>{
  MostrarDiv('tela_cadastro')
})
document.getElementById("btn_tela_listagem").addEventListener("click", ()=>{
  MostrarDiv('tela_listagem')
})


//---------------------------------------------função cancelar cadastro-----------------------------------

btn_cancelar.addEventListener("click", async () => {
  MostrarDiv("tela_inicial")
})
btn_acao_cancelar_edit.addEventListener("click", async () => {
  MostrarDiv("tela_listagem")
  btn_tela_busca.click()
  btn_select.click()

})

//_____________________________________________Filtro de busca_____________________________________________
btn_select.addEventListener("click", async () => {
  let busca = document.getElementById("input_busca").value;
  let opcao = document.getElementById("opcoes").value;
  let html = ""
  html = `<table  class="container table table-dark table-striped">
    <thead class="table-dark">
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Nome</th>
        <th scope="col">Tipo</th>
        <th scope="col">Status</th>
        <th scope="col">Data Início</th>
        <th scope="col">Data Fim</th>
        <th scope="col">Tempo</th>
        <th scope="col">Editar</th>
        <th scope="col">Excluir</th>
      </tr>
    </thead><tbody>`


  document.getElementById("saida").innerHTML = "";
  document.getElementById("input_busca").value = "";

  let resposta = "";
  if (opcao == "todos") {
    resposta = await fetch(`${URL_API}/api/midia`);
  } else if (opcao == "id") {
    resposta = await fetch(`${URL_API}/api/midia/id/${busca}`);
  } else if (opcao == "nome") {
    resposta = await fetch(`${URL_API}/api/midia/nome/${busca}`);
  }

  if (resposta.ok) {

    html = html;
    let array_resultado = await resposta.json();

    for (item of array_resultado) {

      let t = "Video"
      if (item.tipo == "I") {
        t = "Imagem"
      }

      let f = "Ativo"
      if (item.status == "I") {
        f = "Inativo"
      }

      html += `
          <tr>
          <th scope="row">${item.id}</th>
          <td>${item.nome}</td>
          <td>${t}</td>
          <td>${f}</td>
          <td>${new Date(item.data_inicio).toLocaleDateString("pt-BR")}</td>
          <td>${new Date(item.data_fim).toLocaleDateString("pt-BR")}</td>
          <td>${item.tempo} segundos</td>
          
          <td><i onclick="editar(${item.id})" class="bi bi-pencil-square"></i></td>
          <td><i onclick="apagar_midia(${item.id})" class="bi bi-trash"></td>

        </tr>`
    }



    html + `</tbody></table>`

    document.getElementById("saida").innerHTML = html
  }
})

// _______________________________________EXCLUIR MIDIA _______________________________________
async function apagar_midia(id) {
  const resultado = window.confirm("Deseja excluir este usuário?");
  if (resultado) {
    let dados = await fetch(`${URL_API}/api/midia/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    if (dados.ok) {
      btn_tela_busca.click()
      btn_select.click()
    }
  }
}




// ------------------------------------função mostrar/ocultar div--------------------------------------
function MostrarDiv(id) {
  // Esconde todas as DIVs
  document.querySelectorAll('.content').forEach(div => {
    div.classList.add("d-none");
  });

  // Mostra apenas a DIV com o ID correspondente
  document.getElementById(id).classList.remove("d-none");
}

// // ----------------------------------------função icone de editar----------------------------------------------
async function editar(id) {
  MostrarDiv('tela_editar')
  let resposta = await fetch(`${URL_API}/api/midia/id/${id}`);
  if (resposta.ok) {
    let dados = await resposta.json()
    console.log(dados)
    // btn_tela_atualizar.click()
    const dt_inicio = dados[0].data_inicio.substr(0, 10)
    const data_fim = dados[0].data_fim.substr(0, 10)

    let tipo = ""
    if (dados[0].tipo == "I") tipo = "Imagem"
    else tipo = "Video"

    let status = ""
    if (dados[0].status == "I") status = "Inativo"
    else status = "Ativo"

    // document.getElementById("id_editado").value = dados[0].id
    id_editando = dados[0].id
    document.getElementById("nome_editado").value = dados[0].nome
    document.getElementById("tipo_editado").value = tipo
    document.getElementById("status_editado").value = status
    document.getElementById("data_inicio_editado").value = dt_inicio
    document.getElementById("data_fim_editado").value = data_fim
    document.getElementById("url_editado").value = dados[0].url
    document.getElementById("tempo_editado").value = dados[0].tempo
  }
}
//--------------------------------------callback de salvar alterações editar-----------------------------------------
btn_atualizar_dados.addEventListener("click", async () => {
  const id_atualizado = id_editando
  const nome_atualizado = document.getElementById("nome_editado").value
  const tipo_atualizado = document.getElementById("tipo_editado").value
  const status_atualizado = document.getElementById("status_editado").value
  const data_inicio_atualizado = document.getElementById("data_inicio_editado").value
  const data_fim_atualizado = document.getElementById("data_fim_editado").value
  const url_atualizado = document.getElementById("url_editado").value
  const tempo_atualizado = document.getElementById("tempo_editado").value

  let dados = await fetch(`${URL_API}/api/midia/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id_atualizado,
      nome: nome_atualizado,
      tipo: tipo_atualizado,
      status: status_atualizado,
      data_inicio: data_inicio_atualizado,
      data_fim: data_fim_atualizado,
      url: url_atualizado,
      tempo: tempo_atualizado,
    }),
  });

  if (dados.ok) {
    MostrarDiv('tela_listagem')
    btn_select.click()
  }

})
// --------------------------------------------------------------------------------
document.getElementById("btn_tela_midia").addEventListener("click", async => {
  window.open(`${URL_API}/Front/midias.html`, 'location=no','menubar=no', 'fullscreen=no');

})
// ---------------------------------------------------------------------------------------------------



