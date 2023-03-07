const express = require('express');
const port = 6666;
const db = require('./config/mongoose');
const bodyParser = require('body-parser');
const Book = require('./models/book');

const app = express();

app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.send("This is the book service");
})

app.post('/book', (req,res)=>{
    var newBook = {
        title : req.body.title,
        author : req.body.author,
        numberPages : req.body.numberPages,
        publisher : req.body.publisher
    }

    var book = new Book(newBook);

    book.save().then(()=>{
        console.log("New Book Created");
    }).catch((err)=>{
        if(err){
            throw err;
        }
    });

    res.send("A new book created with success");
})

app.get("/book",(req,res)=>{
    Book.find().then((books)=>{
        res.json(books);
    }).catch((err)=>{
        if(err){
            throw err
        }
    })
})

app.get("/book/:id",(req,res)=>{
    Book.findById(req.params.id).then((books)=>{
        if(books){
            res.json(books);
        }
        else{
            res.sendStatus(404);
        }
    }).catch((err)=>{
        if(err){
            throw err
        }
    })
});

app.delete("/book/:id", (req,res)=>{
    Book.findOneAndRemove(req.params.id).then(()=>{
        res.send("Book deleted successfully");
    }).catch((err)=>{
        if(err){
            throw err;
        }
    });
})


app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})