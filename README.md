
[![Netlify Status](https://api.netlify.com/api/v1/badges/7ec2ed37-d4a7-442b-a2f0-9a705dba80e0/deploy-status??branch=master)](https://app.netlify.com/sites/inuacrm/deploys)

[![Node.js CI](https://github.com/lalloyce/inua/actions/workflows/node.js.yml/badge.svg)](https://github.com/lalloyce/inua/actions/workflows/node.js.yml)

# Login-Register-Nodejs
A simple Login/Register application developed in Nodejs using Express.

# Getting started
Unzip the downloaded file.

### Installing dependencies:
Enter this command it will install all the dependencies at once:

```
npm install
```
Or you can install them individually:

```
npm install express express-session mysql pug-cli bcrypt util.promisify
```

Sometimes you get errors and access denied add sudo to the command

```
sudo npm install express express-session mysql pug-cli bcrypt util.promisify
```

### Start the application

```
npm start
```
or
```
node app
```
### Database

For this application, the database name is `Inua_crm`. It contains multiple tables as defined in the `database.sql` file.

### Setting up the database

You can use PhpMyAdmin to import the `database.sql` file included in the project directory.

if you correctly set up the database, you shouldn't get any errors.
