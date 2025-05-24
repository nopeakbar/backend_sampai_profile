const User = require("./User");
const Book = require("./Book");
const Exchange = require("./Exchange");

// Book ke User
Book.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Book, { foreignKey: "userId" });

// Exchange ke Book
Exchange.belongsTo(Book, { as: "targetBook", foreignKey: "targetBookId" });
Exchange.belongsTo(Book, { as: "offeredBook", foreignKey: "offeredBookId" });

// Exchange ke User
Exchange.belongsTo(User, { as: "requester", foreignKey: "requesterId" });

module.exports = { User, Book, Exchange };
