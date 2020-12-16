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
      // console.log(`CALLING ${url}`);

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
      }
      else {
         //otherwise, just get the normal list data.
         this._list = data;
      }
      return data;
   }

   async get(id) {
      let url = `http://${this.apiHostURL}/${this.apiType}/${id}`;
      // console.log(`CALLING ${url}`);

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
      // console.log(`CALLING ${url}`);

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
      // console.log(`CALLING ${url}`);

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
      // console.log(`CALLING ${url}`);

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


export default storageService;