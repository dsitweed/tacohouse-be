import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthHelper, BuildingsHelper } from '../helpers';

describe('Buildings controller', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let buildingsHelper: BuildingsHelper;

  beforeAll(() => {
    app = global.testContext.app;
    authHelper = new AuthHelper();
    buildingsHelper = new BuildingsHelper();
  });

  afterAll(async () => {
    await authHelper.clearUsers();
  });

  describe('GET refresh', () => {
    const URL = '/buildings/refresh';

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
  });
});
