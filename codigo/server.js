const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('dados.json');
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);
server.use(middlewares);


server.post('/avaliacoes', (req, res) => {
  const { rating, comment } = req.body;
  const avaliacao = { rating, comment };
  router.db.get('avaliacoes').push(avaliacao).write();

});

server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server está rodando em http://localhost:${PORT}`);
});
