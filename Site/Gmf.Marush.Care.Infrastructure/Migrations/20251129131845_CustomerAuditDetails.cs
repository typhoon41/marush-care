using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gmf.Marush.Care.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CustomerAuditDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastEditAt",
                table: "CustomerProperties",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "LastEditedById",
                table: "CustomerProperties",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_CustomerProperties_LastEditedById",
                table: "CustomerProperties",
                column: "LastEditedById");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerProperties_Users_LastEditedById",
                table: "CustomerProperties",
                column: "LastEditedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerProperties_Users_LastEditedById",
                table: "CustomerProperties");

            migrationBuilder.DropIndex(
                name: "IX_CustomerProperties_LastEditedById",
                table: "CustomerProperties");

            migrationBuilder.DropColumn(
                name: "LastEditAt",
                table: "CustomerProperties");

            migrationBuilder.DropColumn(
                name: "LastEditedById",
                table: "CustomerProperties");
        }
    }
}
