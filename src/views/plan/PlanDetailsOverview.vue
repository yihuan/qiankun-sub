<template>
  <div v-loading="loading" class="plan-detail-overview">
    <div class="overview-section">
      <div class="section-title">{{ version }}版本计划关键时间点</div>
      <div class="section-body plan-keypoints">
        <PlanSteps :steps="planKeyPoints" />
      </div>
    </div>
    <div class="overview-section">
      <div class="section-title">
        {{ version }}版本数据
        <BaseTooltip placement="bottom" popper-class="version-data-hint">
          <template #content>
            <p>
              1. 版本周期 = 发版时间（iOS提审/Android发版）- 版本开始时间 -
              法定节假日时间（注意：若iOS提审和Android发版不是同一天，取最长的那天）
            </p>
            <p>
              2. 开发周期 = 集成测试开始时间 - 版本开始时间 -
              法定节假日时间（灰度开始时间 - 开发测试开始时间 - 法定节假日时间
              ）
            </p>
            <p>
              3. 集成回归 = 灰度发布前一天 - 集成测试开始时间 - 法定节假日时间
              （其实就是归属类别：集成）
            </p>
            <p>4.灰度 = 灰度当天 （实际情况：一般是1天）</p>
            <p>
              5. 版本间隔 =
              本版本的ios提审/Android发版时间（如果有2个时间，取最长时间）-
              上个版本的ios提审/Android发版时间（如果有2个时间，取最长时间） -
              法定节假日（周六日+节假日）
            </p>
          </template>
          <i class="iconfont icon-icon-16-tishi icon-hint" />
        </BaseTooltip>
      </div>
      <div class="section-body">
        <span class="version-data" v-html="versionData"></span>
      </div>
    </div>
    <div class="overview-section">
      <div class="section-title highlight-title">版本核心任务关键时间点</div>
      <div class="section-body version-key-tasks">
        <div v-for="kt in keyTaskPoints" :key="kt.id" class="key-task-point">
          <div class="text-vertical task-parent task-item">{{ kt.title }}</div>
          <div class="task-child">
            <div v-for="c in kt.children" :key="c.id" class="task-child__item">
              <div class="text-vertical task-item task-child__item-child">
                {{ c.title }}
              </div>
              <div class="task-keypoints">
                <PlanSteps
                  class="kp-nodes"
                  :steps="c.children"
                  :prop="{ desc: 'children' }"
                  :solid="false"
                  :node-size="20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="overview-section">
      <div class="section-title highlight-title">版本主要参与人</div>
      <div class="section-body">
        <BaseTable :columns="columns" :data="versionManagers">
          <template v-for="c in columns" #[c.name]="{ row }">
            <EePerson
              :key="c.name"
              v-model="row[c.name].name"
              :options="row[c.name].options"
              :readonly="isDone || !hasAuth"
              @change="(event) => handlePersonChange(event, c.name)"
            />
          </template>
        </BaseTable>
      </div>
    </div>
    <div class="overview-section">
      <div class="section-title highlight-title">关联迭代</div>
      <div class="section-body">
        <a
          v-for="it in iterations"
          :key="it.id"
          :href="it.url"
          class="base-link iteration-link"
          target="_blank"
        >
          {{ it.title }}
        </a>
      </div>
    </div>
    <div class="overview-section">
      <div class="section-title highlight-title">版本上线信息</div>
      <div class="section-body">
        <el-form label-position="top" size="mini">
          <el-row v-bind="rowProps">
            <el-col :span="onlineInfoSpan">
              <el-form-item label="iOS 正式包实际发版时间">
                <el-date-picker
                  v-model="versionOnlineInfo.iosRealPublishTime"
                  v-bind="dateProps"
                  placeholder="请选择"
                  @change="
                    (event) => handleTimeChange(event, 'iosRealPublishTime')
                  "
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="onlineInfoSpan">
              <el-form-item label="iOS 正式包发布实际版本号">
                <el-input
                  v-model="versionOnlineInfo.iosRealPublishVersion"
                  placeholder="请填写"
                  :disabled="!hasAuth"
                  @blur="
                    (event) => handleVersionBlur(event, 'iosRealPublishVersion')
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="onlineInfoSpan">
              <el-form-item label="iOS 灰度包实际发版时间">
                <el-date-picker
                  v-model="versionOnlineInfo.iosRealGrayPublishTime"
                  v-bind="dateProps"
                  placeholder="请选择"
                  @change="
                    (event) => handleTimeChange(event, 'iosRealGrayPublishTime')
                  "
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="onlineInfoSpan">
              <el-form-item label="iOS 灰度包发布实际版本号">
                <el-input
                  v-model="versionOnlineInfo.iosRealGrayPublishVersion"
                  placeholder="请填写"
                  :disabled="!hasAuth"
                  @blur="
                    (event) =>
                      handleVersionBlur(event, 'iosRealGrayPublishVersion')
                  "
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-bind="rowProps">
            <el-col :span="onlineInfoSpan">
              <el-form-item label="Android 正式包实际发版时间">
                <el-date-picker
                  v-model="versionOnlineInfo.androidRealPublishTime"
                  v-bind="dateProps"
                  placeholder="请选择"
                  @change="
                    (event) => handleTimeChange(event, 'androidRealPublishTime')
                  "
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="onlineInfoSpan">
              <el-form-item label="Android 正式包发布实际版本号">
                <el-input
                  v-model="versionOnlineInfo.androidRealPublishVersion"
                  placeholder="请填写"
                  :disabled="!hasAuth"
                  @blur="
                    (event) =>
                      handleVersionBlur(event, 'androidRealPublishVersion')
                  "
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="onlineInfoSpan">
              <el-form-item label="Android 灰度包实际发版时间">
                <el-date-picker
                  v-model="versionOnlineInfo.androidRealGrayPublishTime"
                  v-bind="dateProps"
                  placeholder="请选择"
                  @change="
                    (event) =>
                      handleTimeChange(event, 'androidRealGrayPublishTime')
                  "
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="onlineInfoSpan">
              <el-form-item label="Android 灰度包发布实际版本号">
                <el-input
                  v-model="versionOnlineInfo.androidRealGrayPublishVersion"
                  placeholder="请填写"
                  :disabled="!hasAuth"
                  @blur="
                    (event) =>
                      handleVersionBlur(event, 'androidRealGrayPublishVersion')
                  "
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router/composables'
import BaseTable from '@/components/common/BaseTable.vue'
import PlanSteps from '@/components/plan/PlanSteps.vue'
import EePerson from '@/components/common/EePerson.vue'
import BaseTooltip from '@/components/common/BaseTooltip.vue'
import {
  getPlanOverview,
  updateOnlineInfo,
  updateManager
} from '@/request/apis'
import { Message } from '@/utils'
import { useAuth } from '@/hooks/use-auth'
import { PlanStatus } from '@/constants/plan.const'
import { useAppStore } from '@/stores'
import { useBaseStore } from '@/hooks/use-base-store'

