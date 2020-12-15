import teamData from './viewModels/teamData.js';

class storageService {
   "use strict";

   // new parameters start at host
   // old params for localStorage- (data=null, key=null)
   constructor(host, type, defaultOptions = {
      sort_col: null,
      sort_dir: null,
      limit: null,
      offset: null,
      filter_col: null,
      filter_str: null,
      is_lookup: null,
      alt_table: null
   }) {

      this.apiHostURL = host;
      this.apiType = type;
      this._list = {};
      this.defaultOptions = defaultOptions;
      //options object looks like
      /*{
        sort_col:"first_name",
        sort_dir:"desc",
        limit: 10,
        offset:10,
      filter_col: "first_name",
      filter_str: "Ke" // (note, in your UI I would not call list until at least 3 chars have been typed)
      };*/
      this._lookups = {};
   }


   // RESTAPI CODE
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   get getList() { return this._list }   //getter for last retrieved list, in case you don't want to call list again
   get lookups() { return this._lookups; }   //getter for lookups object

   /* List function-I'm giving this one to you */
   async list(options = this.defaultOptions) {
      //if we are doing a lookup, call the api for the lookup (alt_table)
      //otherwise, just call api for default apiType

      /* example call
      let list = await storage.list({sort_col:"last_name", sort_dir:"asc", limit:20, offset:0});
      */
      let apiName = (options.is_lookup != null && options.alt_table != null) ? options.alt_table : this.apiType;
      let url = `http://${this.apiHostURL}/${apiName}/${this.getQueryString(options)}`;
      console.log(`CALLING ${url}`);

      let data = await $.ajax({
         type: 'GET',
         url: url,
         async: true,
         contentType: "application/json",
         dataType: "json"
      });
      if (options.is_lookup != null) {
         //store lookups for use later
         this._lookups[options.alt_table] = data;
         // console.log(`STORING LOOKUPS\n${JSON.stringify(this._lookups, null, 2)}`);
      }
      else {
         //otherwise, just get the normal list data.
         this._list = data;
         // console.log(`STORING LIST\n${JSON.stringify(this._list, null, 2)}`);
      }
      return data;
   }

   async get(id) {
      let url = `http://${this.apiHostURL}/${this.apiType}/${id}`;
      console.log(`CALLING ${url}`);

      let data = await $.ajax({
         type: 'GET',
         url: url,
         async: true,
         contentType: "application/json",
         dataType: "json"
      });
      return data;
   }

   async update(id, postData) {
      let url = `http://${this.apiHostURL}/${this.apiType}/${id}`;
      console.log(`CALLING ${url}`);

      let data = await $.ajax({
         type: 'PUT',
         url: url,
         data: JSON.stringify(postData),
         async: true,
         contentType: "application/json",
         dataType: "json"
      });
      return data;
   }

   async create(postData) {
      let url = `http://${this.apiHostURL}/${this.apiType}`;
      console.log(`CALLING ${url}`);

      let data = await $.ajax({
         type: 'POST',
         url: url,
         data: JSON.stringify(postData),
         async: true,
         contentType: "application/json",
         dataType: "json"
      });
      return data;
   }

   async delete(id) {
      let url = `http://${this.apiHostURL}/${this.apiType}/${id}`;
      console.log(`CALLING ${url}`);

      let data = await $.ajax({
         type: 'DELETE',
         url: url,
         async: true,
         contentType: "application/json",
         dataType: "json"
      });
      return data;
   }

