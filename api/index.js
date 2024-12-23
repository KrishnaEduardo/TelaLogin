const restify = require("restify");
const errors = require("restify-errors");
const corsMiddleware = require("restify-cors-middleware2");

// Configuração do CORS
const cors = corsMiddleware({
    origins: ['*']
});

const servidor = restify.createServer({
    name: 'testefinal',
    version: '1.0.0'
});

// Middlewares
servidor.use(restify.plugins.acceptParser(servidor.acceptable));
servidor.use(restify.plugins.queryParser());
servidor.use(restify.plugins.bodyParser());
servidor.pre(cors.preflight);
servidor.use(cors.actual);

// Inicialização do servidor
servidor.listen(8001, function () {
    console.log("Executando em https://localhost:8001");
});

// Configuração do Knex para PostgreSQL
const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432, // Porta do PostgreSQL
        user: 'postgres',
        password: '12345',
        database: 'testefinal'
    }
});

// Rota inicial
servidor.get('/', (req, res, next) => {
    res.send('Bem-Vindo á API!');
});

// Rota para listar todos os usuários cadastrados
servidor.get('/usuarios', (req, res, next) => {
    knex('usuarios')
        .then((dados) => {
            res.send(dados);
        })
        .catch((err) => {
            res.send(new errors.InternalServerError('Erro ao buscar usuários.'));
            next(err);
        });
});

// Rota para login
servidor.post('/login', (req, res, next) => {
    const { email, senha } = req.body;
    knex('usuarios')
        .where({ email })
        .first()
        .then((usuario) => {
            if (!usuario || usuario.senha !== senha) {
                return next(new errors.BadRequestError('Credenciais inválidas.'));
            }
            res.send({ message: 'Login bem-sucedido', usuario });
        })
        .catch(next);
});

// Rota para cadastro
servidor.post('/cadastro', (req, res, next) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return next(new errors.BadRequestError('Todos os campos são obrigatórios.'));
    }

    knex('usuarios')
        .insert({ nome, email, senha })
        .then(() => {
            res.send({ message: 'Cadastro bem-sucedido' });
        })
        .catch((err) => {
            if (err.code === '23505') { // Código de erro para chave única duplicada
                return next(new errors.ConflictError('E-mail já cadastrado.'));
            }
            next(err);
        });
});
