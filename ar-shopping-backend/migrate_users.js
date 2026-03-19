const db = require('./db');

db.serialize(() => {
    try {
        db.run("ALTER TABLE users ADD COLUMN phone TEXT", (err) => {
            if (err && !err.message.includes('duplicate column name')) console.error("Error adding phone", err.message);
            else console.log("Added phone column");
        });
        db.run("ALTER TABLE users ADD COLUMN street TEXT", (err) => {
            if (err && !err.message.includes('duplicate column name')) console.error("Error adding street", err.message);
            else console.log("Added street column");
        });
        db.run("ALTER TABLE users ADD COLUMN city TEXT", (err) => {
             if (err && !err.message.includes('duplicate column name')) console.error("Error adding city", err.message);
             else console.log("Added city column");
        });
        db.run("ALTER TABLE users ADD COLUMN state TEXT", (err) => {
             if (err && !err.message.includes('duplicate column name')) console.error("Error adding state", err.message);
             else console.log("Added state column");
        });
        db.run("ALTER TABLE users ADD COLUMN zip TEXT", (err) => {
             if (err && !err.message.includes('duplicate column name')) console.error("Error adding zip", err.message);
             else console.log("Added zip column");
        });
    } catch(e) {
        console.error("Migration failed:", e);
    }
});
