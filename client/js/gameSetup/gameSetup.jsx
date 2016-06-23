'use strict';

import React from 'react';
import RequestPlayerName from './requestPlayerName.jsx';
import Connecting from './connecting.jsx';
import ChooseSession from './chooseSession.jsx';
import ChooseTeam from './chooseTeam.jsx';
import WaitForPlayers from './waitForPlayers.jsx';
import GameSetupStore from './gameSetupStore';

function getSetupStateClassName(setupState) {
    if (setupState.status === GameSetupStore.GameSetupState.FINISHED) {
        return 'finished';
    }
}

export default React.createClass({

    handleGameSetupState: function () {
        this.setState(GameSetupStore.state);
    },

    componentDidMount: function () {
        GameSetupStore.addChangeListener(this.handleGameSetupState);
    },

    componentWillUnmount: function () {
        GameSetupStore.removeChangeListener(this.handleGameSetupState);
    },

    render: function () {
        this.state = GameSetupStore.state;

        return (
            <div id="gameSetup" className={getSetupStateClassName(this.state)}>
                <Connecting setupState={this.state.status} />
                <RequestPlayerName setupState={this.state.status} />
                <ChooseSession setupState={this.state} />
                <ChooseTeam setupState={this.state} />
                <WaitForPlayers setupState={this.state} />
            </div>
        );
    }
});