const route = useRoute()
const appStore = useAppStore()

const loading = ref(false)
const authData = ref({})
const version = ref('')
const planKeyPoints = ref([])
const versionData = ref('')
const keyTaskPoints = ref([])
const versionOnlineInfo = reactive({
  status: 0,
  iosRealPublishTime: '', // iOS正式包实际发版时间
  iosRealPublishVersion: '', // iOS正式包发布实际版本号
  androidRealPublishTime: '', // Android 正式包实际发版时间
  iosRealGrayPublishTime: '', // iOS灰度包实际发版时间
  iosRealGrayPublishVersion: '', // iOS灰度包发布实际版本号
  androidRealPublishVersion: '', // Android正式包发布实际版本号
  androidRealGrayPublishTime: '', // Android 灰度包实际发版时间
  androidRealGrayPublishVersion: '' // Android 灰度包发布实际版本号
})
const versionManagers = ref([])
const iterations = ref([])
const isDone = computed(() => versionOnlineInfo?.status === PlanStatus.DONE)

const onlineInfoSpan = 5
const rowProps = {
  type: 'flex',
  justify: 'space-between'
}
const dateProps = computed(() => ({
  format: 'yyyy-MM-dd',
  valueFormat: 'yyyy-MM-dd HH:mm:ss',
  clearable: false,
  editable: false,
  disabled: !hasAuth.value
}))

const columns = computed(() => {
  if (!versionManagers.value.length) return []
  return Object.keys(versionManagers.value[0]).map((x) => ({
    name: x,
    key: x,
    slot: x
  }))
})
const prodName = computed(() => appStore.appName)

const { hasAuth } = useAuth(authData, prodName)

getOverview()

const { updateProductName } = useBaseStore()

