const mysql = require('mysql2/promise');

async function checkK() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'bolao_db'
  });

  const [rows] = await connection.execute("SELECT m.Id, m.HomeTeamId, h.Name AS Home, m.AwayTeamId, a.Name AS Away, m.HomeTeamScore, m.AwayTeamScore FROM Matches m JOIN Teams h ON m.HomeTeamId = h.Id JOIN Teams a ON m.AwayTeamId = a.Id WHERE h.`Group` = 'K' OR a.`Group` = 'K'");
  console.log("Matches in Group K:");
  console.table(rows);

  const [teams] = await connection.execute("SELECT Id, Name, `Group`, Points, GamesPlayed FROM Teams WHERE `Group` = 'K'");
  console.log("Teams in Group K:");
  console.table(teams);

  await connection.end();
}

checkK().catch(console.error);
