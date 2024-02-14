<template>
  <el-tree
    :data="dataSource"
    :props="props"
    show-checkbox
    node-key="id"
    :expand-on-click-node="false"
    :default-expanded-keys="expandedKeys"
  >
    <template #default="{ node, data }">
      <span class="tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button type="info" link @click="edit(data)"> Edit </el-button>
          <el-button type="primary" link @click="append(data)"> Append </el-button>
          <el-button type="danger" link @click="remove(node, data)"> Delete </el-button>
        </span>
      </span>
    </template>
  </el-tree>

  <el-dialog
    v-model="dialogFormVisible"
    :title="dialogFormTitle"
    width="500"
    @open="handleDialogOpen"
  >
    <el-form :model="form">
      <el-form-item label="Category Name" :label-width="formLabelWidth">
        <el-input v-model="form.category_name" placeholder="Please input category name" />
      </el-form-item>
      <el-form-item label="Parent Category ID" :label-width="formLabelWidth">
        <el-input v-model="form.parent_id" disabled placeholder="Please input parent category id" />
      </el-form-item>
      <el-form-item label="Parent Category Name" :label-width="formLabelWidth">
        <el-select
          v-model="form.parent_category_name"
          :disabled="disabled"
          placeholder="Please select a parent category"
          @change="handleParentCategoryChange"
        >
          <el-option
            v-for="parentCategory in parentCategories"
            :label="parentCategory.category_name"
            :value="parentCategory.category_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Category Level" :label-width="formLabelWidth">
        <el-select
          v-model="form.category_level"
          :disabled="disabled"
          placeholder="Please select a category level"
        >
          <el-option label="1" value="1" />
          <el-option label="2" value="2" />
          <el-option label="3" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="Sort Order" :label-width="formLabelWidth">
        <el-input v-model="form.sort_order" placeholder="Please input sort order" type="number" />
      </el-form-item>
      <el-form-item label="Activated" :label-width="formLabelWidth">
        <el-switch v-model="form.is_active" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="clearForm">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ProductService } from "@/services";

// el-tree
const dataSource = ref([]);

const props = {
  children: "children",
  label: "category_name"
};

const expandedKeys = ref([]);

// el-dialog
const dialogFormVisible = ref(false);

const dialogFormTitle = ref("");

const dialogFormType = ref("");

const formLabelWidth = "140px";

const disabled = ref(false);

const parentCategories = ref([]);

const form = reactive({
  id: "",
  category_name: "",
  parent_id: "0",
  parent_category_name: "",
  category_level: "",
  sort_order: 1,
  is_active: true,
  icon: null
});

onMounted(async () => {
  dataSource.value = await ProductService.getProductCategories();
});

const handleDialogOpen = async () => {
  parentCategories.value = await ProductService.getProductParentCategories();
};

const handleParentCategoryChange = (value) => {
  const category = parentCategories.value.find((item) => item.category_name === value);
  form.parent_id = category.id;
};

const handleSubmit = async () => {
  expandedKeys.value = dialogFormType.value === "add" ? await handleAdd() : await handleEdit();
  dataSource.value = await ProductService.getProductCategories();
  clearForm();
};

const clearForm = () => {
  dialogFormVisible.value = false;
  form.id = "";
  form.category_name = "";
  form.parent_id = "0";
  form.parent_category_name = "";
  form.category_level = "";
  form.sort_order = 1;
  form.is_active = true;
};

const edit = async (data) => {
  // console.log(data);
  const id = data.parent_id;
  const category = await ProductService.getProductCategory(id);
  form.id = data.id;
  form.category_name = data.category_name;
  form.parent_id = data.parent_id;
  form.parent_category_name = category.category_name;
  form.category_level = data.category_level;
  form.sort_order = data.sort_order;
  form.is_active = Boolean(data.is_active);
  disabled.value = false;
  dialogFormVisible.value = true;
  dialogFormTitle.value = "Edit Category";
  dialogFormType.value = "edit";
};

const handleEdit = async () => {
  const data = {
    id: form.id,
    category_name: form.category_name,
    parent_id: form.parent_id,
    category_level: form.category_level,
    sort_order: form.sort_order,
    is_active: Number(form.is_active)
  };
  await ProductService.updateProductCategory(data.id, data);
  ElMessage.success("Category updated successfully");
  return [data.parent_id];
};

const append = (data) => {
  // console.log(data);
  form.parent_id = data.id;
  form.parent_category_name = data.category_name;
  form.category_level = data.category_level + 1;
  disabled.value = true;
  dialogFormVisible.value = true;
  dialogFormTitle.value = "Add Category";
  dialogFormType.value = "add";
};

const handleAdd = async () => {
  const data = {
    category_name: form.category_name,
    parent_id: form.parent_id,
    category_level: form.category_level,
    sort_order: form.sort_order,
    is_active: Number(form.is_active)
  };
  await ProductService.createProductCategory(data);
  ElMessage.success("Category added successfully");
  return [data.parent_id];
};

const remove = (node, data) => {
  // console.log(node, data);
  ElMessageBox.confirm(`Are you sure to delete [${data.category_name}] permanently?`, "Alert", {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(async () => {
    await ProductService.deleteProductCategory(data.id);
    expandedKeys.value = [data.parent_id];
    dataSource.value = await ProductService.getProductCategories();
    ElMessage.success("Category deleted successfully");
  });
};
</script>

<style scoped>
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
