using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gmf.Marush.Care.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAppointmentBookedOnline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "BookedOnline",
                table: "Appointments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            // What the calendar draws as an online request today: Requested or Approved with no entry.
            // Only the public booking creates those (calendar appointments always get an entry, clients-page
            // ones are Performed). Requests already saved as entries cannot be told apart and stay unmarked.
            migrationBuilder.Sql("""
                UPDATE Appointments
                SET BookedOnline = 1
                WHERE StatusId IN ('c932c2d0-ac07-4f10-a1f9-a934175881f2', 'b14a3e57-15c6-4de2-bd70-431e00e14520')
                  AND NOT EXISTS (SELECT 1 FROM CalendarEntries WHERE CalendarEntries.AppointmentId = Appointments.Id);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookedOnline",
                table: "Appointments");
        }
    }
}
