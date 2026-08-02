// seed_products.mjs
// Run: node seed_products.mjs
// Requires: node-fetch, form-data  → npm install node-fetch form-data

import fetch, { FormData, Blob } from "node-fetch";

const BASE_URL = "http://localhost:8080";

// ── ❶  CREDENTIALS ───────────────────────────────────────────────
const EMAIL    = "dharunprasath.murugan@gmail.com";
const PASSWORD = "12341234";
// ─────────────────────────────────────────────────────────────────

// Helper: download an image from a URL and return a Buffer
async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

// Helper: get a placeholder image for a given seed/category
function imageUrl(seed) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/480`;
}

// ── ❷  PRODUCT DATA ──────────────────────────────────────────────
const products = [
  // Beauty and Healthcare
  { name: "Lavender Essential Oil 30ml", description: "Pure therapeutic-grade lavender oil for relaxation and aromatherapy.", category: "Beauty and Healthcare", subcategory: "Essential Oils", price: 349, quantity: 50, unit: "bottle" },
  { name: "Rose Essential Oil 15ml", description: "100% pure rose oil with natural floral fragrance.", category: "Beauty and Healthcare", subcategory: "Essential Oils", price: 499, quantity: 40, unit: "bottle" },
  { name: "Eucalyptus Essential Oil 30ml", description: "Refreshing eucalyptus oil ideal for steam inhalation.", category: "Beauty and Healthcare", subcategory: "Essential Oils", price: 299, quantity: 60, unit: "bottle" },
  { name: "Amla Shikakai Shampoo 200ml", description: "Herbal shampoo with amla and shikakai for hair growth.", category: "Beauty and Healthcare", subcategory: "Hair Care", price: 179, quantity: 100, unit: "bottle" },
  { name: "Coconut Oil Hair Mask 150g", description: "Deep conditioning hair mask with virgin coconut oil.", category: "Beauty and Healthcare", subcategory: "Hair Care", price: 249, quantity: 80, unit: "jar" },
  { name: "Hibiscus Hair Serum 50ml", description: "Lightweight serum infused with hibiscus extract.", category: "Beauty and Healthcare", subcategory: "Hair Care", price: 399, quantity: 70, unit: "bottle" },
  { name: "Matte Lipstick Rose Pink", description: "Long-lasting matte lipstick in a beautiful rose pink shade.", category: "Beauty and Healthcare", subcategory: "Makeup", price: 199, quantity: 120, unit: "piece" },
  { name: "Kajal Eye Pencil", description: "Smudge-proof, intense black kajal for bold eyes.", category: "Beauty and Healthcare", subcategory: "Makeup", price: 99, quantity: 150, unit: "piece" },
  { name: "BB Cream SPF 30 30ml", description: "Multi-tasking BB cream with SPF 30 for a flawless finish.", category: "Beauty and Healthcare", subcategory: "Makeup", price: 349, quantity: 90, unit: "tube" },
  { name: "Turmeric Face Wash 100ml", description: "Brightening face wash with turmeric and neem extracts.", category: "Beauty and Healthcare", subcategory: "Organic Skincare", price: 229, quantity: 85, unit: "bottle" },
  { name: "Aloe Vera Gel 200g", description: "Pure cold-pressed aloe vera gel for soothing and hydration.", category: "Beauty and Healthcare", subcategory: "Organic Skincare", price: 189, quantity: 110, unit: "jar" },
  { name: "Neem Face Pack 100g", description: "Antibacterial neem face pack for acne-prone skin.", category: "Beauty and Healthcare", subcategory: "Organic Skincare", price: 169, quantity: 90, unit: "jar" },
  // Clothing
  { name: "Cotton Anarkali Blouse", description: "Beautiful hand-embroidered cotton anarkali blouse.", category: "Clothing", subcategory: "Blouses", price: 899, quantity: 30, unit: "piece" },
  { name: "Silk Blouse Navy Blue", description: "Elegant silk blouse perfect for traditional occasions.", category: "Clothing", subcategory: "Blouses", price: 1299, quantity: 20, unit: "piece" },
  { name: "Floral Maxi Dress", description: "Lightweight floral maxi dress for summer outings.", category: "Clothing", subcategory: "Dresses", price: 1499, quantity: 25, unit: "piece" },
  { name: "A-Line Casual Dress", description: "Comfortable A-line dress in breathable cotton.", category: "Clothing", subcategory: "Dresses", price: 1199, quantity: 30, unit: "piece" },
  { name: "Banarasi Silk Saree Gold", description: "Traditional Banarasi silk saree with gold zari work.", category: "Clothing", subcategory: "Sarees", price: 4999, quantity: 15, unit: "piece" },
  { name: "Cotton Handloom Saree", description: "Handloom cotton saree perfect for daily wear.", category: "Clothing", subcategory: "Sarees", price: 1299, quantity: 40, unit: "piece" },
  { name: "Kanjivaram Silk Saree", description: "Premium Kanjivaram silk saree with temple border.", category: "Clothing", subcategory: "Sarees", price: 7999, quantity: 10, unit: "piece" },
  { name: "Mens Formal Shirt White", description: "Classic slim-fit formal shirt in pure cotton.", category: "Clothing", subcategory: "Men's Wear", price: 799, quantity: 50, unit: "piece" },
  { name: "Mens Linen Kurta", description: "Comfortable linen kurta for festive and casual wear.", category: "Clothing", subcategory: "Men's Wear", price: 999, quantity: 40, unit: "piece" },
  { name: "Kids Cotton Frock Set", description: "Cute cotton frock set for girls 2-8 years.", category: "Clothing", subcategory: "Kids Wear", price: 699, quantity: 40, unit: "piece" },
  // Fashion
  { name: "Handmade Jute Tote Bag", description: "Eco-friendly handmade jute tote bag with cotton lining.", category: "Fashion", subcategory: "Bags & Purses", price: 699, quantity: 60, unit: "piece" },
  { name: "Leather Sling Bag Brown", description: "Genuine leather sling bag with multiple compartments.", category: "Fashion", subcategory: "Bags & Purses", price: 1899, quantity: 25, unit: "piece" },
  { name: "Embroidered Canvas Cap", description: "Unisex canvas cap with floral hand embroidery.", category: "Fashion", subcategory: "Caps & Hats", price: 449, quantity: 70, unit: "piece" },
  { name: "Straw Sun Hat", description: "Wide-brim straw hat perfect for beach outings.", category: "Fashion", subcategory: "Caps & Hats", price: 599, quantity: 45, unit: "piece" },
  { name: "Handmade Wooden Sunglasses", description: "Eco-friendly sunglasses with UV400 protection.", category: "Fashion", subcategory: "Eyewear", price: 1299, quantity: 30, unit: "piece" },
  { name: "Analog Watch Rose Gold", description: "Elegant rose gold analog watch with genuine leather strap.", category: "Fashion", subcategory: "Watches", price: 2499, quantity: 20, unit: "piece" },
  { name: "Minimalist Steel Watch", description: "Minimalist stainless steel watch with sapphire glass.", category: "Fashion", subcategory: "Watches", price: 3499, quantity: 15, unit: "piece" },
  // Fashion and Jewellery
  { name: "Silver Anklet Set", description: "Traditional silver anklet set with ghungroo bells.", category: "Fashion and Jewellery", subcategory: "Anklets", price: 799, quantity: 50, unit: "set" },
  { name: "Gold Plated Bangles Set of 6", description: "Beautiful gold plated bangles with intricate enamel work.", category: "Fashion and Jewellery", subcategory: "Bangles & Bracelets", price: 649, quantity: 60, unit: "set" },
  { name: "Kundan Earrings", description: "Handcrafted Kundan earrings with peacock design.", category: "Fashion and Jewellery", subcategory: "Earrings", price: 849, quantity: 40, unit: "pair" },
  { name: "Pearl Drop Earrings", description: "Elegant freshwater pearl drop earrings in gold setting.", category: "Fashion and Jewellery", subcategory: "Earrings", price: 1199, quantity: 35, unit: "pair" },
  { name: "Temple Jewellery Necklace", description: "Traditional temple jewellery necklace with antique gold finish.", category: "Fashion and Jewellery", subcategory: "Necklaces", price: 2499, quantity: 20, unit: "piece" },
  { name: "Oxidised Silver Ring", description: "Handcrafted oxidised silver ring with floral design.", category: "Fashion and Jewellery", subcategory: "Rings", price: 449, quantity: 80, unit: "piece" },
  { name: "Bridal Jewellery Set", description: "Complete bridal set with necklace, earrings and maang tikka.", category: "Fashion and Jewellery", subcategory: "Traditional Sets", price: 5999, quantity: 10, unit: "set" },
  // Food
  { name: "Multigrain Sourdough Bread", description: "Freshly baked multigrain sourdough with seeds and oats.", category: "Food", subcategory: "Bakery", price: 249, quantity: 30, unit: "loaf" },
  { name: "Coconut Cookies 200g", description: "Crispy coconut cookies baked fresh daily.", category: "Food", subcategory: "Bakery", price: 179, quantity: 60, unit: "pack" },
  { name: "Banana Walnut Cake 500g", description: "Homemade banana walnut cake – no maida.", category: "Food", subcategory: "Bakery", price: 399, quantity: 25, unit: "piece" },
  { name: "Cold Pressed Sugarcane Juice 500ml", description: "Fresh cold-pressed sugarcane juice with ginger.", category: "Food", subcategory: "Beverages", price: 89, quantity: 100, unit: "bottle" },
  { name: "Herbal Green Tea 50 bags", description: "Premium green tea with tulsi and mint.", category: "Food", subcategory: "Beverages", price: 299, quantity: 80, unit: "box" },
  { name: "Mixed Dry Fruits 500g", description: "Premium mixed dry fruits – almonds, cashews, raisins.", category: "Food", subcategory: "Dry Fruits & Nuts", price: 599, quantity: 70, unit: "pack" },
  { name: "Roasted Peanuts Masala 250g", description: "Crispy masala roasted peanuts – a perfect snack.", category: "Food", subcategory: "Homemade Snacks", price: 149, quantity: 100, unit: "pack" },
  { name: "Murukku 250g", description: "Traditional crispy murukku made with rice flour.", category: "Food", subcategory: "Homemade Snacks", price: 129, quantity: 80, unit: "pack" },
  { name: "Mango Pickle 500g", description: "Traditional homemade raw mango pickle.", category: "Food", subcategory: "Pickles & Chutneys", price: 199, quantity: 60, unit: "jar" },
  { name: "Sambar Powder 200g", description: "Freshly ground traditional sambar powder.", category: "Food", subcategory: "Spices & Masala", price: 149, quantity: 90, unit: "pack" },
  { name: "Turmeric Powder 200g", description: "Pure organic turmeric powder with high curcumin.", category: "Food", subcategory: "Spices & Masala", price: 129, quantity: 100, unit: "pack" },
  // Groceries
  { name: "Organic Wheat Flour 1kg", description: "Stone-ground organic whole wheat flour.", category: "Groceries", subcategory: "Atta & Flours", price: 89, quantity: 150, unit: "kg" },
  { name: "Toor Dal 1kg", description: "Premium quality split pigeon peas.", category: "Groceries", subcategory: "Dals & Pulses", price: 149, quantity: 120, unit: "kg" },
  { name: "Moong Dal 500g", description: "Organic yellow moong dal.", category: "Groceries", subcategory: "Dals & Pulses", price: 99, quantity: 100, unit: "pack" },
  { name: "Cold Pressed Coconut Oil 500ml", description: "Virgin cold-pressed coconut oil for cooking.", category: "Groceries", subcategory: "Edible Oils", price: 399, quantity: 80, unit: "bottle" },
  { name: "Sona Masoori Rice 5kg", description: "Premium quality Sona Masoori white rice.", category: "Groceries", subcategory: "Rice & Grains", price: 349, quantity: 60, unit: "bag" },
  { name: "Black Pepper Powder 100g", description: "Freshly ground black pepper powder.", category: "Groceries", subcategory: "Spices & Condiments", price: 99, quantity: 100, unit: "pack" },
  { name: "Filter Coffee Powder 250g", description: "Traditional South Indian filter coffee powder.", category: "Groceries", subcategory: "Tea & Coffee", price: 299, quantity: 90, unit: "pack" },
  { name: "Assam CTC Tea 500g", description: "Strong and flavorful Assam CTC tea.", category: "Groceries", subcategory: "Tea & Coffee", price: 249, quantity: 80, unit: "pack" },
  // Handicraft
  { name: "Bamboo Serving Tray", description: "Handcrafted bamboo serving tray with handles.", category: "Handicraft", subcategory: "Bamboo Crafts", price: 899, quantity: 40, unit: "piece" },
  { name: "Bamboo Wind Chimes", description: "Natural bamboo wind chimes for home decor.", category: "Handicraft", subcategory: "Bamboo Crafts", price: 599, quantity: 50, unit: "piece" },
  { name: "Handwoven Jute Bag", description: "Eco-friendly handwoven jute shopping bag.", category: "Handicraft", subcategory: "Handmade Bags", price: 499, quantity: 60, unit: "piece" },
  { name: "Terracotta Wall Hanging", description: "Handpainted terracotta wall hanging with tribal art.", category: "Handicraft", subcategory: "Handmade Home Decor", price: 1299, quantity: 25, unit: "piece" },
  { name: "Hand Painted Clay Pot", description: "Traditional handpainted clay water pot.", category: "Handicraft", subcategory: "Pottery", price: 699, quantity: 35, unit: "piece" },
  { name: "Terracotta Planter Set", description: "Set of 3 decorative terracotta planters.", category: "Handicraft", subcategory: "Terracotta Items", price: 849, quantity: 30, unit: "set" },
  { name: "Wooden Elephant Figurine", description: "Hand-carved wooden elephant figurine with brass detailing.", category: "Handicraft", subcategory: "Wood Carvings", price: 1499, quantity: 20, unit: "piece" },
  { name: "Sandalwood Photo Frame", description: "Carved sandalwood photo frame 6x4 inch.", category: "Handicraft", subcategory: "Wood Carvings", price: 999, quantity: 30, unit: "piece" },
  // Office
  { name: "Ergonomic Office Chair", description: "Adjustable lumbar support chair for long working hours.", category: "Office Code", subcategory: "Chairs", price: 8999, quantity: 10, unit: "piece" },
  { name: "Bamboo Standing Desk", description: "Eco-friendly height-adjustable bamboo standing desk.", category: "Office Code", subcategory: "Desks", price: 14999, quantity: 5, unit: "piece" },
  { name: "Foldable Laptop Stand", description: "Portable aluminum laptop stand with 6 height levels.", category: "Office Code", subcategory: "Laptop Stands", price: 1299, quantity: 50, unit: "piece" },
  { name: "Kraft Paper Notebook Set of 3", description: "Eco-friendly kraft paper notebooks A5 size.", category: "Office Code", subcategory: "Stationery", price: 349, quantity: 80, unit: "set" },
  { name: "Bamboo Pen Holder", description: "Minimalist bamboo desk organizer and pen holder.", category: "Office Code", subcategory: "Stationery", price: 599, quantity: 60, unit: "piece" },
  { name: "LED Desk Lamp", description: "Touch-controlled LED desk lamp with 3 color modes.", category: "Office Code", subcategory: "Lighting", price: 1499, quantity: 35, unit: "piece" },
  // Organic Fruits and Vegetables
  { name: "Organic Alphonso Mangoes 1 Dozen", description: "Fresh farm-picked Alphonso mangoes from Konkan.", category: "Organic Fruits and Vegetables", subcategory: "Fruits", price: 899, quantity: 30, unit: "dozen" },
  { name: "Organic Papaya 1kg", description: "Freshly picked organic papaya rich in enzymes.", category: "Organic Fruits and Vegetables", subcategory: "Fruits", price: 89, quantity: 50, unit: "kg" },
  { name: "Organic Spinach 500g", description: "Fresh organic baby spinach leaves.", category: "Organic Fruits and Vegetables", subcategory: "Leafy Greens", price: 49, quantity: 80, unit: "pack" },
  { name: "Organic Methi Leaves 250g", description: "Fresh methi fenugreek leaves for cooking.", category: "Organic Fruits and Vegetables", subcategory: "Leafy Greens", price: 39, quantity: 100, unit: "pack" },
  { name: "Fresh Ginger 500g", description: "Organically grown fresh ginger root.", category: "Organic Fruits and Vegetables", subcategory: "Root Vegetables", price: 79, quantity: 100, unit: "pack" },
  { name: "Organic Carrots 1kg", description: "Farm-fresh organic orange carrots.", category: "Organic Fruits and Vegetables", subcategory: "Root Vegetables", price: 89, quantity: 90, unit: "kg" },
  { name: "Fresh Pomegranate Juice 500ml", description: "Cold-pressed fresh pomegranate juice no preservatives.", category: "Organic Fruits and Vegetables", subcategory: "Organic Juices", price: 149, quantity: 60, unit: "bottle" },
  { name: "Organic Mixed Vegetables Box 1kg", description: "Weekly seasonal vegetable box – mixed farm fresh produce.", category: "Organic Fruits and Vegetables", subcategory: "Vegetables", price: 199, quantity: 40, unit: "box" },
  { name: "Fresh Tomatoes 1kg", description: "Organically grown red tomatoes, pesticide-free.", category: "Organic Fruits and Vegetables", subcategory: "Vegetables", price: 59, quantity: 100, unit: "kg" },
  // Others
  { name: "Indian Mythology Hardcover", description: "Illustrated guide to Indian mythology and legends.", category: "Others", subcategory: "Books", price: 599, quantity: 40, unit: "piece" },
  { name: "Macrame DIY Kit", description: "Complete beginner macramé kit with rope and instructions.", category: "Others", subcategory: "DIY Kits", price: 999, quantity: 35, unit: "kit" },
  { name: "Handmade Gift Hamper Diwali", description: "Curated Diwali gift hamper with dry fruits and sweets.", category: "Others", subcategory: "Gift Items", price: 1499, quantity: 25, unit: "hamper" },
  { name: "Organic Surface Cleaner 500ml", description: "Plant-based multi-surface cleaner, no harsh chemicals.", category: "Others", subcategory: "Home Cleaning", price: 299, quantity: 70, unit: "bottle" },
  { name: "Natural Dog Biscuits 200g", description: "Healthy grain-free biscuits for dogs.", category: "Others", subcategory: "Pet Supplies", price: 249, quantity: 50, unit: "pack" },
  { name: "Wooden Building Blocks Set", description: "Educational 50-piece wooden building blocks for toddlers.", category: "Others", subcategory: "Toys & Games", price: 799, quantity: 40, unit: "set" },
  { name: "Organic Cotton Plush Toy", description: "Soft organic cotton stuffed animal safe for babies.", category: "Others", subcategory: "Toys & Games", price: 599, quantity: 45, unit: "piece" },
];

// ── ❸  SEED ──────────────────────────────────────────────────────
async function seed() {
  console.log("🔐 Logging in...");
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: EMAIL, password: PASSWORD }),
  });
  if (!loginRes.ok) {
    const err = await loginRes.text();
    throw new Error(`Login failed: ${err}`);
  }
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log("✅ Logged in! Token obtained.\n");

  let success = 0;
  let failed  = 0;

  for (const product of products) {
    try {
      const imgBuf = await downloadImage(imageUrl(product.name));

      const form = new FormData();
      form.append("name",        product.name);
      form.append("description", product.description);
      form.append("category",    product.category);
      form.append("subcategory", product.subcategory);
      form.append("price",       String(product.price));
      form.append("quantity",    String(product.quantity));
      form.append("unit",        product.unit);
      form.append("image1",      new Blob([imgBuf], { type: "image/jpeg" }), "cover.jpg");

      const res = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (res.ok) {
        console.log(`✅ [${success + 1}/${products.length}] ${product.name}`);
        success++;
      } else {
        const err = await res.text();
        console.error(`❌ Failed: ${product.name} → ${err}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ Error: ${product.name} → ${err.message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n🎉 Done! ${success} uploaded, ${failed} failed.`);
}

seed().catch(console.error);
