class storageService {
   "use strict";

   constructor(data, key) {
      this.origModel = data;        //original data, should never change
      this.model = _.cloneDeep(data);    //lodash, deep copy of data
      this.key = key;  //localstorage key for data,  use localStorage[this.key]
   }
   size() {
      //should return the number of items in model.data
      return this.model.data.length;
   }
   reset() {
      //should clear local storage 
      window.localStorage.clear();
      //should restore model from origModel (clone)
      this.model = _.cloneDeep(this.origModel);
   }
   clear() {
      //should clear local storage
      window.localStorage.clear();
   }
   store() {
      //should store your model in localStorage
      window.localStorage.setItem(this.key, this.model);
   }
   retrieve() {
      //should retrieve your model from localStorage.
      //updates local model if not null
      window.localStorage.getItem(this.key) ? this.model = window.localStorage.getItem(this.key) :
         console.log("attempted to get data from empty storage");
   }
   list() {
      //return the list of data items as is
      return this.model.data;
   }
   sort(cols, sorts, perm = false) {

      //returns a copy of the model, sorted using the 'cols' and 'sort' specifications (see index.html for example)
      // storageSvc.sort(['name'],['asc'])
      let sorted = _.sortBy(this.model.data, cols);
      sorts[0] === "asc" ? sorted = _.sortBy(this.model.data, cols) : sorted = _.sortBy(this.model.data, cols).reverse();
      // if 'perm' param is set to true, you should update the internal model.data with the sorted list
      if (perm) {
         this.model.data = sorted;
         this.model.viewModel = {
            sortColumn: cols[0],
            sortDirection: sorts[0]
         };
      }

      // return
      return sorted;
   }

   getSortCol() {
      return this.model.viewModel.sortColumn;
   }

   getSortDirection() {
      return this.model.viewModel.sortDirection;
   }

   filter(query) {
      //returns a copy of the filtered array
      //e.g., storageSvc.filter('<search text>');
      query = query.toString().toLowerCase();

      return _.filter(this.model.data, team => {

         const { name, league, coachFirst, coachLast, coachEmail, coachPhone, division } = team;

         return name.toLowerCase().includes(query) ||
                league.toLowerCase().includes(query) ||
                coachFirst.toLowerCase().includes(query) ||
                coachLast.toLowerCase().includes(query) ||
                coachEmail.toLowerCase().includes(query) ||
                coachPhone.toLowerCase().includes(query) ||
                division.toLowerCase().includes(query);
      });
   }

   getItem(getId) {
      //returns the item in the array with id=getId, null if it is not found
      return this.model.data[_.findIndex(this.model.data, (team) => {
         return team.id === getId;
      })];

   }
   create(obj) {
      //append new object to data store
      //  this.model.data = _.concat(this.model.data, obj);
      this.model.data[obj.id] = obj;
      // persist in local storage by calling store()
      this.store();
   }
   update(obj) {
      //find index of object in array
      let idx;
      for (let x = 0; x < this.model.data.length; x++) {
         if (this.model.data[x].id === obj.id) {
            idx = x;
            break;
         }
      }
      //update object with new contents
      this.model.data[idx] = obj;
      // persist in local storage by calling store()
      this.store();
   }
   remove(removeId) {
      //remove object with specified id from model.data
      if (this.getItem(removeId)) {
         _.remove(this.model.data, (team) => { return team.id === removeId; })
      }
      // persist in local storage by calling store()
      this.store();
   }
   getLookup(name) {
      //returns the requested lookup data 
      return this.model.lookups[name];
   }
   getNextId() {
      return Math.max.apply(Math, this.model.data.map(item => {
         return item.id;
      })) + 1;
   }
}

export default storageService;