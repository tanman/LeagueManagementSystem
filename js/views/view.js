import storageService from '../restStorageService.js'
// import teamData from '../viewModels/teamData.js';
// import teamsTable from '../templates/teamsTable.js';
import modalForm from '../templates/modalForm.js';

class View {

    constructor(viewModel, listContainerId, formContainerId, apiUrl, apiKey) {
        // old way to interface with local storage
        // this.storage = new storageService(teamData, 'data');
        // this.storage.debugResetToPresetData();

        // restapi service setup
        this.storage = new storageService(apiUrl, apiKey, viewModel.list.options);

        this.listContainerId = listContainerId;
        this.formContainerId = formContainerId;
        this.viewModel = viewModel;
    }

    async renderList(animate = true) {

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        this.writeForm();
        try {
            // wipe any stray tooltips
            $('[data-toggle="tooltip"]').tooltip('disable');

            // get the relevant data
            this.viewModel.data = await this.storage.list();

            // get data for the lookups
            await this.populateLookups();

            let templateHtml = await this.getListTemplateHtml();
            this.listTemplate = _.template(templateHtml);
            // render lodash template
            this.$listContainer.html(this.listTemplate({ view: this }));

            // assign tooltips, popovers, event handlers
            this.initializeHandlers();

            //animate if specified to
            if (animate) {
                this.animateTableBuild();
            }
        }
        catch (err) {
            console.log(err);
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }

    async writeForm() {
        // set modal form title
        $('#modalTitle').html(this.viewModel.form.formTitle);
        // clear old modal form 
        // write new modal form
        let templateHtml = await this.getFormTemplateHtml();
        this.formTemplate = _.template(templateHtml);
        // render lodash template
        this.$formContainer.html(this.formTemplate({ view: this }));

        // populate dropdowns from lookup data
        let lookups = this.viewModel.form.necessaryLookups;
        lookups.forEach(async (entry) => {

            // need to use plural here, so we add an s
            let data = await this.storage.getLookup(entry.plural);
            // loop through lookup data, adding options to the respective dropdown
            // can add ${section.charAt(0).toUpperCase()+section.slice(1)} if we want to prefix the leagues/divisions/license levels
            data.forEach((item) => {
                $(`#${entry.singular}Input`).append(`
                <option class="addedOption" id="${entry.name}${item["id"]}" value="${item["id"]}">
                    ${item["label"]}
                </option>`);
            });
        });

        //enable validation
        this.setFieldChangeHandlers();
        this.setSubmitButtonHandler();

        //// phone input masking
        $("#phoneInput").usPhoneFormat({
            format: '(xxx) xxx-xxxx'
        });
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // table setup
    initializeHandlers() {
        // table CRUD
        this.setAddButtonHandler();
        this.setRowDeleteHandlers();
        this.setRowEditHandlers();
        // table interactivity
        this.activateHoverData();
        // sorting
        this.putSortIcon();
        this.setTableColumnHeadHandlers();
        // search bar
        this.setTableSearchBarHandler();
    }
    // row animations
    animateTableBuild() {

        $(`.anim`).hide();
        $(`.anim`).slideDown();

    }
    // table responsiveness
    activateHoverData() {

        // popovers
        // $('[data-toggle="popover"]').popover()
        $('.popover-dismiss').popover({
            trigger: 'focus'
        })

        // tooltips
        $('[data-toggle="tooltip"]').tooltip();
    }
    // sorting functionality
    putSortIcon() {

        let currentSort = this.viewModel.list.options.sort_dir;
        let currentColumn = this.viewModel.list.options.sort_col;
        const { ascendingSortIcon, descendingSortIcon } = this.viewModel.icons;

        let correctIcon;
        currentSort === "asc" ? correctIcon = ascendingSortIcon : correctIcon = descendingSortIcon;

        // wipe any previously placed sort icons
        $("#sortIcon").remove();
        $(`#${currentColumn}`).append(correctIcon);
    }
    setTableColumnHeadHandlers() {

        $(".thead").on('click', (ev) => {
            const { sort_col, sort_dir } = this.viewModel.list.options;
            //sort by relevant column and asc if 
            if (sort_col !== ev.target.id) {
                this.viewModel.list.options.sort_dir = 'asc';
                this.viewModel.list.options.sort_col = ev.target.id;
            }
            else {
                // if currently sorted by this col, sort to the opposite direction
                console.log(`sort dir was ${this.viewModel.list.options.sort_dir}`);
                sort_dir === "asc" ? this.viewModel.list.options.sort_dir = 'desc' : this.viewModel.list.options.sort_dir = 'asc';
                console.log(`sort dir is now ${this.viewModel.list.options.sort_dir}`);
            }

            // rerender the table
            this.renderList();
        });
    }
    // search functionality
    setTableSearchBarHandler() {
        $(`#searchBar > form > input`).on('keyup', (ev) => {
            let query = ev.target.value;

            if (query && query.length > 2) {
                // send search query
                this.viewModel.list.options.filter_col = this.viewModel.list.searchColName;
                this.viewModel.list.options.filter_str = ev.target.value;
                this.renderList();
            }
            // else{
            //     this.rerenderTable(data)
            // }
        });
    }
    // action button event handlers
    async setAddButtonHandler() {
        $("#create").on('click', async () => {
            this.viewModel.form.submitAction = "add"
            this.viewModel.form.formTitle = `Add ${this.viewModel.viewType}`;
            await this.writeForm();
        });
    }
    setSubmitButtonHandler() {

        $("#formModalSubmit").off();
        $("#formModalSubmit").on('click', async () => {
            event.preventDefault();
            // verify all fields are valid
            let valid = true;
            $('.verify').each(function () {
                if (!this.classList.contains('is-invalid') && !this.classList.contains('is-valid')) {
                    valid = false;
                }
                if (this.classList.contains('is-invalid')) {
                    valid = false;
                }
            });
            if (valid) {
                // serialize the form
                let serializedData = $(`#${this.viewModel.form.id}`).serializeArray();
                console.log(serializedData);
                let newObj = {};

                // // hide modal, hit the api, rebuild the table
                $("#formModal").modal("hide");
                if(this.viewModel.form.submitAction === "add"){
                    // make it into proper format for the api
                    serializedData.forEach(function (obj) {
                        newObj[obj.name] = obj.value;
                    });
                    if(this.viewModel.person_type){
                        newObj.person_type = this.viewModel.person_type;
                    }
                    console.log(newObj);
                    console.log(`yeah I'm thinkin I wanna ${this.viewModel.form.submitAction}`);
                    await this.storage.create(newObj);
                }
                else if(this.viewModel.form.submitAction === "update"){
                    // initialize data payload with last known data 
                    newObj = _.find(this.storage.getList, {"id": parseInt(this.viewModel.form.dataId)})
                    // delete newObj.id;
                    console.log();
                    // make it into proper format for the api
                    serializedData.forEach(function (obj) {
                        newObj[obj.name] = obj.value;
                    });
                    console.log(newObj);
                    console.log(`yeah I'm thinkin I wanna ${this.viewModel.form.submitAction}`);
                    let relevantId = this.viewModel.form.dataId;
                    await this.storage.update(relevantId, newObj);
                }
                this.renderList();
            }

        });

    }
    setRowDeleteHandlers() {
        $(".deleter").on('click', (ev) => {

            // tailor the modal with the relevant data
            let id = ev.currentTarget.id
            let rowData = _.find(this.storage.getList, { 'id': parseInt(id) });

            $("#deleteModalTitle").text(`Delete ${rowData.name}?`);
            $("#deleteModalBody").text(`If you wish to delete ${rowData.name}, click confirm.`);

            // assign the modal's delete button to delete the desired team
            // need to clear any pre-existing handlers first
            $("#teamDelete").off('click');
            $("#teamDelete").on('click', () => {

                // animate row deletion, 
                // then delete the row,
                // and disable the tooltips 
                // otherwise they'll get stuck
                this.storage.delete(id);
                this.renderList(false);
                let animationTime = 200;
                $('.trow').tooltip('disable');
                $(`.a${id}`).slideUp(animationTime, () => {
                    // reactivate tooltips
                    $('tr').tooltip('enable');
                });
            });

        });
    }
    async setRowEditHandlers() {
        $(".editer").on("click", async (ev) => {

            // rewrite form
            this.viewModel.form.submitAction = "update";
            this.viewModel.form.formTitle = `Update ${this.viewModel.viewType}`;
            await this.writeForm();
            this.viewModel.form.dataId = ev.currentTarget.id.substring(1);
            let entry = _.find(this.viewModel.data, { "id": parseInt(ev.currentTarget.id.substring(1)) });

            this.viewModel.fields.forEach(function (field) {

                if (!field.hidden && field.inputType !== "select") {
                    $(`#${field.id}`).val(entry[field.name]);
                }
                else if (!field.hidden && field.inputType === "select" && field.lookupName) {
                    let id = entry[field.name]
                    console.log(`#${field.name}${id}`);
                    $(`#${field.name}${id}`).prop('selected', true);
                }
            });

            ////////////////////////////////////////////////////////////////////////////////////////
            console.log('validation triggered');
            let $fields = $('.verify');
            let viewModelFields = this.viewModel.fields
            let valid = true;

            $fields.each(function () {
                // get data 
                let input = this;
                let $input = $(this);
                // get validation data
                let field = _.find(viewModelFields, { "id": input.id });
                // and validate it
                if (field.validation.required) {
                    if ($input.val()) {
                        $input.removeClass("is-invalid").addClass("is-valid");
                        // wiping this as I've been seeing weird bootstrap behavior where
                        // is-invalid is triggered multiple invalid feedback divs
                        $input.next().text('');
                    }
                    else {
                        $input.removeClass("is-valid").addClass("is-invalid");
                        $input.next().text(`${field.validation.requiredMessage}`);
                        valid = false;
                    }
                }
                if (field.validation.regex) {
                    if (field.validation.regex.test($input.val())) {
                        $input.removeClass("is-invalid").addClass("is-valid");
                        // wiping this as I've been seeing weird bootstrap behavior where
                        // is-invalid is triggered multiple invalid feedback divs
                        $input.next().text('');
                    }
                    else {
                        $input.removeClass("is-valid").addClass("is-invalid");
                        $input.next().text(`${field.validation.invalidMessage}`);
                        valid = false;
                    }
                }
            });
            if(valid){
                this.enableButton('formModalSubmit');
            }
            else{
                this.disableButton('formModalSubmit');
            }
            ////////////////////////////////////////////////////////////////////////////////////////
        });
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // getters //
    get $listContainer() { return $(`#${this.listContainerId}`) }
    get $formContainer() { return $(`#${this.formContainerId}`) }

    // utility functions //
    async getListTemplateHtml() {
        return await $.get(this.viewModel.list.templateUrl);
    }

    async getFormTemplateHtml() {
        return await $.get(this.viewModel.form.templateUrl);
    }

    enableButton(id) {
        $(`#${id}`).removeClass(['disabled', 'btn-secondary']).addClass(['btn-primary']);
    }
    disableButton(id) {
        $(`#${id}`).removeClass(['btn-primary']).addClass(['disabled', 'btn-secondary']);
    }

    async populateLookups() {
        //iterate through viewmodel fields and call your REST API to populate the lookups your views will use.
        for (let field of this.viewModel.fields) {
            if ("lookupName" in field) {
                await this.storage.getLookup(field.lookupName);
            }
        }
    }

    getFieldValue(fieldView, fieldData, label = false) {
        //get the field value using the viewModel.
        //if the field is a select box (has 'lookupName' in field view model), get the selected value
        //'label' boolean determines whether you want the actual display name, or the value of the selected item.
        if ("lookupName" in fieldView) {
            let data = _.find(this.storage.lookups[fieldView.lookupName], { value: fieldData[fieldView.name] });
            if (data === undefined)
                return null;
            else {
                return label ? data.label : data.value;
            }
        }
        else { //field is just an input, return the value of the field.
            return fieldData[fieldView.name];
        }
    }

    setFieldChangeHandlers = () => {

        // validate required fields handlers
        let checkRequired = (ev) => {
            console.log('validation triggered');
            // get data 
            let $input = $(`#${ev.target.id}`);
            // get validation data
            let field = _.find(this.viewModel.fields, { "id": ev.target.id });
            let validationCheck = true;
            let requiredCheck = true;
            // and validate it
            if (field.validation.required) {
                if (!$input.val()) {

                    $input.removeClass("is-valid").addClass("is-invalid");
                    $input.next().text(`${field.validation.requiredMessage}`);
                    requiredCheck = false;
                }
            }
            if (field.validation.regex && requiredCheck) {
                if (!field.validation.regex.test($input.val())) {

                    $input.removeClass("is-valid").addClass("is-invalid");
                    $input.next().text(`${field.validation.invalidMessage}`);
                    validationCheck = false;
                }
            }
            if(validationCheck && requiredCheck){
                $input.removeClass("is-invalid").addClass("is-valid");
                    // wiping this as I've been seeing weird bootstrap behavior where
                    // is-invalid is triggered multiple invalid feedback divs
                    $input.next().text('');
            }

            // check to see if we should enable the submit button
            let valid = true;
            $('.verify').each(function () {
                if (!this.classList.contains('is-invalid') && !this.classList.contains('is-valid')) {
                    valid = false;
                }
                if (this.classList.contains('is-invalid')) {
                    valid = false;
                }
            });
            if(valid){
                this.enableButton('formModalSubmit');
            }
            else{
                this.disableButton('formModalSubmit');
            }
        }
        $('.verify').on({'blur': checkRequired, 'keyup': checkRequired});

        // // validate handlers for format checking
        // let checkFormat = (ev) => {
        //     console.log('keyup event triggered for val');
        //     // get data 
        //     let $input = $(`#${ev.target.id}`);
        //     // get validation data
        //     let field = _.find(this.viewModel.fields, { "id": ev.target.id });
        //     // and validate it
        //     if (field.validation.regex) {
        //         if (field.validation.regex.test($input.val())) {
        //             $input.removeClass("is-invalid").addClass("is-valid");
        //             // wiping this as I've been seeing weird bootstrap behavior where
        //             // is-invalid is triggered multiple invalid feedback divs
        //             $input.next().text('');
        //         }
        //         else {
        //             $input.removeClass("is-valid").addClass("is-invalid");
        //             $input.next().text(`${field.validation.invalidMessage}`);
        //         }
        //     }
        // }
        // $('.re').on('keyup', checkFormat);
    }
}

export default View;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // OLD BUILD TABLE
/*
buildTable(fromData = [], animate = false) {
    // sort the model by the params in the local storage
    this.storage.sort([this.storage.model.viewModel.sortColumn], [this.storage.model.viewModel.sortDirection], true);

    let data;
    fromData.length > 0 ? data = fromData : data = this.storage.list()

    // begin table building
    $("table").remove();
    let table = new teamsTable();
    let editIcon = "fas fa-pen";
    let deleteIcon = "fas fa-trash";
    let infoIcon = "fas fa-info-circle";
    $("#teamsTable").append(table.skele());
    data.forEach(team => {
        if (team) {
            // tooltip content
            let toolTip = `${team.name}<br>League: ${team.league}<br>Coach: ${team.coachFirst} ${team.coachLast}<br>${team.coachEmail} ${team.coachPhone}`
            let popOver = `League: ${team.league} Coach: ${team.coachFirst} ${team.coachLast}`
            let row = $(`<tr id="t${team.id}" data-toggle="tooltip" data-html="true" data-placement="bottom" title="${toolTip}"></tr>`);

            // name
            row.append(`<td scope="row"><strong>${team.name}</strong></td>`);
            // league
            row.append(`<td>${team.league}</td>`);
            // coach
            row.append(`<td>${team.coachFirst} ${team.coachLast}</td>`);
            // team admin
            row.append(`<td>${team.coachEmail}<br>${team.coachPhone}</td>`);
            // division
            row.append(`<td>${team.division}</td>`);
            // actions
            let infoPopover = `<button type="button" class="popover-dismiss" data-toggle="popover" data-placement="top" title="${team.name}" data-content="${popOver}"><i class="${infoIcon}"></i></button>`
            let deleteButton = `<button type="button" id="${team.id}" class="table-button deleter" data-toggle="modal" data-target="#Modal"><i class="${deleteIcon}"></i></button>`
            let editButton = `<button type="button" id="e${team.id}" class="table-button editer" data-toggle="modal" data-target="#formModal"><i class="${editIcon}"></i></button>`

            row.append(`<td>${editButton}${deleteButton}${infoPopover}</td>`);

            $("#teamsTableBody").append(row);
            // animation hooks
            $(`#t${team.id} > td`).wrapInner(`<div class="a${team.id}"></div>`);
            if (animate) {
                $(`.a${team.id}`).hide();
                $(`.a${team.id}`).slideDown();
            }
        }
    });

    // place sort icon
    this.putSortIcon(this.storage.getSortCol(), this.storage.getSortDirection())
}
*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////