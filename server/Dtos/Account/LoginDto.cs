using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace server.Dtos.Account
{
    public class LoginDto
    {
        [Required]
        public string? Username {get; set;} = string.Empty;
        [Required]
        public string? Password {get; set;} = string.Empty;
    }
}