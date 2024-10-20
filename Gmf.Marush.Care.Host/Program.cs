var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.Gmf_Marush_Care_Api>("gmf-marush-care-api");
//builder.AddProject<Projects.Gmf_Marush_Care_App>("gmf-marush-care-app");

builder.Build().Run();
