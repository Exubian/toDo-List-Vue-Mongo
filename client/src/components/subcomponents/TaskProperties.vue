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
  <div class="cycle-block">
  <select v-if="isEditCycle"
    class="edit-cycle" v-model="editedTodo.repeat"
    @change="handleChange($event.target)"
    @vue:mounted="({ el }) => el.focus()"
    @click.right.prevent="doneEdit(items, 'isEditCycle')"
    @keyup.escape="canselEdit('isEditCycle')"
    >
    <option v-for="status in repeatStatuses" :value="status.title" @keyup.escape.stop>
      {{ status.title }}
    </option>
  </select>
  <div class="next" v-if="nextCycleOpen" @click.right.prevent="toggle()">
    <button class="next-select" v-for="status in repeatStatusesNext[selectedCycle].next.select">
      {{ status }}
    </button>
  </div>
  </div>
  <br>
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
      selectedCycle: null,
      nextCycleOpen: false,
      repeatStatusesNext: this.containsNext(this.repeatStatuses)
    }
  },
  watch:{
    isEditCycle: {
      handler(isEditCycle) {
        if(isEditCycle !== true) this.nextCycleOpen = false;
      }
    }
  },
  emits: ['add-sub','c-a', 'done-edit', 'cansel-edit', 'crutch'],
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
    },

    handleChange(trg) {
      for (const status in this.repeatStatuses) {
        if (this.repeatStatuses[status].title == trg.value) {
          this.selectedCycle = status; break;
        }
      }
      
      for (let status in this.repeatStatusesNext) {
        if ( this.repeatStatusesNext[status].title.includes(trg.value) ) {
          return this.nextCycleOpen = true;
        }
      }
      return this.nextCycleOpen = false;
    },

    toggle(variable='nextCycleOpen') {
      this[variable] = !this[variable];
    },

    containsNext(obj) {
      const retObj = {};
      for (const key in obj) {
        if (obj[key].next) {
          retObj[key] = obj[key];
        }
      }
      return retObj;
    }
  },
  beforeUnmount() {
    this.$emit('crutch', 'isEditCycle')
  }
}
</script>
<style scoped>
  .next{
    display: flex;
  }
  .next-select{
    width: 2em;
  }
  
</style>