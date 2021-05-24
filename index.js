/**
 * 
 * @summary
 * Módulo principal do sistema
 * @description
 * Carrega frameworks
 * Define rotas
 * Define porta do sistema 
 * @author Florentino dos Santos Filho <florentino.s.filho@gmail.com>
 * @version 1.0 maio/21 
 * 
*/

//        Comentário Separador JSDoc


/**
 * 
 * @type {Object}
 * @summary
 * Framework principal do sistema
 * @description
 * Carrega framework Express
 * Express é o framework javascript mais utilizado para criação de aplicações escritas em NodeJS
 * 
*/
const express = require("express");


/** 
    @type {Object}
    @summary
    Instancia aplicação express
    @description 
    Esta é a principal constante
    Encapsula todos os recursos do framework expres e instancia o servidor de aplicação
    @example 
    const app=express();
*/
const app = express();

/**
 * bodyParser é a biblioteca que faz o "parser" de um código html
 * usado para extrair variaveis submetidas por um codigo html
 */
const bodyParser = require("body-parser");

/**
 * Criação da conexao MySQL
 * 
 */
const connection = require("./database/database");


/**
 * Model Pergunta
 */
const Pergunta = require("./database/Pergunta");

/**
 * Model Resposta
 */
 const Resposta = require("./database/Resposta");
/**
 * Aqui o ORM sequelize testa a conexão com o banco de dados
 */
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

/**
 * Definindo engine html - EJS 
 */
app.set('view engine','ejs');
app.use(express.static('public'));
// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var alert = require('alert');
/** 
    @summary
    Define a rota principal do sistema
    @description 
    Define a rota principal
    Define funcão de call-back e variáveis 
    req     requisição
    res     resposta
    @example 
    res.send('bem vindo')
    Imprime no navegador a mensagem 'bem vindo'
*/

app.get("/",(req, res) => {
        res.render("login");
    });



app.get("/paginaPrincipal",(req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC'] // ASC = Crescente || DESC = Decrescente
    ]}).then(perguntas => {
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar",(req, res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta",(req, res) => {

    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/paginaPrincipal");
    });
});


app.get("/pergunta/:id",(req ,res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ // Pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ 
                    ['id','DESC'] 
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        }else{ // Não encontrada
            res.redirect("/");
        }
    });
})

app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/"+perguntaId);
    });
});

app.post("/validaLogin",(req, res) => {
    var email = req.body.email;
    var senha = req.body.senha;
    if ((email=='florentino@gmail.com') && (senha=='123')) {
        res.redirect("/paginaPrincipal");
    }else{
      //  console.log('email:'+email+' senha:'+senha)
    }

});


app.listen(8090,()=>{console.log("Rodando na porta 8090");})