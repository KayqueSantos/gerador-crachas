
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
								nomeArquivoLogo: nomeArquivoLogo, logoPlace: logoPlace});
}

//Inicializa a função gerar crachás
var btnBaixar = document.getElementById("btnBaixar");
btnBaixar.addEventListener("click", baixarCrachas);