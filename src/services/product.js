import axios from "@/utils/axios";
import { set } from "lodash";

// Category
export const getProductCategories = async () => {
  const response = await axios.get("/api/category/");
  // console.log(response.data);
  const data = {};
  response.data.forEach((category) => {
    if (category.parent_id === "0") {
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
  const response = await axios.get("/api/category/");
  const data = response.data.filter((category) => category.parent_id === "0");
  return data;
};

export const updateProductCategory = async (id, data) => {
  const response = await axios.put(`/api/category/${id}/`, data);
  return response.data;
};

export const createProductCategory = async (data) => {
  const response = await axios.post("/api/category/", data);
  return response.data;
};

export const deleteProductCategory = async (id) => {
  const response = await axios.delete(`/api/category/${id}/`);
  return response.data;
};

// Brand
export const getProductBrandsCount = async () => {
  const response = await axios.get("/api/brand/");
  return response.data.length;
};

export const getProductBrandsByPage = async (page, pageSize) => {
  const response = await axios.get("/api/brand", {
    params: {
      _page: page,
      _per_page: pageSize
    }
  });
  // console.log(response.data);
  return response.data.data;
};
