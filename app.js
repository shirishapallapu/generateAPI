const express = require("express");
const path = require("path");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
module.exports = app;
app.use(express.json());
const dbPath = path.join(__dirname,"cricketTeam.db");
let db = null;
const initializeDbAndServer = async()=>{
   try{ db = await open({filename:dbPath,
    driver:sqlite3.Database});
    app.listen(3000);
}
catch(e){
    console.log(`DB Error:${e.message}`);
    process.exit(1);
}
};
app.get("/players/",async(request,response)=>{
    const getPlayerListQuery = `SELECT * FROM cricketTeam 
    ORDER BY player_id;`;
    const playersList = await db.all(getPlayerListQuery);
    response.send(playersList);


});
app.post("/players/",async(request,response)=>{
    const playerDetails = request.body;
    const {player_id,player_name,jersey_name,role} = playerDetails;
    const addPlayerQuery = `INSERT INTO cricketTeam(player_id,player_name,jersey_name,role)
    VALUES(${player_id},${player_name},${jersey_name},${role});`;
    const dbResponse = await db.run(addPlayerQuery);
    response.send("Player Added to Team");
});

app.get("/players/:playerId/",async (request,response)=>{
    const {player_id} = request.params;
    const getPlayerDetailsQuery = `SELECT * FROM 
    cricketTeam 
    WHERE player_id = ${player_id};`;
    const player = await db.get(getPlayerDetailsQuery);
    response.send(player);
});

app.put("/players/:player_id",async (request,response)=>{
    const {player_id} = request.params;
    const player_details = request.body;
    const {player_id,player_name,jersey_name,role} = player_details;
    const updatePlayerDetailsQuery = 'UPDATE 
    cricketTeam SET 
    player_id = ${player_id},
    player_name = ${player_name},
    jersey_name = ${jersey_name},
    role = ${role}
    WHERE player_id = ${player_id};
    ';
    await db.run(updatePlayerDetailsQuery);
    response.send("Player Details Updated");

});

app.delete("/players/:player_id",async(request,response)=>{
    const {player_id} = request.params;
    const deletePlayerQuery = `DELETE FROM cricketTeam 
    WHERE player_id = ${player_id};`;
    await db.run(deletePlayerQuery);
    response.send("Player Removed");
});


