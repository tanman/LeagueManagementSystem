import controller from './controller.js';
import playerViewModel from './viewModels/playerViewModel.js';
import teamViewModel from './viewModels/teamViewModel.js';
import coachViewModel from './viewModels/coachViewModel.js';

$(() => {
    let awsHost = "lms-rest-api.us-east-2.elasticbeanstalk.com";
    let localHost = "localhost:8080";
    let control = new controller(playerViewModel, teamViewModel, coachViewModel, "listHook","formHook", awsHost);
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