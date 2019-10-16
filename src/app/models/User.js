import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // Campo não existente na base de dados
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      // Realiza function antes de salvar no BD
      if (user.password) {
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password, 8); // Realiza uma criptografia de nv 8 em cima da senha
      }
    });
    return this;
  }

  // Reference to File Model
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' }); // avatar_id belong to File model
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash); // Verifica se bate a senhas
  }
}

export default User;
