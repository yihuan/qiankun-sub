# 公用组件及使用示例

如果组件可以被其他项目通用，建议命名以`Ee`开头，以便以后封装到公用组件库中。

## 公用组件

### 表单元素验证组件(*FormItemWrapper*)

处理自定义组件在 Element Form 中无法触发验证的问题

- 属性
  - validateEvent {*Boolean*} - 是否验证事件，默认为 true
- Slot
  - default
- 事件
  - change - 元素的 change 事件
  - blur - 元素的 blur 事件
- 示例
  - 第一种方式

    ```html
    <FormItemWrapper @change="handleMemberChange">
      <template #default="{ change, blur }">
        <EeUser v-model="form.members" @change="change" @blur="blur" />
      </template>
    </FormItemWrapper>
    ```

    ```js
    function handleMemberChange(event) {
      // 包含的组件的真正的 change 事件
    }

    function handleMemberBlur(event) {
      // 包含的组件的真正的 blur 事件
    }
    ```

  - 第二种方式

    ```html
    <FormItemWrapper ref="memberRef ">
      <template #default="{ change, blur }">
        <EeUser v-model="form.members" @change="change" @blur="blur" />
      </template>
    </FormItemWrapper>
    ```

    ```js
    const memberRef = ref(null)
    // 第一种方式
    function handleMemberChange(event) {
      // 包含的组件的真正的 change 事件
      memberRef.value.change(event) // 传入 change 后的值
    }

    function handleMemberBlur(event) {
      // 包含的组件的真正的 blur 事件
      memberRef.value.blur(event)
    }
    ```

### 表格组件(*BaseTable*)

- 属性
  - loading {*Boolean*} - 加载状态
  - columns {*Object[]*} - 展示的列，格式：[{ name: String; key: String; slot: String}]，name：表头名称，key：对应的 data 数据的 key 值，slot：使用 slot 的名称
  - data {*Object[]*} - 数据
  - height {*String | Number*} - 高度
  - max-height {*String | Number*} - 最大高度
  - stripe {*Boolean*} - 是否为斑马纹 table
  - border {*Boolean*} - 是否带有纵向边框
  - show-header {*Boolean*} - 是否显示表头，默认为 true
  - row-key {*String|Function*} - 行数据的 key，与 el-table 同
  - sortable {*Boolean*} - 是否可拖动排序，打开会在第一列显示拖动图标
  - canSort {*Boolean*} - 是否有拖动排序权限（是否显示拖动按钮），默认为 true
  - notSortableIndices {*Number[]*} - 不可拖动排序行的 index 值数组
  - showIndex {*Boolean*} - 是否显示索引
  - indexWidth {*Number*} - 索引列宽度
  - showExpand {*Boolean*} - 是否显示行展开，为 true 时通过 slot expand 添加
- 事件
  - cell-setting - 鼠标滑过设置按钮点击事件钮，返回值为当前行的值（`showActions: true`）
  - cell-del - 鼠标滑过删除按钮点击事件钮，返回值为当前行的值（`showActions: true`）
  - sort-update - 拖动后列表更新时间，返回值为列表更新后的值
  - cell-mouse-enter - 单元格 hover 进入时触发
  - cell-mouse-leave - 单元格 hover 退出时触发
- Slot
  - [key]Actions - columns 中定义的 key 加 Actions，可以添加自定义按钮（鼠标滑过显示），需要 `showActions: true`，如 key 值为 name，则 slot 名称为 nameActions
  - expand - 如果`showExpand`为 true，则可配置展开行内容
- 其他
  - columns 中对象属性值
    - name {*String*} - 表头名称
    - key {*String*} - 对应数据中的 key 值
    - slot {*String*} - 使用 slot 的名称，如果设置，可以通过 slot 方式修改展示方式，如 slot 为 name，则是用方式如下：

      ```html
      <template #name="{ row }">{{ row.name }}</template>
      ````

    - tooltip {*Boolean*} - 内容过多是否省略号显示
    - headerSlot {*Boolean*} - 表头 slot，如为 `true` 则通过名为 `keyHeader` 的 `slot` 来制定，如：`nameHeader`
    - showActions {*Boolean*} - 是否显示操作按钮，如果配置了则在鼠标滑过当前行时在当前属性右侧展示操作按钮，默认为编辑和删除
    - width {*String*} - 与 `el-table Table-column` 列宽度属性一样
    - minWidth {*String*} - 与 `el-table Table-column` 列宽度属性一样

- 使用示例

  ```html
    <BaseTable :loading="loading" :columns="columns" :data="list" :show-expand="true" @cell-settings="handleSettings" @cell-del="handleDel">
      <template #name="{ row }"> <!-- name 使用 slot -->
        <h2>{{ row.name }}</h2>
      </template>
      <template #nameActions="{ row, index }"> <!-- 自定义操作按钮 slot -->
        <i
          class="iconfont icon-icon-16-bianjigongzuotai"
          @click="handleSettings(row, index)"
        ></i>
        <i
          class="iconfont icon-a-icon-16-fuzhi4x"
          @click="handleCopy(row)"
        ></i>
        <i
          class="iconfont icon-icon-16-shanchu"
          @click="handleDel(row)"
        ></i>
      </template>
      <template #expand="{ row }">
        {{ row.name }} plus expanded content
      </template>
    </BaseTable>
  ```

  ```js
  <script setup>
    import { ref } from 'vue'

    const loading = ref(false)
    const columns = [
      {
        name: '姓名',
        key: 'name',
        slot: 'name', // 使用 Slot
        showActions: true // 在 name 行后显示操作按钮
      },
      {
        name: '性别',
        key: 'gender'
      }
    ]
    const list = [
      {
        name: 'Sky',
        gender: 'M'
      },
      {
        name: 'Eve',
        gender: 'F'
      }
    ]

    function handleSettings(row) {}

    function handleDel(row) {}
  </script>
  ```

### 标签菜单(*TabMenu*)

- 属性
  - value(v-model) {*String|Number|Boolean*} - 当前选中值
  - menus {*Object[{label:String;value:String|Number|Boolean;}]*} - 显示菜单内容
  - size {*String*} - 大小
  - disabled {*Boolean*} - 禁用
- 事件
  - change - 菜单切换，参数为当前选中菜单 value

### 抽屉组件(*EeDrawer*)

- 属性
  - value(v-model) {*Boolean*} - 展示和隐藏抽屉
  - size - 大小，与 Element UI Drawer 相同
- Slot
  - title - 标题
- 事件
  - select - 菜单选择事件，返回值为菜单的 value
  - close - 抽屉关闭事件

### 工作项标签组件(*IconTag*)

- 属性
  - iconClass {*String*} - 图标 class
  - iconColor {*String*} - 图标颜色
  - iconfont {*Boolean*} - 是否是 iconfont 图标，默认为 true
  - text {*String*} - 标签文字
- 事件
  - click - 点击事件

### 页面头部菜单组件(*PageHeaderMenus*)

- 属性
  - value(v-model) {*String*} - 选中菜单的值
  - menus {*Array*} - 菜单数据，格式为：`[{label: String; value: String}]`
- Slot
  - Default - 菜单右侧操作区域
- 事件
  - select - 当前选中菜单，参数为菜单 `value` 值

### 包含页面名称布局组件(*PageVerticalLayout*)

- 属性
  - title {*String*} - 页面标题
- Slot
  - title - 页面标题
  - actions - 页面标题右侧操作区域

