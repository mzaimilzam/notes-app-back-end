/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InVariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UserService {
  constructor() {
    this._pool = new Pool();
  }

  async AddUser({ username, password, fullName }) {
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3 $4) returning id',
      values: [id, username, hashedPassword, fullName],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InVariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async VerifyNewUsername(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InVariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async GetUserById(userId) {
    const query = {
      text: 'SELECT id, username, fullname FROM users WHERE id =$1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }
}

module.exports = UserService;
