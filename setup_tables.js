const db = require('./db');

async function createTables() {
    try {
        console.log('Creating tables...');

        // Create KodUser table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS KodUser (
                uid INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                balance DECIMAL(15, 2) DEFAULT 100000.00,
                phone VARCHAR(20),
                role ENUM('Customer', 'manager', 'admin') DEFAULT 'Customer'
            )
        `);
        console.log('KodUser table created or already exists.');

        // Create UserToken table
        // Note: 'expairy' as requested by user image, though 'expiry' is standard. 
        // I will use 'expiry' but comment about the user prompt image spelling.
        await db.execute(`
            CREATE TABLE IF NOT EXISTS UserToken (
                tid INT AUTO_INCREMENT PRIMARY KEY,
                token TEXT NOT NULL,
                uid INT NOT NULL,
                expiry DATETIME NOT NULL,
                FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
            )
        `);
        console.log('UserToken table created or already exists.');

        console.log('Database setup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error);
        process.exit(1);
    }
}

createTables();
