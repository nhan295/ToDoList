using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using server.Models;
using server.Dtos.ToDoItem;
using server.Interfaces;
using server.Extensions;
using server.Repository;
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
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata;

namespace server.Controllers
{
    [Route("api/todoitem")]
    [ApiController]
    [Authorize]
    public class ToDoItemController : ControllerBase
    {
        private readonly ITodoRepository _todoRepository;

        public ToDoItemController(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
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

            await _todoRepository.CreateAsync(todoItem);

            return Ok(todoItem);
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult>DeleteItem(int id)
        {
            var userId = User.GetUserId();
            var todoItem = await _todoRepository.GetByIdAsync(id, userId);

            if(todoItem == null) return NotFound("ToDo item not found");

            await _todoRepository.DeleteAsync(todoItem);

            return Ok("Todo item deleted successfully");
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult>UpdateItem(int id, UpdateItemDto updateItemDto)
        {
            var userId = User.GetUserId();
            var todoItem = await _todoRepository.GetByIdAsync(id,userId);

            if(todoItem == null) return NotFound("Todo item not found");
          
            todoItem.Title = updateItemDto.Title;
            todoItem.Description = updateItemDto.Description;
            todoItem.DueDate = DateTime.SpecifyKind(
                updateItemDto.DueDate,
                DateTimeKind.Utc);

            todoItem.Priority = updateItemDto.Priority;
            todoItem.Status = updateItemDto.Status;
            await _todoRepository.UpdateAsync(todoItem);
            return Ok("Todo item updated successfully");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItemDto>>> GetItems()
        {
            var userId = User.GetUserId();
             var todoItem = await _todoRepository
                .GetUserItemsAsync(userId);

            var result = todoItem.Select(x => new TodoItemDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                DueDate = x.DueDate,
                Priority = x.Priority,
                Status = x.Status
            });

            return Ok(result);
        }
        
    }
}