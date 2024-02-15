<template>
  <div class="custom-div">
    <el-button plain :icon="CirclePlus" @click="create"> New Brand </el-button>
    <el-input
      v-model="search"
      placeholder="Search brand name"
      :prefix-icon="Search"
      clearable
      @change="handleSearch"
    />
  </div>

  <el-dialog v-model="dialogFormVisible" :title="dialogFormTitle" width="500">
    <el-form :model="form">
      <el-form-item label="Brand Name" :label-width="formLabelWidth">
        <el-input v-model="form.brand_name" placeholder="Please input brand name" />
      </el-form-item>
      <el-form-item label="Description" :label-width="formLabelWidth">
        <el-input
          v-model="form.description"
          :rows="3"
          type="textarea"
          placeholder="Please input brand description"
        />
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

  <el-table :data="tableData" stripe>
    <el-table-column prop="id" label="Brand ID" width="90" align="center" />
    <el-table-column prop="brand_name" label="Brand Name" width="180" />
    <el-table-column prop="description" label="Description" width="300" />
    <el-table-column prop="sort_order" label="Sort Order" width="120" align="center" />
    <el-table-column label="Activated" width="90" align="center">
      <template #default="{ row }">
        {{ row.is_active ? "Yes" : "No" }}
      </template>
    </el-table-column>
    <el-table-column label="Operations" align="center">
      <template #default="scope">
        <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
          Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <div class="custom-div">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { CirclePlus, Search } from "@element-plus/icons-vue";
import { ProductService } from "@/services";

// el-input
const search = ref("");

// el-dialog
const dialogFormVisible = ref(false);

const dialogFormTitle = ref("");

const dialogFormType = ref("");

const formLabelWidth = "140px";

const form = reactive({
  id: "",
  brand_name: "",
  description: "",
  sort_order: 1,
  is_active: true,
  logo: null
});

// el-table
const tableData = ref([]);

// el-pagination
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

onMounted(async () => {
  tableData.value = await ProductService.getProductBrandsByPage(currentPage.value, pageSize.value);
  total.value = await ProductService.getProductBrandsCount();
});

const handleSearch = async () => {
  tableData.value = await ProductService.getProductBrandByName(search.value);
  total.value = tableData.value.length;
};

const clearForm = () => {
  dialogFormVisible.value = false;
  form.id = "";
  form.brand_name = "";
  form.description = "";
  form.sort_order = 1;
  form.is_active = true;
};

const handleSubmit = async () => {
  dialogFormType.value === "add" ? await handleAdd() : await handleEdit();
  tableData.value = await ProductService.getProductBrandsByPage(currentPage.value, pageSize.value);
  clearForm();
};

const create = () => {
  dialogFormVisible.value = true;
  dialogFormTitle.value = "Add Brand";
  dialogFormType.value = "add";
};

const handleAdd = async () => {
  const data = {
    brand_name: form.brand_name,
    description: form.description,
    sort_order: form.sort_order,
    is_active: Number(form.is_active)
  };
  await ProductService.createProductBrand(data);
  ElMessage.success("Brand added successfully");
  total.value = await ProductService.getProductBrandsCount();
};

const edit = (index, row) => {
  // console.log(index, row);
  form.id = row.id;
  form.brand_name = row.brand_name;
  form.description = row.description;
  form.sort_order = row.sort_order;
  form.is_active = Boolean(row.is_active);
  dialogFormVisible.value = true;
  dialogFormTitle.value = "Edit Brand";
  dialogFormType.value = "edit";
};

const handleEdit = async () => {
  const data = {
    id: form.id,
    brand_name: form.brand_name,
    description: form.description,
    sort_order: form.sort_order,
    is_active: Number(form.is_active)
  };
  await ProductService.updateProductBrand(data.id, data);
  ElMessage.success("Brand updated successfully");
};

const handleDelete = (index, row) => {
  // console.log(index, row);
  ElMessageBox.confirm(`Are you sure to delete [${row.brand_name}] permanently?`, "Alert", {
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    type: "warning"
  }).then(async () => {
    await ProductService.deleteProductBrand(row.id);
    tableData.value = await ProductService.getProductBrandsByPage(
      currentPage.value,
      pageSize.value
    );
    ElMessage.success("Brand deleted successfully");
    total.value = await ProductService.getProductBrandsCount();
  });
};

const handleSizeChange = async (val) => {
  pageSize.value = val;
  tableData.value = await ProductService.getProductBrandsByPage(currentPage.value, pageSize.value);
};

const handleCurrentChange = async (val) => {
  currentPage.value = val;
  tableData.value = await ProductService.getProductBrandsByPage(currentPage.value, pageSize.value);
};
</script>

<style scoped>
.custom-div {
  /* flex: 1; */
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.custom-div > .el-input {
  width: 400px;
}
.el-table {
  margin: 20px 0;
}
.el-pagination {
  margin: auto;
}
</style>
