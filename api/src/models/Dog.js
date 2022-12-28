const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('dog', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, //es un tipo primary key,contiene alrededor de 15 caracteres, es autoincremental y es alfanumerico
      allowNull: false,
      primaryKey: true
    },
    life_span: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    minWeight: {
        type: DataTypes.STRING,
        allowNull: false,
      },

    maxWeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    minHeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxHeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdInDataBase: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    },
  }
  )};

