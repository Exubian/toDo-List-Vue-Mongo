<template>
    
  <ul class="under-project" :class="{'open-project' : isOpen}" v-if="isProject">
    <hr>
    <div class="project-title" :class="{completed: items.completed, editing: isItemEdit}">
      <input class="toggle" type="checkbox" v-model="items.completed" 
        @change="updateCompletedStatus(items)"
      />
      <span class="" @click="editItem(items)" @dblclick="editItem(items)">{{ items.title }}</span>
      <TaskMenu type="main" :underItem="underItem" :i="index" 
        :isOpen="isOpen" :isAddingSub="isAddingSub" @toggle="toggle" 
        @remove-project="removeProject"
      />
      <TaskMenu type="menu" :isTaskMenuOpen="isTaskMenuOpen" 
        :isAddingSub="isAddingSub" :items="items"
        @menu-change="onMenuChange" @toggle="toggle" @done-edit="doneEdit" 
        @cansel-edit="canselEdit" @add-sub="addItem" @c-a="cA" @crutch="crutch"
      />
    </div>
    <input v-if="isItemEdit"
      class="edit" :class="{proj : isItemEdit}" type="text" v-model="editedTodo.title"
      @vue:mounted="({ el }) => el.focus()"
      
      @keyup.enter="doneEdit(items)"
      @keyup.escape="canselEdit()"
    />
    <!-- @blur="doneEdit(items)" -->
    <hr>
  </ul>

  <li v-if="!isProject" class="simple-item" >
    <hr>
    L {{ items.level }}
    <input class="toggle" type="checkbox" v-model="items.completed" 
      @change="updateCompletedStatus(items)"/>
    <span class="item-title " v-show="!isItemEdit" @click="editItem(items, 'isItemEdit')"
      @dblclick="editItem(items, 'isItemEdit')">{{items.title || '...'}}
    </span>
    <input v-if="isItemEdit"
      class="edit" type="text"
      v-model="editedTodo.title"
      @vue:mounted="({ el }) => el.focus()"

      @keyup.enter="doneEdit(items, 'isItemEdit')"
      @keyup.escape="canselEdit()"
    />
        
    <TaskMenu type="item" :items="items" :underItem="underItem" :i="index" 
      :isTaskMenuOpen="isTaskMenuOpen" @add-item="addItem" @remove-item="removeItem" 
      @menu-change="onMenuChange" @toggle="toggle" 
      @done-edit="doneEdit" @cansel-edit="canselEdit" @add-sub="addItem"  
    />
    <hr>
  </li>
  
  <ul class="tree-item" v-show="isOpen" v-if="items.subItems?.length" > 

    <tree-item 
      v-for="item, i in items.subItems" :key="item.id"
      :items="item" :index="i" :underItem="items"
      >
    </tree-item>
  </ul>
  
</template>

<script>
import { computed } from 'vue';
import TreeItem from './TreeItem.vue';
import TaskMenu from './TaskMenu.vue'
import { RepeatStatuses } from '@/plugins/repeatStatuses';

export default {
  name: 'TreeItem',
  components: {
    TreeItem: this,
    TaskMenu
  },
  props: {
    items: {
      type: Object,
      required: true,
    },
    underItem: {
      type: Object
    },
    index: {
      type: Number, 
      default: 0
    }
  },
  data() {
    return {
      isOpen: false,
      editedTodo: null,
      isItemEdit: false,
      isTaskMenuOpen: false,
      isEditDate: false,
      isEditCycle: false,
      isAddingSub: false,
      repeatStatuses: new RepeatStatuses()
    };
  },
  provide() { 
    return {
      isItemEdit: computed(() => this.isItemEdit),
      isEditDate: computed(() => this.isEditDate),
      isEditCycle: computed(() => this.isEditCycle),
      isAddingSub: computed(() => this.isAddingSub),
      repeatStatuses: computed(() => this.repeatStatuses),
      editedTodo: computed(() => this.editedTodo),
      items: computed(() => this.items)
    }
   },
  methods: {

    addItem(parentItem, title) {
      title=title.trim();
      if(!title) return;
      let maxId = 1;
        if (parentItem.subItems) {
        for(let item of parentItem.subItems) {
          if(item.id > maxId) maxId = item.id;
        }
        maxId++;
      }
      const newItem = {
        id: maxId,
        level: this.items.level+1,
        title: title,
        completed: false,
        prevCompleted: false,
        repeat: null,
        dueDate: getTomorrowDate(),
        subItems: [],
      };
      parentItem.subItems.push(newItem);

      // this.newTodoText="";
      this.isAddingSub = false;
      if (this.isProject == false) this.isProject = true;
    },

    removeProject(parentItem, i) {
      if (Array.isArray(parentItem)) {
        parentItem.splice(i, 1);
      } else {
        parentItem.subItems.splice(i, 1);
      }
    },
    
    removeItem(parentItem, i) {
      if (!parentItem.subItems) {
        parentItem.splice(i, 1)
      } else {
        parentItem.subItems.splice(i, 1);
      }
    },

    editItem(item, variable='isItemEdit') {
      this.editedTodo = excludeOne(item, "subItems");
      this[variable]=true;
    },
    doneEdit(item, variable='isItemEdit') {
      if (!this.editedTodo || !item.title) return;
      const oKeys = Object.keys(item);
      for (const key in this.editedTodo) {
        if (oKeys.includes(key)) {
          if (key=='title') { item[key]=this.editedTodo[key].trim(); continue }
          item[key] = this.editedTodo[key];
        }
      }
      this.editedTodo = null; this[variable]=false;
    },
    canselEdit( variable='isItemEdit') {
      this[variable] = false;
      this.editedTodo = null;
    },

    toggle(check, variable, event) {
      if(check === true) {
        if(this.isProject) {
          this.isOpen = !this.isOpen
        }
      } else {
        this[variable] = !this[variable]
        if(this[variable]) {
          document.body.style.overflow = 'hidden'; setPaddingBasedOnOverflow();
        } else {document.body.style.overflow = ''; setPaddingBasedOnOverflow();}
      }
    },

    onMenuChange(property) {
      if (property == 'isAddingSub') {
        this.isAddingSub=true;
      } else this.editItem(this.items, property);
    }, cA() { this.isAddingSub = false },
    
    updateCompletedStatus(items) {
      items.prevCompleted = items.completed;
      if (items.subItems?.length) {
        this.recursionCompletedStatus(items.subItems, items.completed);
      }
    },

    recursionCompletedStatus(items, status) {
      for (const item of items) {
        if (status) {
          item.completed = status;
        } else item.completed = item.prevCompleted;
        if (item.subItems && item.subItems.length > 0) {
          this.recursionCompletedStatus(item.subItems, status);
        }
      }
    },
    
    crutch(variable) {
      this[variable] = false;
    }
  },
  computed: {
    isProject() {
      return this.items?.subItems && this.items.subItems.length || this.items.level<2;
    },
    
  },
}
</script>
<style>
  .project-title {
    text-align: start;
    font-weight: 900;
    font-size: 18px;
  }
  .under-project {
    background-color: #f5f1f1;
  }
  .open-project {
    background-color: #d2ffce;
  }

  .tree-item {
    margin: 9px 0px 0px 10px;
    background-color: #cadafd;
  }

  input[type="checkbox"].toggle:not(:checked),
  input[type="checkbox"].toggle:checked {
    margin-top: 0.9em;
    pointer-events: auto;
    opacity: 0;
    z-index: 1;
  }
  input[type="checkbox"].toggle + span:before,
      input[type="checkbox"].toggle + span:after {
      pointer-events: none;
      opacity: 1; 
      
    }
  
</style>