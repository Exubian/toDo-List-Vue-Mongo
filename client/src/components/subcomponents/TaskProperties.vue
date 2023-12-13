<template>
  <input v-if="isItemEdit"
    class="edit" :class="{proj : isItemEdit}" type="text" v-model="editedTodo.title"
    @vue:mounted="({ el }) => el.focus()"
    @blur="doneEdit(items)"
    @keyup.enter="doneEdit(items)"
    @keyup.escape="canselEdit()"
  />
  <input v-if="isEditDate"
    class="edit-date" type="datetime-local" v-model="editedTodo.dueDate"
    @vue:mounted="({ el }) => el.focus()"
    @keyup.enter="doneEdit(items, 'isEditDate')"
    @blur="doneEdit(items, 'isEditDate')"
    @keyup.escape="canselEdit('isEditDate')"
  />
  <select v-if="isEditCycle"
    class="edit-cycle" v-model="editedTodo.repeat"
    @vue:mounted="({ el }) => el.focus()"
    @blur="doneEdit(items, 'isEditCycle')"
    @keyup.escape="canselEdit('isEditCycle')"
  >
    <option v-for="status of repeatStatuses.mainStatus" :value="status">{{ status }}</option>
  </select>
  <input v-if="isAddingSub" 
    class="new-todo" type="text" v-model="newTodoText" 
    style="margin: 0 5px 0 5px"
    placeholder="Добавить подзадачу"
    @vue:mounted="({ el }) => el.focus()"
    @keyup.enter="addItem(items, newTodoText)"
    @keyup.escape="$emit('c-a')"
  /> <!-- @blur="isAddingSub=false" -->
  <button v-if="isAddingSub" 
    class="projectAR" @click="addItem(items, newTodoText)"> +
  </button>
</template>

<script>

export default {
  inject: ['isItemEdit', 'isEditDate', 'isEditCycle', 'isAddingSub', 
    'repeatStatuses', 'editedTodo', 'items'
  ],
  data() {
    return {
      newTodoText: "",
  //     isItemEdit: this.isItemEdit,
  //     isEditDate: this.isEditDate,
  //     isEditCycle: this.isEditCycle,
  //     isAddingSub: this.isAddingSub,
  //     repeatStatuses: this.repeatStatuses,
  //     editedTodo: this.editedTodo,
  //     items: this.items
    }
  },
  emits: ['add-sub','c-a', 'done-edit', 'cansel-edit'],
  methods: {
    addItem(parentItem, title) {
      this.$emit('add-sub', parentItem, title);
      this.newTodoText = "";
    },
    doneEdit(item, variable) {
      this.$emit('done-edit', item, variable);
    },
    canselEdit( variable) {
      this.$emit('cansel-edit', variable);
    }
  }
}
</script>