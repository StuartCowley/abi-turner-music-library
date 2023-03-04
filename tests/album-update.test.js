const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('Update Album', () => {
  let artist;
  let album;
  let singleArtistId;
  beforeEach(async () => {
    let albumData;
    let artistData;

    artistData = await Promise.all([
      db.query(
        `INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *`,
        ['Tame Impala', 'rock']
      ),
    ]);
    artist = artistData.map(({ rows }) => rows[0]);
    singleArtistId = artist[0].id;

    albumData = await Promise.all([
      db.query(
        'INSERT INTO Albums (name, date, artistId) VALUES ($1, $2, $3) RETURNING *',
        ['Currents', 2015, singleArtistId]
      ),
      db.query(
        'INSERT INTO Albums (name, date, artistId) VALUES ($1, $2, $3) RETURNING *',
        ['The Slow Rush', 2020, singleArtistId]
      ),
      db.query(
        'INSERT INTO Albums (name, date, artistId) VALUES ($1, $2, $3) RETURNING *',
        ['Lonerism', 2012, singleArtistId]
      ),
    ]);

    album = albumData.map(({ rows }) => rows[0]);
  });

  describe('PATCH /albums/{id}', () => {
    it('updates the album and returns the updated record', async () => {
      const { status, body } = await request(app)
        .patch(`/albums/${album[0].id}`)
        .send({ name: 'new album', date: 2023, artistId: singleArtistId });
      expect(status).to.equal(200);

      expect(body).to.deep.equal({
        id: album[0].id,
        name: 'new album',
        date: 2023,
        artistid: singleArtistId,
      });

      it('returns a 404 if the album does not exist', async () => {
        const { status } = await request(app)
          .patch('/albums/999999999')
          .send({ name: 'new album', date: 2023, artistid: singleArtistId });
        expect(status).to.equal(404);
      });
    });
  });
});
