const express = require("express");
const { randomUUID } = require("crypto")
const fs = require("fs")

const app = express()

app.use(express.json())

let products = []

fs.readFile("products.json", "utf-8", (err, data) => {
    if(err){
        console.log(err)
    } else {
        products = JSON.parse(data)
    }
})

/**
 * POST -> Inserir um dado;
 * GET -> Buscar um/mais dados;
 * PUT -> Alterar um dado;
 * DELETE -> Remover um dado;
 */

/**
 * Body -> Sempre que eu quiser enviar dados para a minha aplicacao
 * Params -> /products/78316239162982
 * Query -> /products?id=219821298317283value=21381231
 */

app.post("/products", (req, resp) => {
    // Nome e Preco
    const { name, price } = req.body

    const product = {
        name,
        price,
        id: randomUUID()
    }

    products.push(product)

    productFile()

    return resp.json(product)
})

app.get("/products", (req, resp) => {
    return resp.json(products)
})

app.get("/products/:id", (req, resp) => {
    const {id} = req.params
    const product = products.find(product => product.id === id)
    return resp.json(product)
})

app.put("/products/:id", (req, resp) => {
    const {id} = req.params
    const {name, price} = req.body

    const productIndex = products.findIndex(product => product.id === id)

    products[productIndex] = {
        ...products[productIndex],
        name,
        price
    }

    productFile()

    return resp.json({ message: "Produto alterado com SUCESSO!"})
})

app.delete("/products/:id", (req, resp) => {
    const { id } = req.params

    const productIndex = products.findIndex((product) => product.id === id)

    products.splice(productIndex, 1)

    productFile()
    
    return resp.json({message: "Produto removido com SUCESSO!"})
})

function productFile() {
    fs.writeFile("products.json", JSON.stringify(products), (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Produto inserido")
        }
    })
}

app.listen(4002, () => console.log("Servidor está rodando na porta 4002"))