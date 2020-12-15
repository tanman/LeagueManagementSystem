var teamViewModel= {
    viewType: "team",
    list: {
        options: {
            sort_col:"name",
            sort_dir:"asc",
            limit: null,
            offset:null,
            filter_col: null,
            filter_str: null,
            is_lookup:null,
            alt_table:null       
            },
        listTitle: "Team List",
        listButtonId: "teamButton",
        templateUrl: "js/templates/listTemplate.html",
        id: "my-list",
        tableClasses:"table table-striped table-dark",
        searchColLabel: "name",
        searchColName: "name"
    },
    form: {
        id: "directForm",
        formTitle: "Add Team",
        createFormTitle: "Create Team",
        actionUrl:"",
        method: "POST",
        suppressSubmit: true,
        templateUrl: "js/templates/formTemplate.html",
        // used to populate the options for each specified lookup
        necessaryLookups: [
            {singular: "coach", plural: "coaches", name: "coach_id"},
            {singular: "league", plural: "leagues", name: "league_id"}],
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
        // in use
        ascendingSortIcon: `<i id="sortIcon" class="fas fa-long-arrow-alt-up"></i>`,
        descendingSortIcon: `<i id="sortIcon" class="fas fa-long-arrow-alt-down"></i>`

    },
    fields: [
        {
            label: "Id",
            name: "id",
            hidden: true,
            inputType: "hidden",
            list: true,
            validation: {
                required: false,
            }
        },
        {
            label: "Team Name",
            name: "name",
            inputType: "text",
            id: "nameInput",
            placeholder: "Enter your Team name here",
            list: true,
            inputClasses: 'verify',
            value: null,
            validation: {
                required: true,
                requiredMessage: "Team Name is required!"
            }
        },
        {
            label: "Coach",
            name: "coach_id",
            inputType: "select",
            id: "coachInput",
            placeholder: "Select a Coach",
            lookupName: "coaches",
            list: true,
            inputClasses: 'verify',
            defaultVal: "0",
            validation: {
                 required: true,
                 requiredMessage: "A coach is required!"
             }
        },
        {
            label: "League",
            name: "league_id",
            inputType: "select",
            id: "leagueInput",
            list:true,
            inputClasses: 'verify',
            placeholder: "Select a League",
            lookupName: "leagues",
            validation: {
                required: true,
                requiredMessage: "A league is required!"
            }
        },
    ]

}

export default teamViewModel;
