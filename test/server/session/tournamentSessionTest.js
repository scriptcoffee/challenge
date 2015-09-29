'use strict';

import {expect} from 'chai';
import sinon from 'sinon';
import TournamentSession from '../../../server/session/tournamentSession.js';
import CloseEventCode from '../../../server/communication/closeEventCode.js';
import Ranking from '../../../server/game/ranking/ranking.js';
import SingleGameSession from '../../../server/session/singleGameSession.js';
import SessionType from '../../../shared/session/sessionType.js';

describe('tournamentSession', () => {

    let session,
        clientApiMock,
        rankingMock,
        singleGameSessionMock;

    beforeEach(() => {
        session = TournamentSession.create('sessionName');
        clientApiMock = sinon.mock(session.clientApi);
        rankingMock = sinon.mock(Ranking);
        singleGameSessionMock = sinon.mock(SingleGameSession);
    });

    afterEach(() => {
        clientApiMock.restore();
        rankingMock.restore();
        singleGameSessionMock.restore();
    });

    describe('create', () => {
        it('should initialize name and players', () => {
            let sessionName = 'sessionName';

            let session = TournamentSession.create(sessionName);

            expect(session.name).to.equal(sessionName);
            expect(session.players).to.eql([]);
            expect(session.spectators).to.eql([]);
        });
    });

    describe('addPlayer', () => {

        let playerName = 'playerName',
            webSocket = 'webSocket';

        it('should add player to clientApi and player array', () => {
            clientApiMock.expects('addClient').withArgs(webSocket).once().returns(Promise.resolve());

            session.addPlayer(webSocket, playerName);

            clientApiMock.verify();
        });

        it('should add object to player array', () => {
            session.addPlayer(webSocket, playerName);

            expect(session.players[0]).to.eql({
                playerName,
                isPlaying: false,
                connected: true,
                clients: [
                    webSocket
                ]
            });
        });

        it('should add client to already existing playerName', () => {
            session.addPlayer(webSocket, playerName);
            session.addPlayer(webSocket, playerName);

            expect(session.players).to.have.length(1);
            expect(session.players[0]).to.eql({
                playerName,
                isPlaying: false,
                connected: true,
                clients: [
                    webSocket,
                    webSocket
                ]
            });
        });

        it('should close connections and mark player offline when one of its clients disconnects', (done) => {
            let rejectedPromise = Promise.reject();
            clientApiMock.expects('addClient').withArgs(webSocket).once().returns(Promise.resolve());
            clientApiMock.expects('addClient').withArgs(webSocket).once().returns(rejectedPromise);
            clientApiMock.expects('removeClient').withArgs(webSocket, CloseEventCode.ABNORMAL, sinon.match.string).twice();

            session.addPlayer(webSocket, playerName);
            session.addPlayer(webSocket, playerName);

            rejectedPromise.catch(() => {
                expect(session.players[0].connected).to.equal(false);
                clientApiMock.verify();
                done();
            }).catch(done);
        });

        it('should not add client to already existing playerName with two clients', () => {
            clientApiMock.expects('removeClient').withArgs(webSocket, CloseEventCode.ABNORMAL, sinon.match.string).once();

            session.addPlayer(webSocket, playerName);
            session.addPlayer(webSocket, playerName);
            session.addPlayer(webSocket, playerName);

            expect(session.players).to.have.length(1);
            expect(session.players[0].clients).to.have.length(2);
            clientApiMock.verify();
        });
    });

    describe('addSpectator', () => {
        it('should add spectator to clientapi', () => {
            let webSocket = 'webSocket';
            clientApiMock.expects('addClient').withArgs(webSocket).once();

            session.addSpectator(webSocket);

            clientApiMock.verify();
        });

        it('should add spectator to spectator array', () => {
            let webSocket = 'webSocket';

            session.addSpectator(webSocket);

            expect(session.spectators).to.have.length(1);
            expect(session.spectators[0]).to.equal(webSocket);
        });
    });

    describe('close', () => {
        it('should call clientapi closeAll', () => {
            let webSocket = 'webSocket',
                message = 'message',
                code = 'code';

            clientApiMock.expects('closeAll').withArgs(code, message).once();

            session.close(code, message);

            clientApiMock.verify();
        });
    });

    describe('start', () => {

        it('should add players to ranking', () => {
            let webSocket = 'webSocket',
                player1 = 'playerName1',
                player2 = 'playerName2';

            singleGameSessionMock.expects('create').returns({
                addPlayer() {},
                start() {
                    return Promise.resolve();
                }
            });

            rankingMock.expects('addPlayer').withArgs(player1).once();
            rankingMock.expects('addPlayer').withArgs(player2).once();

            session.addPlayer(webSocket, player1);
            session.addPlayer(webSocket, player1);
            session.addPlayer(webSocket, player2);
            session.addPlayer(webSocket, player2);

            session.start();

            rankingMock.verify();
        });

        it('should create pairings with round-robin', () => {
            let webSocket = 'webSocket',
                player1 = 'playerName1',
                player2 = 'playerName2',
                player3 = 'playerName3';

            singleGameSessionMock.expects('create').returns({
                addPlayer() {},
                start() {
                    return Promise.resolve();
                }
            });

            session.addPlayer(webSocket, player1);
            session.addPlayer(webSocket, player1);
            session.addPlayer(webSocket, player2);
            session.addPlayer(webSocket, player2);
            session.addPlayer(webSocket, player3);
            session.addPlayer(webSocket, player3);

            session.start();

            expect(session.pairings).to.have.length(3);
        });

        it('should start session with players who are not playing', done => {
            let webSocket = 'webSocket',
                player1 = 'playerName1',
                player2 = 'playerName2',
                player3 = 'playerName3',
                addPlayerSpy = sinon.spy(),
                resolvedPromise = Promise.resolve();

            session.addPlayer(webSocket, player1);
            session.addPlayer(webSocket, player1);
            session.addPlayer(webSocket, player2);
            session.addPlayer(webSocket, player2);
            session.addPlayer(webSocket, player3);
            session.addPlayer(webSocket, player3);

            session.players[1].isPlaying = true;

            singleGameSessionMock.expects('create').withArgs(sinon.match.string).once().returns({
                addPlayer: addPlayerSpy,
                start() {
                    return resolvedPromise;
                }
            });

            session.start();

            expect(addPlayerSpy.calledWith(webSocket, player1)).to.equal(true);
            expect(addPlayerSpy.calledWith(webSocket, player3)).to.equal(true);
            expect(session.players[0].isPlaying).to.equal(true);
            expect(session.players[2].isPlaying).to.equal(true);
            singleGameSessionMock.verify();
            resolvedPromise.then(() => {
                expect(session.players[0].isPlaying).to.equal(false);
                expect(session.players[2].isPlaying).to.equal(false);
                expect(session.pairings).to.have.length(2);

                done();
            }).catch(done);
        });
    });
});