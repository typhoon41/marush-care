# Welcome to "Marush: Space of Care" project!

Purpose of this project is to hold source code for Marush: Space of Care beauty salon (https://marushcare.com).

# Things you need to do in order to run Marush locally

* Have the latest Visual Studio (Code)
* Install the latest LTS Node.js and NPM from https://nodejs.org/en
* Install Docker Desktop from https://www.docker.com
* Install Entity framework Core Migrations tool from https://learn.microsoft.com/en-us/ef/core/cli/
* Follow MigrationCommands from <strong>Gmf.Marush.Care.Infrastructure</strong> to initialize your database.
* Add user secrets by right clicking on <strong>Gmf.Marush.Care.Api</strong> project and hitting <em>"Manage User Secrets"</em>. 
* 
## Setup secrets file
For development, to generate your own Jwt:Key, you can use PowerShell: 
```ps
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Minimum 0 -Maximum 256}))
```
Fill out the following JSON or reach out to fellow developer.
```json
{
  "ConnectionStrings:MarushCare": "",
  "Smtp:Server": "",
  "Smtp:Port": "",
  "Smtp:From": "",
  "Smtp:Username": "",
  "Smtp:Password": "",
  "Developer:Email": "",
  "Jwt:Key": "",
  "Jwt:Issuer": "",
  "Jwt:Audience": "",
  "Jwt:TokenExpiryTime": ""
}
```