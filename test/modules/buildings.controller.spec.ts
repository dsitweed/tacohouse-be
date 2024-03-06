import { HttpStatus, INestApplication } from '@nestjs/common';
import { randomInt } from 'crypto';
import request from 'supertest';
import { AuthHeader, AuthHelper, BuildingsHelper } from '../helpers';
import { fakeCreateBuilding } from '../mocks';

describe('Buildings controller', () => {
  let app: INestApplication;
  let authHelper: AuthHelper;
  let buildingsHelper: BuildingsHelper;
  let ownerId: number;
  let buildingId: number;
  let fakeAuthHeader: AuthHeader;

  beforeAll(() => {
    app = global.testContext.app;
    authHelper = new AuthHelper();
    buildingsHelper = new BuildingsHelper();
  });

  beforeEach(async () => {
    ownerId = randomInt(256);
    buildingId = randomInt(256);
    fakeAuthHeader = await authHelper.fakeAuthHeader({ id: ownerId });
  });

  afterEach(async () => {
    await buildingsHelper.clearBuildings();
    await authHelper.clearUsers();
  });

  describe('POST /buildings', () => {
    const URL = '/buildings';

    it('Should success', async () => {
      const response = await request(app.getHttpServer())
        .post(URL)
        .set({ ...fakeAuthHeader })
        .send(fakeCreateBuilding());

      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('Should fail due to missing buildingType', async () => {
      const response = await request(app.getHttpServer())
        .post(URL)
        .set({ ...fakeAuthHeader })
        .send(fakeCreateBuilding({ type: undefined }));

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'type should not be empty',
          'type must be one of the following values: HOSTEL, ENTIRE_HOUSE',
        ]),
      );
    });

    it('Should fail if building name is duplicated', async () => {
      await buildingsHelper.createBuilding(ownerId, { name: 'AAA' });

      const response = await request(app.getHttpServer())
        .post(URL)
        .set({ ...fakeAuthHeader })
        .send(fakeCreateBuilding({ name: 'AAA' }));

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Building names cannot be duplicated');
    });
  });

  describe('GET /buildings', () => {
    const URL = '/buildings';

    it('Should success return empty list', async () => {
      const response = await request(app.getHttpServer())
        .get(URL)
        .set({ ...fakeAuthHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBe(0);
    });

    it('Should success return list building', async () => {
      await buildingsHelper.createBuilding(ownerId);
      await buildingsHelper.createBuilding(ownerId);

      const response = await request(app.getHttpServer())
        .get(URL)
        .set({ ...fakeAuthHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty('rooms');
    });
  });

  describe('GET /buildings/:id', () => {
    it('Should success return building', async () => {
      const URL = `/buildings/${buildingId}`;

      await buildingsHelper.createBuilding(ownerId, { id: buildingId });

      const response = await request(app.getHttpServer())
        .get(URL)
        .set({ ...fakeAuthHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(buildingId);
      expect(response.body.data).toHaveProperty('rooms');
      expect(response.body.data).toHaveProperty('buildingUnitPrices');
    });

    it('Should fail if building not found', async () => {
      const URL = `/buildings/${buildingId}`;

      const response = await request(app.getHttpServer())
        .get(URL)
        .set({ ...fakeAuthHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe('Building not found');
    });
  });

  describe('PATH /buildings/:id', () => {
    it('Should success update building', async () => {
      const URL = `/buildings/${buildingId}`;
      const newAddress = 'AAAAA';

      await buildingsHelper.createBuilding(ownerId, { id: buildingId });

      const response = await request(app.getHttpServer())
        .patch(URL)
        .send({ address: newAddress })
        .set({ ...fakeAuthHeader });

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(buildingId);
      expect(response.body.data.address).toBe(newAddress);
    });

    it('Should fail if building not found', async () => {
      const URL = `/buildings/${buildingId}`;
      const newAddress = 'AAAAA';

      const response = await request(app.getHttpServer())
        .patch(URL)
        .send({ address: newAddress })
        .set({ ...fakeAuthHeader });

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.message).toBe('Building not found');
    });

    it('Should fail if building name is duplicated', async () => {
      const URL = `/buildings/${buildingId}`;
      const newAddress = 'AAAAA';

      await buildingsHelper.createBuilding(ownerId, { id: buildingId });

      await buildingsHelper.createBuilding(ownerId, { name: 'BBBBB' });

      const response = await request(app.getHttpServer())
        .patch(URL)
        .send({ address: newAddress, name: 'BBBBB' })
        .set({ ...fakeAuthHeader });

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toBe('Building names cannot be duplicated');
    });
  });
});
