using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gmf.Marush.Care.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoveCalendarEntryMoneyAndTreatmentsToAppointment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Money",
                table: "Appointments",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppointmentTreatments",
                columns: table => new
                {
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    AppointmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppointmentTreatments", x => new { x.AppointmentId, x.Name });
                    table.ForeignKey(
                        name: "FK_AppointmentTreatments_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql("""
                UPDATE Appointments
                SET Money = CalendarEntries.Money
                FROM Appointments
                INNER JOIN CalendarEntries ON CalendarEntries.AppointmentId = Appointments.Id
                WHERE CalendarEntries.Money IS NOT NULL;
                """);

            migrationBuilder.Sql("""
                INSERT INTO AppointmentTreatments (AppointmentId, Name)
                SELECT CalendarEntries.AppointmentId, CalendarEntryTreatments.Name
                FROM CalendarEntryTreatments
                INNER JOIN CalendarEntries ON CalendarEntries.Id = CalendarEntryTreatments.CalendarEntryId;
                """);

            migrationBuilder.DropTable(
                name: "CalendarEntryTreatments");

            migrationBuilder.DropColumn(
                name: "Money",
                table: "CalendarEntries");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Money",
                table: "CalendarEntries",
                type: "decimal(10,2)",
                precision: 10,
                scale: 2,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CalendarEntryTreatments",
                columns: table => new
                {
                    CalendarEntryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalendarEntryTreatments", x => new { x.CalendarEntryId, x.Name });
                    table.ForeignKey(
                        name: "FK_CalendarEntryTreatments_CalendarEntries_CalendarEntryId",
                        column: x => x.CalendarEntryId,
                        principalTable: "CalendarEntries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Online requests without an entry have nowhere to keep their treatments before this migration.
            migrationBuilder.Sql("""
                UPDATE CalendarEntries
                SET Money = Appointments.Money
                FROM CalendarEntries
                INNER JOIN Appointments ON Appointments.Id = CalendarEntries.AppointmentId
                WHERE Appointments.Money IS NOT NULL;
                """);

            migrationBuilder.Sql("""
                INSERT INTO CalendarEntryTreatments (CalendarEntryId, Name)
                SELECT CalendarEntries.Id, AppointmentTreatments.Name
                FROM AppointmentTreatments
                INNER JOIN CalendarEntries ON CalendarEntries.AppointmentId = AppointmentTreatments.AppointmentId;
                """);

            migrationBuilder.DropTable(
                name: "AppointmentTreatments");

            migrationBuilder.DropColumn(
                name: "Money",
                table: "Appointments");
        }
    }
}
