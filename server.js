const express = require('express') 
const bodyParser = require('body-parser');
const app = express()

const { ObjectId } = require('mongodb');

const MongoClient = require('mongodb').MongoClient
const uri ="mongodb+srv://matheus:senha@devs.r7kmv.mongodb.net/fail?retryWrites=true&w=majority";

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, client)=> { 
    if(err) return console.log(err)
    db = client.db('fail')
    
    app.listen(3000, () => { 
      console.log('Servidor rodando na porta 3000')
    })   
})

app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/', (req,res) => {
    var cursor = db.collection('fail').find()
});

app.get('/show', (req, res) => {
    db.collection('crud').find().toArray((err, results) => {
        if(err) return console.log(err);
        res.render('show.ejs', {data: results})
    })
})

app.post('/show', (req, res) => {
    db.collection('crud').insertOne(req.body, (err, result) => {
        if(err) return console.log(err);

        console.log('Salvo no Banco de Dados');
        res.redirect('/show')
    })
});

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('crud').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { data: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var name = req.body.name
  var surname = req.body.surname
  var cpf = req.body.cpf
  var email = req.body.email
  var numero = req.body.numero
  var cep = req.body.cep
  var sexo = req.body.sexo

  db.collection('crud').updateOne({_id: ObjectId(id)}, {
    $set: {
      name: name,
      surname: surname,
      cpf: cpf,
      email: email,
      numero: numero,
      cep: cep,
      sexo: sexo
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

    db.collection('crud').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if(err) return res.send(500, err)
        console.log('Deletado do Banco de Dados!');
        res.redirect('/show')
    })
})