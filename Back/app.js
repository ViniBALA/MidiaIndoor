const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')

const app = express()
app.use(cors()) 

const porta = 3000
app.use(bodyParser.json())

app.listen(porta, () => {
    console.log(`O servidor está rodando http://localhost:${porta}`)
})

// criar uma pool de conexão
const pool = mysql.createPool({
    host: `localhost`,
    user: `root`,
    password: '',
    database: `midia_indoor`,
    waitForConnections:true,
    connectionLimit: 3,
    queueLimit: 0
})

// 01 ROTA CADASTRAR MIDIA INDOR
app.post("/api/midia", async(req, res) => {
    try {
        const {nome, tipo, status, data_inicio, data_fim, url, tempo} = req.body
        const conexao = await pool.getConnection()
        const sql = `INSERT INTO midia (nome, tipo, status, data_inicio, data_fim, url, tempo) VALUE 
        ("${nome}","${tipo}","${status}","${data_inicio}","${data_fim}","${url}","${tempo}")`
        console.log(sql)
        const [linhas] = await conexao.execute(sql)
        // console.log([linhas])
        conexao.release()
        res.json({msg: "Registro cadastrado!"})

    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.send(500).json({error:"Deu algum erro no cadastro"})
    }
})

// 02 ROTA PARA SELECT
app.get('/api/midia' ,async (req, res)=>{
    try {
        const conexao = await pool.getConnection()
        const sql = "SELECT * FROM midia"
        const [linhas] = await conexao.execute(sql)
        //console.log([linhas])
        conexao.release()
        res.json(linhas)
 
    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.send(500).json({error:"Deu algum erro na busca"})
    }
})

// 02.1 ROTA PARA SELECT - ID
app.get('/api/midia/id/:id' ,async (req, res)=>{
    try {
        const id = req.params.id
        const conexao = await pool.getConnection()
        const sql = `SELECT * FROM midia WHERE id =${id} `
        const [linhas] = await conexao.execute(sql)
        console.log(linhas)
        conexao.release()
        res.json(linhas)

    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.send(500).json({error:"Deu algum erro na busca"})
    }

})

//02.2 ROTA PARA SELECT - NOME
app.get('/api/midia/nome/:nome', async (req, res) => {
    try {
        const nome = req.params.nome
        const conexao = await pool.getConnection()
        const sql = `SELECT * FROM midia WHERE NOME LIKE "%${nome}%"`
        const [linhas] = await conexao.execute(sql)
        // console.log([linhas])
        conexao.release()
        res.json(linhas)

    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.send(500).json({error:"Deu algum erro na busca"})
    }
})

// 03. ROTA PARA EDITAR
app.put("/api/midia/", async (req, res) => {
    try {
        const {id, nome, tipo, status, data_inicio, data_fim, url, tempo} = req.body

        const conexao = await pool.getConnection()
        const sql = `UPDATE midia SET nome = "${nome}", tipo = "${tipo}", status = "${status}",
        data_inicio = "${data_inicio}", data_fim = "${data_fim}", url = "${url}", tempo = ${tempo} WHERE id = ${id}`
        
        console.log(sql)
        const [linhas] = await conexao.execute(sql)
        conexao.release()
        res.json({msg: "Registro de edição concluído!"})

    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.status(500).json({error:"Deu algum erro na edição"})
    }
})

// 04 ROTA DE EXCLUSÃO
app.delete("/api/midia/:id",async (req, res)=>{
    try {
        const id_passado = req.params.id
        const conexao = await pool.getConnection()
        const sql = `DELETE FROM midia WHERE id = ${id_passado}`
        const [linhas] = await conexao.execute(sql)
        conexao.release()
        res.json({msg: "Registro excluido!"})

    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.send(500).json({error:"Deu algum erro ao ser excluído"})
    }

})

//05 ROTA DE EXIBIR MIDIAS 
app.get('/api/midia' ,async (req, res)=>{
    try {
        const conexao = await pool.getConnection()
        const sql = "SELECT * FROM midia"
        const [linhas] = await conexao.execute(sql)
        conexao.release()
        res.json(linhas)
 
    } catch (error) {
        console.log(`O Erro que ocorreu foi :${error}`)
        res.send(500).json({error:"Deu algum erro na busca"})
    }
})