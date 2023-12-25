<template>
  <div class="common-layout">
    <el-container class="main">
      <el-header>
        开发测试
      </el-header>
      <el-container class="main-content">
        <el-aside width="200px">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-sub-menu :index="navitem.id" v-for="navitem in nav" :key="navitem.id">
              <template #title>
                <span>{{ navitem.name }}</span>
              </template>
              <template v-if="navitem.children && navitem.children.length">
                <el-menu-item :index="item.id" v-for="item in navitem.children" :key="item.id"><router-link :to="item.url">{{ item.name }}</router-link></el-menu-item>
              </template>
              <!-- <template v-else>
                <el-sub-menu :index="item.id" v-for="item in ">
                  <template #title>item four</template>
                  <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
              </template> -->
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="main-view">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import navData from '../nav'
import type { LooseObject } from '../../auto-imports'

const nav: Array<LooseObject> = ref(navData)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

</script>

<style scoped>
.main {
  height: 100%;
}

.main-content {
  height: calc(100% - 60px);
}
.common-layout {
  width: 100%;
  height: 100%;
}

.main-view {
  width: 100%;
  height: 100%;
  padding: 0;
}

.el-menu-item {
  padding: 0;
  
  a {
    width: 100%;
  }
}
</style>
