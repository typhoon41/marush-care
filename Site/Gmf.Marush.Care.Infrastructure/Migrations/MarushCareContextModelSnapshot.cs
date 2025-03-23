﻿// <auto-generated />
using System;
using Gmf.Marush.Care.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Gmf.Marush.Care.Infrastructure.Migrations
{
    [DbContext(typeof(MarushCareContext))]
    partial class MarushCareContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments.AppointmentDto", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("CustomerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTimeOffset>("ExpectedEndTime")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Language")
                        .IsRequired()
                        .HasMaxLength(2)
                        .HasColumnType("nvarchar(2)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(16)");

                    b.Property<DateTimeOffset>("ScheduledFor")
                        .HasColumnType("datetimeoffset");

                    b.Property<Guid>("StatusId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("StatusId");

                    b.HasIndex("CustomerId", "Email");

                    b.HasIndex("CustomerId", "Phone");

                    b.ToTable("Appointments", (string)null);
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments.AppointmentStatusDto", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.ToTable("AppointmentStatus", (string)null);

                    b.HasData(
                        new
                        {
                            Id = new Guid("c932c2d0-ac07-4f10-a1f9-a934175881f2"),
                            Name = "Requested"
                        },
                        new
                        {
                            Id = new Guid("26c7dd9f-b501-4116-8438-00a5549d2555"),
                            Name = "Rejected"
                        },
                        new
                        {
                            Id = new Guid("b14a3e57-15c6-4de2-bd70-431e00e14520"),
                            Name = "Approved"
                        });
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerDto", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.ToTable("Customers", (string)null);
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerEmailDto", b =>
                {
                    b.Property<Guid>("CustomerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Email")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("CustomerId", "Email");

                    b.ToTable("CustomerEmails", (string)null);
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerPhoneDto", b =>
                {
                    b.Property<Guid>("CustomerId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("PhoneNumber")
                        .HasMaxLength(16)
                        .HasColumnType("nvarchar(16)");

                    b.HasKey("CustomerId", "PhoneNumber");

                    b.ToTable("CustomerPhones", (string)null);
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.UserDto", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("nvarchar(512)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("nvarchar(64)");

                    b.HasKey("Id");

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments.AppointmentDto", b =>
                {
                    b.HasOne("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerDto", "Customer")
                        .WithMany("Appointments")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments.AppointmentStatusDto", "Status")
                        .WithMany("Appointments")
                        .HasForeignKey("StatusId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerEmailDto", "CustomerEmail")
                        .WithMany("Appointments")
                        .HasForeignKey("CustomerId", "Email")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerPhoneDto", "CustomerPhone")
                        .WithMany("Appointments")
                        .HasForeignKey("CustomerId", "Phone")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Customer");

                    b.Navigation("CustomerEmail");

                    b.Navigation("CustomerPhone");

                    b.Navigation("Status");
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerEmailDto", b =>
                {
                    b.HasOne("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerDto", "Customer")
                        .WithMany("Emails")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerPhoneDto", b =>
                {
                    b.HasOne("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerDto", "Customer")
                        .WithMany("Phones")
                        .HasForeignKey("CustomerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments.AppointmentStatusDto", b =>
                {
                    b.Navigation("Appointments");
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerDto", b =>
                {
                    b.Navigation("Appointments");

                    b.Navigation("Emails");

                    b.Navigation("Phones");
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerEmailDto", b =>
                {
                    b.Navigation("Appointments");
                });

            modelBuilder.Entity("Gmf.Marush.Care.Infrastructure.Data.Entities.Customers.CustomerPhoneDto", b =>
                {
                    b.Navigation("Appointments");
                });
#pragma warning restore 612, 618
        }
    }
}
