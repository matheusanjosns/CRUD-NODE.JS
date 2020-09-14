const express = require('express') 
const bodyParser = require('body-parser');
const app = express()

const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://JonasUs:33Jo021349@cluster0.8nrnl.mongodb.net/CRUD?retryWrites=true&w=majority"

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, client)=> { 
    if(err) return console.log(err)
    db = client.db('CRUD')
    
    app.listen(7001, () => { 
      console.log('Servidor rodando na porta 7001')
    })   
})


app.use(bodyParser.urlencoded({ extended:true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/', (req, res) =>{
    var cursor = db.collection('data').find()
})
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })
    })
})

app.post('/show',(req,res) => {
    db.collection('data').insertOne(req.body, (err, result) =>{
        if (err) return console.log(err)

        console.log('Salvo')
        res.redirect('/show')

    })
    

})
app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
  var idade = req.body.idade
  var rg = req.body.rg
  var email = req.body.email
  var telefone = req.body.telefone
  var endereco = req.body.endereco
  var sexo = req.body.sexo  

  db.collection('data').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname,
      idade: idade,
      rg: rg,
      email: email,
      telefone: telefone,
      endereco: endereco,
      sexo: sexo,
      
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletado do Banco de Dados!');
        res.redirect('/show')
    })
})