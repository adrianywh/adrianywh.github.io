var lastUpdated = "2020-March-16";
var vgcTeams;

$( document ).ready(function() {
    $.getJSON( '/resource/vgc20Teams.json')
        .then(function (items) {
            vgcTeams = items
        })
        .then(function () {
            var uniquePkmn = [];
            var uniquePlayer = [];

            for (let i = 0; i < vgcTeams.length; i++) {
                var vgcTeamPkmn = [vgcTeams[i].pkmn1_text, vgcTeams[i].pkmn2_text, vgcTeams[i].pkmn3_text, vgcTeams[i].pkmn4_text, vgcTeams[i].pkmn5_text, vgcTeams[i].pkmn6_text]
                for (let j = 0; j < vgcTeamPkmn.length; j++) {
                    let isPkmnsExist = false;
                    for (var k = 0; k < uniquePkmn.length; k++) {
                        if (uniquePkmn[k].toUpperCase() == vgcTeamPkmn[j].toUpperCase()) {
                            isPkmnsExist = true;
                        }
                    }
                    if (!isPkmnsExist) {
                        uniquePkmn.push(vgcTeamPkmn[j]);
                    }
                }

                let isPlayerExist = false;
                for (let j = 0; j < uniquePlayer.length; j++) {
                    if (uniquePlayer[j].toUpperCase() == vgcTeams[i].player_text.toUpperCase()) {
                        isPlayerExist = true;
                        break;
                    }
                }
                if (!isPlayerExist) {
                    uniquePlayer.push(vgcTeams[i].player_text);
                }
            }

        $("#vgcPlayer").html("");
        uniquePlayer.sort();
        var optionBuilderPlayer = "<option selected>(All)</option>";
        for (let i = 0; i < uniquePlayer.length; i++) {
            if (uniquePlayer[i] == "") {
                optionBuilderPlayer += "<option value=''>";
                optionBuilderPlayer += "(None)";
                optionBuilderPlayer += "</option>";
            } else {
                optionBuilderPlayer += "<option>";
                optionBuilderPlayer += uniquePlayer[i];
                optionBuilderPlayer += "</option>";
            }
        }

        $("#vgcPlayer").html(optionBuilderPlayer);

        $(".vgcInputPkmn").html("");
        uniquePkmn.sort();
        var optionBuilderPkmn = "<option>-</option>";
        for (let i = 0; i < uniquePkmn.length; i++) {
            optionBuilderPkmn += "<option>";
            optionBuilderPkmn += uniquePkmn[i];
            optionBuilderPkmn += "</option>";
        }

        $(".vgcInputPkmn").html(optionBuilderPkmn);
    })
    .then(function () {
        $("#vgcPlayer").select2();
    })

     $("#lastUpdatedText").html(lastUpdated)
})

/********************vgc helper******************** */
$(document).on("change", "#selectAllPkmn", function () {
    if ($("#selectAllPkmn").is(':checked')) {
        $(".vgcInputPkmn").attr("disabled", 'disabled')
    } else {
        $(".vgcInputPkmn").removeAttr("disabled")
    }
})

