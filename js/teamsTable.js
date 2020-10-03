class teamsTable {
    "use strict";
    constructor(){
        this.template = `
        <table class="table table-striped table-responsive-md">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Team Name</th>
              <th scope="col">League</th>
              <th scope="col">Coach</th>
              <th scope="col">Contact</th>
              <th scope="col">Player Count</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody id="teamsTableBody"></tbody>
        </table>`;
    }

    skele(){
        return this.template;
    }
}

export default teamsTable;