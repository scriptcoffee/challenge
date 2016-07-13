import {expect} from 'chai';
import sinon from 'sinon';
import {SessionType} from '../../../shared/session/sessionType';
import JassAppConstants from '../../../client/js/jassAppConstants';
import ServerApi from '../../../client/js/communication/serverApi';

import gameSetupDispatchFunctions from '../../../client/js/gameSetup/gameSetupDispatchFunctions';

describe('GameSetupDispatchFunctions', () => {

    let underTest,
        dispatchSpy;

    beforeEach(() => {
        dispatchSpy = sinon.spy();
        underTest = gameSetupDispatchFunctions(dispatchSpy);
    });

    describe('createNewSession', () => {

        let sendCreateNewSessionMessageStub;

        beforeEach(() => {
            sendCreateNewSessionMessageStub = sinon.stub(ServerApi, 'sendCreateNewSessionMessage');
        });

        afterEach(() => {
            ServerApi.sendCreateNewSessionMessage.restore();
        });

        it('should dispatch create session message when sessiontype TOURNAMENT', () => {
            const sessionType = SessionType.TOURNAMENT,
                sessionName = 'sessionName',
                asSpectator = true;


            underTest.createNewSession(sessionType, sessionName, asSpectator);

            sinon.assert.calledWith(sendCreateNewSessionMessageStub, sessionName, sessionType, asSpectator);
        });

        it('should dispatch prepared join session message when sessiontype SINGLE_GAME', () => {
            const sessionType = SessionType.SINGLE_GAME,
                sessionName = 'sessionName',
                asSpectator = true,
                chosenTeamIndex = 1;


            underTest.createNewSession(sessionType, sessionName, asSpectator);

            sinon.assert.calledWith(dispatchSpy, {
                type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                data: {
                    sessionName,
                    joinSession: sinon.match((joinSessionFunction) => {
                        joinSessionFunction(chosenTeamIndex);
                        sinon.assert.calledWith(sendCreateNewSessionMessageStub, sessionName, sessionType, asSpectator, chosenTeamIndex);
                        return true;
                    })
                }
            });
        });
    });

    describe('autojoinSession', () => {

        let sendAutojoinSessionMessageStub;

        beforeEach(() => {
            sendAutojoinSessionMessageStub = sinon.stub(ServerApi, 'sendAutojoinSessionMessage');
        });

        afterEach(() => {
            ServerApi.sendAutojoinSessionMessage.restore();
        });

        it('should dispatch create session message when sessiontype TOURNAMENT', () => {
            underTest.autojoinSession();

            sinon.assert.calledWith(sendAutojoinSessionMessageStub);
        });
    });

    describe('joinExistingSession', () => {

        let sendChooseExistingSessionMessageStub;

        beforeEach(() => {
            sendChooseExistingSessionMessageStub = sinon.stub(ServerApi, 'sendChooseExistingSessionMessage');
        });

        afterEach(() => {
            ServerApi.sendChooseExistingSessionMessage.restore();
        });

        it('should call prepared join session message function', () => {
            const sessionName = 'sessionName',
                chosenTeamIndex = 2;

            underTest.joinExistingSession(sessionName);

            sinon.assert.calledWith(dispatchSpy, {
                type: JassAppConstants.CHOOSE_SESSION_PARTIAL,
                data: {
                    sessionName,
                    joinSession: sinon.match((joinSessionFunction) => {
                        joinSessionFunction(chosenTeamIndex);
                        sinon.assert.calledWith(sendChooseExistingSessionMessageStub, sessionName, chosenTeamIndex);
                        return true;
                    })
                }
            });
        });
    });

    describe('joinExistingSessionSpectator', () => {

        let sendChooseExistingSessionSpectatorMessageStub;

        beforeEach(() => {
            sendChooseExistingSessionSpectatorMessageStub = sinon.stub(ServerApi, 'sendChooseExistingSessionSpectatorMessage');
        });

        afterEach(() => {
            ServerApi.sendChooseExistingSessionSpectatorMessage.restore();
        });
        
        it('should dispatch', () => {
            const sessionName = 'sessionName';

            underTest.joinExistingSessionSpectator(sessionName);

            sinon.assert.calledWith(sendChooseExistingSessionSpectatorMessageStub, sessionName);
        });
    });
});