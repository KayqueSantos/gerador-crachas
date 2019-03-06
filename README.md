# Gerador de Crachás

Projeto de Desenvolvimento Web para Processo Seletivo Dev Backend - Even3

A aplicação gerá crachás automaticamente a partir de informações inseridas pelo usuário.

## Ferramentas de Desenvolvimento Utilizadas

* Javascript
* jQuery v3.3.1
* Bootstrap v4.1.3
* Node.js v10.15.1
* Jimp v0.6.0
* PDFKit v0.9.0

## Pré-requisitos

* Node.js ([Download](https://nodejs.org/en/download/))

## Instruções de Execução

1. Clonar o repositório. Você pode fazer isso digitando o seguinte comando no CMD, em um diretório de sua preferência.
```
$ git clone https://github.com/KayqueSantos/gerador-crachas.git
```
2. Instalar as dependências do projeto. Você pode fazer isso digitando o seguinte comando no CMD:
```
$ npm install
```
3. Inicializar o servidor.
```
$ node server.js
```
4. Acessar ```localhost:3000```

5. Com a página inicializada, você terá acesso as funcionalidades da aplicação.

## Funcionamento da Aplicação

A aplicação recebe do usuário uma imagem que servirá de plano de fundo para o usuário, e uma imagem de logo do evento, sendo esta última opcional. (Observação 1: É importante que o usuário clique enviar, do contrário as imagens não serão enviadas para o servidor e a aplicação não funcionará.)

O usuário digita, na primeira caixa de texto, as tags que serão inseridas nos crachás, isto é, os cabeçalhos da planilha. Abaixo desta, ele pode escolher algumas opções de formatação do texto e o posicionamento da logo no crachá, o qual só é levado em conta no caso em que a logo é inserida.

Na segunda caixa de texto, ele deve colar o conteúdo da planilha diretamente do excel, incluindo os cabeçalhos. (Observação 2: se o conteúdo inserido nessa caixa de texto não for diretamente do excel, o programa não funcionará corretamente.)

Ao clicar baixar, é gerado um pdf contendo todos os crachás para o usuário fazer download.

## Limitações

1. A biblioteca Jimp. usada para a manipulação das imagens, só tem suporte para fontes do tipo Bitmap(FNT). Por essa razão, a formatação do texto nos crachás ficou um pouco limitada. A aplicação operece três tamanhos para o texto no crachá: pequeno, médio, e grande. O texto é escrito sempre com a fonte Open Sans, na cor preta, e é sempre centralizado.

2. A função que gera o PDF é inicializada após um tempo que equivale a 10 segundos por cada crachá. Isso foi feito com o uso da função setTimeout, para evitar que a função de gerar PDF tentasse acessar as imagens do crachá antes que elas estivessem prontas. No entanto, podem ocorrer casos em que a função que escreve as imagens no crachá demore mais que o necessário, e nesses casos, a aplicação da erro e encerra.
