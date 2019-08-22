import { Router } from 'express'//Importanod classe Router do express

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ msg: "Hello World" });
})

export default routes;