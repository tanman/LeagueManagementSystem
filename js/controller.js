import viewModel from './viewModel.js';

class controller {
    constructor(){
        this.viewModel = new viewModel();
    }

    setTableColumnHeadHandlers(){

        $(".col-head").on('click', (ev)=>{
            console.log(`ev ${JSON.stringify(ev)}`);
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
            let data;
            ev.target.value ? data = this.viewModel.storage.filter({'name':ev.target.value}) : data = [];
            this.rerenderTable(data);
        });
    }

    setRowDeleteHandlers(){

        // setup delete handler
        $(".deleter").on('click', (ev)=>{

            // tailor the modal with the relevant data
            let id = parseInt(ev.currentTarget.id)
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

    rerenderTable(data = []){
        this.viewModel.buildTable(data);
        this.setTableColumnHeadHandlers();
        this.setRowDeleteHandlers();
    }

}

export default controller;

