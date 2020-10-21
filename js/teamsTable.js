class teamsTable {
    "use strict";
    constructor(){
        this.template = `
        <table class="table table-striped table-responsive-md table-dark table-hover">
          <thead class="thead-dark">
            <tr>
              <th scope="col">
                <button type="button" id="name" class="col-head">Team Name</button>
              </th>
              <th scope="col">
                <button type="button" id="league" class="col-head">League</button>
              </th>
              <th scope="col">
                <button type="button" id="coachFirst" class="col-head">Coach</button>
              </th>
              <th scope="col">
                <button type="button" id="coachEmail" class="col-head">Contact</button>
              </th>
              <th scope="col">
                <button type="button" id="playerCount" class="col-head">Player Count</button>
              </th>
              <th scope="col">
                Actions
              </th>
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