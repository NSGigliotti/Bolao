using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bolao_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCardsToTeamsAndMatches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RedCards",
                table: "Teams",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "YellowCards",
                table: "Teams",
                type: "int",
                nullable: false,
                defaultValue: 0);

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RedCards",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "YellowCards",
                table: "Teams");

        }
    }
}
