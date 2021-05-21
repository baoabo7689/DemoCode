const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/game-data', (req, res) => {
	let gameData = [
		{ "gameId":1,  "iconSize":"big", "sortOrder":6 }, 
		{ "gameId":2,  "iconSize":"small", "sortOrder":4 }, 
		{ "gameId":3, "iconSize":"medium", "sortOrder":2 }, 
		{ "gameId":4, "iconSize":"small", "sortOrder":5 }, 
		{ "gameId":5, "iconSize":"small", "sortOrder":8, "chips":[] }, 
		{ "gameId":6, "iconSize":"small", "sortOrder":7 }, 
		{ "gameId":7, "iconSize":"big", "sortOrder":1, "chips":[] }, 
		{ "gameId":8, "iconSize":"small", "sortOrder":3 }, 
		{ "gameId":10, "iconSize":"big", "sortOrder":9 }, 
		{ "gameId":20, "iconSize":"big", "sortOrder":10 }];	
		
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);


	res.send(gameData);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})