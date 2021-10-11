# SupervisorNotifications
SupervisorNotifications Full Stack Engineer coding challenge for LightFeather.IO

To run the code:
1) Open the "SupervisorNotifications.sln" solution in MS Visual Studio 2019.
2) On the top icons make sure that you use:
   A) The "Debug" configuration
   B) Next to it change the default "IIS Express" and select instead "SupervisorNotifications".
      (This will allow the "Console" window to show up with some messages).
3) In your "Solution Explorer" right-click at the top "SupervisorNotifications" solution and select "Clean Solution".
   Check that it finishes correctly, you should see "Clean" and "succeeded" messages.
   Right-click again on the solution and select this time "Rebuild Solution".
   Check that it finishes correctly, too, you should see "Rebuild All" and "succeeded" or similar messages.
4) Now run the code by pressing F5 ("Debug" => "Start Debugging" from the top menu).


Important Components:
1) The SupervisorNotifications.csproj (project) uses .NET Core 3.1.
   You will need to install from Microsoft a "developer pack" of it if you don't have it.
2) During the initial loading of this solution, NuGet should correctly restore these 2 packages: 
   A) "Newtonsoft.Json" Version="13.0.1"
   B) "System.Net.Http.Formatting.Extension" Version="5.2.3"
 