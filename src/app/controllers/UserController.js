/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // VALIDAÇÃO DO BODY DA REQUISIÇÃO
    // Como o body da requisição deve ser
    const schema = Yup.object().shape({
      name: Yup.string().required(), // name tipo String, e obrigatório
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6), // senha deve ter no minimo 6 caracteres
    });

    // Caso o corpo da requisição não cumpra com os requisitos manda erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } }); // Verifica se existe e-mail duplicado
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const { id, name, email, provider } = await User.create(req.body); // Cria novo User
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // UPDATE
  async update(req, res) {
    // VALIDAÇÃO DO BODY DA REQUISIÇÃO
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when(
          'oldPassword', // Fazer uma condição em cima de oldPassword
          (oldPassword, field) => {
            return oldPassword ? field.required() : field; // Se oldPassWord existir então o field do password éobrigatório
          }
        ),
      confirmPassword: Yup.string().when('password', (password, field) => {
        return password ? field.required().oneOf([Yup.ref('password')]) : field; // confirm passworf deve ser igual a password caso password exista
      }),
    });

    // Caso o corpo da requisição não cumpra com os requisitos manda erro
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId); // Acha por Primary Key

    // Caso o usuário queira trocar de email verifica se o novo email está disponivel
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } }); // Verifica se existe e-mail duplicado

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
