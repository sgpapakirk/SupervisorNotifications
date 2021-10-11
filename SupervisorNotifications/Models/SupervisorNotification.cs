using System.ComponentModel.DataAnnotations;

namespace SupervisorNotifications.Models
{
    public class SupervisorNotification
    {
        [Required(ErrorMessage = "FirstName is required")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "LastName is required")]
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Supervisor is required")]
        public string Supervisor { get; set; }
    }
}