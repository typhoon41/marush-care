using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Gmf.Marush.Care.Infrastructure.Migrations;

/// <inheritdoc />
public partial class CustomerProperties : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AlterColumn<string>(
            name: "Language",
            table: "Appointments",
            type: "nvarchar(2)",
            maxLength: 2,
            nullable: true,
            oldClrType: typeof(string),
            oldType: "nvarchar(2)",
            oldMaxLength: 2);

        _ = migrationBuilder.AlterColumn<DateTimeOffset>(
            name: "ExpectedEndTime",
            table: "Appointments",
            type: "datetimeoffset",
            nullable: true,
            oldClrType: typeof(DateTimeOffset),
            oldType: "datetimeoffset");

        _ = migrationBuilder.AlterColumn<string>(
            name: "Email",
            table: "Appointments",
            type: "nvarchar(100)",
            nullable: true,
            oldClrType: typeof(string),
            oldType: "nvarchar(100)");

        _ = migrationBuilder.CreateTable(
            name: "CustomerProperties",
            columns: table => new
            {
                CustomerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                DateOfBirth = table.Column<DateOnly>(type: "date", nullable: false),
                PlaceOfResidence = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                Diagnosis = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                Allergies = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                Comments = table.Column<string>(type: "nvarchar(max)", maxLength: 4096, nullable: false),
                Notes = table.Column<string>(type: "nvarchar(max)", maxLength: 4096, nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_CustomerProperties", x => x.CustomerId);
                _ = table.ForeignKey(
                    name: "FK_CustomerProperties_Customers_CustomerId",
                    column: x => x.CustomerId,
                    principalTable: "Customers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropTable(
            name: "CustomerProperties");

        _ = migrationBuilder.AlterColumn<string>(
            name: "Language",
            table: "Appointments",
            type: "nvarchar(2)",
            maxLength: 2,
            nullable: false,
            defaultValue: "",
            oldClrType: typeof(string),
            oldType: "nvarchar(2)",
            oldMaxLength: 2,
            oldNullable: true);

        _ = migrationBuilder.AlterColumn<DateTimeOffset>(
            name: "ExpectedEndTime",
            table: "Appointments",
            type: "datetimeoffset",
            nullable: false,
            defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)),
            oldClrType: typeof(DateTimeOffset),
            oldType: "datetimeoffset",
            oldNullable: true);

        _ = migrationBuilder.AlterColumn<string>(
            name: "Email",
            table: "Appointments",
            type: "nvarchar(100)",
            nullable: false,
            defaultValue: "",
            oldClrType: typeof(string),
            oldType: "nvarchar(100)",
            oldNullable: true);
    }
}
