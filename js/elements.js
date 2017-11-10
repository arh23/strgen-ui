var bgColour = '#b80000';
var linkColour = '#ff0505';

$.fn.extend({
    qcss: function(css) { // from https://stackoverflow.com/a/35057342
        return $(this).queue(function(next) {
            $(this).css(css);
            next();
        });
    },
    qtext: function(text) {
        return $(this).queue(function(next) {
            $(this).text(text);
            next();
        });
    }
});

$(document).ready(function(){
    $("div.history_header").click(function(){
        if($("div.history_list").css("display") == "none") {
            $(this).css({marginTop:'0px'}).css({width:'60vw'}).css({height:'63.56px'});
            $(this).css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'});
            $(this).text("Logs");
            $("div.history_list").slideToggle('fast');
        } else {
            $("div.history_list").slideUp(100);
            $(this).delay(125).qcss({height:'29px'}).qcss({width:'100px'}).qcss({marginTop:'20px'});
            $(this).delay(25).qcss({border:'thin solid #000000'}).qcss({fontWeight:''}).qcss({fontSize:'13.3333px'}).qtext("View Logs");
        }
    });

    $("form[name='regex_form']").on('submit', initialize_generator);

    $('.doc_button').click(function() {
        window.location = 'strgen_doc.html';
    });

    $(document).on("click", ".log_label", function() {
        var element = "#" + $(this).parent().attr('id');

        if ($(element).find('p.log_content').css('display') == "none") {
            $(element).find('p.log_content').css('display','block').css('border-color', bgColour);    
            $(element).css('background-color', bgColour);
            $(this).css('color', 'white').css('padding-left','4px');  
            $(element).find('div.log_export a').css('color', 'white').css('padding-right', '4px');    
        } else {
            $(element).find('p.log_content').css('display','none');
            $(element).css('background-color', '');
            $(this).css('color', 'black').css('padding-left', '0px');
            $(element).find('div.log_export a').css('color', linkColour).css('padding-right', '0px');
        }
    });

    $("#enablelogging").change(function(){
        if ($(this).is(":checked"))
        {
            if (confirm('Enabling logging can cause performance problems. Are you sure?') == false) {
                $(this).removeAttr("checked")
            }
        }
    });
});