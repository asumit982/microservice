const express = require('express');
const port = 5555;
const db = require('./config/mongoose');
const Customer = require('./models/customer');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.send("This is the customer service");
})

app.post('/customer',(req,res)=>{


    var newCustomer = {
        name : req.body.name,
        age : req.body.age,
        address : req.body.address
    }

    var customer = new Customer(newCustomer);

    customer.save().then(()=>{
        console.log("New Customer Created");
    }).catch((err)=>{
        if(err){
            throw err;
        }
    });

    res.send("A new customer created with success");

})

app.get("/customers", (req,res) => {
    Customer.find().then((customers) =>{
        res.json(customers);
    }).catch((err)=>{
        if(err){
            throw err;
        }
    })
})

app.get("/customers/:id", (req,res) => {
    Customer.findById(req.params.id).then((customers) =>{
        if(customers){
            res.json(customers);
        }else{
            res.send("Invalid Id")
        }
    }).catch((err)=>{
        if(err){
            throw err;
        }
    })
})

app.delete("/customers/:id", (req,res)=>{
    Customer.findOneAndRemove(req.params.id).then(()=>{
        res.send("Customer deleted successfully");
    }).catch((err)=>{
        if(err){
            throw err;
        }
    });
})


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})