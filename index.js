const express = require('express');
const{ leerJSON, escribirJSON } = require('./src/files')
const Joi = require('joi');
const moment = require('moment');


//definimos esquema de joi
const computador = Joi.object({
    marca: Joi.string().min(3).max(20).required(),
    id: Joi.number().integer().min(1).max(100)
});




const app = express();
app.use(express.json())

// middelware a nivel de aplicación
app.use((req, res, next) => {
    console.log('Middelware en aplicación')
    console.log(req.method, req.url)
    next()
})

//index filter
app.get('/pcs', (req, res) => {
    //leer archivo
    const pcs = leerJSON('./bd.json')
    const {filter, marca} = req.query;
    
    if (filter === 'marca' && marca){
        const pcsfiltrados = pcs.filter(pc => pcs.marca);
        return res.send(pcsfiltrados)
    }
    
    res.send(pcs)
})






//index
app.get('/pcs', (req, res) => {
    //leer archivo
    const pcs = leerJSON('./bd.json')
    res.send(pcs)
})


//mostrar pc por id

app.get('/pcs/:id', (req, res, next) => {
    console.log('mid a nivel de ruta')
    next()},

    (req, res) =>{
    
    const id = req.params.id
    const pcs = leerJSON('./bd.json')
    const pc  = pcs.find(pc => pc.id === parseInt(id))

    //no existe
        if(!pc){
            res.status(404).send('No existe')
            return
        }
    //si existe
        res.send(pc)
})


//añadir un pc 
app.post('/pcs', (req,res) => {
    const pc = req.body
    const pcs = leerJSON('./bd.json')
    pc.id = pcs.length + 1 
    pcs.push(pc)
    //Escribir archivo
    escribirJSON('./bd.json', pcs)
    res.status(201).send(pc)
})

app.put('/pcs/:id' , (req,res) => {
    //buscamos la tarea con el id recibido en la url
    const id = req.params.id
    const pcs =  leerJSON('./bd.json')
    const pc = pcs.find(pc => pc.id === parseInt(id))
    

    //no existe
    if(! pc){
        res.status(404).send('No existe')
        return
    }
    //Existe
    //Actualizar la tarea
    
    
    const newPc = computador.validate({...pc, ...req.body}) //spread operator
    const index = pcs.indexOf(pc)
    pcs[index] = newPc

    //escribir en el archivo
    escribirJSON('./bd.json', pcs)
    res.send(newPc)
    res.send('Hello from PUT')
})




//actualizar acces_log.txt
app.put('/pcs/:id' , (req,res) => {
    //buscamos la tarea con el id recibido en la url
    const id = req.params.id
    const pcs =  leerJSON('./bd.json')
    const pc = pcs.find(pc => pc.id === parseInt(id))
    
    //no existe
    if(! pc){
        res.status(404).send('No existe')
        return
    }
    //Existe
    //Actualizar la tarea
    
    
    const newPc = {...pc, ...req.body} //spread operator
    const index = pcs.indexOf(pc)
    pcs[index] = newPc

    //escribir en el archivo
    escribirJSON('./acces_log.txt', pcs)
    res.send(newPc)
    res.send('Hello from PUT')
})






app.delete('/computadores/:id', (req, res) => {
    res.send('Hello from DELETE')
})



app.put('/actualizar-fecha', (req, res) => {
    const pcs = leerJSON('bd.json');
    const actPcs = pcs.map(pc => {
        return {
            ...pc,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    });

    escribirJSON('planes.json', actPcs);
    res.send(actPcs);
});







app.listen(3000, () => {
    console.log('listening on port 3000');
})