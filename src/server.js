require('dotenv').config();

const Hapi = require('@hapi/hapi');
// const routes = require('./routes');
const notes = require('./api/notes');
const NotesService = require('./service/postgres/NotesService');
// const NotesService = require('./service/inMemory/NotesService');
const NotesValidator = require('./validator/notes');

// users
const users = require('./api/users');
const UserService = require('./service/postgres/UserService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const notesService = new NotesService();
  const userService = new UserService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
