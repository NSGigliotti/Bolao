using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bolao_Backend.Migrations
{
    /// <inheritdoc />
    public partial class MakeTeamIdsNullableV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Safety: Try to drop foreign keys if they were partially created (using stored-procedure-like logic for MySQL)
            migrationBuilder.Sql(@"
                SET @exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Prediction_Teams_AwayTeamId' AND TABLE_NAME = 'Prediction' AND TABLE_SCHEMA = DATABASE());
                SET @query = IF(@exists > 0, 'ALTER TABLE Prediction DROP FOREIGN KEY FK_Prediction_Teams_AwayTeamId', 'SELECT 1');
                PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;");

            migrationBuilder.Sql(@"
                SET @exists = (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_NAME = 'FK_Prediction_Teams_HomeTeamId' AND TABLE_NAME = 'Prediction' AND TABLE_SCHEMA = DATABASE());
                SET @query = IF(@exists > 0, 'ALTER TABLE Prediction DROP FOREIGN KEY FK_Prediction_Teams_HomeTeamId', 'SELECT 1');
                PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;");

            // Safety: Try to drop indexes if they were partially created
            migrationBuilder.Sql(@"
                SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE INDEX_NAME = 'IX_Prediction_AwayTeamId' AND TABLE_NAME = 'Prediction' AND TABLE_SCHEMA = DATABASE());
                SET @query = IF(@exists > 0, 'DROP INDEX IX_Prediction_AwayTeamId ON Prediction', 'SELECT 1');
                PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;");

            migrationBuilder.Sql(@"
                SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE INDEX_NAME = 'IX_Prediction_HomeTeamId' AND TABLE_NAME = 'Prediction' AND TABLE_SCHEMA = DATABASE());
                SET @query = IF(@exists > 0, 'DROP INDEX IX_Prediction_HomeTeamId ON Prediction', 'SELECT 1');
                PREPARE stmt FROM @query; EXECUTE stmt; DEALLOCATE PREPARE stmt;");

            migrationBuilder.AlterColumn<int>(
                name: "HomeTeamId",
                table: "Prediction",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "AwayTeamId",
                table: "Prediction",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            // Clean up invalid data in Prediction table (e.g., 0 values that don't match any Team)
            migrationBuilder.Sql("UPDATE Prediction SET HomeTeamId = NULL WHERE (HomeTeamId IS NOT NULL AND HomeTeamId NOT IN (SELECT Id FROM Teams)) OR HomeTeamId = 0;");
            migrationBuilder.Sql("UPDATE Prediction SET AwayTeamId = NULL WHERE (AwayTeamId IS NOT NULL AND AwayTeamId NOT IN (SELECT Id FROM Teams)) OR AwayTeamId = 0;");

            migrationBuilder.AddForeignKey(
                name: "FK_Prediction_Teams_AwayTeamId",
                table: "Prediction",
                column: "AwayTeamId",
                principalTable: "Teams",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Prediction_Teams_HomeTeamId",
                table: "Prediction",
                column: "HomeTeamId",
                principalTable: "Teams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prediction_Teams_AwayTeamId",
                table: "Prediction");

            migrationBuilder.DropForeignKey(
                name: "FK_Prediction_Teams_HomeTeamId",
                table: "Prediction");

            migrationBuilder.AlterColumn<int>(
                name: "HomeTeamId",
                table: "Prediction",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "AwayTeamId",
                table: "Prediction",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Prediction_Teams_AwayTeamId",
                table: "Prediction",
                column: "AwayTeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Prediction_Teams_HomeTeamId",
                table: "Prediction",
                column: "HomeTeamId",
                principalTable: "Teams",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
