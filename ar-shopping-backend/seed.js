const db = require('./db');

const products = [
  {
    name: "Classic White Tee",
    description: "Premium cotton classic white t-shirt. Perfect for any casual occasion.",
    price: 259.99,
    sizes: '["S", "M", "L", "XL"]',
    colors: '["White"]',
    fabric: "100% Cotton",
    image_url: "/products/white_tee.svg",
    ar_model_url: "/products/white_tee.svg",
    stock: 100
  },
  {
    name: "Urban Black V-Neck",
    description: "Sleek black v-neck t-shirt with a modern athletic fit.",
    price: 299.99,
    sizes: '["M", "L", "XL"]',
    colors: '["Black"]',
    fabric: "Cotton Blend",
    image_url: "/products/black_tee.svg",
    ar_model_url: "/products/black_tee.svg",
    stock: 50
  },
  {
    name: "Grey Unisex Tee",
    description: "Versatile heather grey tee. Perfect balance of casual style and comfort for anyone.",
    price: 229.99,
    sizes: '["S", "M", "L", "XL", "XXL"]',
    colors: '["Heather Grey"]',
    fabric: "Tri-blend",
    image_url: "/products/grey_tee.svg",
    ar_model_url: "/products/grey_tee.svg",
    stock: 75
  },
  {
    name: "Navy Unisex Tee",
    description: "Deep navy blue unisex t-shirt. A solid wardrobe staple.",
    price: 249.99,
    sizes: '["S", "M", "L", "XL"]',
    colors: '["Navy Blue"]',
    fabric: "100% Cotton",
    image_url: "/products/navy_tee.svg",
    ar_model_url: "/products/navy_tee.svg",
    stock: 60
  },
  {
    name: "Red Unisex Tee",
    description: "Vibrant red unisex tee to stand out in the crowd.",
    price: 219.99,
    sizes: '["S", "M", "L", "XL"]',
    colors: '["Red"]',
    fabric: "Cotton Blend",
    image_url: "/products/red_tee.svg",
    ar_model_url: "/products/red_tee.svg",
    stock: 45
  }
];

db.serialize(() => {
  db.run("DELETE FROM products", (err) => {
    if (err) console.error("Error clearing existing products", err);
    console.log("Cleared old products.");
    
    products.forEach(p => {
      db.run(
        `INSERT INTO products (name, description, price, sizes, colors, fabric, image_url, ar_model_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.description, p.price, p.sizes, p.colors, p.fabric, p.image_url, p.ar_model_url, p.stock],
        (err) => {
          if (err) console.error("Error inserting", p.name, err);
          else console.log("Inserted", p.name);
        }
      );
    });
  });
});
