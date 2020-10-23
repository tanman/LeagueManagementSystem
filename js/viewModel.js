import storageService from './storageService.js'
import teamData from './teamData.js';
import teamsTable from './teamsTable.js';

class viewModel{

    constructor(){
        this.storage = new storageService(teamData, 'data');
    }

    buildTable(fromData=[], animate=false){

        // sort the model by the params in the local storage
        this.storage.sort([this.storage.model.viewModel.sortColumn],[this.storage.model.viewModel.sortDirection],true);

        let data;
        fromData.length>0 ? data = fromData: data = this.storage.list()

        // begin table building
        $("table").remove();
        let table = new teamsTable();
        let editIcon = "fas fa-pen";
        let deleteIcon = "fas fa-trash";
        let infoIcon = "fas fa-info-circle";
        $("#teamsTable").append(table.skele());
        data.forEach(team => {
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
            row.append(`<td>${team.playerCount}</td>`);
            // actions
            let infoPopover= `<button type="button" class="popover-dismiss" data-toggle="popover" data-placement="top" title="${team.name}" data-content="${popOver}"><i class="${infoIcon}"></i></button>`
            let deleteButton= `<button type="button" id="${team.id}" class="table-button deleter" data-toggle="modal" data-target="#Modal"><i class="${deleteIcon}"></i></button>`
            let editButton= `<button type="button" id="e${team.id}" class="table-button editer" data-toggle="modal" data-target="#formModal"><i class="${editIcon}"></i></button>`
            //
            // <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#formModal">
            //     Launch demo modal
            // </button>
            //
            row.append(`<td>${editButton}${deleteButton}${infoPopover}</td>`);

            $("#teamsTableBody").append(row);
            // animation hooks
            $(`#t${team.id} > td`).wrapInner(`<div class="a${team.id}"></div>`);
            if(animate){
                $(`.a${team.id}`).hide();
                $(`.a${team.id}`).slideDown();
            }
        });
        
        // place sort icon
        this.putSortIcon(this.storage.getSortCol(), this.storage.getSortDirection())
    }

    putSortIcon(col, direction){
        let ascIcon = `<i id="sortIcon" class="fas fa-long-arrow-alt-up"></i>`;
        let descIcon = `<i id="sortIcon" class="fas fa-long-arrow-alt-down"></i>`;

        // wipe any previously placed sort icons
        $("#sortIcon").remove();

        let icon;
        direction === 'asc' ? icon = ascIcon : icon = descIcon;
        // dynamically place new sort icon onto correct column header
        switch (col){
            case 'name':
                $("#name").append(icon);
                break;

            case 'league':
                $("#league").append(icon);
                break;

            case 'coachFirst':
                $("#coachFirst").append(icon);
                break;
            
            case 'coachEmail':
                $("#coachEmail").append(icon);
                break;

            case 'playerCount':
                $("#playerCount").append(icon);
                break;
            
            default:
                break;
        }
    }

    sortTableByCol(col, direction){

    }

}

export default viewModel;