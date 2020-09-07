const express = require('express') 
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const app = express()


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://<userName>:<password>@cluster0.y3pgi.mongodb.net/<dataBase>?retryWrites=true&w=majority";
// Na linha logo acima, adicionar a URI do DB: Contendo userName + Password + nomeDoDataBase
MongoClient.connect(uri, {useUnifiedTopology: true}, (err, client) => {
    if(err) return console.log(err);
    db = client.db('<dataBase>') //Nome do Banco de Dados

    app.listen(3000, () => {
        console.log('Servidor rodando na porta 3000');
    })
})

app.use(bodyParser.urlencoded({ extended: true }))


app.set('view engine', 'ejs')

app.get('/', (req, res) => {res.render('app.ejs');
})

app.get('/cadaster', (req, res) => {res.render('index.ejs');
});

app.get('/cadaster', (req,res) => {
    var cursor = db.collection('data').find()
});



app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if(err) return console.log(err);
        res.render('show.ejs', {data: results})
    })
})

app.post('/show', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {
        if(err) return console.log(err);

        console.log('Salvo no Banco de Dados');
        res.redirect('/show')
    })
});

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {data: result})
    })

})

.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    var cpf = req.body.cpf
    var telefone = req.body.telefone
    var anoNascimento = req.body.anoNascimento
    var email = req.body.email
    var userName = req.body.userName
    var password = req.body.password

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname,
            cpf: cpf,
            telefone: telefone,
            anoNascimento: anoNascimento,
            email: email,
            userName: userName,
            password: password
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados');
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