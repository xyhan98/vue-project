import axios from "@/utils/axios";
import { set } from "lodash";

export const getProductCategories = async () => {
  const response = await axios.get("/api/category");
  // console.log(response.data);
  const data = {};
  response.data.forEach((category) => {
    if (category.parent_category_id === 0) {
      set(data, category.category_id, category);
      set(category, "children", []);
    } else {
      const parentCategory = data[category.parent_category_id];
      parentCategory.children.push(category);
    }
  });
  // console.log(data);
  return Object.values(data);
};