function getOverview() {
  loading.value = true
  getPlanOverview(route.params.id)
    .then((res) => {
      authData.value = res?.rightData
      const data = res?.data
      version.value = data?.version
      planKeyPoints.value =
        data?.keyPointFlow?.map((x) => ({
          ...x,
          title: x.name,
          desc: x.time
        })) ?? []
      keyTaskPoints.value = data?.scheduleDetail ?? []
      versionData.value =
        data?.keyPointTimes?.value?.replaceAll(
          '·',
          '&nbsp;&nbsp;·&nbsp;&nbsp;'
        ) ?? ''
      iterations.value = data?.iterations ?? []
      versionManagers.value = [
        data?.sponsor?.reduce((ret, curr) => {
          ret[curr.role] = {
            role: curr.role,
            name: [curr.oaName],
            options: [
              {
                msg: curr.realName,
                code: curr.oaName
              }
            ]
          }
          return ret
        }, {})
      ]
      if (data?.schedule) {
        updateProductName(data.schedule.productName)
        Object.keys(versionOnlineInfo).forEach((key) => {
          versionOnlineInfo[key] = data.schedule[key]
        })
      }
    })
    .finally(() => {
      loading.value = false
    })
}

function handlePersonChange(event, role) {
  const { userName, nickName } = event[0]
  updateManager({
    scheduleId: Number(route.params.id),
    productName: prodName.value,
    role: role,
    realName: nickName,
    oaName: userName
  }).then(() => {
    Message.success('更新成功')
  })
}

function updateOnlineField(key, value) {
  updateOnlineInfo({
    id: route.params.id,
    [key]: value
  }).then(() => {
    Message.success('更新成功')
  })
}

function handleTimeChange(time, key) {
  updateOnlineField(key, time)
}

function handleVersionBlur(value, key) {
  updateOnlineField(key, versionOnlineInfo[key])
}
</script>

<style lang="scss" scoped>
// 版本核心任务关键时间点
$key-task-border-color: #d7d7d7;
$key-task-border-width: 2px;

:global(.version-data-hint) {
  max-width: 550px;

  p {
    line-height: 1.5;
  }
}

.plan-detail-overview {
  .overview-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: $base-gap * 4 0;

    .section-title {
      width: 100%;
      font-size: 16px;
      font-weight: 500;
      color: $font-color;

      &.highlight-title {
        padding: $base-gap 0 $base-gap $base-gap * 2;
        border-left: 4px solid $primary-color;
        background-color: rgba(21, 100, 255, 0.1);

        .icon-hint {
          cursor: pointer;
          font-size: 14px;
        }
      }
    }

    .section-body {
      width: 100%;
      padding-top: $base-gap * 4;

      &.plan-keypoints {
        padding-top: $base-gap * 8;
      }

      .version-data {
        display: block;
        color: $primary-color;
        font-size: 14px;
        font-weight: 500;
        margin: $base-gap * 4 0 $base-gap * 8 0;
      }

      .iteration-link {
        margin: 0 $base-gap * 8 0 $base-gap * 4;
        font-size: 14px;
        font-weight: 500;
      }

      &.version-key-tasks {
        padding-top: $base-gap * 4;

        .key-task-point {
          display: flex;
          color: $font-color;

          .text-vertical {
            writing-mode: vertical-lr;
            text-orientation: upright;
          }

          .task-item {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(21, 100, 255, 0.2);
            padding: $base-gap * 2 $base-gap;
          }

          // Add bottom border for the last item
          &:last-child {
            .task-parent {
              border-bottom: $key-task-border-width solid $key-task-border-color;
            }

            .task-child {
              &__item {
                border-bottom: $key-task-border-width solid
                  $key-task-border-color;
              }
            }
          }

          .task-parent {
            border-top: $key-task-border-width solid $key-task-border-color;
            border-left: $key-task-border-width solid $key-task-border-color;

            &:last-child {
              border-bottom: $key-task-border-width solid $key-task-border-color;
            }
          }

          .task-child {
            display: flex;
            flex-direction: column;

            &__item {
              flex: 1 0 auto;
              display: flex;
              align-items: stretch;

              &-child {
                border-top: $key-task-border-width solid $key-task-border-color;
                border-right: $key-task-border-width solid
                  $key-task-border-color;
                border-left: $key-task-border-width solid $key-task-border-color;
              }
            }
          }

          .task-keypoints {
            flex: 1 0 auto;

            .kp-nodes {
              :deep(.steps-line) {
                .title {
                  font-weight: 500;
                  color: $font-color;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
