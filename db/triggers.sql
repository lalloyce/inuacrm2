-- This script creates triggers for the users table in the Inua CRM database.
-- These triggers are used to log user actions in the AuditLogs table.

-- Trigger for INSERT operations on users table
DELIMITER //
CREATE TRIGGER users_insert_trigger
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    -- Insert a new record into the AuditLogs table when a new user is created
    INSERT INTO AuditLogs (userId, action, endpoint, method, statusCode, message)
    VALUES (NEW.id, 'INSERT', 'users', 'INSERT', 200, CONCAT('New user created: ', NEW.email));
END;
//

-- Trigger for UPDATE operations on users table
CREATE TRIGGER users_update_trigger
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    -- Insert a new record into the AuditLogs table when a user is updated
    INSERT INTO AuditLogs (userId, action, endpoint, method, statusCode, message)
    VALUES (NEW.id, 'UPDATE', 'users', 'UPDATE', 200, CONCAT('User updated: ', NEW.email));
END;
//

-- Trigger for DELETE operations on users table
CREATE TRIGGER users_delete_trigger
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    -- Insert a new record into the AuditLogs table when a user is deleted
    INSERT INTO AuditLogs (userId, action, endpoint, method, statusCode, message)
    VALUES (OLD.id, 'DELETE', 'users', 'DELETE', 200, CONCAT('User deleted: ', OLD.email));
END;
//

DELIMITER ;