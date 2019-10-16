import jwt from 'jsonwebtoken';

import { promisify } from 'util'; // Import para alterar function callback para async await
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  const [, token] = authHeader.split(' '); // Pega apenas o token e ingora o bearer

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id; // Criando variavel na requisição para armezenar o id

    return next();
  } catch (err) {
    return res.status(401).json(err);
  }
};
