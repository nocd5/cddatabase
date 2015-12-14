package main

import (
	"database/sql"
	"encoding/json"
	"github.com/coopernurse/gorp"
	_ "github.com/mattn/go-sqlite3"
	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"net/http"
	"strings"
)

type Item struct {
	Id     int32 `db:"_id"`
	Artist string
	Title  string
	Genre  string
}

func main() {
	goji.Get("/database.json", databaseJsonHandler)
	goji.Get("/genre.json", genreJsonHandler)
	goji.Get("/artist.json", artistJsonHandler)
	goji.Get("/*", http.FileServer(http.Dir("public")))
	goji.Serve()
}

func databaseJsonHandler(ctx web.C, res http.ResponseWriter, req *http.Request) {
	genre := req.URL.Query().Get("genre")
	artist := req.URL.Query().Get("artist")
	encoder := json.NewEncoder(res)
	encoder.Encode(getDatabase(genre, artist))
}

func genreJsonHandler(ctx web.C, res http.ResponseWriter, req *http.Request) {
	encoder := json.NewEncoder(res)
	encoder.Encode(getGenre())
}

func artistJsonHandler(ctx web.C, res http.ResponseWriter, req *http.Request) {
	genre := req.URL.Query().Get("genre")
	encoder := json.NewEncoder(res)
	encoder.Encode(getArtist(genre))
}

func escapeKeyword(keyword string) string {
	return strings.Replace(keyword, "'", "''", -1)
}

func getDatabase(genre string, artist string) []Item {
	_genre := escapeKeyword(genre)
	if _genre == "" {
		_genre = "%"
	}
	_artist := escapeKeyword(artist)
	if _artist == "" {
		_artist = "%"
	}

	dbmap := openDb()
	defer dbmap.Db.Close()
	var items []Item
	_, _ = dbmap.Select(&items, "SELECT * FROM database WHERE genre LIKE '"+_genre+"' AND artist LIKE '"+_artist+"' ORDER BY artist ASC, title ASC")
	return items
}

func getGenre() []string {
	dbmap := openDb()
	defer dbmap.Db.Close()

	var items []Item
	_, _ = dbmap.Select(&items, "SELECT DISTINCT genre FROM database ORDER BY genre ASC")
	var genre []string
	for _, item := range items {
		genre = append(genre, item.Genre)
	}
	return genre
}

func getArtist(genre string) []string {
	_genre := escapeKeyword(genre)
	if _genre == "" {
		_genre = "%"
	}

	dbmap := openDb()
	defer dbmap.Db.Close()

	var items []Item
	_, _ = dbmap.Select(&items, "SELECT DISTINCT artist FROM database WHERE genre LIKE '"+_genre+"' ORDER BY artist ASC")
	var artist []string
	for _, item := range items {
		artist = append(artist, item.Artist)
	}
	return artist
}

func openDb() *gorp.DbMap {
	db, err := sql.Open("sqlite3", "./CDDatabase.db3")
	if err != nil {
		panic(err.Error())
	}
	return &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}
}
