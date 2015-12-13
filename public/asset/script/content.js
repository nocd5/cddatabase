var database = []
var genre = []
var artist = []
var currentGenre = ''
var currentArtist = ''

var xmlHttpRequestGenre = new XMLHttpRequest();
xmlHttpRequestGenre.onreadystatechange = function()
{
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
            genre = JSON.parse(xmlHttpRequestGenre.responseText);
            generateGenreList();
        }
    }
}

var xmlHttpRequestArtist = new XMLHttpRequest();
xmlHttpRequestArtist.onreadystatechange = function()
{
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
            artist = JSON.parse(xmlHttpRequestArtist.responseText);
            generateArtistList();
        }
    }
}

var xmlHttpRequestDatabase = new XMLHttpRequest();
xmlHttpRequestDatabase.onreadystatechange = function()
{
    if( this.readyState == 4 && this.status == 200 )
    {
        if( this.response )
        {
            database = JSON.parse(xmlHttpRequestDatabase.responseText);
            generateTable()
        }
    }
}

$(window).load(function(){
    xmlHttpRequestGenre.open( 'GET', 'genre.json', true );
    xmlHttpRequestGenre.send( null );
    xmlHttpRequestArtist.open( 'GET', 'artist.json', true );
    xmlHttpRequestArtist.send( null );
    xmlHttpRequestDatabase.open( 'GET', 'database.json', true );
    xmlHttpRequestDatabase.send( null );

    $('#genre').on('click', 'li', function(event){
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

        generateTable();
        generateArtistList();
    })
    $('#artist').on('click', 'li', function(event){
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
        generateTable()
    })

    setPanelHeight();
});

$(window).resize(function () {
    setPanelHeight();
});

function setPanelHeight() {
    var headerPaddingTop = parseInt($('.panel-heading').css('padding-top'), 0);
    var headerPaddingBottom = parseInt($('.panel-heading').css('padding-top'), 0);
    var buttonMarginTop = parseInt($('.btn-group').css('margin-top'), 0);
    var buttonMarginBottom = parseInt($('.btn-group').css('margin-top'), 0);
    height = $(window).height() - $('.panel-heading').height() - $('.btn-group').height()
        - (headerPaddingTop + headerPaddingBottom)
        - (buttonMarginTop + buttonMarginBottom);
    $('.panel-height').css('height', height + 'px');
}

function generateGenreList() {
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

function generateArtistList() {
    $('#artist li').remove();

    $('#artist').append(
        $('<li>').append(
            $('<a>').text('All')
        )
    );
    $('#artist').append( $('<li>', {role: 'separator', class: 'divider'}) );

    for (var i = 0; i < artist.length; i++) {
        if ((currentGenre == '') | (currentGenre == artist[i].Genre)) {
            $('#artist').append(
                $('<li>').append(
                    $('<a>').text(artist[i].Artist)
                )
            );
        }
    }
}

function generateTable() {
    $('#database tr').remove();
    var count = 0;
    for (var i = 0; i < database.length; i++) {
        if ((currentGenre == '') && (currentArtist == '')) {
            $('#database').append(
                $('<tr>').append(
                    $('<th>').text(database[i].Artist),
                    $('<th>').text(database[i].Title),
                    $('<th>').text(database[i].Genre)
                )
            );
            count++;
        }
        else if (currentGenre == '') {
            if (database[i].Artist == currentArtist) {
                $('#database').append(
                    $('<tr>').append(
                        $('<th>').text(database[i].Artist),
                        $('<th>').text(database[i].Title),
                        $('<th>').text(database[i].Genre)
                    )
                );
                count++;
            }
        }
        else if (currentArtist == '') {
            if (database[i].Genre == currentGenre) {
                $('#database').append(
                    $('<tr>').append(
                        $('<th>').text(database[i].Artist),
                        $('<th>').text(database[i].Title),
                        $('<th>').text(database[i].Genre)
                    )
                );
                count++;
            }
        }
        else {
            if ((database[i].Artist == currentArtist)
                && (database[i].Genre == currentGenre)) {
                $('#database').append(
                    $('<tr>').append(
                        $('<th>').text(database[i].Artist),
                        $('<th>').text(database[i].Title),
                        $('<th>').text(database[i].Genre)
                    )
                );
                count++;
            }
        }
    }

    $('#cd-count h1').remove();
    $('#cd-count').append($('<h1>').text(count + ' / ' + database.length + ' CDs'));
}
