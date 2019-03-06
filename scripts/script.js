/*Projeto - Teste Prático Backend Even3 
Autor: Kayque Lucas Santana dos Santos
Email: klss@cin.ufpe.br
Data: 2019-02-24

Descrição: Client-side da API.

Copyright(c) 2018 Kayque Lucas Santana dos Santos
*/

function baixarCrachas() {
	// Cria os crachás com as informações especificadas no layout, e fornecidas pela planilha, e gera um pdf para download.
	var tags = identificarTags(document.getElementById("tagsInput").value);
	var conteudo = processarConteudo1(document.getElementById("text-input").value);
	var nomeArquivoBg = document.getElementById("imgInput").files[0].name;

	if(!document.getElementById("logoInput").files.length == 0){
		var nomeArquivoLogo = document.getElementById("logoInput").files[0].name;
		var logoPlace = document.getElementById("logoP").value;
	} else {
		var nomeArquivoLogo = null;
		var logoPlace = null;
	}

	var formatacao = [document.getElementById("tagB").checked, document.getElementById("tagI").checked,
	 document.getElementById("tagF").value];

	var is_same = (tags.length == conteudo[0].length) && tags.every(function(element, index) {
    return element.toLowerCase() == conteudo[0][index].toLowerCase();}); //Compara se as tags inseridas correspondem ao conteúdo da planilha

    if(!is_same) {
    	alert("Os cabeçalhos estão diferentes das tags inseridas.")
    } else {
		gerarCrachas(conteudo.slice(1,-1), formatacao, nomeArquivoBg, nomeArquivoLogo, logoPlace);
	}
}

function identificarTags(textAreaCode)  {
	// Identifica as tags especificadas pelo usuário.
	var tags=textAreaCode.split(/{([^}]*)}/g).filter(Boolean);
	return (tags);
}

function processarConteudo1(textAreaCode) {
	// Separa a primeira linha em tags do conteúdo em tags, para comparar com as tags inseridas na caixa de layout
	linhas = textAreaCode.split("\n");
	linhas[0] = linhas[0].split("	");
	return linhas;
}

function gerarCrachas(conteudo, formatacao, nomeArquivoBg, nomeArquivoLogo, logoPlace) {
	// Pega as informações dos crachás, de formatação, e o nome do arquivo de plano de fundo e envia
	//para o servidor numa requisição post para o endereço /baixarCrachás
	var conteudo = JSON.stringify(conteudo);
	var formatacao = JSON.stringify(formatacao);
	var nomeArquivoBg = JSON.stringify(nomeArquivoBg);
	var nomeArquivoLogo = JSON.stringify(nomeArquivoLogo);
	var logoPlace = JSON.stringify(logoPlace);

	$.post('/baixarCrachas', {conteudo: conteudo, formatacao: formatacao, nomeArquivoBg: nomeArquivoBg,
								nomeArquivoLogo: nomeArquivoLogo, logoPlace: logoPlace}, 
								function () {window.open('/baixarCrachas')}
			);
}

//Inicializa a função gerar crachás
var btnBaixar = document.getElementById("btnBaixar");
btnBaixar.addEventListener("click", baixarCrachas);

//Configura um visualizador para a imagem de fundo enviada
document.getElementById("uploadImg").addEventListener('submit', setViewerBg);
function setViewerBg() {
	var viewImg = document.createElement("img");
	var srcName = "/uploads/"+document.getElementById("imgInput").files[0].name
	setTimeout(function() {viewImg.setAttribute('src', srcName)}, 4000);;
	viewImg.setAttribute('alt', 'na');
	viewImg.setAttribute('width', "200");
	var viewContainer = document.getElementById('viewBg');
    if (viewContainer.hasChildNodes()) {
		viewContainer.removeChild(viewContainer.childNodes[0]);
		setTimeout(function() {viewContainer.appendChild(viewImg)}, 4000);
	} else {
		setTimeout(function() {viewContainer.appendChild(viewImg)}, 4000);
	}
};

//Configura um visualizador para a imagem de logo enviada
document.getElementById("uploadLogo").addEventListener('submit', setViewerLogo);
function setViewerLogo() {
	var viewImg = document.createElement("img");
	var srcName = "/uploads/"+document.getElementById("logoInput").files[0].name
	setTimeout(function() {viewImg.setAttribute('src', srcName)}, 4000);;
	viewImg.setAttribute('alt', 'na');
	viewImg.setAttribute('width', "200");
	var viewContainer = document.getElementById('viewLogo');
    if (viewContainer.hasChildNodes()) {
		viewContainer.removeChild(viewContainer.childNodes[0]);
		setTimeout(function() {viewContainer.appendChild(viewImg)}, 4000);
	} else {
		setTimeout(function() {viewContainer.appendChild(viewImg)}, 4000);
	}
};