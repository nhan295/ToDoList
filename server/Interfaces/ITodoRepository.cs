using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Data;
using server.Models;


namespace server.Interfaces
{
    public interface ITodoRepository
    {
        Task<TodoItem> CreateAsync(TodoItem TodoItem);
        Task<List<TodoItem>> GetUserItemsAsync(string userId);

        Task<TodoItem?> GetByIdAsync(int id, string userId);

        Task<bool> DeleteAsync(TodoItem todoItem);
        Task<TodoItem> UpdateAsync(TodoItem todoItem);
        Task<List<TodoItem>> SearchAsync(string searchItem, string userId);
    }
}