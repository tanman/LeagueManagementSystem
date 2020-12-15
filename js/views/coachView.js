import view from './view.js';

class CoachView extends view
{
    constructor(coachViewModel, listContainerId, formContainerId, apiUrl)
  {
      super(coachViewModel, listContainerId, formContainerId, apiUrl, "coaches");  
  }
//TODO-Place any player specific code validation here//
}

export default CoachView;