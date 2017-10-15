require('dotenv').config();
import {EMAIL_IS_REQUIRED, EMAIL_IS_INVALID, PASSWORD_IS_REQUIRED,
        PASSWORD_IS_TOO_SHORT, EMAIL_ALREADY_IN_USE} from '../../constants/errors';
const db = require('../../models');
import {seedDb} from '../../utils';
import {USER_ROLE, ADMIN_ROLE, SUPERADMIN_ROLE} from '../../constants/roles';

async function expectError(response: any, error:any){
  expect(response.statusCode).toBe(422);
  expect(response.text).toMatch(error);
}

describe('AUTH', () => {

  const request = require('supertest');
  let app: any;

  beforeEach(async() => {
    await db.sequelize.sync({force:true});
    await seedDb(db.sequelize.queryInterface);
    app = require('../../server');
  });

  afterEach(async() => {
    app.close();
  });

  it('should fail to create a user without input', async () => {
    expect.assertions(2);
    const response = await request(app).post('/auth/register');
    expectError(response,EMAIL_IS_REQUIRED);
  });

  it('should fail to create a user when email is invalid', async () => {
    expect.assertions(2);
    const response = await request(app).post('/auth/register')
                                       .type('form')
                                       .send( { email: 'invalid@email' });
    expectError(response,EMAIL_IS_INVALID);
  });

  it('should fail to create a user without password', async () => {
    expect.assertions(2);
    const response = await request(app).post('/auth/register')
                                       .type('form')
                                       .send( { email: 'valid@email.com' });
    expectError(response,PASSWORD_IS_REQUIRED);
  });

  it('should fail to create a user without password', async () => {
    expect.assertions(2);
    const response = await request(app).post('/auth/register')
                                       .type('form')
                                       .send( { email: 'valid@email.com', password: 'short' });
    expectError(response,PASSWORD_IS_TOO_SHORT);
  });

  it('should fail to create a user without password', async () => {
    expect.assertions(2);
    const response = await request(app).post('/auth/register')
                                       .type('form')
                                       .send( { email: 'valid@email.com', password: 'short' });
    expectError(response,PASSWORD_IS_TOO_SHORT);
  });

  it('should fail to create a user with the same email address', async () => {
    expect.assertions(2);
    const validUser = {email:'valid@email.com', password: 'password'};
    await db.User.create(validUser);
    const response = await request(app).post('/auth/register')
                                       .type('form')
                                       .send( validUser);
    expectError(response,EMAIL_ALREADY_IN_USE);
  });

  it('should create a user with valid input', async () => {
    expect.assertions(3);
    const response = await request(app).post('/auth/register')
                                       .type('form')
                                       .send( { email: 'valid@email.com', password: 'longenough' });
    const data = JSON.parse(response.text);
    expect(response.statusCode).toBe(201);
    expect(data.token).toMatch(/JWT/);
    expect(data.user).toMatchSnapshot();
  });
});