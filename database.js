const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const { DB_USER, DB_PASS } = require('./config');

let database;

const mongoConnect = (callback) => {
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.zvxnqeu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  
  MongoClient.connect(uri)
    .then(client => {
      console.log("Connection to the database has been established.");
      database = client.db('shop');
      callback();
    })
    .catch(error => {
      console.error("Connection error:", error);
      throw error;
    });
};

const getDatabase = () => {
  if (!database) {
    throw new Error("No database found.");
  }
  return database;
};

module.exports = {
  mongoConnect,
  getDatabase
};