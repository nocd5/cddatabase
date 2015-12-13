package main

import (
	"database/sql"
	"encoding/json"
	"github.com/coopernurse/gorp"
	_ "github.com/mattn/go-sqlite3"
	"github.com/zenazn/goji"
	"github.com/zenazn/goji/web"
	"net/http"
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
	encoder := json.NewEncoder(res)
	encoder.Encode(getDatabase())
}

func genreJsonHandler(ctx web.C, res http.ResponseWriter, req *http.Request) {
	encoder := json.NewEncoder(res)
	encoder.Encode(getGenre())
}

func artistJsonHandler(ctx web.C, res http.ResponseWriter, req *http.Request) {
	encoder := json.NewEncoder(res)
	encoder.Encode(getArtist())
}

func getDatabase() []Item {
	dbmap := openDb()
	defer dbmap.Db.Close()
	var items []Item
	_, _ = dbmap.Select(&items, "SELECT * FROM database")
	return items
}

func getGenre() []string {
	dbmap := openDb()
	defer dbmap.Db.Close()

	var items []Item
	_, _ = dbmap.Select(&items, "SELECT DISTINCT genre FROM database")
	var genre []string
	for _, item := range items {
		genre = append(genre, item.Genre)
	}
	return genre
}

func getArtist() []Item {
	dbmap := openDb()
	defer dbmap.Db.Close()

	var items []Item
	_, _ = dbmap.Select(&items, "SELECT DISTINCT artist, genre FROM database")
	return items
}

func openDb() *gorp.DbMap {
	db, err := sql.Open("sqlite3", "./CDDatabase.db3")
	if err != nil {
		panic(err.Error())
	}
	return &gorp.DbMap{Db: db, Dialect: gorp.SqliteDialect{}}
}
