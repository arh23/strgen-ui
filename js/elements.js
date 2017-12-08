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
    },
    qremove: function() {
        return $(this).queue(function(next) {
            $(this).remove();
            next();
        });
    }
});

$(document).ready(function(){
    var state = "";
    $("#logs").click(function(){
        if($("div.history_list").css("display") == "none") {
            state = "open";
            if($("div.config-container").css("display") != "none") {
                toggle_options("close", "#options"); 
            }
            setTimeout(toggle_log("open", this), 2000);
        } else {
            state = "close";
            toggle_log("close", this);
        }
        toggle_ref(state);
    });

    $("#options").click(function(){
        var state = "";
        if($("div.config-container").css("display") == "none") {
            state = "open";
            if($("div.history_list").css("display") != "none") {
                toggle_log("close", "#logs"); 
            }
            setTimeout(toggle_options("open", this), 2000);
        } else {
            state = "close";
            toggle_options("close", this);
        }
        toggle_ref(state);
    });

    $("form[name='regex_form']").on('submit', initialize_generator);

    $('#docs').click(function() {
        window.location = 'strgen_doc.html';
    });

    $(document).on("click", ".log_label", function() {
        var element = "#" + $(this).parent().attr('id');

        if ($(element).find('p.log_content').css('display') == "none") {
            open_log($(this), element);
        } else {
            close_log($(this), element);
        }
    });

    $(document).on("click", ".pattern-ex", function() {
        document.getElementById("templatebox").value = $(this).text();
        initialize_generator();
    });

    $(document).on("click", ".predefined-ex", function() {
        var range = $(this).text();
        var pattern = document.getElementById("templatebox").value;

        if (pattern == "") {
            pattern = "[]"
        } else if (pattern != "" && pattern.indexOf(']') < 0) {
            pattern += "[]"
        }

        console.log(range);
        pattern = pattern.replace("]", range + "]");

        document.getElementById("templatebox").value = pattern;
    });

    $("#enablelogging").change(function(){
        if ($(this).is(":checked"))
        {
            if (confirm('Enabling logging can cause performance problems. Are you sure?') == false) {
                $(this).removeAttr("checked")
            }
        }
    });

    $(document).on("click", ".notification", function() {
        $(this).stop(true);
        $(this).fadeOut("slow").qremove();
    });

    function toggle_ref(state) {
        if($("div.ref-container").css("display") == "none" && state == "close") {
            $("div.ref-header").css({display:'flex'}).css({marginTop:'0px'}).css({width:'60vw'}).css({height:'4vh'}); //height:'63.56px'
            $("div.ref-header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.ref-header").text("Reference");
            //$("div.ref-container").slideToggle('fast');
            $("div.ref-container").qcss({display:'block'});
        } else if(state == "open") {
            $("div.ref-header").text("");
            //$("div.ref-container").slideUp(100);
            $("div.ref-container").qcss({display:'none'});
            $("div.ref-header").qcss({display:'none'})       
        }
    }

    function toggle_options(state, element) {
        if (state == "open") {
            $(element).css({backgroundColor:bgColour}).css({color:'white'});
            $(element).find("img").attr("src","img/options-active.svg");
            $("div.config-header").css({display:'flex'}).css({marginTop:'0px'}).css({width:'60vw'}).css({height:'4vh'}); //height:'63.56px'
            $("div.config-header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.config-header").text("Options");
            //$("div.config-container").slideToggle('fast').qcss({display:'grid'});
            $("div.config-container").qcss({display:'grid'});
        } else if (state == "close") {
            $("div.config-header").text("");
            $(element).css({backgroundColor:'white'}).css({color:'initial'});
            $(element).find("img").attr("src","img/options.svg");
            $("div.config-container").css({display:'none'});/*$("div.config-container").slideUp(100);*/
            $("div.config-header").qcss({display:'none'});
        }
    }

    function toggle_log(state, element) {
        if (state == "open") {
            $(element).css({backgroundColor:bgColour}).css({color:'white'}).attr("src","img/log-active.svg");
            $(element).find("img").attr("src","img/log-active.svg");
            $("div.history_header").css({display:'flex'}).css({marginTop:'0px'}).css({width:'60vw'}).css({height:'4vh'}); //height:'63.56px'
            $("div.history_header").css({fontWeight:'bold'}).css({fontSize:'16px'}).css({border:'none'}).css({borderBottom:'thin solid #000000'}); //fontSize:'16px'
            $("div.history_header").text("Logs");
            //$("div.history_list").slideToggle('fast');     
            $("div.history_list").qcss({display:'block'});    
        } else if (state == "close") {
            $("div.history_header").text("");
            $(element).css({backgroundColor:'white'}).css({color:'initial'});
            $(element).find("img").attr("src","img/log.svg");
            $("div.history_list").css({display:'none'})/*$("div.history_list").slideUp(100);*/
            $("div.history_header").qcss({display:'none'});
            /*$("div.history_header").delay(125).qcss({height:'0x'}).qcss({width:'0px'}).qcss({marginTop:'0px'});*/
            /*$("div.history_header").delay(25).qcss({border:'thin solid #000000'}).qcss({fontWeight:''}).qcss({fontSize:'13.3333px'}).qtext("View Logs");*/
        }
    }

    function open_log(parent, element) {
        close_log(parent, '.history_record'); // close all logs that are currently open

        $(element).find('p.log_content').css('display','block').css('border-color', bgColour);    
        $(element).css('background-color', bgColour);
        $(parent).css('color', 'white').css('padding-left','4px');  
        $(element).find('div.log_export a').css('color', 'white').css('padding-right', '4px');
    }

    function close_log(parent, element) {
        $(element).find('p.log_content').css('display','none');
        $(element).css('background-color', '');
        $(parent).css('color', 'black').css('padding-left', '0px');
        $(element).find('div.log_export a').css('color', linkColour).css('padding-right', '0px');

        if ($(element).find('p.log_content').css('display') == 'none') {
            $(element).find('.log_label').css('color', 'black').css('padding-left', '0px');
        }       
    }
});