<template>
  <el-tooltip
    popper-class="ee-person__tips__wrapper"
    effect="light"
    :disabled="toolTipDisabled"
  >
    <template #content>
      <div class="ee-person__tips">
        <div
          v-for="(chooseItem, index) in chooseItems"
          :key="'full_' + chooseItem[prop.value]"
          class="ee-person__tips__item"
        >
          <div class="ee-person__left">
            <ee-meishi-card
              :user-name="chooseItem[prop.value]"
              :user-label="chooseItem[prop.label]"
            >
              <i
                :class="[
                  'ee-person__item__profile',
                  slicedChooseItems.length > 1 &&
                  index !== slicedChooseItems.length - 1
                    ? ' ee-person__item__profile--border'
                    : ''
                ]"
                :style="{
                  backgroundImage: 'url(' + (chooseItem.img || defaultImg) + ')'
                }"
              ></i>
            </ee-meishi-card>

            <span class="ee-person__item__label ellipsis">
              {{ chooseItem[prop.label] + '(' + chooseItem[prop.value] + ')' }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <div>
      <div v-if="slicedChooseItems.length > 0" class="ee-person__tag">
        <div
          v-for="(chooseItem, index) in slicedChooseItems"
          :key="chooseItem[prop.value]"
          class="ee-person__item"
        >
          <div class="ee-person__left">
            <template
              v-if="
                index === slicedChooseItems.length - 1 &&
                chooseItems.length > iconMax
              "
            >
              <i
                :class="[
                  'ee-person__item__profile ee-person__item__profile__number',
                  slicedChooseItems.length > 1 &&
                  index !== slicedChooseItems.length - 1
                    ? 'ee-person__item__profile--border'
                    : ''
                ]"
              >
                +{{ chooseItems.length - slicedChooseItems.length + 1 }}
              </i>
            </template>
            <template v-else>
              <ee-meishi-card
                :disabled="!meishiCardAvailable || !toolTipDisabled"
                :user-name="chooseItem[prop.value]"
                :user-label="chooseItem[prop.label]"
              >
                <i
                  :class="[
                    'ee-person__item__profile',
                    slicedChooseItems.length > 1 &&
                    index !== slicedChooseItems.length - 1
                      ? ' ee-person__item__profile--border'
                      : ''
                  ]"
                  :style="{
                    backgroundImage:
                      'url(' + (chooseItem.img || defaultImg) + ')'
                  }"
                ></i>
              </ee-meishi-card>
            </template>

            <span
              v-if="chooseItems.length <= 1 && showLabel"
              class="ee-person__item__label ellipsis"
            >
              {{ chooseItem[prop.label] }}
            </span>
          </div>
        </div>
      </div>
      <span v-else class="ee-person__tag-empty">-</span>
    </div>
  </el-tooltip>
</template>

<script setup>
import { ref, computed } from 'vue'
import EeMeishiCard from '@/components/common/EeMeishiCard'
import profile from '@/assets/images/profile.png'

const props = defineProps({
  prop: {
    type: Object,
    default: () => ({ label: 'msg', value: 'code' })
  },
  showLabel: { type: Boolean, default: true },
  iconMax: {
    type: Number,
    default: 2,
    validator: (v) => v >= 1 && v <= 100
  },
  chooseItems: {
    type: Array,
    default: () => []
  },
  meishiCardAvailable: {
    type: Boolean,
    default: true
  }
})
const defaultImg = ref(profile)

const slicedChooseItems = computed(() => {
  return props.chooseItems.slice(0, props.iconMax) || []
})

const toolTipDisabled = computed(() => {
  return (
    !props.meishiCardAvailable || props.chooseItems?.length <= props.iconMax
  )
})
</script>

<style>
.ee-person__tips__wrapper.is-light {
  width: 238px;
  max-height: 208px;
  overflow-y: auto;
  padding: 0;
  background-color: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
}
.ee-person__tips__wrapper .popper__arrow {
  display: none;
}
</style>
<style lang="scss" scoped>
.ee-person {
  &__tag {
    position: relative;
    display: flex;
    align-items: center;
    &__label {
      margin-right: $base-gap;
    }
  }

  &__left {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
  }

  &__right {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  @mixin stackPersonItem($max, $unit) {
    @for $i from 2 through $max {
      &:nth-of-type(#{$i}) {
        position: absolute;
        left: $unit * ($i - 1);
        z-index: $max - $i;
      }
    }
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    z-index: 10;
    @include stackPersonItem(5, 18px);

    &__profile {
      position: relative;
      display: block;
      width: 24px;
      height: 24px;
      background-size: cover;
      background-repeat: no-repeat;
      border-radius: 50%;
      flex: 24px 0 0;

      &--border {
        &::after {
          position: absolute;
          content: '';
          top: -1px;
          right: -1px;
          bottom: -1px;
          left: -1px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 1);
        }
      }

      &__number {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-mini;
        background: transparent;
        color: $radio-color;

        &::after {
          position: absolute;
          content: '';
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          border-radius: 50%;
          border: 1px solid $radio-bg-color;
        }
      }
    }

    &__label {
      margin-left: $base-gap * 3;
      color: $secondary-text-color;
    }
  }

  &__tips {
    padding: $base-gap 0;

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 0;
      z-index: 10;
      padding: 6px 8px;
    }
  }
}
</style>
