const mysql = require('mysql2/promise');

async function checkThirds() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'bolao_db'
  });

  const [teams] = await connection.execute("SELECT Id, Name, `Group`, Points, GoalsFor, GoalsAgainst, GamesPlayed FROM Teams WHERE `Group` = 'K'");
  
  teams.forEach(t => t.GD = t.GoalsFor - t.GoalsAgainst);
  console.table(teams);

  await connection.end();
}

checkThirds().catch(console.error);
