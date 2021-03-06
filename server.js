/*Projeto - Teste Prático Backend Even3 
Autor: Kayque Lucas Santana dos Santos
Email: klss@cin.ufpe.br
Data: 2019-02-24

Descrição: Server-side da API.

Copyright(c) 2018 Kayque Lucas Santana dos Santos
*/


//Inicializa o servidor e cria uma pasta de repositório para os uploads de imagem de fundo e logo do evento
//require dependencies
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const Jimp = require('Jimp');
const multer = require('multer'); 
const PDFDocument = require('pdfkit');
const fs = require('fs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Define o local de destino para o arquivo de imagem de fundo, e configura o nome do arquivo
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb (null, 'uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
});

//A configuração de storage na variável upload é referenciada como upload, e posteriormente é usada para
//lidar com o arquivo na requisição de post para /uploads
const upload = multer({ storage })

app.get('/', (req, res) => {
 res.sendFile('/index.html', {root: __dirname})
});

app.post('/uploads', upload.single('img'), (req, res) => {
	console.log(req.body, req.file);
	res.status(204).send();

});

//As duas instruções a seguir permitem que a aplicação acesse os arquivos upados no client-side
var publicDir = require('path').join(__dirname,'/');
app.use(express.static(publicDir));

app.listen(3000, () => console.log('Listening on port 3000!'));


//Define as instruções da requisição de post para /baixarCrachás
app.post('/baixarCrachas', (req, res) => {
	var conteudo = processarConteudo2(JSON.parse(req.body.conteudo));
	var formatacao = JSON.parse(req.body.formatacao);
	var nomeArquivoBg = JSON.parse(req.body.nomeArquivoBg);
	var nomeArquivoLogo = JSON.parse(req.body.nomeArquivoLogo);
	var logoPlace = JSON.parse(req.body.logoPlace);
	var fonte = formatacao[0].toString()+formatacao[1].toString()+formatacao[2].toString()
	//Após lidar com as informações passadas na requisição feita para/baixarCrachás, a função
	//escreverCracha é chamada i vezes, sendo i o número de linhas do conteúdo da planilha
	//inserido pelo usuário. É esperado que cada linha represente a informação de uma pessoa.
	Jimp.loadFont(publicDir+"resources/"+fonte+"/"+fonte+".fnt")
	.then(font => {
		for (i in conteudo) {
			escreverCracha(conteudo[i], font, nomeArquivoBg, nomeArquivoLogo, logoPlace, i);
		};
	});
	//A função gerarPDF é chamada para gerar o PDF com todos os crachás
	//Foi utilizada a função setTimeout, com um tempo que equivale a 10 segundos
	//para cada crachá gerado, para que a função aguarde o tempo necessário até que todos os
	//arquivos estejam prontos
	const time = conteudo.length*10000;
	setTimeout(function() {gerarPDF(conteudo.length)}, time);
	res.setTimeout(time+10000, function() {
		res.end()});
});


//A requisição get é feita para baixar o arquivo pdf
app.get('/baixarCrachas', (req, res) => {
		res.download(publicDir+"uploads/crachas/Crachas.pdf", 'Crachas.pdf');
		}, (err) => {
        	console.log(err);
 		});

function processarConteudo2(conteudo) {
	// Processa o conteúdo que será escrito nos crachás
	for (i in conteudo) {
		conteudo[i] = conteudo[i].split("\t");
	};
	return conteudo;
}

function escreverCracha(conteudo, font, nomeArquivoBg, nomeArquivoLogo, logoPlace, indice) {
	/*A função escreve todas as informações passadas no crachá. A variável conteúdo recebe as informações
	propriamente fornecidas. 
	A variável fonte é um código que define qual arquivo de fonte será carregado de acordo com a 
	formatação escolhida pelo usuário. A codificação se dá por: negrito(tORf)italico(tORf)tamanho(1or2or3)
	De forma que "truetrue1", por exemplo, corresponde à fonte negrito, italico de tamanho pequeno.
	A variável nomeArquivoBg indica o nome do arquivo de plano de fundo do crachá.
	A variável nomeArquivoLogo indica o nome do arquivo de logotipo do evento. Quando o usuário não faz
	upload do logo, a variável será null.
	Logo place é a variável que define a posição do logo no crachá. Ela pode ser 1 ou 2, sendo 1 para
	superior e 2 para inferior. Quando o usuário não faz upload do logo, a variável será null.
	Indice é uma variável de controle para salvar todos os crachás requeridos pelo usuário.
	*/
	Jimp.read(publicDir+"uploads/"+nomeArquivoBg)
	.then(image => {
		var y = image.bitmap.height/2;
		var w = image.bitmap.width;
    	var h = image.bitmap.height;
	
		//O bloco de código a seguir carrega o arquivo de fonte de acordo com a formatação requerida
		//pelo usuário e escreve as informações no crachá

		for (i in conteudo) {
			var text = conteudo[i];
			var textWidth = Jimp.measureText(font, text);
			var textHeight = Jimp.measureTextHeight(font, text);

			image.print(font, w/2 - textWidth/2, y, conteudo[i]);
			y = y+textHeight;
		}
		//O bloco de código a seguir posiciona a logo do evento no crachá, caso o usuário tenha
		//feito o upload. Caso não, ele apenas salva a imagem.
  		if(nomeArquivoLogo!=null) {
			Jimp.read(publicDir+"uploads/"+nomeArquivoLogo)
			.then(logo => {
				logo.resize(Jimp.AUTO, h/4)
				if(logoPlace==1){
					var logoY = 40;
				} else {
					var logoY = h-logo.bitmap.height-40;
				}
				image.composite(logo, w/2-logo.bitmap.width/2, logoY);
				//Como a imagem gerada do crachá é para fins de impressão, ela é sempre
				//salva no formato jpg
				image.write(publicDir+"uploads/crachas/Cracha-"+indice.toString()+".jpg");
			});
		} else {
			image.write(publicDir+"uploads/crachas/Cracha-"+indice.toString()+".jpg");
		}
	})
  	.catch(err => {
    	console.error(err)
  	});
}

function gerarPDF(qtdCrachas, res) {
	//A função recebe a quantidade de Crachas, e adiciona todas as imagens de crachás salvas
	//na pasta /uploads/Crachás a um arquivo PDF
	const doc = new PDFDocument({autoFirstPage: false});
	for (i = 0; i < qtdCrachas; i++){
		fileDir=(publicDir+"uploads/crachas/Cracha-"+i.toString()+".jpg");
		doc.addPage();
		doc.image(fileDir, {width: 298, align: 'center', valign: 'center'})
		doc.text('  ');
	}

	doc.pipe(fs.createWriteStream(publicDir+"uploads/crachas/Crachas.pdf"));
	doc.end();
}