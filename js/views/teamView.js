import view from './view.js';

class TeamView extends view
{
    constructor(teamViewModel, listContainerId, formContainerId, apiUrl)
   {
        super(teamViewModel, listContainerId, formContainerId, apiUrl, "teams");
   }
    //TODO-Place any team specific code validation here
}

export default TeamView;