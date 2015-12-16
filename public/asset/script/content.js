var currentGenre = ''
var currentArtist = ''

var xmlHttpRequestGenre = new XMLHttpRequest();
xmlHttpRequestGenre.onreadystatechange = function () {
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
            generateGenreList(JSON.parse(xmlHttpRequestGenre.responseText));
        }
    }
}
function postGenreJsonRequest(parameter) {
    xmlHttpRequestGenre.open( 'GET', 'genre.json' + parameter, true );
    xmlHttpRequestGenre.send( null );
}

var xmlHttpRequestArtist = new XMLHttpRequest();
xmlHttpRequestArtist.onreadystatechange = function () {
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
            generateArtistList(JSON.parse(xmlHttpRequestArtist.responseText));
        }
    }
}
function postArtistJsonRequest(parameter) {
    xmlHttpRequestArtist.open( 'GET', 'artist.json' + parameter, true );
    xmlHttpRequestArtist.send( null );
}

var xmlHttpRequestDatabase = new XMLHttpRequest();
xmlHttpRequestDatabase.onreadystatechange = function () {
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
            generateTable(JSON.parse(xmlHttpRequestDatabase.responseText))
        }
    }
}
function postDatabaseJsonRequest(parameter) {
    xmlHttpRequestDatabase.open( 'GET', 'database.json' + parameter, true );
    xmlHttpRequestDatabase.send( null );
}

function getQueryParameter() {
    var param = [];
    if (currentGenre != '') {
        param.push('genre=' + encodeURIComponent(currentGenre));
    }
    if (currentArtist != '') {
        param.push('artist=' + encodeURIComponent(currentArtist));
    }
    var result = '';
    if (param.length > 0) {
        result = '?' + param.join('&');
    }
    return result;
}

$(window).load(function () {
    postGenreJsonRequest('');
    postArtistJsonRequest('');
    postDatabaseJsonRequest('');

    $('#genre').on('click', 'li', function () {
        if ($(this).index() == 0) {
            currentGenre = '';
            $('#dropdown-menu-genre').text('Genre');
        }
        else {
            currentGenre = $(this).text();
            $('#dropdown-menu-genre').text(currentGenre);
        }
        $('#dropdown-menu-genre').append(' ');
        $('#dropdown-menu-genre').append($('<span>', {class: 'caret'}));

        currentArtist = '';
        $('#dropdown-menu-artist').text('Artist');
        $('#dropdown-menu-artist').append(' ');
        $('#dropdown-menu-artist').append($('<span>', {class: 'caret'}));

        var parameter = '';
        if (currentGenre != '') {
            parameter += '?genre=' + encodeURIComponent(currentGenre);
        }
        postArtistJsonRequest(parameter);
        postDatabaseJsonRequest(getQueryParameter());
    })
    $('#artist').on('click', 'li', function () {
        if ($(this).index() == 0) {
            currentArtist = '';
            $('#dropdown-menu-artist').text('Artist');
        }
        else {
            currentArtist = $(this).text();
            $('#dropdown-menu-artist').text(currentArtist);
        }
        $('#dropdown-menu-artist').append(' ');
        $('#dropdown-menu-artist').append($('<span>', {class: 'caret'}));
        postDatabaseJsonRequest(getQueryParameter());
    })

    setPanelHeight();
});

$(window).resize(function () {
    setPanelHeight();
});

function setPanelHeight() {
    var panelMarginBottom = parseInt($('.panel').css('margin-bottom'), 0);
    var panelBorderTopWidth = parseInt($('.panel').css('border-top-width'), 0);
    var panelBorderBottomWidth = parseInt($('.panel').css('border-bottom-width'), 0);
    var headerHeight = parseInt($('.thead').css('height'), 0);
    var headerPaddingTop = parseInt($('.panel-heading').css('padding-top'), 0);
    var headerPaddingBottom = parseInt($('.panel-heading').css('padding-bottom'), 0);
    var buttonMarginTop = parseInt($('.btn-group').css('padding-top'), 0);
    var buttonMarginBottom = parseInt($('.btn-group').css('padding-bottom'), 0);
    var height = $(window).height() - $('.panel-heading').height() - $('.btn-group').height()
        - panelMarginBottom - (panelBorderTopWidth + panelBorderBottomWidth)
        - (headerHeight + headerPaddingTop + headerPaddingBottom)
        - (buttonMarginTop + buttonMarginBottom);
    $('.panel-height').css('height', height + 'px');
}

function generateGenreList(genre) {
    $('#genre li').remove()

    $('#genre').append(
        $('<li>').append(
            $('<a>').text('All')
        )
    );
    $('#genre').append( $('<li>', {role: 'separator', class: 'divider'}) );

    for (var i = 0; i < genre.length; i++) {
        $('#genre').append(
            $('<li>').append(
                $('<a>').text(genre[i])
            )
        );
    }
}

function generateArtistList(artist) {
    $('#artist li').remove();

    $('#artist').append(
        $('<li>').append(
            $('<a>').text('All')
        )
    );
    $('#artist').append( $('<li>', {role: 'separator', class: 'divider'}) );

    for (var i = 0; i < artist.length; i++) {
        $('#artist').append(
            $('<li>').append(
                $('<a>').text(artist[i])
            )
        );
    }
}

function generateTable(database) {
    $('#database div').remove();
    for (var i = 0; i < database.length; i++) {
        $('#database').append(
            $('<div>', {class: 'row trow'}).append(
                $('<div>', {class: 'col-xs-1'}).append($('<img>', {src: './jacket?id=' + database[i].Id + '&width=50'})),
                $('<div>', {class: 'col-xs-3'}).text(database[i].Artist),
                $('<div>', {class: 'col-xs-5'}).text(database[i].Title),
                $('<div>', {class: 'col-xs-3'}).html(database[i].Genre.replace('/', '/<wbr>'))
            )
        );
    }

    $('#cd-count h1').remove();
    $('#cd-count').append($('<h1>').text(database.length + ' CDs'));
}
