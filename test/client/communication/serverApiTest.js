'use strict';

let expect = require('chai').expect,
    sinon = require('sinon'),
    JassAppDispatcher = require('../../../client/js/jassAppDispatcher');

describe('serverApi', () => {

    let serverApi = require('../../../client/js/communication/serverApi');

    describe('connect', () => {
        it('should connect to Server and register handleMessage/handleActions functions', () => {
            window.WebSocket = function () {};
            let webSocket = sinon.stub(window, 'WebSocket');
            let registerSpy = sinon.stub(JassAppDispatcher, 'register');

            serverApi.connect();

            expect(webSocket.calledWithNew()).to.equal(true);
            expect(webSocket.calledWith('ws://' + window.location.host)).to.equal(true);
            expect(registerSpy.calledWith(serverApi.handleActionsFromUi)).to.equal(true);
        });
    });
});