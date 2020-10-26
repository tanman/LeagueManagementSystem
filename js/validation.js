class validation {

    constructor(){

        this.missingErrors= {
            teamNameInput: "Please enter a team name.",
            leagueInput: "Please select a league.",
            divisionInput: "Please select a division.",
            firstNameInput: "Please enter a first name.",
            lastNameInput: "Please enter a last name.",
            addressInput: "Please enter your address.",
            cityInput: "Please enter your city.",
            stateInput: "Please select a state.",
            zipInput: "Please enter a zip code.",
            emailInput: "Please enter an email address.",
            phoneInput: "Please enter a phone number.",
            licenseLevelInput: "Please select a license level.",
            usernameInput: "Please enter the username.",
            passwordInput: "Please enter the password",
            passwordConfirmInput: "Please confirm the password."
        }
        this.formatErrors={
            zipInput: "This zip code is invalid.",
            emailInput: "This email is invalid.",
            phoneInput: "This phone number is invalid",
            usernameInput: "Username must contain at least 8 characters, one uppercase, and one lowercase.",
            passwordInput: "Password must contain at least 8 characters, one uppercase, and one underscore.",
            passwordConfirmInput: "Password must contain at least 8 characters, one uppercase, and one underscore."
        }
        this.regexes={
            zipInput: /^\d{5}(-\d{4})?$/,
            emailInput: /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
            phoneInput: /\(\d{3}\)\s\d{3}-\d{4}/,
            usernameInput: /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}/,
            passwordInput: /^(?=.*[a-z])(?=.*[A-Z])(?=.*_)[a-zA-Z\d]{8,}/,
            passwordConfirmInput: /^(?=.*[a-z])(?=.*[A-Z])(?=.*_)[a-zA-Z\d]{8,}/
        }

    }
    
    validateForm(){

        let validated = true;
        let missingErrors = this.missingErrors;
        let formatErrors = this.formatErrors;
        let regexes = this.regexes;

        // validate required fields
        $("[required]").each(function(){
            let that  = $(this);
            if(that.val()){
                that.removeClass("is-invalid").addClass("is-valid");
            }
            else{
                that.removeClass("is-valid").addClass("is-invalid");
                that.next().text(`${missingErrors[this.id]}`);
                validated = false;
            }
        });

        // confirm password: matches password
        let $password = $("#passwordInput");
        let $confirmPassword = $("#passwordConfirmInput");
        if($confirmPassword.val() && !regexes.passwordInput.test($confirmPassword.val) &&$password.val() !== $confirmPassword.val()){
            $confirmPassword.removeClass("is-valid").addClass("is-invalid");
            $confirmPassword.next().text("");
            validated = false;
        }

        // zip code: std zip code regex
        // email: std email regex
        // username: 8 chars, one upper, one lower
        // password: 8 chars, one upper, one underscore
        $(".doubleCheck").each(function(){
            let that = $(this);
            if(that.val() && !regexes[this.id].test(that.val())){
                that.removeClass("is-valid").addClass("is-invalid");
                that.next().text(`${formatErrors[this.id]}`);
                validated = false;
            }
        });

        return validated;
    }

}

export default validation;