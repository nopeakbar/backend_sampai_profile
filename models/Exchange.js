const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Book = require("./Book");

const Exchange = sequelize.define("Exchange", {
  requesterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  offeredBookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestedBookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
}, {
  tableName: "exchanges"
});

// Relasi
Exchange.belongsTo(User, { foreignKey: "requesterId", as: "requester" });
Exchange.belongsTo(Book, { foreignKey: "offeredBookId", as: "offeredBook" });
Exchange.belongsTo(Book, { foreignKey: "requestedBookId", as: "requestedBook" });

module.exports = Exchange;
