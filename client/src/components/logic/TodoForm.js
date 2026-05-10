import api from "../../api";

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