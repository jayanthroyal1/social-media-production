// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

// let mongosServer;

// // this is jest lifecycle hook
// /*
// beforeAll() runs once before all tests start
// We use it to start the temporary MongoDB instance
// */
// beforeAll(async () => {
//   //Create in-memory mongoDB instance
//   mongosServer = await MongoMemoryServer.create();

//   //Get the connection string
//   const mongoUrl = mongosServer.getUri();

//   //connect mongoose to test database
//   await mongoose.connect(mongoUrl);
// });

// /*
// afterEach() runs after every test
// We clear collections so tests stay isolated
// */
// afterEach(async () => {
//   const collections = mongoose.connection.collection;

//   for (const key in collections) {
//     await collections[key].deletemany();
//   }
// });

// /*
// afterEach() runs after every test
// We clear collections so tests stay isolated
// */
// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await mongosServer.stop();
// });

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
