import storageService from './storageService.js'

class model{

    constructor(){
        this.storage = new storageService(teamData, 'teamData');
    }

}

export default model;