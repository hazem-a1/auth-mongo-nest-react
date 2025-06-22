# Start by installing dependency in ./frontend and in the root

============================================================

running in dev mode:

1 - make sure you have docker installed and running
2 - run ` docker compose -f 'docker-compose.yaml' up -d --build `
3 - run `npm run dev`

4 - visit [localhost:5555/api/docs](http://localhost:5555/api/docs) to find the swagger docs.
5 - visit [localhost:5555](http://localhost:5555) to find the frontend.

============================================================

running in prod mode:

1 - make sure you have docker installed and running
2 - run ` docker compose -f 'docker-compose.yaml' up -d --build `
3 - run `npm run build:prod`
4 - run `npm run start:prod`

============================================================

Nest Auth MongoDB app

======================

1- auth with passport.js and jwt. local/jwt/google auth.
2- mongodb with mongoose.
3- swagger docs
4- api versioning.
5- docker compose. for mongodb. running in dev and prod.
6- frontend with vite.
7- nestjs.
8- nestjs config.
9- nestjs jwt.
10- nestjs passport.
11- nestjs swagger.

======================
API Documentations
visit [host]/api/docs to find the swagger docs.

Todo:
[] unit test
[] cover OWASP
[] use zod for validation
