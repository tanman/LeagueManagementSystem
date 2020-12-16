var playerViewModel= {
    viewType: "player",
    person_type: "player",
    functionality: {
        searchState: ""
    },
    defaultLicenseLevel: 4,
    list: {
        //You can use these as default options for your calls to your REST Service 'list' function
        options: {
            sort_col:"first_name",
            sort_dir:"asc",
            limit: null,
            offset:null,
            filter_col: null,
            filter_str: null,
            is_lookup:null,
            alt_table:null       
            },
        listButtonId: "playerButton",   //button id for players list, use while rendering list dynamically
        listTitle: "Player List",    //title above list
        templateUrl: "js/templates/listTemplate.html",  //path to lodash template
        id: "player-list",
        tableClasses:"table table-striped table-dark table-hover",   //bootstrap classes to apply to my table
        searchColLabel: "first name",
        searchColName: "first_name"
    },
    //The following can be used in rendering your form
    //dynamic rendering via lodash is recommended, but not required for the final
    form: {
        id: "directForm",
        formTitle: "Add Player",
        createFormTitle: "Create Player",
        actionUrl:"",
        method: "POST",
        suppressSubmit: true,
        templateUrl: "js/templates/formTemplate.html",
        // used to populate the options for each specified lookup
        necessaryLookups: [
            {singular: "team", plural:"teams", name: "team_id"},
            // {singular: "licenseLevel", plural:"licenseLevels", name: "license_level_id"}
        ],
        submitAction: ""
    },
    //For dynamically generating the action item buttons
    icons: {
        // currently unused
        editIcon: "fas fa-pen",
        deleteIcon: "fas fa-trash",
        infoIcon: "fas fa-info-circle",
        toolTip: "",
        popOver: "",
        // currently used
        ascendingSortIcon: `<i id="sortIcon" class="fas fa-long-arrow-alt-up"></i>`,
        descendingSortIcon: `<i id="sortIcon" class="fas fa-long-arrow-alt-down"></i>`
    },
    //Meta data for fields.  You can use for rendering your list dynamically.
    //if 'list' is true, then you should render this field in your list
    fields: [
        {
            label: "Id",
            name: "id",
            hidden: true,
            inputType: "hidden",
            list: true,
            inputClasses: 'verify',
            validation: {
                required: false,
            }
        },
        {
            label: "Username",
            name: "user_name",
            inputType: "text",
            id: "usernameInput",
            placeholder: "Enter your username here",
            list: true,
            inputClasses: 'verify',
            value: null,
            //as you can see,this player meta data could easily be used to dynamically validate your form
            validation: {
                required: true,
                requiredMessage: "Username is required!"
            }
        },
        {
            label: "First Name",
            name: "first_name",
            inputType: "text",
            id: "firstNameInput",
            placeholder: "Enter your first name here",
            list: true,
            inputClasses: 'verify',
            value: null,
            //as you can see,this player meta data could easily be used to dynamically validate your form
            validation: {
                required: true,
                requiredMessage: "First name is required!"
            }
        },
        {
            label: "Last Name",
            name: "last_name",
            inputType: "text",
            id: "lastNameInput",
            placeholder: "Enter your last name here",
            list: true,
            inputClasses: 'verify',
            validation: {
                required: true,
                requiredMessage: "Last name is required!"
            }
        },
        {
            label: "Team",
            name: "team_id",
            inputType: "select",
            id: "teamInput",
            list:true,
            inputClasses: 'verify',
            placeholder: "Select a Team",
            lookupName: "teams",
            validation: {
                required: true,
                requiredMessage: "Team is required!"
            }
        },
        {
            label: "Address 1",
            name: "address1",
            inputType: "text",
            id: "address1Input",
            list: false,
            placeholder: "Enter your address name here",
            inputClasses: 'verify',
            validation: {
                required: true,
                requiredMessage: "Address is required!"
            }
        },
        {
            label: "Address 2",
            name: "address2",
            inputType: "text",
            id: "address2Input",
            placeholder: "Enter your address name here",
            list: false,
            inputClasses: 'verify is-valid',
            validation: {
                required: false,
                requiredMessage: "Address is required!"
            }
        },
        {
            label: "City",
            name: "city",
            inputType: "text",
            id: "cityInput",
            placeholder: "Enter your city name here",
            list: false,
            inputClasses: 'verify',
            validation: {
                required: true,
                requiredMessage: "City is required!"
            }
        },
        {
            label: "State",
            name: "state",
            inputType: "text",
            id: "stateInput",
            placeholder: "Enter your state name here",
            list: false,
            inputClasses: 'verify',
            validation: {
                required: true,
                requiredMessage: "State is required!"
            }
        },
        {
            label: "Zip",
            name: "zip",
            inputType: "text",
            id: "zipInput",
            placeholder: "Enter your zip code here",
            list: false,
            inputClasses: 'verify re',
            validation: {
                required: true,
                requiredMessage: "Zip Code is required!",
                invalidMessage: "Invalid zip code!",
                regex: /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/
            }
        },
        {
            label: "Email Address",
            name: "email",
            inputType: "email",
            id: "emailInput",
            placeholder: "Enter your email here",
            list: false,
            inputClasses: 'verify re',
            validation: {
                required: true,
                requiredMessage: "Email Address is required!",
                invalidMessage: "Invalid Email address",
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            }
        },
        {
            label: "Phone Number",
            name: "phone",
            inputType: "tel",
            id: "phoneInput",
            placeholder: "Enter your phone number here",
            list: true,
            inputClasses: 'verify re',
            validation: {
                required: true,
                requiredMessage: "Phone Number is required!",
                invalidMessage: "Invalid Phone Number",
                regex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
            }
        },
        {
            label: "Password",
            name: "password",
            inputType: "password",
            id: "passwordInput",
            placeholder: "Enter your Password",
            list: false,
            inputClasses: 'verify re',
            validation: {
                required: true,
                requiredMessage: "Password is required!",
                invalidMessage: "Invalid Password-must have 1 upper case, 1 lower case, min 8 chars",
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/im
            }
        },
        {
            label: "Notes",
            name: "notes",
            inputType: "text",
            id: "notesInput",
            placeholder: "Enter your Notes",
            list: false,
            inputClasses: 'is-valid',
            validation: {
                required:false
            }
        }
    ]
}

export default playerViewModel;