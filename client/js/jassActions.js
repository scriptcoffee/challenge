'use strict';

let JassAppConstants = require('./jassAppConstants'),
    JassAppDispatcher = require('./jassAppDispatcher');

module.exports = {
    throwError: (source, error) => {
        JassAppDispatcher.throwErrorAction({
            actionType: JassAppConstants.ERROR,
            data: error,
            source: source
        });
    },

    requestPlayerName: () => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.REQUEST_PLAYER_NAME
        });
    },

    choosePlayerName: (playerName) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CHOOSE_PLAYER_NAME,
            data: playerName
        });
    },

    requestSessionChoice: (availableSessions) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.REQUEST_SESSION_CHOICE,
            data: availableSessions
        });
    },

    joinExistingSession: (sessionChoice) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CHOOSE_EXISTING_SESSION,
            data: sessionChoice
        });
    },

    joinExistingSessionAsSpectator: (sessionChoice) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CHOOSE_EXISTING_SESSION_SPECTATOR,
            data: sessionChoice
        });
    },

    createNewSession: (sessionName) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CREATE_NEW_SESSION,
            data: sessionName
        });
    },

    autojoinSession: () => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.AUTOJOIN_SESSION
        });
    },

    sessionJoined: (playerInfo) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.SESSION_JOINED,
            data: playerInfo
        });
    },

    broadcastTeams: (teams) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.BROADCAST_TEAMS,
            data: teams
        });
    },

    dealCards: (cards) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.DEAL_CARDS,
            data: cards
        });
    },

    requestTrumpf: (isGeschoben) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.REQUEST_TRUMPF,
            data: isGeschoben
        });
    },

    chooseTrumpf: (mode, trumpfColor) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CHOOSE_TRUMPF,
            data: {
                mode,
                trumpfColor
            }
        });
    },

    broadastTrumpf: (gameMode) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.BROADCAST_TRUMPF,
            data: gameMode
        });
    },

    changeCardType: (cardType) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CHANGE_CARD_TYPE,
            data: cardType
        });
    },

    requestCard: (playedCards) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.REQUEST_CARD,
            data: playedCards
        });
    },

    chooseCard: (color, number) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.CHOOSE_CARD,
            data: {
                color,
                number
            }
        });
    },

    rejectCard: (card) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.REJECT_CARD,
            data: card
        });
    },

    playedCards: (playedCards) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.PLAYED_CARDS,
            data: playedCards
        });
    },

    broadcastStich: (stich) => {
        JassAppDispatcher.handleServerAction({
            actionType: JassAppConstants.BROADCAST_STICH,
            data: stich
        });
    },

    adjustSpectatorSpeed: (speedInMs) => {
        JassAppDispatcher.handleViewAction({
            actionType: JassAppConstants.ADJUST_SPECTATOR_SPEED,
            data: speedInMs
        });
    }
};