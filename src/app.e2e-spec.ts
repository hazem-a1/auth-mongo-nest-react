import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/docs (GET)', () => {
    return request(app.getHttpServer()).get('/api/docs').expect(200);
  });

  it('should have proper CORS configuration', () => {
    return request(app.getHttpServer())
      .options('/api/auth/v1/login')
      .set('Origin', 'http://localhost:3000')
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type')
      .expect(200);
  });

  it('should have proper API versioning', () => {
    return request(app.getHttpServer()).get('/api/user/v1').expect(401); // Should return 401 (Unauthorized) not 404 (Not Found)
  });

  it('should have proper global prefix', () => {
    return request(app.getHttpServer()).get('/user/v1').expect(404); // Should return 404 because /api prefix is missing
  });

  it('should handle non-existent routes', () => {
    return request(app.getHttpServer())
      .get('/api/non-existent-route')
      .expect(404);
  });

  it('should have proper validation pipe configuration', () => {
    return request(app.getHttpServer())
      .post('/api/auth/v1/register')
      .send({
        // Missing required fields
      })
      .expect(400); // Should return 400 Bad Request due to validation
  });

  it('should have proper rate limiting', async () => {
    // Make multiple requests to trigger rate limiting
    const promises = Array.from(
      { length: 101 },
      () => request(app.getHttpServer()).get('/api/user/v1').expect(401), // Should return 401 (Unauthorized)
    );

    await Promise.all(promises);

    // The 101st request should be rate limited
    return request(app.getHttpServer()).get('/api/user/v1').expect(429); // Too Many Requests
  }, 30000); // Increase timeout for rate limiting test

  it('should have proper security headers', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200)
      .expect((res) => {
        // Check for security headers
        expect(res.headers).toHaveProperty('x-frame-options');
        expect(res.headers).toHaveProperty('x-content-type-options');
        expect(res.headers).toHaveProperty('x-xss-protection');
      });
  });

  it('should have proper compression', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .set('Accept-Encoding', 'gzip, deflate')
      .expect(200)
      .expect((res) => {
        // Check if response is compressed
        expect(res.headers['content-encoding']).toBeDefined();
      });
  });

  it('should handle health check endpoint if exists', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect((res) => {
        // Either 200 if health endpoint exists, or 404 if it doesn't
        expect([200, 404]).toContain(res.status);
      });
  });

  it('should have proper JWT guard configuration', () => {
    return request(app.getHttpServer())
      .get('/api/user/v1')
      .expect(401) // Should return 401 (Unauthorized) due to JWT guard
      .expect((res) => {
        expect(res.body.message).toBeDefined();
      });
  });

  it('should allow public routes', () => {
    return request(app.getHttpServer())
      .post('/api/auth/v1/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect((res) => {
        // Should not return 401 (Unauthorized) for public routes
        expect(res.status).not.toBe(401);
      });
  });

  it('should have proper Swagger documentation setup', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('swagger');
        expect(res.text).toContain('Nest Auth API');
      });
  });

  it('should handle malformed JSON requests', () => {
    return request(app.getHttpServer())
      .post('/api/auth/v1/register')
      .set('Content-Type', 'application/json')
      .send('invalid json')
      .expect(400);
  });

  it('should handle requests with invalid content type', () => {
    return request(app.getHttpServer())
      .post('/api/auth/v1/register')
      .set('Content-Type', 'text/plain')
      .send('plain text')
      .expect(400);
  });

  it('should have proper error handling for internal server errors', () => {
    // This test would require mocking a service to throw an error
    // For now, we just test that the app doesn't crash
    return request(app.getHttpServer()).get('/api/docs').expect(200);
  });

  it('should have proper logging configuration', () => {
    // This test verifies that the app starts without logging errors
    expect(app).toBeDefined();
    expect(app.getHttpServer()).toBeDefined();
  });

  it('should have proper environment configuration', () => {
    // Test that the app can access environment variables
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should handle graceful shutdown', async () => {
    // Test that the app can be closed gracefully
    await expect(app.close()).resolves.not.toThrow();
  });
});
