var builder = DistributedApplication.CreateBuilder(args);

var connectionString = builder.AddConnectionString("Database").Resource;
var sql = builder.AddSqlServer("sql")
                 .WithConnectionStringRedirection(connectionString)
                 .AddDatabase("MarushCare");

var api = builder.AddProject<Projects.Gmf_Marush_Care_Api>("marush-care-api")
    .WithReference(sql);
builder.AddJavaScriptApp("marush-care-app", "../Site/Gmf.Marush.Care.App", "start:aspire")
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(port: 4200, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithExplicitStart();

builder.Build().Run();
