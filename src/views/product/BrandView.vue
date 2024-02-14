<template>
  <el-table :data="tableData" stripe>
    <el-table-column prop="id" label="Brand ID" width="90" align="center" />
    <el-table-column prop="brand_name" label="Brand Name" width="180" />
    <el-table-column prop="description" label="Description" width="300" />
    <el-table-column prop="sort_order" label="Sort Order" width="90" align="center" />
    <el-table-column label="Activated" width="90" align="center">
      <template #default="{ row }">
        {{ row.is_active ? "Yes" : "No" }}
      </template>
    </el-table-column>
    <el-table-column label="Operations" align="center">
      <template #default="scope">
        <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
          Delete</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <div>
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
import { onMounted, ref } from "vue";
import { ProductService } from "@/services";

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

const handleEdit = (index, row) => {
  console.log(index, row);
};
const handleDelete = (index, row) => {
  console.log(index, row);
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
div {
  display: flex;
  align-items: center;
}
.el-pagination {
  margin: auto;
  padding-top: 20px;
}
</style>