   /* getLookup */
   /* This function passes two additional query string params to the 'list' call
      You will need to modify your list code in the REST API to return an array of objects that
      contain  just 'label' (name for Team, first_name+""+last_name for player) and 'value' (id of team/coach)
    
       Here's an example of what this object will look like
        {
            "teams": [{"label":"Raptors","value":"1"}, ....],
            "coaches": [{"label":"John Jenson","value":"2"}, ....]
        }
        As you retrieve lookups, they will be stored in the service so you don't need
        to look them up again.
        
   */
async getLookup(name) {
      if (!(name in this._lookups)) {  //if not cached yet, call
         await this.list({
            is_lookup: true,
            alt_table: name
         });
      }
      return this._lookups[name];
   }
   /* UTILITY FUNCTIONS */
   getQueryString(options) {     //string to break out options object into a query string
      let query = "?";
      let count = 0;
      for (var key in options) {
         if (options[key] != null) {
            query += count > 0 ? "&" : "";
            query += `${key}=${options[key]}`;
            count++;
         }
      }
      return query.length > 1 ? query : "";
   }
}
// LEGACY LOCAL STORAGE CODE
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    size() {
//       //should return the number of items in model.data
//       return this.model.data.length;
//    }
//    reset() {
//       //should clear local storage 
//       window.localStorage.clear();
//       //should restore model from origModel (clone)
//       this.model = _.cloneDeep(this.origModel);
//    }
//    clear() {
//       //should clear local storage
//       window.localStorage.clear();
//    }
//    store() {
//       //should store your model in localStorage
//       window.localStorage.setItem(this.key, JSON.stringify(this.model));
//    }
//    retrieve() {
//       //should retrieve your model from localStorage.
//       //updates local model if not null
//       window.localStorage.getItem(this.key) ? this.model = window.localStorage.getItem(this.key) :
//          console.log("attempted to get data from empty storage");
//    }
//    list() {
//       //return the list of data items as is
//       return this.model.data;
//    }
//    sort(cols, sorts, perm = false) {

//       //returns a copy of the model, sorted using the 'cols' and 'sort' specifications (see index.html for example)
//       // storageSvc.sort(['name'],['asc'])
//       let sorted = _.sortBy(this.model.data, cols);
//       sorts[0] === "asc" ? sorted = _.sortBy(this.model.data, cols) : sorted = _.sortBy(this.model.data, cols).reverse();
//       // if 'perm' param is set to true, you should update the internal model.data with the sorted list
//       if (perm) {
//          this.model.data = sorted;
//          this.model.viewModel = {
//             sortColumn: cols[0],
//             sortDirection: sorts[0]
//          };
//       }

//       // return
//       return sorted;
//    }

//    getSortCol() {
//       return this.model.viewModel.sortColumn;
//    }

//    getSortDirection() {
//       return this.model.viewModel.sortDirection;
//    }

//    filter(query) {
//       //returns a copy of the filtered array
//       //e.g., storageSvc.filter('<search text>');
//       query = query.toString().toLowerCase();

//       return _.filter(this.model.data, team => {

//          const { name, league, coachFirst, coachLast, coachEmail, coachPhone, division } = team;

//          return name.toLowerCase().includes(query) ||
//             league.toLowerCase().includes(query) ||
//             coachFirst.toLowerCase().includes(query) ||
//             coachLast.toLowerCase().includes(query) ||
//             coachEmail.toLowerCase().includes(query) ||
//             coachPhone.toLowerCase().includes(query) ||
//             division.toLowerCase().includes(query);
//       });
//    }

//    getItem(getId) {
//       //returns the item in the array with id=getId, null if it is not found
//       return this.model.data[_.findIndex(this.model.data, (team) => {
//          return team.id === getId;
//       })];

//    }
//    create(obj) {
//       //append new object to data store
//       this.model.data.push(obj);
//       // persist in local storage by calling store()
//       this.store();
//    }
//    update(obj) {
//       //find index of object in array
//       let idx;
//       for (let x = 0; x < this.model.data.length; x++) {
//          if (this.model.data[x].id === obj.id) {
//             idx = x;
//             break;
//          }
//       }
//       //update object with new contents
//       this.model.data[idx] = obj;
//       // persist in local storage by calling store()
//       this.store();
//    }
//    remove(removeId) {
//       //remove object with specified id from model.data
//       if (this.getItem(removeId)) {
//          _.remove(this.model.data, (team) => { return team.id === removeId; })
//       }
//       // wipe out null entries from array if they exist
//       this.model.data = this.model.data.filter((item) => { return item != null });
//       // persist in local storage by calling store()
//       this.store();
//    }
//    getLookup(name) {
//       //returns the requested lookup data 
//       return this.model.lookups[name];
//    }
//    getNextId() {
//       return Math.max.apply(Math, this.model.data.map(item => {
//          return item.id;
//       })) + 1;
//    }
//    debugResetToPresetData() {
//       this.origModel = teamData;        //original data, should never change
//       this.model = _.cloneDeep(teamData);    //lodash, deep copy of data
//       this.store();
//    }
// }

export default storageService;