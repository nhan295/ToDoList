using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;
using server.Dtos.ToDoItem;
using server.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Diagnostics.Tracing;
using System.ComponentModel.DataAnnotations;
using System.Security.Principal;
using System.Security.Claims;

namespace server.Controllers
{
    [Route("api/todoitem")]
    [ApiController]
    [Authorize]
    public class ToDoItemController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly UserManager<AppUser> _userManager;

        public ToDoItemController(ApplicationDBContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("create")]
        public async Task<ActionResult<TodoItem>> CreateItem(CreateItemDto createItemDto)
        {
            var userId = User.GetUserId();
 
            var todoItem = new TodoItem
            {
                Title = createItemDto.Title,
                Description = createItemDto.Description,
                DueDate = DateTime.SpecifyKind(createItemDto.DueDate, DateTimeKind.Utc),
                Priority = createItemDto.Priority,
                Status = createItemDto.Status,

                AppUserId = userId
            };

            await _context.TodoItems.AddAsync(todoItem);
            await _context.SaveChangesAsync();

            return Ok(todoItem);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult>DeleteItem(int id)
        {
            var userId = User.GetUserId();
            var todoItem = await _context.TodoItems.FirstOrDefaultAsync(x => x.Id == id && x.AppUserId == userId);

            if(todoItem == null) return NotFound("ToDo item not found");

             _context.Remove(todoItem);
             await _context.SaveChangesAsync();

            return Ok("Todo item deleted successfully");
        }
        
    }
}