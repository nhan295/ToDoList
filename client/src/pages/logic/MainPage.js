import api from "../../api";

export const getTodoItems = async () => {
  try {
    const response = await api.get("/api/todoitem");
    return {
      success: true,
      data: response.data || [],
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data ||
        error.message ||
        "Failed to fetch todo items",
    };
  }
};

export const createTodoItem = async (title, description, dueDate, priority, status) => {
  try {
    const response = await api.post("/api/todoitem/create", {
      title,
      description,
      dueDate,
      priority,
      status,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data ||
        error.message ||
        "Failed to create todo item",
    };
  }
};

export const updateTodoItem = async (id, title, description, dueDate, priority, status) => {
  try {
    const response = await api.put(`/api/todoitem/update/${id}`, {
      title,
      description,
      dueDate,
      priority,
      status,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data ||
        error.message ||
        "Failed to update todo item",
    };
  }
};

// Không có endpoint toggle riêng — gọi update với toàn bộ data, chỉ đổi status
export const toggleTodoComplete = async (item, isCompleted) => {
  const status = isCompleted ? "Completed" : "InProgress";
  return await updateTodoItem(
    item.id,
    item.title,
    item.description,
    item.dueDate,
    item.priority,
    status
  );
};

export const deleteTodoItem = async (id) => {
  try {
    await api.delete(`/api/todoitem/delete/${id}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data ||
        error.message ||
        "Failed to delete todo item",
    };
  }
};