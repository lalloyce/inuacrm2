[![Netlify Status](https://api.netlify.com/api/v1/badges/7ec2ed37-d4a7-442b-a2f0-9a705dba80e0/deploy-status)]
(https://app.netlify.com/sites/inuacrm/deploys)

# Inua CRM

Inua CRM is a comprehensive customer relationship management system designed to streamline interactions with clients, manage user roles, and facilitate communication through notifications and ticketing systems.

## 🚀 Features

- User management with role-based access control
- Ticketing system for tracking customer inquiries
- Notification system for user updates
- Password reset functionality
- Audit logging for tracking user actions

## 📦 Technologies Used

- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web framework for building APIs
- **Sequelize**: ORM for database interactions
- **MySQL**: Relational database management system
- **dotenv**: Module for loading environment variables
- **bcrypt**: Library for hashing passwords
- **jsonwebtoken**: For user authentication
- **nodemailer**: For sending emails

## 📋 Requirements

- Node.js (version 14 or higher)
- MySQL (version 5.7 or higher)

## 🛠️ Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/lalloyce/inuacrm2.git
   cd inuacrm2
   ```

2. Install npm modules:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your database credentials:
   ```plaintext
   DATABASE_URL=mysql://root:D%23FR%24GG%23D@localhost:3306/inuacrm
   ```

4. Run the database schema:
   ```bash
   mysql -u root -p < db/schema.sql
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## 📖 Usage Instructions

- To create a new user, send a POST request to `/api/users` with the required user data.
- To create a new ticket, send a POST request to `/api/tickets` with the ticket details.
- Notifications can be accessed via the `/api/notifications` endpoint.

## 📄 Documentation

For detailed API documentation, refer to the [API Documentation](link-to-your-api-docs).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please reach out via [GitHub Issues](https://github.com/yourusername/inua-crm/issues).

---

Thank you for checking out Inua CRM! If you find this project helpful, please give it a star ⭐️.
