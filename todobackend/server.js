const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json())
app.use(cors())
 

// let todos=[];


//database connect
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(()=>{
    console.log('DB connected');
})
.catch((err)=>{
    console.log(err);
})



//schema
const todoSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})
//model
const todomodel = mongoose.model('Todo', todoSchema);
//create
app.post('/todo',async(req,res)=>{
    const {title, description} =req.body;
    // const newtodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newtodo);
    // console.log(todos);
try {
    const newTodo= new todomodel({title, description})
   await newTodo.save();
   res.status(201).json(newTodo);
} catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
}
   
    
})


//get the items
app.get('/todo',async(req,res)=>{
try {
    const todos = await todomodel.find();
    res.json(todos);
} catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
}

})

//update
app.put('/todo/:id',async(req,res)=>{
    try {
        const {title, description} =req.body;
        const id = req.params.id;
    
            const updatedTodo = await todomodel.findByIdAndUpdate(
                id,
                {title, description},
                {new:true}
            );
            if(!updatedTodo)
            {
                return res.status(404).json({message:"todo not found"})
            }
            res.json(updatedTodo); 
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
    })


//delete the item
app.delete('/todo/:id',async(req,res)=>{
    try {
    const id=req.params.id;
    const deleteTodo = await todomodel.findByIdAndDelete(id);
    res.status(204).end();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
        
    }
})



const port=8000;
app.listen(port,()=>{
    console.log("server listening"+port);
})