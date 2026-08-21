using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gmf.Marush.Care.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MoveCalendarEntryNotesToAppointmentDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE Appointments
                SET Description = CalendarEntries.Notes
                FROM Appointments
                INNER JOIN CalendarEntries ON CalendarEntries.AppointmentId = Appointments.Id
                WHERE CalendarEntries.Notes IS NOT NULL AND LTRIM(RTRIM(CalendarEntries.Notes)) <> '';
                """);

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "CalendarEntries");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "CalendarEntries",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE CalendarEntries
                SET Notes = Appointments.Description
                FROM CalendarEntries
                INNER JOIN Appointments ON Appointments.Id = CalendarEntries.AppointmentId
                WHERE Appointments.Description <> '';
                """);
        }
    }
}
