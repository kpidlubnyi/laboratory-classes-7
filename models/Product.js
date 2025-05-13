const { getDatabase } = require('../database');

const COLLECTION_NAME = "products";

class Product {
  constructor(name, description, price) {
    this.name = name;
    this.description = description;
    this.price = price;
  }

  static getAll() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  static add(product) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME)
      .findOne({ name: product.name })
      .then(existingProduct => {
        if (!existingProduct) {
          return db.collection(COLLECTION_NAME).insertOne(product);
        }
        return Promise.resolve();
      });
  }

  static findByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).findOne({ name: name });
  }

  static deleteByName(name) {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME).deleteOne({ name: name });
  }

  static getLast() {
    const db = getDatabase();
    return db.collection(COLLECTION_NAME)
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .next()
      .catch(() => null);
  }
}

module.exports = Product;