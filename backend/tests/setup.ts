import { Database } from 'sqlite3';

// Setup test database
beforeAll((done) => {
  // Use an in-memory database for tests
  process.env.NODE_ENV = 'test';
  done();
});

afterAll((done) => {
  done();
});