var builder = DistributedApplication.CreateBuilder(args);

// A persistent container on a fixed port keeps development data between runs and lets SSMS connect to
// localhost,14330. Aspire generates the sa password once and keeps it in this project's user secrets.
var sql = builder.AddSqlServer("sql", port: 14330)
                 .WithLifetime(ContainerLifetime.Persistent)
                 .WithDataVolume()
                 .AddDatabase("MarushCare");

// Kept in this project's user secrets after the first run, so a fresh clone needs no hand-made JWT key.
var jwtKey = builder.AddParameter("jwt-key", new GenerateParameterDefault { MinLength = 44, Special = false },
    secret: true, persist: true);

var api = builder.AddProject<Projects.Gmf_Marush_Care_Api>("marush-care-api")
    .WithReference(sql)
    .WaitFor(sql)
    .WithEnvironment("Jwt__Key", jwtKey);
builder.AddJavaScriptApp("marush-care-app", "../Site/Gmf.Marush.Care.App", "start:aspire")
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(port: 4200, env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
