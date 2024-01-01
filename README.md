# FarmApp
Application for the person having farm

#Migrations 
Drop-Database -Context EntityDbContext -p Infrastructure -s MyAPI 
Remove-Migration -Context EntityDbContext -p Infrastructure -s MyAPI 
Update-Database -Context EntityDbContext

Drop-Database -Context AppIdentityDbContext -p Infrastructure -s MyAPI 
Remove-Migration -Context AppIdentityDbContext -p Infrastructure -s MyAPI 
Update-Database -Context AppIdentityDbContext

Add-Migration InitialCreate -p Infrastructure -s MyAPI -c EntityDbContext -o Data/Migrations 
Add-Migration IdentityInitial -p Infrastructure -s MyAPI -c AppIdentityDbContext -o Identity/Migrations 

--Update-Database -Context EntityDbContext
--Update-Database -Context AppIdentityDbContext

#CONFIG SECRET

dotnet user-secrets list
type .\secrets.json | dotnet user-secrets set
dotnet user-secrets set "KEY" "VALUE" --project "C:\apps\WebApp1\src\WebApp1"
dotnet user-secrets clear

#ENABLE HTTPS

https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl?view=aspnetcore-8.0&tabs=visual-studio%2Clinux-ubuntu

https://www.altcademy.com/blog/how-to-enable-https-in-reactjs/#:~:text=Implementing%20HTTPS%20in%20ReactJS,-Now%20that%20we&text=By%20default%2C%20it%20uses%20HTTP,tweaking%20the%20npm%20start%20script.&text=Here%2C%20HTTPS%3Dtrue%20tells%20the,key%20files%20we%20generated%20earlier.
