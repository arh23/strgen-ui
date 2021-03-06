var history = new Array();
var count = 0;
var notification_count = 0;
var generator = new Strgen();

function initializeGenerator() {
	try {
	    document.getElementById('stringvalue').innerHTML = "";
	    $('.notification').remove();

        var pattern = document.getElementById('templatebox').value;
        var allow_duplicate_characters = document.getElementById('allowduplicates').checked;
        var enable_logging = document.getElementById('enablelogging').checked;
        var reporting_type = document.getElementById('reportingdropdown').value;
        var print_to_console = document.getElementById('printlog').checked;
        var allow_multiple_instances =  document.getElementById('multipleduplicates').checked;
        var ignore_duplicate_case =  document.getElementById('caseduplicates').checked;
        var symbol_quantifier_max = document.getElementById('maxquantifier').value;
        
        var generator = new Strgen(); // refresh strgen instance

        generator.pattern = pattern;
        generator.allow_duplicate_characters = allow_duplicate_characters;
        generator.allow_logging = enable_logging;
        generator.reporting_type = reporting_type;
        generator.print_to_console = print_to_console;
        generator.store_errors = true;
        generator.allow_multiple_instances = allow_multiple_instances;
        generator.ignore_duplicate_case = ignore_duplicate_case;
        generator.symbol_quantifier_max = symbol_quantifier_max;

        for (preset in generator.preset) {
            generator.preset[preset].value = document.getElementById(generator.preset[preset].preset_code).value;
        }

	    var generated_string = generator.createString();

        getErrors(generator);

        if(generated_string != undefined) {
           document.getElementById("stringvalue").innerHTML = generated_string; 
        } else {
            generated_string = "";
        }
	    
	    recordValue(pattern, generated_string, generator.generator_log);
	} catch(error) {
        displayNotification("Error! ", error.message, "strgen-js");
        getErrors(generator);
	    console.error(error.message);
	    console.error(error.stack);
	}
};

function recordValue(pattern, generated_output, log_array) {
    if (log_array != "") {
        if (pattern == "") {
            pattern = "no pattern";
        }

        if (generated_output == "") {
            generated_output = "no string generated";
        } else if (generated_output == " ") {
            generated_output = "white space";
        }

        createFields(pattern, generated_output, count, pattern + " - " + generated_output, log_array);

        count += 1;
    }
};

function createFields(pattern, generated_output, count, log_label, log_array) {
    var current_id = "result" + count;
    var current_count = count;

    if (!document.getElementById(current_id)){
        var container = document.createElement("div");

        container.setAttribute("id", current_id);
        container.setAttribute("class", "history_record");
        container.setAttribute("title", generated_output);

        document.getElementById("historylist").appendChild(container);
    }
    var divBar = document.createElement("div"); // create log label

    divBar.setAttribute("id", current_id + "_bar");
    divBar.setAttribute("class", "log_bar");
    document.getElementById(current_id).appendChild(divBar);

    var divLabel = document.createElement("div"); // create log label

    divLabel.setAttribute("id", current_id + "_label");
    divLabel.setAttribute("class", "log_label");
    document.getElementById(current_id + "_bar").appendChild(divLabel);

    document.getElementById(current_id + "_label").innerHTML = "<b>Log entry " + (current_count + 1) + ":</b> " + log_label;

    var divExport = document.createElement("div"); // create export label

    divExport.setAttribute("id", current_id + "_export");
    divExport.setAttribute("class", "log_export");
    document.getElementById(current_id + "_bar").appendChild(divExport);

    var paragraph = document.createElement("p"); // create log content

    paragraph.setAttribute("id", current_id + "_p");
    paragraph.setAttribute("class", "log_content");
    document.getElementById(current_id).appendChild(paragraph);

    var log_string = "";

    if (log_array != "") {
        for (var count = 0; count <= log_array.length - 1; count++) {
            log_string += log_array[count] + "~";
        }
    } else {
        log_string = "No log entries..."
    }

    var log_content = log_string.split('~').join("\r\n");
    var export_content = encodeURIComponent(log_content);

    document.getElementById(current_id + "_p").innerHTML = log_content;

    var a = document.getElementById(current_id + "_export").appendChild(
        document.createElement("a")
    );

    var currentdate = new Date(); 

    var date_string = currentdate.toLocaleDateString();
    date_string = date_string.split('/').join("-");

    var time_string = currentdate.toLocaleTimeString();
    time_string = time_string.split(':').join("-");
    
    var date_time_string = date_string + "-" + time_string;

    a.download = log_label + "_" + current_id + "_" + date_time_string + ".txt";
    a.href = "data:text/plain;charset=utf-8," + export_content;
    a.innerHTML = "Export";
};

function createPresetOptions(strgen = generator, count = 0) {
    if (strgen.preset.length > count) {
        var current_id = "preset" + count;
        var current_count = count;
        var parent = document.getElementsByClassName("sub-container preset-options")[0];

        var preset = strgen.preset[count].preset_code;
        var value = strgen.preset[count].value;

        var presetLabel = document.createElement("label"); // create export label

        presetLabel.setAttribute("id", preset + "_label");
        presetLabel.setAttribute("class", "preset-label");
        parent.appendChild(presetLabel);

        document.getElementById(preset + "_label").innerHTML = "\\" + preset;

        var presetInput = document.createElement("input"); // create log content

        presetInput.setAttribute("type", "text");
        presetInput.setAttribute("id", preset);
        presetInput.setAttribute("class", "preset-content");
        presetInput.setAttribute("value", value);
        parent.appendChild(presetInput);
        count += 1;

        this.createPresetOptions(strgen, count);
    }
}

