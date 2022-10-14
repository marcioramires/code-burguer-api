const express = require("express")
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Order not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const listeningRequirements = (request, response, next) => {
    console.log(`Requisição recebida pelo método ${request.method}, através da URL localhost/order/`)

    next()
}

app.post('/order', listeningRequirements, (request, response) => {

    const { order, clientName, price } = request.body

    const finalOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(finalOrder)

    return response.status(201).json(finalOrder)

})

app.get('/order', listeningRequirements, (request, response) => {

    return response.json(orders)

})

app.put('/order/:id', listeningRequirements, checkOrderId, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = orders[index]

    const { order, clientName, price } = request.body

    orders[index] = { 
        id, 
        order: order ? order : updatedOrder.order, 
        clientName: clientName ? clientName : updatedOrder.clientName, 
        price: price ? price : updatedOrder.price, 
        status: updatedOrder.status
    }

    return response.json(orders[index])
})

app.delete('/order/:id', listeningRequirements, checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()

})

app.get('/order/:id', listeningRequirements, checkOrderId, (request, response) => {
    const index = request.orderIndex
    return response.json(orders[index])

})

app.patch('/order/:id', listeningRequirements, checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders[index].status = "Pronto"

    return response.json(orders[index])
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})