import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/user.entity';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Authentication system (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const email: string = 'testsignup@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '12345',
      })
      .expect(201)
      .then((res: { body: User }) => {
        const { body } = res;

        expect(body.id).toBeDefined();
        expect(body.email).toEqual(email);
      });
  });

  it('signup as a new user and get the currently logged in user', async () => {
    const email = 'signupwhom@test.com';
    const req = request(app.getHttpServer());
    const res = await req
      .post('/auth/signup')
      .send({
        email,
        password: '12345',
      })
      .expect(201);
    const Cookie = res.get('set-cookie');
    return req
      .get('/auth/me')
      .set({
        Cookie,
      })
      .expect(200)
      .then((res: { body: User }) => {
        const { body } = res;
        expect(body.id).toBeDefined();
        expect(body.email).toEqual(email);
        console.log(body);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
