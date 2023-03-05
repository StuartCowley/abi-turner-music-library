const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('Read Albums', () => {
  let artists;
  let album;
  beforeEach(async () => {
    let artistData;
    let albumData;

    artistData = await Promise.all([
      db.query(
        'INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *',
        ['Tame Impala', 'rock']
      ),
    ]);
    artists = artistData.map(({ rows }) => rows[0]);
    const artistId = artists[0].id;

    albumData = await Promise.all([
      db.query(
        'INSERT INTO Albums (name, date, artistId) VALUES ($1, $2, $3) RETURNING *',
        ['Currents', 2015, artistId]
      ),
      db.query(
        'INSERT INTO Albums (name, date, artistId) VALUES ($1, $2, $3) RETURNING *',
        ['The slow rush', 2020, artistId]
      ),
      db.query(
        'INSERT INTO Albums (name, date, artistId) VALUES ($1, $2, $3) RETURNING *',
        ['Lonerism', 2012, artistId]
      ),
    ]);

    album = albumData.map(({ rows }) => rows[0]);
  });

  describe('GET /albums', () => {
    it('returns all album records in the database', async () => {
      const { status, body } = await request(app).get('/albums').send();

      expect(status).to.equal(200);
      expect(body.length).to.equal(3);

      body.forEach((albumRecord) => {
        const expected = album.find((a) => a.id === albumRecord.id);

        expect(albumRecord).to.deep.equal(expected);
      });
    });
  });

  describe('GET /albums/{id}', () => {
    it('returns the album with the correct id', async () => {
      const { status, body } = await request(app)
        .get(`/albums/${album[0].id}`)
        .send();

      expect(status).to.equal(200);
      expect(body).to.deep.equal(album[0]);
    });
    it('returns a 404 if the album does not exist', async () => {
      const { status } = await request(app).get('/albums/999999999').send();

      expect(status).to.equal(404);
    });
  });
});
