const db = require('./db');

db.run("ALTER TABLE products ADD COLUMN category TEXT", (err) => {
    if (err) {
        console.log("Migration skipped or already applied:", err.message);
    } else {
        console.log("Successfully added 'category' column to products table.");
    }
    db.close();
});
