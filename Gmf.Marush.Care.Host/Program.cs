var builder = DistributedApplication.CreateBuilder(args);

var connectionString = builder.AddConnectionString("Database").Resource;
var sql = builder.AddSqlServer("sql")
                 .WithConnectionStringRedirection(connectionString)
                 .AddDatabase("MarushCare");

builder.AddProject<Projects.Gmf_Marush_Care_Api>("gmf-marush-care-api")
    .WithReference(sql);
//builder.AddProject<Projects.Gmf_Marush_Care_App>("gmf-marush-care-app");

builder.Build().Run();
