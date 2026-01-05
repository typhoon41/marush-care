var builder = DistributedApplication.CreateBuilder(args);

var connectionString = builder.AddConnectionString("Database").Resource;
var sql = builder.AddSqlServer("sql")
                 .WithConnectionStringRedirection(connectionString)
                 .AddDatabase("MarushCare");

var api = builder.AddProject<Projects.Gmf_Marush_Care_Api>("gmf-marush-care-api")
    .WithReference(sql);
builder.AddJavaScriptApp("gmf-marush-care-app", "../Site/Gmf.Marush.Care.App", "start")
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(port: 4200, env: "PORT");

builder.Build().Run();
