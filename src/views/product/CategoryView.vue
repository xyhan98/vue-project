<template>
  <el-tree :data="data" :props="props" show-checkbox @node-click="handleNodeClick" />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ProductService } from "@/services";

const data = ref([]);

const props = {
  children: "children",
  label: "category_name"
};

onMounted(async () => {
  data.value = await ProductService.getProductCategories();
});

const handleNodeClick = (data) => {
  console.log(data);
};
</script>
