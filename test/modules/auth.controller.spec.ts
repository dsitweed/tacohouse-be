import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthHelper } from '../helpers/auth.helper';

describe('Auth controller', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;

  beforeAll(() => {
    app = global.testContext.app;
    authHelper = new AuthHelper();
  });

  afterAll(async () => {
    await authHelper.clearUsers();
  });

  describe('POST sign-up', () => {
    const URL = '/auth/sign-up';

    it('Should success', async () => {
      const fakeEmail = faker.internet.email();
      const fakePassword = 'Passw0rd@';

      const response = await request(app.getHttpServer()).post(URL).send({
        email: fakeEmail,
        password: fakePassword,
        role: 'ADMIN',
      });

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          email: fakeEmail,
          role: 'ADMIN',
        }),
      );
    });

    it('Should fail with weak password', async () => {
      const fakeEmail = faker.internet.email();
      const fakePassword = faker.string.alpha(8);

      const response = await request(app.getHttpServer()).post(URL).send({
        email: fakeEmail,
        password: fakePassword,
        role: 'ADMIN',
      });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'Password should contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character',
        ]),
      );
    });

    it('Should fail if email is already taken', async () => {
      const fakeEmail = faker.internet.email();
      const fakePassword = 'Passw0rd@';

      await authHelper.createUser({
        email: fakeEmail,
        password: fakePassword,
        role: 'ADMIN',
      });

      const response = await request(app.getHttpServer()).post(URL).send({
        email: fakeEmail,
        password: fakePassword,
        role: 'ADMIN',
      });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('This email is already taken');
    });
  });

  describe('POST sign-in', () => {
    const URL = '/auth/sign-in';

    it('Should fail with wrong credentials', async () => {
      const fakeEmail = faker.internet.email();
      const fakePassword = faker.string.alpha(8);
      const response = await request(app.getHttpServer()).post(URL).send({
        email: fakeEmail,
        password: fakePassword,
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('Should success', async () => {
      const email = faker.internet.email();
      const password = 'Passw0rd@';

      await authHelper.createUser({ email, password });

      const response = await request(app.getHttpServer())
        .post(URL)
        .send({ email, password });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });
  });

  describe('POST sign-out', () => {
    const URL = '/auth/sign-out';

    it('Should success', async () => {
      const email = faker.internet.email();
      const password = 'Passw0rd@';

      const fakeAuthHeader = await authHelper.fakeAuthHeader({
        email,
        password,
      });

      const response = await request(app.getHttpServer())
        .post(URL)
        .set(fakeAuthHeader)
        .send();

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data).toBe('Sign out success!');
    });

    it('Should fail if unauthorized', async () => {
      const response = await request(app.getHttpServer()).post(URL).send();

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('GET refresh', () => {
    const URL = '/auth/refresh';

    it('Should success', async () => {
      const email = faker.internet.email();
      const password = 'Passw0rd@';

      const {
        tokens: { refreshToken },
      } = await authHelper.createUserWithToken({
        email,
        password,
      });

      const response = await request(app.getHttpServer())
        .get(URL)
        .set({
          Authorization: `Bearer ${refreshToken}`,
        })
        .send();

      expect(response.status).toBe(HttpStatus.OK);
    });

    it('Should fail if unauthorized', async () => {
      const response = await request(app.getHttpServer()).get(URL).send();

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
