using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;

namespace server.Dtos.ToDoItem
{
    public class TodoItemDto
    {
        public int Id { get; set; }
        public string Title {get; set;}
        public string Description {get; set;}
        public DateTime DueDate {get; set;}
        public Priority Priority {get; set;}
        public TodoStatus Status { get; set; }
        

    }
}