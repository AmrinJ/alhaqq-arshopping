const db = require('./db');

db.serialize(() => {
    // Dynamically delete the first 5 products chronologically
    const query = `
        DELETE FROM products 
        WHERE id IN (
            SELECT id FROM products 
            ORDER BY id ASC 
            LIMIT 5
        )
    `;
    
    db.run(query, function(err) {
        if (err) {
            console.error("Error deleting products:", err.message);
        } else {
            console.log(`Successfully deleted ${this.changes} products from the catalog.`);
        }
    });
});

db.close();
