import axios from "@/utils/axios";
import { set } from "lodash";

export const getProductCategories = async () => {
  const response = await axios.get("/api/category");
  // console.log(response.data);
  const data = {};
  response.data.forEach((category) => {
    if (category.parent_id === 0) {
      set(data, category.id, category);
      set(category, "children", []);
    } else {
      const parentCategory = data[category.parent_id];
      parentCategory.children.push(category);
    }
  });
  // console.log(data);
  return Object.values(data);
};

export const getProductCategory = async (id) => {
  const response = await axios.get(`/api/category/${id}/`);
  return response.data;
};

export const getProductParentCategories = async () => {
  const response = await axios.get("/api/category");
  const data = response.data.filter((category) => category.parent_id === 0);
  return data;
};
