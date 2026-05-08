using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Data;
using server.Interfaces;
using server.Models;
using Microsoft.EntityFrameworkCore;


namespace server.Repository
{
    public class ToDoItemRepository : ITodoRepository
    {
        private readonly ApplicationDBContext _context;

        public ToDoItemRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<TodoItem> CreateAsync(TodoItem todoItem)
        {
            await _context.TodoItems.AddAsync(todoItem);
            await _context.SaveChangesAsync();
            return todoItem;
        }

         public async Task<List<TodoItem>> GetUserItemsAsync(string userId)
        {
            return await _context.TodoItems
                .Where(x => x.AppUserId == userId)
                .ToListAsync();
        }

        public async Task<TodoItem?> GetByIdAsync(int id, string userId)
        {
            return await _context.TodoItems
                .FirstOrDefaultAsync(x =>
                    x.Id == id &&
                    x.AppUserId == userId);
        }

         public async Task<bool> DeleteAsync(TodoItem todoItem)
        {
            _context.TodoItems.Remove(todoItem);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<TodoItem> UpdateAsync(TodoItem todoItem)
        {
            await _context.SaveChangesAsync();
            return todoItem;
        }

        public async Task<List<TodoItem>>SearchAsync(string searchItem,string userId)
        {
             return await _context.TodoItems.Where(x =>
                x.AppUserId == userId &&
            (
                x.Title.ToLower().Contains(searchItem.ToLower()) ||
                x.Description.ToLower().Contains(searchItem.ToLower())
            )
        )
        .ToListAsync();
            
        }

    }
}