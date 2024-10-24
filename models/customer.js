// models/Customer.js
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    firstName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING, allowNull: false },
    nationalIdNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    mpesaMobileNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    alternativeMobileNumber: { type: DataTypes.STRING },
    gender: { type: DataTypes.ENUM('male', 'female', 'other'), allowNull: false },
    dateOfBirth: { type: DataTypes.DATE, allowNull: false },
    village: { type: DataTypes.STRING },
    subLocation: { type: DataTypes.STRING },
    ward: { type: DataTypes.STRING },
    subCounty: { type: DataTypes.STRING },
    county: { type: DataTypes.ENUM('Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City'), allowNull: false },
    isGroupLeader: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, { foreignKey: 'created_by' });
    Customer.belongsTo(models.GroupSalesContract, { foreignKey: 'group_sales_contract_id' });
    Customer.hasMany(models.Payment, { foreignKey: 'customer_id' });
    Customer.hasMany(models.Notification, { foreignKey: 'userId' });
    Customer.hasOne(models.CustomerBalance, { foreignKey: 'customer_id' });
  };

  return Customer;
};
