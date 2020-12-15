import controller from './controller.js';
import playerViewModel from './viewModels/playerViewModel.js';
import teamViewModel from './viewModels/teamViewModel.js';
import coachViewModel from './viewModels/coachViewModel.js';

$(() => {
    let control = new controller(playerViewModel, teamViewModel, coachViewModel, "listHook","formHook", "localhost:8080");
    control.renderTeamListView();

    $('#teamsButton').on('click', ()=>{
        control.renderTeamListView();
    });
    $('#playersButton').on('click', ()=>{
        control.renderPlayerListView();
    });
    $('#coachesButton').on('click', ()=>{
        control.renderCoachListView();
    });

    // nav slide animation
    $('#logo').toggleClass('open');
})