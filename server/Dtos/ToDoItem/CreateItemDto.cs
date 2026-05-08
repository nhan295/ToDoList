using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using server.Models;

namespace server.Dtos.ToDoItem
{
    public class CreateItemDto
    {

        [Required]
        [MaxLength(100)]
        public string Title {get; set;} = string.Empty;
        public string Description {get; set;} = string.Empty;

        public DateTime DueDate {get; set;} = DateTime.Now.AddDays(7);

        public Priority Priority {get; set;} = Priority.Medium;

        public TodoStatus Status { get; set; } = TodoStatus.Pending;


    }
}