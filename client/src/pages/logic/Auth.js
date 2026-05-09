import api from "../../api";

export const login = async (username, password) => {
  try {

    if (!username.trim()) {
      return {
        success: false,
        message: "Please enter username",
      };
    }

    if (!password) {
      return {
        success: false,
        message: "Please enter password",
      };
    }

    const response = await api.post(
      "/api/account/login",
      {
        username,
        password,
      }
    );

    const data = response.data;

    if (data?.token) {

      localStorage.setItem("auth_token",data.token);
      localStorage.setItem("user_info",JSON.stringify({userName: data.userName,email: data.email,})
    );

      window.location.href = "/home"
      return {
        success: true,
        data,
      };
    }

    return {
      success: false,
      message: "Login failed",
    };

  } catch (error) {

    return {
      success: false,
      message:
        error.response?.data ||
        error.message ||
        "Login failed",
    };
  }
};

export const register = async (
  username,
  email,
  password,
  confirmPassword
) => {
  try {

    if (!username) {
      return {
        success: false,
        message: "Please enter username",
      };
    }

    if (!email) {
      return {
        success: false,
        message: "Please enter email",
      };
    }

    if (!password) {
      return {
        success: false,
        message: "Please enter password",
      };
    }

    if (password !== confirmPassword) {
      return {
        success: false,
        message: "Passwords do not match",
      };
    }

    const response = await api.post(
      "/api/account/register",
      {
        username,
        email,
        password,
        confirmPassword,
      }
    );

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
        "Register failed",
    };
  }
};



