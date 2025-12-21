using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gmf.Marush.Care.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentStatusPerformed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AppointmentStatus",
                columns: new[] { "Id", "Name" },
                values: new object[] { new Guid("4f8b1835-c724-4635-bef7-30b2f1c37965"), "Performed" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AppointmentStatus",
                keyColumn: "Id",
                keyValue: new Guid("4f8b1835-c724-4635-bef7-30b2f1c37965"));
        }
    }
}
