import view from './view.js';

class PlayerView extends view
{
    constructor(playerViewModel, listContainerId, formContainerId, apiUrl)
  {
      super(playerViewModel, listContainerId, formContainerId, apiUrl, "players");  
  }
//TODO-Place any player specific code validation here//
}

export default PlayerView;