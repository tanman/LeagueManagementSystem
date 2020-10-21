import controller from './controller.js';

$(() => {
    let control = new controller();
    control.viewModel.buildTable([], true);
    control.setTableColumnHeadHandlers();
    control.setTableSearchBarHandler();
    control.setRowDeleteHandlers();
    
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })

    // row tooltips
    $('tr').tooltip()

    // smoother modal opening
    $('.modal').on('show.bs.modal', function () {
        if ($(document).height() > $(window).height()) {
            // no-scroll
            $('body').addClass("modal-open-noscroll");
        }
        else {
            $('body').removeClass("modal-open-noscroll");
        }
    });
    $('.modal').on('hide.bs.modal', function () {
        $('body').removeClass("modal-open-noscroll");
    });

    // aside button
    $('#asideExpand').on('click', (e)=>{
        $('#aside')[0].animate({'width': '100px'}, 150);
        $('#aside').css({'width':'150px'});
    });

    // nav slide animation
    $('#logo').toggleClass('open');


})