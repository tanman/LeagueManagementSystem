import viewModel from './viewModel.js';

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
            this.viewModel.buildTable();
            // reinitialize the handlers since the table was rebuilt
            this.setTableColumnHeadHandlers();

        });
    }

}

export default controller;

