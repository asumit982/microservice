const express = require('express');
const port = 7777;
const bodyParser = require('body-parser')
const db = require('./config/mongoose');
const Order = require('./models/order');
const { default: mongoose } = require('mongoose');
const axios = require('axios');
const { response } = require('express');

const app = express();

app.use(bodyParser.json());

app.post('/order', (req,res)=>{

    var newOrder = {
        CustomerID : new mongoose.Types.ObjectId(req.body.CustomerID),
        BookID : new mongoose.Types.ObjectId(req.body.BookID),
        initialDate : req.body.initialDate,
        deliveryDate : req.body.deliveryDate
    }

    var order = new Order(newOrder);

order.save().then(()=>{
    res.send("Order created with success")
}).catch((err)=>{
    if(err){
        throw err;
    }
})

})


app.get('/order', (req,res)=>{
     
    Order.find().then((books)=>{
        res.json(books);
    }).catch((err)=>{
        if(err){
            throw err;
        }
    })
})

app.get('/order/:id', (req,res)=>{

    Order.findById(req.params.id).then((order)=>{
        if(order){
             axios.get("http://localhost:5555/customers/" + order.CustomerID).then((response) =>{
             
             var orderObject = {customerName: response.data.name, bookTitle: ''}

             axios.get("http://localhost:4545/book/" + order.BookID).then((response) =>{

             orderObject.bookTitle = response.data.title

             res.json(orderObject)

             })

             })

        }
        else{
            res.send("Invalid order");
        }
    })

})


app.listen(7777, ()=>{
    console.log(`Order Server is running on port: ${port}`);

})