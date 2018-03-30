const mongoose = require('mongoose');
const chai = require('chai');
const chaiHTTP = require('chai-http');
const { expect } = chai;
const sinon = require('sinon');
chai.use(chaiHTTP);

const Game = require('./models');
const server = require('./server');

describe('Games', () => {
  before(done => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/test');
    const db = mongoose.connection;
    db.on('error', () => console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('we are connected');
      done();
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      console.log('we are disconnected');
    });
  });

  let gameID = null;

  beforeEach(done => {
    const newGame = new Game({
      title: 'Halo',
      releaseDate: 'November 15, 2001',
      genre: 'First Person Shooter'
    });
    newGame
      .save()
      .then(game => {
        gameID = game._id;
        done();
      })
      .catch(err => {
        console.error(err);
        done();
      })
  });

  afterEach(done => {
    Game.remove({}, err => {
      if (err) console.error(err);
      done();
    });
  });

  // test the POST here
  describe('[POST] /api/game/create', () => {
    it('should add a new game and save to the database', (done) => {
      const newGame = {
        title: 'Fortnite',
        releaseDate: 'July 25, 2017',
        genre: 'Survival'
      };
      chai
        .request(server)
        .post('/api/game/create')
        .send(newGame)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.title).to.equal('Fortnite')
          done();
        });
    });
  });
  // test the GET here

  // test the PUT here

  // --- Stretch Problem ---
  // Test the DELETE here
});
