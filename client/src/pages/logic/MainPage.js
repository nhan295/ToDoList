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

export const getUserInfo = async()=>{
  try{
    const response = await api.get("/api/account");
    return {
      success: true,
      data: response.data || [],
    };
  }catch(error){
    return{
      success: false,
      message:
      error.response?.data ||
      error.message || "Failed to get User Infomation"
    }
  }
}

export const logout = () => {
  localStorage.removeItem("token"); // đổi key nếu bạn dùng tên khác
};