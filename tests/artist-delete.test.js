const { expect } = require('chai');
const request = require('supertest');
const db = require('../src/db');
const app = require('../src/app');

describe('delete artist', () => {
  let artist;
  beforeEach(async () => {
        const { rows } = await db.query(
          'INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *',
          ['Tame Impala', 'rock']
      );
      
      artist = rows[0];
    });
    

    describe('DELETE /artists/{id}', () => {
        it('deletes a single artist with the correct id', async () => {
            const { status, body } = await request(app)
                .delete(`/artists/${artist.id}`)
                .send();

            expect(status).to.equal(200);

            expect(body).to.deep.equal({
                id: artist.id,
                name: 'Tame Impala',
                genre: 'rock',
            });
        });

        it('returns a 404 if the artist is not in the database', async () => {
            const { status, body } = await request(app)
                .delete('/artist/999999')
                .send();

            expect(status).to.equal(404);
        });
    });
  });