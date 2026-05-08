using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;

namespace server.Dtos.ToDoItem
{
    public class UpdateItemDto
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime DueDate { get; set; }

        public Priority Priority { get; set; }

        public TodoStatus Status { get; set; }
    }
}