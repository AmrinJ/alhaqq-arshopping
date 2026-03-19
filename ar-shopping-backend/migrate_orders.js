const db = require('./db');

db.serialize(() => {
    // Add tracking_status enum column
    db.run("ALTER TABLE orders ADD COLUMN tracking_status TEXT DEFAULT 'Processing'", (err) => {
        if (err) {
            console.log("tracking_status column migration skipped or already applied:", err.message);
        } else {
            console.log("Successfully added 'tracking_status' column to orders table.");
        }
    });

    // Add expected_delivery date column
    db.run("ALTER TABLE orders ADD COLUMN expected_delivery DATETIME", (err) => {
        if (err) {
            console.log("expected_delivery column migration skipped or already applied:", err.message);
        } else {
            console.log("Successfully added 'expected_delivery' column to orders table.");
        }
    });
});

db.close();
