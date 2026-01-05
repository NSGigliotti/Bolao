using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bolao_Backend.Migrations
{
    /// <inheritdoc />
    public partial class FixPredictionUserIdType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prediction_Users_UserId1",
                table: "Prediction");

            migrationBuilder.DropIndex(
                name: "IX_Prediction_UserId1",
                table: "Prediction");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Prediction");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Prediction",
                type: "char(36)",
                nullable: false,
                collation: "ascii_general_ci",
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Prediction_UserId",
                table: "Prediction",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Prediction_Users_UserId",
                table: "Prediction",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prediction_Users_UserId",
                table: "Prediction");

            migrationBuilder.DropIndex(
                name: "IX_Prediction_UserId",
                table: "Prediction");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Prediction",
                type: "int",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "Prediction",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Prediction_UserId1",
                table: "Prediction",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Prediction_Users_UserId1",
                table: "Prediction",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
