import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client';

export interface ITestContext {
  app: INestApplication;
  module: TestingModule;
  prisma: PrismaClient;
}
declare global {
  // eslint-disable-next-line no-var
  var testContext: ITestContext;
}

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [],
  }).compile();

  const testApp: INestApplication = moduleFixture.createNestApplication();

  testApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await testApp.init();
  await testApp.listen(0);

  global.testContext = {
    app: testApp,
    module: moduleFixture,
    prisma: new PrismaClient(),
  };
});

afterAll(async () => {
  if (global.testContext) {
    await global.testContext.app.close();
  }
});
