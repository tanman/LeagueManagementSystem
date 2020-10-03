import storageService from './storageService.js'
import teamData from './teamData.js';
import teamsTable from './teamsTable.js';
// import fontawesome from '@fontawesome';
// fontawesome.library.add(faFreeSolid)

class controller {
    constructor(){
        this.storage = new storageService(teamData, 'teamData');
    }

    buildTable(){
        $("table").remove();
        let table = new teamsTable();
        let editIcon = "fas fa-pen";
        let deleteIcon = "fas fa-trash";
        let infoIcon = "fas fa-info-circle";
        $("#teamsTable").append(table.skele());
        this.storage.list().forEach(team => {
            // tooltip content
            let toolTip = `${team.name}<br>League: ${team.league}<br>Coach: ${team.coachFirst} ${team.coachLast}<br>${team.coachEmail} ${team.coachPhone}`
            let popOver = `League: ${team.league} Coach: ${team.coachFirst} ${team.coachLast}`
            let row = $(`<tr id="t${team.id}" data-toggle="tooltip" data-html="true" data-placement="bottom" title="${toolTip}"></tr>`);
    
            // name
            row.append(`<td scope="row"><strong>${team.name}</strong></td>`);
            // league
            row.append(`<td>${team.league}</td>`);
            // coach
            row.append(`<td>${team.coachFirst} ${team.coachLast}</td>`);
            // team admin
            row.append(`<td>${team.coachEmail}<br>${team.coachPhone}</td>`);
            // player count
            row.append(`<td>X</td>`);
            // actions
            let infoPopover= `<button type="button" class="popover-dismiss" data-toggle="popover" data-placement="top" title="${team.name}" data-content="${popOver}"><i class="${infoIcon}"></i></button>`
            let deleteButton= `<button type="button" id="d${team.id}" class="table-button" data-toggle="modal" data-target="#Modal"><i class="${deleteIcon}"></i></button>`
            let editButton= `<button type="button" class="table-button"><i class="${editIcon}"></i></button>`
            row.append(`<td>${editButton}${deleteButton}${infoPopover}</td>`);
    
            $("#teamsTableBody").append(row);

            // setup up delete handler
            $(`#d${team.id}`).on('click', (e)=>{
                console.log(`delete request for ${team.name} ${team.id}`);
                // tailor the modal with the relevant data
                $(".modal-title").text(`Delete the ${team.name}?`);
                $(".modal-body").text(`If you wish to delete the ${team.name}, click confirm.`);

                // assign the modal's delete button to delete the desired team
                // need to clear any pre-existing handlers first
                $("#teamDelete").off('click');
                $("#teamDelete").on('click', ()=>{
                    console.log(`delete request for ${team.name} ${team.id}`);
                    this.storage.remove(team.id);
                    this.buildTable();
                });
                
            });
        });
    }

}

export default controller;