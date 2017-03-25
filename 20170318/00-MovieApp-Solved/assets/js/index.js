var years = [2017, 2016, 2015],
    apiUrl = "https://www.omdbapi.com/",

    // Store reference to first level templates on the document
    $templates = $("template"),

    // Partial view placeholder
    $partialViewPlaceholder = $("#partial-view");


// Load years when page loads
loadYearsTemplate();




/** Add event listeners */
// When user clicks plus button to add a new year
$(document).on("click", "#year-box .command", function () {
    var $yearBoxInput = $("#year-box input")
    years.push($yearBoxInput.val());
    loadYearsTemplate();
    $yearBoxInput.val("");
});

// When user clicks on search button
$(document).on("click", "#search-box .command", search);

// When user clicks a year to search for
$(document).on("click", "#years a", function () {
    var $yearClicked = $(this);
    $("#years a").removeClass("active");
    $yearClicked.addClass("active");

    search();
});

// When user clicks on any result to see its details
$(document).on("click", ".movie-result", function () {
    var imdbID = $(this).attr("imdb-id");
    searchById(imdbID);
});





/** Template loaders */
function loadYearsTemplate() {
    var $yearsPlaceholder = $("#years");
    $yearsPlaceholder.empty();

    years.forEach(function (year) {
        var yearTmplHtml = $templates.filter("#tmpl-year").html(),
            $yearTmpl = $(yearTmplHtml);

        $yearsPlaceholder.append($yearTmpl);
        $yearTmpl.text(year);
    });
}

function loadMovieResultsTemplate(response) {
    var movieResultsTmplHtml = $templates.filter("#tmpl-movie-results").html(),
        $movieResultsTmpl = $(movieResultsTmplHtml);
    $partialViewPlaceholder.empty().append($movieResultsTmpl);

    response.Search.forEach(function (result) {
        var movieResultTmplHtml = $movieResultsTmpl.find("#tmpl-movie-result").html(),
            $movieResultTmpl = $(movieResultTmplHtml);

        $movieResultsTmpl.append($movieResultTmpl);

        $movieResultTmpl.find(".movie-title").text(result.Title);
        $movieResultTmpl.find(".movie-year").text(result.Year);
        $movieResultTmpl.find(".movie-result").attr("imdb-id", result.imdbID);
        if (result.Poster !== "N/A") {
            $movieResultTmpl.find("img").attr("src", result.Poster);
        }
    });
}

function loadMovieDetailsTemplate(response) {
    var movieDetailsTmplHtml = $templates.filter("#tmpl-movie-details").html(),
        $movieDetailsTmpl = $(movieDetailsTmplHtml);
    $partialViewPlaceholder.empty().append($movieDetailsTmpl);

    $movieDetailsTmpl.find(".page-header span").text(response.Title);
    $movieDetailsTmpl.find(".page-header small").text(response.Genre);
    $movieDetailsTmpl.find(".movie-plot").text(response.Plot);

    if (response.Poster !== "N/A") {
        $movieDetailsTmpl.find("img").attr("src", response.Poster);
    }

    var actors = response.Actors.split(", ");
    actors.forEach(function (actor) {
        var actorTmplHtml = $movieDetailsTmpl.find("#tmpl-actor").html(),
            $actorTmpl = $(actorTmplHtml);

        $movieDetailsTmpl.find(".movie-actors").append($actorTmpl);

        $actorTmpl.text(actor);
    });
}


/** Search functions */
function search() {
    var searchCriteria = $("#search-box input").val(),
        year = $("#years a.active").text();

    if (!searchCriteria) return;

    $.ajax({
        url: apiUrl,
        data: {
            s: searchCriteria,
            y: year
        }
    }).done(loadMovieResultsTemplate);
}

function searchById(imdbID) {
    $.ajax({
        url: apiUrl,
        data: {
            i: imdbID
        }
    }).done(loadMovieDetailsTemplate);
}











