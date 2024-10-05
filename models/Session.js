/**
 * Importing necessary modules and models
 */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

/**
 * Defining the Session model
 */
class Session extends Model {}

/**
 * Initializing the Session model with its attributes
 */
Session.init({
    /**
     * session_id: A unique identifier for the session, primary key.
     * @type {DataTypes.STRING(255)}
     */
    session_id: {
        type: DataTypes.STRING(255),
        primaryKey: true,
    },
    /**
     * user_id: The foreign key referencing the User model's id.
     * @type {DataTypes.INTEGER}
     */
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    /**
     * expires: The date and time when the session expires.
     * @type {DataTypes.DATE}
     */
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    /**
     * data: Additional data stored in the session, with a specific collation.
     * @type {DataTypes.TEXT}
     */
    data: {
        type: DataTypes.TEXT,
        collate: 'utf8mb4_bin',
    },
}, {
    /**
     * Associating the model with the sequelize instance and defining model name, table name, and timestamps.
     */
    sequelize,
    modelName: 'Session',
    tableName: 'sessions', // Explicitly define table name
    timestamps: true,
});

/**
 * Exporting the Session model
 */
module.exports = Session;
