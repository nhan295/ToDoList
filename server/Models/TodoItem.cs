using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace server.Models
{
    public class TodoItem
    {
        public int Id {get;set;}
        [Required, MaxLength(100)]
        public string Title { get; set; } = string.Empty;
        public string Description {get; set;} = string.Empty;
        public DateTime DueDate {get; set; }
        public Priority Priority {get; set; } = Priority.Medium;
         public TodoStatus Status { get; set; }
            = TodoStatus.Pending;
        public DateTime CreateAt {get; set;} = DateTime.UtcNow;
        public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;

        public string AppUserId {get; set;} = string.Empty;
        public AppUser? AppUser {get; set;}
    }

    public enum Priority {Low,Medium,High}
    public enum TodoStatus {Pending,InProgress,Completed}
}