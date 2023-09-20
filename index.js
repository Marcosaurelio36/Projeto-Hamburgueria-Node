const express = require('express')
const uuid = require('uuid')
const app = express()
app.use(express.json())

const port = 3000


const clients = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = clients.findIndex(client => client.id === id)

    if (index < 0) {
        return response.status(404).json({error: "order not found"})
    }

    request.clientIndex = index
    request.clientId=id
    next()


}
     //Rota que verifica todos os Usuarios e pedidos//
app.get('/clients', (request, response) => {
    return response.json(clients)
})

    //criando um Pedido //
app.post('/clients', (request, response) => { 
    const { order, clientName, price, } = request.body

    const client = { id: uuid.v4(), order, clientName, price, status: 'Em preparação' }

    clients.push(client)

    return response.status(201).json(client)
})
// Atualizando um pedido pelo id//
app.put('/clients/:id',checkOrderId, (request, response) => { 

    const { order, clientName, price, } = request.body
    const index = request.clientIndex
    const id =request.clientId
    const updateClient = { id, order, clientName, price,status: 'Em preparação'  }

  
    clients[index] = updateClient
    return response.status(201).json(updateClient)
})
 // Atualizando o Status de um pedido //
app.patch('/clients/:id',checkOrderId,(request,response)=>{

    const {id}=request.params
    const index = clients.findIndex(client => client.id === id)

    clients[index].status ="Pronto"

    


    return response.status(201).json(clients[index])

})
 // Deletando um usuario pelo id//
app.delete('/clients/:id',checkOrderId, (request, response) => {
    const index = request.clientIndex

    clients.splice(index, 1)
    return response.status(204).json()
})

// Pesquisando  um usuario especifico 
app.get('/clients/:id',checkOrderId, (request, response) => {
    const index = request.clientIndex

    const orderSpecific = clients[index]

    return response.json(orderSpecific)
})









app.listen(port, () => {
    console.log(`Server started in port ${port}`)
})