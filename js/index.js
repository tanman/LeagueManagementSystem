import controller from './controller.js';

$(() => {
    console.log("hello world");
    let control = new controller();
    control.storage.list().forEach(element => {
        console.log(element);
    });
    control.buildTable();
    
    // enable popover-dismiss popovers, and set them to dismiss on focus event 
    // $(function () {
    //     $('[data-toggle="popover"]').popover()
    // })
    $('.popover-dismiss').popover({
        trigger: 'focus'
    })

    // row tooltips
    $('tr').tooltip()

    // aside mouseover / mouseout
    // $('#aside').on('mouseover', ()=>{
    //     $('#aside')[0].animate({'width': '100px'}, 250);
    // })
    // $('aside').on('mouseout', ()=>{
    //     $('aside')[0].animate({'width': '60px'}, 250);
    // })


})