function searchTeam() {
    console.log("getSuggestionBtn")
    var limit = $("#selectLimit").val();
    let inputPkmnList = [];

    if (!$("#selectAllPkmn").is(':checked')) {
        if ($("#vgcPkmn1").val() != "-") {
            inputPkmnList.push($("#vgcPkmn1").val());
        }
        if ($("#vgcPkmn2").val() != "-") {
            inputPkmnList.push($("#vgcPkmn2").val());
        }
        if ($("#vgcPkmn3").val() != "-") {
            inputPkmnList.push($("#vgcPkmn3").val());
        }
        if ($("#vgcPkmn4").val() != "-") {
            inputPkmnList.push($("#vgcPkmn4").val());
        }
        if ($("#vgcPkmn5").val() != "-") {
            inputPkmnList.push($("#vgcPkmn5").val());
        }
        if ($("#vgcPkmn6").val() != "-") {
            inputPkmnList.push($("#vgcPkmn6").val());
        }

        if(inputPkmnList.length == 0){
            $("#selectAllPkmn").prop("checked",true).trigger("change");
            inputPkmnList = ['-']
        }
    } else {
        inputPkmnList = ['-']
    }

    var eventActionDEsc = "vgcstats";
    if ($("#checkboxAlternativeList").is(':checked')){
        eventActionDEsc = "vgcstats and alt"
    }
    ga('send', {
        hitType: 'event',
        eventCategory: 'Team Search',
        eventAction: 'vgc20 team search - '+eventActionDEsc,
        eventLabel: inputPkmnList.join(", ")
    });

    if (limit > inputPkmnList.length && inputPkmnList.length != 0) {
        limit = inputPkmnList.length
        $("#selectLimit").val(inputPkmnList.length)
    }

    var sim1 = []
    var sim2 = []
    var sim3 = []
    var sim4 = []
    var sim5 = []
    var sim6 = []
    for (let i = 0; i < vgcTeams.length; i++) {
        var count = 0

        if (!$("#checkboxAlternativeList").is(':checked') && !vgcTeams[i].is_official ) {
            continue;
        }

        if (!$("#selectAllPkmn").is(':checked')) {
            for (let j = 0; j < inputPkmnList.length; j++) {
                var pkmn = inputPkmnList[j];
                if (pkmn.length == 0) {
                    continue
                }

                if (vgcTeams[i].pkmn1_text.toUpperCase() == pkmn.toUpperCase()) {
                    count++;
                }
                if (vgcTeams[i].pkmn2_text.toUpperCase() == pkmn.toUpperCase()) {
                    count++;
                }
                if (vgcTeams[i].pkmn3_text.toUpperCase() == pkmn.toUpperCase()) {
                    count++;
                }
                if (vgcTeams[i].pkmn4_text.toUpperCase() == pkmn.toUpperCase()) {
                    count++;
                }
                if (vgcTeams[i].pkmn5_text.toUpperCase() == pkmn.toUpperCase()) {
                    count++;
                }
                if (vgcTeams[i].pkmn6_text.toUpperCase() == pkmn.toUpperCase()) {
                    count++;
                }
            }
        } else {
            count = 6;
        }

        if ($("#selectEventType").val() != "All" && $("#selectEventType").val() != vgcTeams[i].playlist_text) {
            continue
        }

        if ($("#selectSeries").val() != "All" && $("#selectSeries").val() != vgcTeams[i].series_text) {
            continue
        }

        let isPlayerFound = false;
        if ($("#vgcPlayer").val() != "(All)") {
            for (let j = 0; j < $("#vgcPlayer").val().length; j++) {
                if ($("#vgcPlayer").val()[j].toUpperCase() == vgcTeams[i].player_text.toUpperCase()) {
                    isPlayerFound = true;
                    break;
                }
            }
        } else {
            isPlayerFound = true;
        }

        if (count == 1 && isPlayerFound) {
            if (limit > 1) {
                continue
            }
            sim1.push(vgcTeams[i])
        }
        else if (count == 2 && isPlayerFound) {
            if (limit > 2) {
                continue
            }
            sim2.push(vgcTeams[i])
        }
        else if (count == 3 && isPlayerFound) {
            if (limit > 3) {
                continue
            }
            sim3.push(vgcTeams[i])
        }
        else if (count == 4 && isPlayerFound) {
            if (limit > 4) {
                continue
            }
            sim4.push(vgcTeams[i])
        }
        else if (count == 5 && isPlayerFound) {
            if (limit > 5) {
                continue
            }
            sim5.push(vgcTeams[i])
        }
        else if (count == 6 && isPlayerFound) {
            sim6.push(vgcTeams[i])
        }
    }

    $(".card").hide();
    $(".collapse").removeClass("show")
    let isExpanded = false;
    let isResultsFound = false;
    if (sim6.length > 0) {
        $("#cardOne").show();
        var sim6builder = "";
        $("#sim6body").html("");
        for (let i = 0; i < sim6.length; i++) {
            sim6builder += "<p>" 
            if(!sim6[i].is_official){
                sim6builder += "**";
            }
            sim6builder += sim6[i].playlist_text + " - " + sim6[i].event_date + ", " + sim6[i].region_text + ", " + sim6[i].country_text + " " + sim6[i].player_text + " Ranking: " + sim6[i].placing_text + "</P>";
            sim6builder += "<div class='row'>";
            sim6builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim6[i].img1_text + "' ><figcaption class='figure-caption'>" + sim6[i].pkmn1_text + "</figcaption></figure></div>";
            sim6builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim6[i].img2_text + "' ><figcaption class='figure-caption'>" + sim6[i].pkmn2_text + "</figcaption></figure></div>";
            sim6builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim6[i].img3_text + "' ><figcaption class='figure-caption'>" + sim6[i].pkmn3_text + "</figcaption></figure></div>";
            sim6builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim6[i].img4_text + "' ><figcaption class='figure-caption'>" + sim6[i].pkmn4_text + "</figcaption></figure></div>";
            sim6builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim6[i].img5_text + "' ><figcaption class='figure-caption'>" + sim6[i].pkmn5_text + "</figcaption></figure></div>";
            sim6builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim6[i].img6_text + "' ><figcaption class='figure-caption'>" + sim6[i].pkmn6_text + "</figcaption></figure></div>";
            sim6builder += "</div>"
        }
        $("#sim6body").html(sim6builder);
        $("#sim6Found").html(sim6.length);
        isResultsFound = true;
        if (!isExpanded) {
            $("#collapseOne").collapse("show")
            isExpanded = true;
        }
    }
    if (sim5.length > 0) {
        $("#cardTwo").show();
        var sim5builder = "";
        $("#sim5body").html("");
        for (let i = 0; i < sim5.length; i++) {
            sim5builder += "<p>"
            if(!sim5[i].is_official){
                sim5builder += "**";
            }
            sim5builder += sim5[i].playlist_text + " - " + sim5[i].event_date + ", " + sim5[i].region_text + ", " + sim5[i].country_text + " " + sim5[i].player_text + " Ranking: " + sim5[i].placing_text + "</P>";
            sim5builder += "<div class='row'>";
            sim5builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim5[i].img1_text + "' ><figcaption class='figure-caption'>" + sim5[i].pkmn1_text + "</figcaption></figure></div>";
            sim5builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim5[i].img2_text + "' ><figcaption class='figure-caption'>" + sim5[i].pkmn2_text + "</figcaption></figure></div>";
            sim5builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim5[i].img3_text + "' ><figcaption class='figure-caption'>" + sim5[i].pkmn3_text + "</figcaption></figure></div>";
            sim5builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim5[i].img4_text + "' ><figcaption class='figure-caption'>" + sim5[i].pkmn4_text + "</figcaption></figure></div>";
            sim5builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim5[i].img5_text + "' ><figcaption class='figure-caption'>" + sim5[i].pkmn5_text + "</figcaption></figure></div>";
            sim5builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim5[i].img6_text + "' ><figcaption class='figure-caption'>" + sim5[i].pkmn6_text + "</figcaption></figure></div>";
            sim5builder += "</div>"
        }
        $("#sim5body").html(sim5builder);
        $("#sim5Found").html(sim5.length);
        isResultsFound = true;
        if (!isExpanded) {
            $("#collapseTwo").collapse("show")
            isExpanded = true;
        }
    }
    if (sim4.length > 0) {
        $("#cardThree").show();
        var sim4builder = "";
        $("#sim4body").html("");
        for (let i = 0; i < sim4.length; i++) {
            sim4builder += "<p>"
            if(!sim4[i].is_official){
                sim4builder += "**";
            }
            sim4builder += sim4[i].playlist_text + " - " + sim4[i].event_date + ", " + sim4[i].region_text + ", " + sim4[i].country_text + " " + sim4[i].player_text + " Ranking: " + sim4[i].placing_text + "</P>";
            sim4builder += "<div class='row'>";
            sim4builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim4[i].img1_text + "' ><figcaption class='figure-caption'>" + sim4[i].pkmn1_text + "</figcaption></figure></div>";
            sim4builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim4[i].img2_text + "' ><figcaption class='figure-caption'>" + sim4[i].pkmn2_text + "</figcaption></figure></div>";
            sim4builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim4[i].img3_text + "' ><figcaption class='figure-caption'>" + sim4[i].pkmn3_text + "</figcaption></figure></div>";
            sim4builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim4[i].img4_text + "' ><figcaption class='figure-caption'>" + sim4[i].pkmn4_text + "</figcaption></figure></div>";
            sim4builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim4[i].img5_text + "' ><figcaption class='figure-caption'>" + sim4[i].pkmn5_text + "</figcaption></figure></div>";
            sim4builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim4[i].img6_text + "' ><figcaption class='figure-caption'>" + sim4[i].pkmn6_text + "</figcaption></figure></div>";
            sim4builder += "</div>"
        }
        $("#sim4body").html(sim4builder);
        $("#sim4Found").html(sim4.length);
        isResultsFound = true;
        if (!isExpanded) {
            $("#collapseThree").collapse("show")
            isExpanded = true;
        }
    }
    if (sim3.length > 0) {
        $("#cardFour").show();
        var sim3builder = "";
        $("#sim3body").html("");
        for (let i = 0; i < sim3.length; i++) {
            sim3builder += "<p>" 
            if(!sim3[i].is_official){
                sim3builder += "**";
            }
            sim3builder += sim3[i].playlist_text + " - " + sim3[i].event_date + ", " + sim3[i].region_text + ", " + sim3[i].country_text + " " + sim3[i].player_text + " Ranking: " + sim3[i].placing_text + "</P>";
            sim3builder += "<div class='row'>";
            sim3builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim3[i].img1_text + "' ><figcaption class='figure-caption'>" + sim3[i].pkmn1_text + "</figcaption></figure></div>";
            sim3builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim3[i].img2_text + "' ><figcaption class='figure-caption'>" + sim3[i].pkmn2_text + "</figcaption></figure></div>";
            sim3builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim3[i].img3_text + "' ><figcaption class='figure-caption'>" + sim3[i].pkmn3_text + "</figcaption></figure></div>";
            sim3builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim3[i].img4_text + "' ><figcaption class='figure-caption'>" + sim3[i].pkmn4_text + "</figcaption></figure></div>";
            sim3builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim3[i].img5_text + "' ><figcaption class='figure-caption'>" + sim3[i].pkmn5_text + "</figcaption></figure></div>";
            sim3builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim3[i].img6_text + "' ><figcaption class='figure-caption'>" + sim3[i].pkmn6_text + "</figcaption></figure></div>";
            sim3builder += "</div>"
        }
        $("#sim3body").html(sim3builder);
        $("#sim3Found").html(sim3.length);
        isResultsFound = true;
        if (!isExpanded) {
            $("#collapseFour").collapse("show")
            isExpanded = true;
        }
    }
    if (sim2.length > 0) {
        $("#cardFive").show();
        var sim2builder = "";
        $("#sim2body").html("");
        for (let i = 0; i < sim2.length; i++) {
            sim2builder += "<p>" 
            if(!sim2[i].is_official){
                sim2builder += "**";
            }
            sim2builder += sim2[i].playlist_text + " - " + sim2[i].event_date + ", " + sim2[i].region_text + ", " + sim2[i].country_text + " " + sim2[i].player_text + " Ranking: " + sim2[i].placing_text + "</P>";
            sim2builder += "<div class='row'>";
            sim2builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim2[i].img1_text + "' ><figcaption class='figure-caption'>" + sim2[i].pkmn1_text + "</figcaption></figure></div>";
            sim2builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim2[i].img2_text + "' ><figcaption class='figure-caption'>" + sim2[i].pkmn2_text + "</figcaption></figure></div>";
            sim2builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim2[i].img3_text + "' ><figcaption class='figure-caption'>" + sim2[i].pkmn3_text + "</figcaption></figure></div>";
            sim2builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim2[i].img4_text + "' ><figcaption class='figure-caption'>" + sim2[i].pkmn4_text + "</figcaption></figure></div>";
            sim2builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim2[i].img5_text + "' ><figcaption class='figure-caption'>" + sim2[i].pkmn5_text + "</figcaption></figure></div>";
            sim2builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim2[i].img6_text + "' ><figcaption class='figure-caption'>" + sim2[i].pkmn6_text + "</figcaption></figure></div>";
            sim2builder += "</div>"
        }
        $("#sim2body").html(sim2builder);
        $("#sim2Found").html(sim2.length);
        isResultsFound = true;
        if (!isExpanded) {
            $("#collapseFive").collapse("show")
            isExpanded = true;
        }
    }
    if (sim1.length > 0) {
        $("#cardSix").show();
        var sim1builder = "";
        $("#sim1body").html("");
        for (let i = 0; i < sim1.length; i++) {
            sim1builder += "<p>"
            if(!sim1[i].is_official){
                sim1builder += "**";
            }
            sim1builder += sim1[i].playlist_text + " - " + sim1[i].event_date + ", " + sim1[i].region_text + ", " + sim1[i].country_text + " " + sim1[i].player_text + " Ranking: " + sim1[i].placing_text + "</P>";
            sim1builder += "<div class='row'>";
            sim1builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim1[i].img1_text + "' ><figcaption class='figure-caption'>" + sim1[i].pkmn1_text + "</figcaption></figure></div>";
            sim1builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim1[i].img2_text + "' ><figcaption class='figure-caption'>" + sim1[i].pkmn2_text + "</figcaption></figure></div>";
            sim1builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim1[i].img3_text + "' ><figcaption class='figure-caption'>" + sim1[i].pkmn3_text + "</figcaption></figure></div>";
            sim1builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim1[i].img4_text + "' ><figcaption class='figure-caption'>" + sim1[i].pkmn4_text + "</figcaption></figure></div>";
            sim1builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim1[i].img5_text + "' ><figcaption class='figure-caption'>" + sim1[i].pkmn5_text + "</figcaption></figure></div>";
            sim1builder += "<div class='col-lg-2'> <figure class='figure'> <img class='pkmn-img figure-img img-fluid rounded' src='" + sim1[i].img6_text + "' ><figcaption class='figure-caption'>" + sim1[i].pkmn6_text + "</figcaption></figure></div>";
            sim1builder += "</div>"
        }
        $("#sim1body").html(sim1builder);
        $("#sim1Found").html(sim1.length);
        isResultsFound = true;
        if (!isExpanded) {
            $("#collapseSix").collapse("show")
            isExpanded = true;
        }
    }
    if (isResultsFound) {
        $("#suggestionResults").show();
        $("#noResults").hide();

    } else {
        $("#suggestionResults").hide();
        $("#noResults").show();
    }

}

function resetVgcForm() {
    $(".card").hide();
    $("#selectAllPkmn").prop("checked",true).trigger("change");
    $(".vgcInputPkmn").val("-");
    $("#vgcPlayer").val("(All)").trigger('change');
    $("#selectLimit").val("4");
    $("#selectEventType").val("All");
    $("#selectSeries").val("All");
    $("#suggestionResults").hide();
    $("#noResults").hide();
    
}