function resetPresetOptions(strgen = generator, count = 0) {
    if (strgen.preset.length > count) {
        document.getElementById(strgen.preset[count].preset_code).value = strgen.preset[count].value;
        count += 1;

        this.resetPresetOptions(strgen, count);
    }
}

function displayNotification(caption, message, component = "strgen", fade = 5000, colour = 'var(--active-colour)', 
    text_colour = 'white', border = 'thin solid', border_colour = 'var(--hover-colour)', ) {
    notification_count +=1;

    var notifElement = document.createElement("div");
    var notifId = "notif_" + notification_count;

    notifElement.setAttribute("id", notifId);
    notifElement.setAttribute("class", "notification");
    notifElement.setAttribute("style", "display: none;");


    document.getElementById("notification-area").appendChild(notifElement);

    notifId = "#" + notifId;

    var timer = null;

    if (timer) { 
        window.clearTimeout(timer); 
        timer = null;
    };

    $(notifId).stop(true, true);

    $(notifId).css('border', border);
    $(notifId).css('border-color', border_colour);
    $(notifId).css('background-color', colour);
    $(notifId).css('color', text_colour);

    if (message != undefined) {
        $(notifId).fadeIn("fast").append(message);
    } else {
        $(notifId).fadeIn("fast");
    }

    $(notifId + " br:lt(1)").remove();

    if (caption != undefined && caption != "") {
        $(notifId).prepend("<b>" + caption + "</b><br />");
    }

    $(notifId).prepend("<i>" + component + "</i><br /><hr style='color:" + border_colour + "'>");

    timer = window.setTimeout(function() { 
        $(notifId).fadeOut("slow").qremove();    
    }, fade);
};

function getErrors(generator) {
    if (generator.error_list != null) {
        for (error in generator.error_list) {
            if (generator.error_list[error].state == "warning") {
                displayNotification("Warning! ", generator.error_list[error].msg, "strgen-js", 15000, 'var(--warning-colour');
            } else if (generator.error_list[error].state == "error") {
                displayNotification("Error! ", generator.error_list[error].msg, "strgen-js");
            }
        }
    }
};

function generateFromList(listString) {
    var separator = document.getElementById("listseparator").value;
    var pattern, original_pattern;
    var operator = "[]{}()-\\|/+*?"

    if (listString == "") {
        $('.notification').remove();
        displayNotification("Warning! ", "No values to select from!", "strgen-ui", 15000, 'var(--warning-colour');
    } else {
        do 
            if (listString.charAt(listString.length - 1) == ",") {
                listString = listString.substr(0, listString.length - 1);
            } else if (listString.charAt(listString.length - 1) == "\n") {
                listString = listString.substr(0, listString.length - 1);
            }
        while (listString.charAt(listString.length - 1) == "\n" || listString.charAt(listString.length - 1) == ",")

        original_pattern = "(" + listString + ")";
        original_pattern = original_pattern.replace(/,/g, "|");
        original_pattern = original_pattern.replace(/,\n/, "|");

        if (separator != "") {
            var count = 0;

            do {
                if (operator.includes(separator.charAt(count))) {
                    separator = separator.substr(0, count) + "/" + separator.substr(count);
                    count += 1;
                }
                count += 1;
            } while (count < separator.length)

            pattern = "(" + listString; // process pattern and add separator at end
            pattern = pattern.replace(/,/g, separator + "|"); // replace commas
            pattern = pattern.replace(/,\n/, separator + "|") + separator + ")"; // replace commas and new lines, add separator and closing bracket
        } else {
            pattern = "(" + listString.replace(/,/g, "|") + ")"; // process pattern
            pattern = pattern.replace(/,/g, "|"); // replace commas
            pattern = pattern.replace(/,\n/, "|"); // replace commas and new lines
        }

        var quantifier = document.getElementById("listquantifier").value;
        var individual_sequence = document.getElementById("toggleunique").checked;


        if (quantifier == 0 || quantifier == undefined) {
            $('.notification').remove();
            displayNotification("Warning! ", "Number of values to select cannot be 0! Setting to 1.", "strgen-ui", 15000, 'var(--warning-colour');
            quantifier = 1;
        }

        if (separator != "" && quantifier >= 2 && individual_sequence == false) {
            pattern = pattern + "{" + (quantifier - 1) + "}" + original_pattern;
        } else if (quantifier == 1 && individual_sequence == false) {
            pattern = original_pattern;
        } else if (individual_sequence) {
            if (separator != "") {
                pattern = pattern.repeat(quantifier - 1) + original_pattern;
            } else {
                pattern = pattern.repeat(quantifier);
            }
            
        } else {
            pattern = pattern + "{" + quantifier + "}";
        }

        document.getElementById("templatebox").value = pattern;
        initializeGenerator();
    }
}