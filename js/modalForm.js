class modalForm {
    "use strict";
    constructor(){
        this.template = `
        <div class="modal fade" id="formModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">

                <div class="modal-header">
                <h5 class="modal-title" id="modalTitle">Edit Team</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>

                <div class="modal-body">
                    <div class="container-fluid">

                    <div class="row">

                        <div class="col-md-12">
                        <form class="needs-validation" id="directForm" novalidate>
                            <h3 class="mb-3">Team Info</h3>
                            <div class="row">
                            <div class="col-md-12 mb-3">
                                <label for="teamNameInput">Team Name</label>
                                <input type="text" class="form-control" id="teamNameInput" placeholder="" value=""
                                required name="name">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">

                                <label for="leagueInput">League</label>
                                <select class="custom-select d-block w-100" id="leagueInput" required name="league">
                                <option selected value="">Select a League</option>
                                </select>
                                <div class="invalid-feedback">
                                </div>

                            </div>
                            <div class="col-md-6 mb-3">

                                <label for="divisionInput">Division</label>
                                <select class="custom-select d-block w-100" id="divisionInput" required name="division">
                                <option selected value="">Select a Grade</option>
                                </select>
                                <div class="invalid-feedback">
                                </div>

                            </div>
                            </div>
                            <hr class="mb-4">
                            <h3 class="mb-3">Coach Info</h3>
                            <div class="row">
                            <div class="col-md-5 mb-3">
                                <label for="firstNameInput">First name</label>
                                <input type="text" class="form-control" id="firstNameInput" placeholder="" value=""
                                required name="coachFirst">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class="col-md-5 mb-3">
                                <label for="lastNameInput">Last name</label>
                                <input type="text" class="form-control" id="lastNameInput" placeholder="" value=""
                                required name="coachLast">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class="col-md-2 mb-3">
                                <label for="coachIdInput">ID</label>
                                <input type="text" class="form-control" id="coachIdInput" placeholder="" value=""
                                name="coachId" readonly>
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class="col-md-12 mb-3">
                                <label for="addressInput">Address</label>
                                <input type="text" class="form-control" id="addressInput" placeholder="1234 Main St"
                                required name="coachAddress">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            </div>

                            <div class="row">
                            <div class="col-md-4 mb-3">
                                <label for="cityInput">City</label>
                                <input type="text" class="form-control" id="cityInput" required name="coachCity">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="stateInput">State</label>
                                <select class="custom-select d-block w-100" id="stateInput" required name="coachState">
                                <option value="">Choose...</option>
                                <option id="AL" value="AL">AL</option>
                                <option id="AK" value="AK">AK</option>
                                <option id="AR" value="AR">AR</option>	
                                <option id="AZ" value="AZ">AZ</option>
                                <option id="CA" value="CA">CA</option>
                                <option id="CO" value="CO">CO</option>
                                <option id="CT" value="CT">CT</option>
                                <option id="DC" value="DC">DC</option>
                                <option id="DE" value="DE">DE</option>
                                <option id="FL" value="FL">FL</option>
                                <option id="GA" value="GA">GA</option>
                                <option id="HI" value="HI">HI</option>
                                <option id="IA" value="IA">IA</option>	
                                <option id="ID" value="ID">ID</option>
                                <option id="IL" value="IL">IL</option>
                                <option id="IN" value="IN">IN</option>
                                <option id="KS" value="KS">KS</option>
                                <option id="KY" value="KY">KY</option>
                                <option id="LA" value="LA">LA</option>
                                <option id="MA" value="MA">MA</option>
                                <option id="MD" value="MD">MD</option>
                                <option id="ME" value="ME">ME</option>
                                <option id="MI" value="MI">MI</option>
                                <option id="MN" value="MN">MN</option>
                                <option id="MO" value="MO">MO</option>	
                                <option id="MS" value="MS">MS</option>
                                <option id="MT" value="MT">MT</option>
                                <option id="NC" value="NC">NC</option>	
                                <option id="NE" value="NE">NE</option>
                                <option id="NH" value="NH">NH</option>
                                <option id="NJ" value="NJ">NJ</option>
                                <option id="NM" value="NM">NM</option>			
                                <option id="NV" value="NV">NV</option>
                                <option id="NY" value="NY">NY</option>
                                <option id="ND" value="ND">ND</option>
                                <option id="OH" value="OH">OH</option>
                                <option id="OK" value="OK">OK</option>
                                <option id="OR" value="OR">OR</option>
                                <option id="PA" value="PA">PA</option>
                                <option id="RI" value="RI">RI</option>
                                <option id="SC" value="SC">SC</option>
                                <option id="SD" value="SD">SD</option>
                                <option id="TN" value="TN">TN</option>
                                <option id="TX" value="TX">TX</option>
                                <option id="UT" value="UT">UT</option>
                                <option id="VT" value="VT">VT</option>
                                <option id="VA" value="VA">VA</option>
                                <option id="WA" value="WA">WA</option>
                                <option id="WI" value="WI">WI</option>	
                                <option id="WV" value="WV">WV</option>
                                <option id="WY" value="WY">WY</option>
                                </select>
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            <div class="col-md-4 mb-3">
                                <label for="zipInput">Zip</label>
                                <input type="text" class="form-control doubleCheck" id="zipInput" placeholder="" required name="coachZip">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            </div>

                            <div class="mb-3">
                            <label for="emailInput">Email</label>
                            <input type="email" class="form-control doubleCheck" id="emailInput" placeholder="you@example.com" required name="coachEmail">
                            <div class="invalid-feedback">
                            </div>
                            </div>

                            <div class="row">
                            <div class="mb-3 col-md-6">
                                <label for="phoneInput">Phone</label>
                                <input type="text" class="form-control doubleCheck" id="phoneInput" required name="coachPhone">
                                <div class="invalid-feedback">
                                </div>
                            </div>

                            <div class="mb-3 col-md-6">
                                <label for="licenseLevelInput">License Level</label>
                                <select class="custom-select" id="licenseLevelInput" required name="coachLicenseLevel">
                                <option selected value="">Select a license level</option>
                                </select>
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            </div>

                            <div class="mb-3">
                            <label for="usernameInput">Username</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                <span class="input-group-text">@</span>
                                </div>
                                <input type="text" class="form-control doubleCheck" id="usernameInput" placeholder="Username" required name="coachUserName">
                                <div class="invalid-feedback">
                                </div>
                            </div>
                            </div>

                            <div class="mb-3">
                            <label for="passwordInput">Password</label>
                            <input type="password" class="form-control doubleCheck" id="passwordInput" required name="password">
                            <div class="invalid-feedback">
                            </div>
                            </div>
                            <div class="mb-3">
                            <label for="passwordConfirmInput">Confirm Password</label>
                            <input type="password" class="form-control" id="passwordConfirmInput" required>
                            <div class="invalid-feedback">
                            </div>
                            </div>

                            <input type="text" class="form-control d-none" id="teamId" value="" name="id">


                            <hr class="mb-4">
                            <button class="btn btn-primary btn-lg btn-block" id="formModalSubmit" type="submit">Submit</button>
                        </form>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>`;
    }

    skele(){
        return this.template;
    }
}

export default modalForm;