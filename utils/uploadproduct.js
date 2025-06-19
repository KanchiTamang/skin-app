// utils/uploadProducts.js
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const productList = [
  {
    name: "Himalaya Neem Face Wash",
    brand: "Himalaya",
    skinType: ["Oily", "Combination"],
    concern: ["Acne", "Dark Spots"],
    price: 180,
    priceRange: "Low",
    type: "Face Wash",
    imageURL: "https://m.media-amazon.com/images/I/71Lcq9p9AVL._SL1500_.jpg"
  },
  {
    name: "Minimalist 10% Niacinamide Serum",
    brand: "Minimalist",
    skinType: ["Oily", "Dry", "Combination"],
    concern: ["Hyperpigmentation", "Dark Spots"],
    price: 599,
    priceRange: "Medium",
    type: "Serum",
    imageURL: "https://m.media-amazon.com/images/I/61fHe4pdpYL._SL1500_.jpg"
  },
  {
    name: "Dot & Key Retinol Night Cream",
    brand: "Dot & Key",
    skinType: ["Dry", "Normal"],
    concern: ["Wrinkles", "Dark Spots"],
    price: 1095,
    priceRange: "Medium",
    type: "Night Cream",
    imageURL: "https://m.media-amazon.com/images/I/61M7LkP0cnL._SL1500_.jpg"
  },
  {
    name: "Mamaearth Vitamin C Serum",
    brand: "Mamaearth",
    skinType: ["All"],
    concern: ["Hyperpigmentation", "Dark Spots"],
    price: 599,
    priceRange: "Medium",
    type: "Serum",
    imageURL: "https://m.media-amazon.com/images/I/71ESzjilLmL._SL1500_.jpg"
  }
];

export const uploadProducts = async () => {
  try {
    const colRef = collection(db, "products");
    for (let product of productList) {
      await addDoc(colRef, product);
      console.log("✅ Product added:", product.name);
    }
    alert("✅ All products uploaded to Firestore!");
  } catch (e) {
    console.error("❌ Error adding products:", e);
  }
};
