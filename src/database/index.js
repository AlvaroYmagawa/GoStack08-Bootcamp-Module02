import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import dataBaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment]; // Cria array dos models

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // REALIZA CONEXÃO COM O BANCO
  init() {
    this.connection = new Sequelize(dataBaseConfig); // Passa o endereço do banco
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  // CONNECTION WITH MONGODB
  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
