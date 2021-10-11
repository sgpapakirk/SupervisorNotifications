﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SupervisorNotifications.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SupervisorNotifications.APIControllers
{
    //[Route("api/[controller]")]
    [Route("api")]
    [ApiController]
    public class SupervisorNotificationsController : ControllerBase
    {
        private readonly IConfiguration _Configuration;

        /// <summary>
        /// SupervisorNotificationsController
        /// </summary>
        /// <param name="configuration"></param>
        public SupervisorNotificationsController(IConfiguration configuration)
        {
            _Configuration = configuration;
        }

        [HttpGet("supervisors")]
        [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetSupervisors()
        {
            try
            {
                string managersURL = _Configuration.GetSection("AppSettings:ManagersURL").Value;
                if (string.IsNullOrEmpty(managersURL))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError,
                                      "Server configuration error: Can't determine the managers' URL");
                }

                using (var httpClient = new HttpClient())
                {
                    HttpResponseMessage responseMessage = await httpClient.GetAsync(managersURL);
                    if (responseMessage.IsSuccessStatusCode)
                    {
                        //Problem with the responseMessage.Content.ReadAsAsync<T>() method missing.
                        //Added & used the "System.Net.Http.Formatting.Extension" NuGet package.
                        var managers = await responseMessage.Content.ReadAsAsync<IEnumerable<Manager>>();

                        int numericJurisdiction;
                        IEnumerable<string> supervisors = from e in managers
                                                          where !int.TryParse(e.Jurisdiction, out numericJurisdiction)
                                                          orderby e.Jurisdiction, e.LastName, e.FirstName
                                                          select string.Format("{0} - {1}, {2}", e.Jurisdiction, e.LastName, e.FirstName);

                        return Ok(supervisors);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError,
                                          string.Format("Server error: The managers' URL call returned: Status code: {0} ({1})  Error: {2}",
                                                        (int)responseMessage.StatusCode, responseMessage.StatusCode, responseMessage.ReasonPhrase));
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                  string.Concat("Server error: ", ex.Message));
            }
        }

        [HttpPost("submit")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(string), StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public IActionResult CreateSupervisorNotification([FromBody] SupervisorNotification supervisorNotification)
        {
            try
            {
                Console.WriteLine("Submitted supervisorNotification object:");
                if (supervisorNotification == null)
                {
                    Console.WriteLine("null object");
                }
                else
                {
                    Console.WriteLine("FirstName: {0}", supervisorNotification.FirstName);
                    Console.WriteLine("LastName: {0}", supervisorNotification.LastName);
                    Console.WriteLine("Email: {0}", supervisorNotification.Email);
                    Console.WriteLine("PhoneNumber: {0}", supervisorNotification.PhoneNumber);
                    Console.WriteLine("Supervisor: {0}", supervisorNotification.Supervisor);
                }

                //Check the passed model state to see if there are any errors:
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                                  string.Concat("Server error: ", ex.Message));
            }
        }
    }
}