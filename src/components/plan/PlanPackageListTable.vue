<template>
  <BaseTable :columns="columns" :data="data">
    <template #id="{ row }">
      {{ row.id }}
    </template>
    <template #flowName="{ row }">
      <a class="base-link" :href="row.flowUrl" target="_blank">
        {{ row.flowName }}
      </a>
    </template>
    <template #type="{ row }">
      {{ PackageTypeMap[row.pkType] }}
    </template>
    <template #prodOs="{ row }">
      {{ SystemTypeMap[row.prodOs] }}
    </template>
    <template #createUser="{ row }">
      {{ row.createUser }}
    </template>
    <template #createTime="{ row }">
      {{ row.createTime | date }}
    </template>
    <template #packageQRCodeNewList="{ row }">
      <el-popover
        :data="packageDetail"
        placement="top-start"
        trigger="click"
        width="450"
        popper-class="qrcode-details"
      >
        <h3>构建详情</h3>
        <p>包类型：{{ packageDetail?.type }}</p>
        <p>创建人：{{ packageDetail?.packageInfo?.createUser }}</p>
        <p>生成时间：{{ packageDetail?.packageInfo?.createTime | date }}</p>
        <p>
          查看日志：
          <a
            class="base-link"
            :href="packageDetail?.betaLogUrl"
            target="_blank"
          >
            {{ packageDetail?.betaLogUrl }}
          </a>
        </p>
        <div>
          二维码:
          <!-- <div
            v-for="(item, i) in packageDetail?.packageInfo
              ?.packageQRCodeNewList"
            :key="i"
          >
            <vue-qr :logo-src="row.logo" :text="item.qrcode"></vue-qr>
            <el-link :href="item.packageurl" target="_blank" type="primary">
              {{ item.packageurl }}
            </el-link>
          </div> -->
          <div class="qrcode-list">
            <div
              v-for="(item, i) in packageDetail?.packageInfo
                ?.packageQRCodeNewList"
              :key="i"
              class="qrcode-list__item"
            >
              <vue-qr :logo-src="row.logo" :text="item.qrcode"></vue-qr>
              <div>
                <el-link
                  :href="item.packageurl"
                  target="_blank"
                  type="primary"
                  class="qrcode-link"
                >
                  {{ item.packageurl }}
                </el-link>
              </div>
            </div>
          </div>
        </div>
        <div>
          文件下载:
          <div
            v-for="(item, i) in packageDetail?.packageInfo
              ?.packageUrlAndOtherList"
            :key="i"
          >
            <el-link :href="item" target="_blank" type="primary">
              {{ item }}
            </el-link>
          </div>
        </div>
        <div>
          代码地址：
          <div v-for="(item, i) in packageDetail?.gitUrlList" :key="i">
            {{ item }}
          </div>
        </div>
        <div>
          构建参数:
          <div v-for="(item, i) in packageDetail?.betaParamList" :key="i">
            {{ item }}
          </div>
        </div>
        <el-button slot="reference" @click="getPackageDetail(row)">
          构建详情
        </el-button>
      </el-popover>
      <el-popover placement="top-start" trigger="hover">
        <div class="qrcode-list">
          <div
            v-for="(item, i) in row.packageQRCodeNewList"
            :key="i"
            class="qrcode-list__item"
          >
            <vue-qr :logo-src="row.logo" :text="item.qrcode"></vue-qr>
            <div>
              <el-link
                :href="item.packageurl"
                target="_blank"
                type="primary"
                class="qrcode-link"
              >
                {{ item.packageurl }}
              </el-link>
            </div>
          </div>
        </div>

        <el-button slot="reference">二维码</el-button>
      </el-popover>
    </template>

    <!-- <template #packageUrlList="{ row }">
      <el-popover placement="top-start" width="200" trigger="hover">
        <h3>代码地址：</h3>
        <p>{{ row.packageOperate }}</p>
        <h3>构建参数：</h3>
        <p>{{ row.packageOperateResult }}</p>
        <el-button slot="reference">查看</el-button>
      </el-popover>
    </template> -->
    <template #packageUrlList="{ row }">
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        @show="getData(row)"
        @hide="clearData()"
      >
        <h3>代码地址：</h3>
        <div>
          <p v-for="(it, index) in gitUrl" :key="index">{{ it }}</p>
        </div>
        <h3>构建参数：</h3>
        <p v-for="(it, index) in betaParam" :key="index">{{ it }}</p>
        <el-button slot="reference">查看</el-button>
      </el-popover>
    </template>
  </BaseTable>
</template>

<script setup>
import { ref } from 'vue'
import BaseTable from '@/components/common/BaseTable.vue'
import { SystemType, PackageType } from '@/constants/plan.const'
import * as thirdPartyApi from '@/request/apis/third-party.api'
import vueQr from 'vue-qr'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const SystemTypeMap = {
  [SystemType.ALL]: '全部',
  [SystemType.ANDROID]: 'Android',
  [SystemType.IOS]: 'iOS'
}

const PackageTypeMap = {
  [PackageType.BUILD]: '构建包',
  [PackageType.GRAY]: '灰度包',
  [PackageType.RELEASE]: '全量包'
}

const columns = [
  {
    name: '序号',
    key: 'id',
    width: 100
  },
  {
    name: '流水线名称',
    key: 'flowName',
    slot: 'flowName',
    width: 500
  },
  {
    name: '类别',
    key: 'type',
    slot: 'type',
    width: 130
  },
  {
    name: '端',
    key: 'prodOs',
    slot: 'prodOs',
    width: 130
  },
  {
    name: '创建人',
    key: 'createUser',
    slot: 'createUser',
    width: 200
  },
  {
    name: '生成包时间',
    key: 'createTime',
    slot: 'createTime',
    width: 300
  },
  {
    name: '下载',
    key: 'packageQRCodeNewList',
    slot: 'packageQRCodeNewList',
    width: 240
  },
  {
    name: '快速参数',
    key: 'packageUrlList',
    slot: 'packageUrlList',
    width: 200
  }
]
const packageDetail = ref({})

function getPackageDetail(row) {
  thirdPartyApi
    .getCompilerPackageAllInfo(row.flowNodeAttrDetailId)
    .then((res) => {
      packageDetail.value = res?.data
    })
}
const gitUrl = ref([])
const betaParam = ref([])

const loading = ref(false)

function getData(row) {
  loading.value = true
  thirdPartyApi
    .getCompilerPackageDetail(row.flowNodeAttrDetailId)
    .then((res) => {
      gitUrl.value = res?.data?.gitUrlList
      betaParam.value = res?.data?.betaParamList
    })
    .finally(() => {
      loading.value = false
    })
}

function clearData() {
  gitUrl.value = []
  betaParam.value = []
}
</script>

<style lang="scss" scoped>
.el-link {
  white-space: pre-wrap;
  word-break: break-all;
}

:global(.qrcode-details.el-popover) {
  max-height: 600px;
  overflow-y: auto;
}

.qrcode-list {
  display: flex;
  align-items: center;
  overflow-x: auto;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: $base-gap * 2;

    &:last-child {
      margin-right: 0;
    }

    .qrcode-link {
      max-width: 200px;
    }
  }
}
</style>
