const express = require('express');
const app = express();
app.use(express.static('public'));


app.listen(process.env.PORT || 3030, ()=>{
    console.log('Servidor funcionando puerto 3030');
});

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/register', (req,res)=>{
    res.sendFile(__dirname + '/views/register.html');
});

app.get('/register', (req,res)=>{
    res.sendFile(__dirname + '/views/login.html');
});