/*Projeto - Teste Prático Backend Even3 
Autor: Kayque Lucas Santana dos Santos
Email: klss@cin.ufpe.br
Data: 2019-02-24

Descrição: Cria um servidor local para o backend.

Copyright(c) 2018 Kayque Lucas Santana dos Santos
*/



const express = require('express')
const app = express()
const multer = require('multer')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb (null, 'uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, 'imagemdefundo.png')
	}

})

const upload = multer({ storage })

app.get('/', (req, res) => {
 res.sendFile('/index.html', {root: __dirname})
})

app.post('/uploads', upload.single('img'), (req, res) => {
	console.log(req.body, req.file)
	res.sendFile('/index.html', {root: __dirname})
})

var publicDir = require('path').join(__dirname,'/uploads')
app.use(express.static(publicDir));

app.listen(3000, () => console.log('Listening on port 3000!'))