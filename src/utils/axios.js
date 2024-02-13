import axios from "axios";
import { ElMessage } from "element-plus";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json"
  }
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    ElMessage.error(error.message);
    return Promise.reject(error);
  }
);

export default instance;
