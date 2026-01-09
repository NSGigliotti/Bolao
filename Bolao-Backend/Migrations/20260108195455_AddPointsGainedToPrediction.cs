using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bolao_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPointsGainedToPrediction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PointsGained",
                table: "Prediction",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PointsGained",
                table: "Prediction");
        }
    }
}
