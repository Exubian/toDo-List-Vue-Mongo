<template>
  <div v-if="type=='main' && !isAddingSub" class="main-buttons">
    <button class="toggle-button" @click="$emit('toggle', true)">
      <span class="material-symbols-outlined">
        {{ isOpen ? '▽' : ' > ' }}
      </span>
    </button>
    <button class="remove-button" @click="$emit('removeProject', underItem, i)">
      <i class="small material-icons">clear</i>
    </button>
    <button @click="$emit('toggle', '','isTaskMenuOpen', $event)">
      ︙
    </button>    
  </div>

  <div class="task-info-menu" v-if="isTaskMenuOpen" 
  @click.stop="$emit('toggle', '','isTaskMenuOpen')"   >
    <div class="menu-content" @click.stop> 
      <span class="item-title">{{ items.title }}</span>
      <TaskProperties v-if="isEditProperties"
        @done-edit="doneE" @cansel-edit="canselE" @add-sub="addS" @c-a="cA" @crutch="other"
      />
      <button v-for="button in menuItems" :key="button.label" @click.stop="button.action">
        {{ button.label }}
      </button>
    </div>
  </div>
  
  <div v-if="type=='item'" class="item">
    <button class="projectAR" @click="$emit('add-item', items, 'titleSubEl')">+</button>
    <button @click="$emit('remove-item', underItem, i)" class="remove-button">
      <i class="small material-icons">clear</i>
    </button>
    <button @click="$emit('toggle', '','isTaskMenuOpen', $event)">
      ︙
    </button>
    
  </div>
</template>

<script>
import { computed } from 'vue';
import TaskProperties from './TaskProperties.vue';

export default {
  name: 'TaskMenu',
  components: { TaskProperties },
  props: {
    type: {
      type: String,
      required: true
    },
    underItem: {
      type: Object
    },
    i: {
      type: Number
    },
    isOpen:{
      type: Boolean
    },
    isTaskMenuOpen: {
      type: Boolean
    },
    menuPosition: {
      type: Object
    },
    isAddingSub: {
      type: Boolean
    },
    items: {
      type: Object
    }
  },
  emits: ['toggle', 'remove-project', 'menu-change', 'add-item', 'remove-item', 
    'date-edit', 'cycle-edit', 'add-sub','c-a', 'done-edit', 'cansel-edit', 'crutch'
  ],
  data() {
    return {
      isEditProperties: false,
      menuItems: [
        { label:"Add subtask", 
          action: () => {
            this.$emit('menu-change', 'isAddingSub');
            this.isEditProperties = true
          }
        },
        { label: computed(() => this.items.dueDate || "Установить Дату"),
          action: () => {
            this.$emit('menu-change', 'isEditDate')
            this.isEditProperties = true
          }
        },
        { label: computed(() => this.items.repeat.title || this.items.repeat || "Повторять"),
          action: () => {
            this.$emit('menu-change', 'isEditCycle')
            this.isEditProperties = true
          }
        },
      ],      
    }
  },
  methods: {
    addS(parentItem, title) {
      this.$emit('add-sub', parentItem, title);
      this.toggle();
    },
    doneE(item, variable) {
      this.$emit('done-edit', item, variable);
      this.toggle();
    },
    canselE(variable) { 
      this.$emit('cansel-edit', variable);
      this.toggle();
    },
    cA() { this.$emit('c-a'); this.toggle() },
    other(variable) {
      this.$emit('crutch', variable);
      this.isEditProperties = false;
    },

    toggle(variable = 'isEditProperties') {
      this[variable] = !this[variable];
    }
  }

}
</script>

<style scoped>
  .main-buttons, .item{
    display: inline-block;
    margin-left: 5px;
  }

  .task-info-menu {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3;
  padding: 10% 0 0;
  font-size: 18px;
  font-weight: 600;
}
.menu-content {
  left: 15px;
  width: 100%;
  height: 105%;
  background-color: #feebeb;
  border: 1px solid black;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  padding: 10px 1% 0 3%;
}
.task-info-menu button, .item-title{
  margin-right: 10px;
}


</style>