class validation {

    constructor(){}
    
    validateForm(){

        // validate required fields
        $("[required]").each(function(){
            console.log(`${this.id}`)
            let that  = $(this);
            if(that.val()){
                that.removeClass("is-invalid");
                that.addClass("is-valid");
            }
            else{
                that.removeClass("is-valid");
                that.addClass("is-invalid");
            }
        });

        // zip code: std zip code regex

        // email: std email regex

        // username: 8 chars, one upper, one lower

        // password: 8 chars, one upper, one underscore

        // confirm password: matches password
    }

}

export default validation;