import viewModel from './viewModel.js';
import validation from './validation.js';

class controller {
    constructor(){
        this.viewModel = new viewModel();
    }

    setTableColumnHeadHandlers(){

        $(".col-head").on('click', (ev)=>{

            // if not currently sorted by this col, sort asc
            if(this.viewModel.storage.getSortCol() !== ev.target.id){

                this.viewModel.storage.sort([`${ev.target.id}`],['asc'], true)
            }
            // if currently sorted by this col, sort to opposite direction
            else if(this.viewModel.storage.getSortCol() === ev.target.id){
                
                if(this.viewModel.storage.getSortDirection() === 'asc'){

                    this.viewModel.storage.sort([`${ev.target.id}`],['desc'], true)
                }
                else{

                    this.viewModel.storage.sort([`${ev.target.id}`],['asc'], true)
                } 
            }
            // rebuild the table
            this.rerenderTable();
        });
    }

    setTableSearchBarHandler(){
        $(`#searchBar > form > input`).on('keyup', (ev)=>{
            let data= [];
            let query = ev.target.value;

            if(query){
                data = this.viewModel.storage.filter({'name':query})
                data.length === 0 ? this.viewModel.tableDisplayNone() : this.rerenderTable(data);
            }
            else{
                this.rerenderTable(data)
            }
            
        });
    }

    setRowDeleteHandlers(){

        // setup delete handler
        $(".deleter").on('click', (ev)=>{

            // tailor the modal with the relevant data
            let id = ev.currentTarget.id
            let team = this.viewModel.storage.getItem(id);

            $("#deleteModalTitle").text(`Delete the ${team.name}?`);
            $("#deleteModalBody").text(`If you wish to delete the ${team.name}, click confirm.`);

            // assign the modal's delete button to delete the desired team
            // need to clear any pre-existing handlers first
            $("#teamDelete").off('click');
            $("#teamDelete").on('click', ()=>{
                
                // animate row deletion, 
                // then delete the row,
                // and disable the tooltips 
                // otherwise they'll get stuck
                let animationTime = 200;
                $('tr').tooltip('disable');
                $(`.a${id}`).slideUp(animationTime, ()=>{
                    this.viewModel.storage.remove(id);
                    this.viewModel.storage.store();
                    this.rerenderTable();
                    // reactivate tooltips
                    $('tr').tooltip('enable');
                });
            });
            
        });
    }

    setRowEditHandlers(){
        $(".editer").on("click", (ev)=>{

            // rewrite form
            this.initializeModal();

            // load team data into the form
            let expectedId = ev.currentTarget.id.substr(1); // chop off the prefix char, 'e' in this context
            let teamData = this.viewModel.storage.getItem(expectedId);
            $("#teamNameInput").val(teamData.name);
            $(`#optionleague${teamData.league}`).prop('selected', true);
            $(`#optiondivision${teamData.division}`).prop('selected', true);
            $("#firstNameInput").val(teamData.coachFirst);
            $("#lastNameInput").val(teamData.coachLast);
            $("#coachIdInput").val(teamData.coachId);
            $("#addressInput").val(teamData.coachAddress);
            $("#cityInput").val(teamData.coachCity);
            $(`#${teamData.coachState}`).prop('selected', true);
            $("#zipInput").val(teamData.coachZip);
            $("#emailInput").val(teamData.coachEmail);
            $("#phoneInput").val(teamData.coachPhone);
            $(`#optionlicenseLevel${teamData.coachLicenseLevel}`).prop('selected', true);
            $("#usernameInput").val(teamData.coachUserName);
            $("#teamId").val(teamData.id);

        });
    }

    rerenderTable(data = []){
        this.viewModel.buildTable(data);
        this.setTableColumnHeadHandlers();
        this.setRowDeleteHandlers();
        this.setRowEditHandlers();
    }

    addFormSubmitHandler(){
        $("#formModalSubmit").off();
        $("#formModalSubmit").on('click', ()=>{
            event.preventDefault();
            let val = new validation();
            if(val.validateForm()){
                let data = $("#directForm").serializeArray();
                let obj = {}
                data.forEach((item)=>{
                    obj[item.name] = item.value;
                });

                if($("#modalTitle").text()==="Edit Team"){
                    // update
                    this.viewModel.storage.update(obj);
                }
                else if($("#modalTitle").text()==="Create Team"){
                    // create
                    obj.id= this.viewModel.storage.getNextId().toString();
                    this.viewModel.storage.create(obj);
                }

                $("#formModal").modal("hide");
                this.rerenderTable();
            }
        });
    }
    initializeModal(){
        this.viewModel.writeForm();
        this.addFormSubmitHandler();
    }

    setAddTeamHandler(){
        $("#addTeam").off();
        $("#addTeam").on('click', ()=>{
            this.initializeModal();
            $("#modalTitle").text("Create Team");
            // enable id field
            $("#idInput").removeAttr('disabled');
        });
    }

}

export default controller;

