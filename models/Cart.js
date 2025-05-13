const { getDatabase } = require('../database');
const Product = require('./Product');

const COLLECTION_NAME = "carts";

class Cart {
  constructor() {}

  static add(productName) {
    const db = getDatabase();
    
    return Product.findByName(productName)
      .then(product => {
        if (!product) {
          throw new Error(`Product '${productName}' not found.`);
        }
        
        return db.collection(COLLECTION_NAME)
          .findOne({ productName: productName })
          .then(cartItem => {
            if (cartItem) {
              // Produkt już w koszyku - zwiększ ilość
              return db.collection(COLLECTION_NAME)
                .updateOne(
                  { productName: productName },
                  { $inc: { quantity: 1 } }
                );
            } else {
              // Dodaj nowy produkt do koszyka
              return db.collection(COLLECTION_NAME)
                .insertOne({
                  product: product,
                  productName: productName,
                  quantity: 1
                });
            }
          });
      });
  }

  static getItems() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  static getProductsQuantity() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME)
      .aggregate([
        { 
          $group: { 
            _id: null, 
            total: { $sum: "$quantity" } 
          } 
        }
      ])
      .toArray()
      .then(result => {
        return result.length > 0 ? result[0].total : 0;
      })
      .catch(() => 0);
  }

  static getTotalPrice() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME)
      .aggregate([
        {
          $project: {
            totalItemPrice: { 
              $multiply: ["$quantity", "$product.price"] 
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalItemPrice" }
          }
        }
      ])
      .toArray()
      .then(result => {
        return result.length > 0 ? result[0].total : 0;
      })
      .catch(() => 0);
  }

  static clearCart() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).deleteMany({});
  }
}

module.exports = Cart;