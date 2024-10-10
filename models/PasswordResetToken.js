/**
 * Importing Sequelize, DataTypes, and Model for database operations.
 */
const { Sequelize, DataTypes, Model } = require('sequelize');
/**
 * Establishing a new Sequelize instance with the database connection URL from environment variables.
 */
const sequelize = new Sequelize(process.env.DATABASE_URL);
/**
 * Importing the User model for association.
 */
const User = require('./User');

/**
 * Defining the PasswordResetToken model.
 * 
 * This model represents a password reset token within the system.
 * 
 * @class PasswordResetToken
 * @extends Model
 */
class PasswordResetToken extends Model {}

/**
 * Initializing the PasswordResetToken model with its attributes.
 * 
 * @param {Object} attributes - The attributes of the PasswordResetToken model.
 * @param {Object} options - The options for the PasswordResetToken model.
 */
PasswordResetToken.init({
    /**
     * The unique identifier for the password reset token, auto-incrementing and primary key.
     * 
     * @param {integer} id - The unique identifier.
     */
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    /**
     * The foreign key referencing the 'Users' model, indicating the user associated with the password reset token.
     * 
     * @param {integer} user_id - The foreign key referencing the 'Users' model.
     */
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE', // Optional: define behavior on user deletion
    },
    /**
     * The password reset token itself, not null.
     * 
     * @param {string} token - The password reset token.
     */
    token: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    /**
     * The expiration date and time for the password reset token, not null.
     * 
     * @param {date} expires_at - The expiration date and time.
     */
    expires_at: {
        type: DataTypes.DATE, // Changed to DATE for better compatibility
        allowNull: false,
    },
}, {
    /**
     * The Sequelize instance associated with the model.
     */
    sequelize,
    /**
     * The name of the model.
     */
    modelName: 'PasswordResetToken',
    /**
     * The name of the table in the database.
     */
    tableName: 'password_reset_tokens', // Explicitly define table name
    /**
     * Indicates if timestamps are enabled for the model.
     */
    timestamps: true,
    /**
     * Indicates if the underscored naming convention is used.
     */
    underscored: true, // Use underscored naming convention
});

/**
 * Exporting the PasswordResetToken model.
 */
module.exports = PasswordResetToken;