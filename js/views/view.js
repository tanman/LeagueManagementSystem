import storageService from '../restStorageService.js'

class View {

    constructor(viewModel, listContainerId, formContainerId, apiUrl, apiKey) {
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
                sort_dir === "asc" ? this.viewModel.list.options.sort_dir = 'desc' : this.viewModel.list.options.sort_dir = 'asc';
            }

            // rerender the table
            this.renderList();
        });
    }
    // search functionality
    setTableSearchBarHandler() {
        $(`#searchBar > form > input`).on('keyup', (ev) => {
            let query = ev.target.value;
            this.viewModel.functionality.searchState = query;

            if (query && query.length > 2) {
                // send search query
                this.viewModel.list.options.filter_col = this.viewModel.list.searchColName;
                this.viewModel.list.options.filter_str = ev.target.value;
                this.renderList();
            }
            else if(!query){
                this.viewModel.list.options.filter_col = "";
                this.viewModel.list.options.filter_str = "";
                this.renderList();
            }
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
                    // set a default license level for players, as that field is only for coaches
                    if(this.viewModel.person_type==="player"){
                        newObj.license_level_id = this.viewModel.defaultLicenseLevel;
                    }
                    console.log(`yeah I'm thinkin I wanna ${this.viewModel.form.submitAction}`);
                    await this.storage.create(newObj);
                }
                else if(this.viewModel.form.submitAction === "update"){
                    // initialize data payload with last known data 
                    newObj = _.find(this.storage.getList, {"id": parseInt(this.viewModel.form.dataId)})
                    // make it into proper format for the api
                    serializedData.forEach(function (obj) {
                        newObj[obj.name] = obj.value;
                    });
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
            $("#teamDelete").on('click', async () => {

                // animate row deletion, 
                // then delete the row,
                // and disable the tooltips 
                // otherwise they'll get stuck
                let animationTime = 200;
                $('.trow').tooltip('disable');
                $(`.a${id}`).slideUp(animationTime, () => {
                    // reactivate tooltips
                    $('tr').tooltip('enable');
                });
                await this.storage.delete(id);
                await this.renderList(false);
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
                    $(`#${field.name}${id}`).prop('selected', true);
                }
            });

            ////////////////////////////////////////////////////////////////////////////////////////
            // console.log('validation triggered');
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
    }
}

export default View;