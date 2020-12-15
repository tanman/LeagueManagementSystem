// import View from './views/view.js';
import PlayerView from './views/playerView.js';
import CoachView from './views/coachView.js';
import TeamView from './views/teamView.js';

class controller {
    constructor(playerViewModel, teamViewModel, coachViewModel, listContainerId, formContainerId, apiUrl){

        // not using an api key for now, so just passing in ''
        this.teamView = new TeamView(teamViewModel, listContainerId, formContainerId, apiUrl, '');
        this.playerView = new PlayerView(playerViewModel, listContainerId, formContainerId, apiUrl, '');
        this.coachView = new CoachView(coachViewModel, listContainerId, formContainerId, apiUrl, '');
    }

    renderTeamListView() {
        this.teamView.renderList();
    }

    renderPlayerListView() {
        this.playerView.renderList();
    }

    renderCoachListView() {
        this.coachView.renderList();
    }
}

export default controller;

