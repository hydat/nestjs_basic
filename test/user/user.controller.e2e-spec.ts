import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module'; // hoặc đường đúng tới AppModule
import { RolesGuard } from 'src/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true }) // bỏ qua xác thực
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true }) // bỏ qua check role
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('POST /users - should create a user successfully', async () => {
    const user = {
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456',
      role: 1,
    };

    const res = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('email', user.email);
  });
  it('GET /users/1', async () => {
    const res = await request(app.getHttpServer()).get('/users/1').expect(200);

    expect(res.body.data).toHaveProperty('id', 1);
  });

  it('GET /users', async () => {
    const res = await request(app.getHttpServer()).get('/users').expect(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  afterAll(async () => {
    await app.close();
  });
});
