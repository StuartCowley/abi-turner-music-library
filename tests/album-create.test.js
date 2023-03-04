const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('create album', () => {
  let artistid;
  beforeEach(async () => {
    const { status, body } = await request(app)
      .post('/artists')
      .send({ name: 'Tame Impala', genre: 'rock' });
    
    expect(status).to.equal(201);
    expect(body.name).to.equal('Tame Impala');
    expect(body.genre).to.equal('rock');
    artistid = body.id
  });
     

  describe('/albums', () => {
    describe('POST', () => {
      it('creates a new album in the database', async () => {
        const { status, body } = await request(app)
          .post(`/artists/${artistid}/albums`)
          .send({
            name: 'Currents',
            date: 2015,
          });

        expect(status).to.equal(201);
        expect(body.name).to.equal('Currents');
        expect(body.date).to.equal(2015);

        const {
          rows: [albumsData],
        } = await db.query(`SELECT * FROM Albums WHERE id = ${body.id}`);
        expect(albumsData.name).to.equal('Currents');
        expect(albumsData.date).to.equal(2015);
      });
    });
  });
});