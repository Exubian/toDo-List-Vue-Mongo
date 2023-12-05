<template>
    
  <ul class="under-project" :class="{'open-project' : isOpen}" v-if="isProject">
    <hr>
    <div class="project-title" :class="{completed: items.completed, editing: isItemEdit}">
      <input class="toggle" type="checkbox" v-model="items.completed" 
        @change="updateCompletedStatus(items)"
      />
      
      <span class="with-gap" @click="editItem(items)" @dblclick="editItem(items)">{{ items.title }}</span>
      <TaskMenu type="main" :underItem="underItem" :i="index" 
        :isOpen="isOpen" :menuItems="menuItems" @toggle="toggle" 
        @remove-project="removeProject"
      />
      <TaskMenu type="menu" :isTitleMenu="isTitleMenu" 
        :menuPosition="menuPosition" :menuItems="menuItems" :items="items"
        @on-item-click="onItemClick" @toggle="toggle" 
      />
    </div>
    <input v-if="isItemEdit"
      class="edit" :class="{proj : isItemEdit}" type="text" v-model="editedTodo.title"
      @vue:mounted="({ el }) => el.focus()"
      @blur="doneEdit(items)"
      @keyup.enter="doneEdit(items)"
      @keyup.escape="canselEdit(items)"
    />

    <input v-if="isEditDate"
      class="edit-date" type="datetime-local" v-model="editedTodo.dueDate"
      @vue:mounted="({ el }) => el.focus()"
      @keyup.enter="doneEdit(items, 'isEditDate')"
      @keyup.escape="canselEdit(items, 'isEditDate')"
    />

    <select v-if="isEditCycle"
      class="edit-cycle" v-model="editedTodo.repeat"
      @vue:mounted="({ el }) => el.focus()"
      @blur="doneEdit(items, 'isEditCycle')"
      @keyup.escape="canselEdit(items, 'isEditCycle')"
    ><option v-for="status of repeatStatuses.mainStatus" :value="status">{{ status }}</option></select>
    <!-- @keyup.enter="doneEdit(items, 'isEditCycle')" -->
        
    <input v-if="menuItems[0].editing" 
      class="new-todo" type="text" v-model="newTodoText" 
      style="margin: 0 5px 0 5px"
      placeholder="Добавить подзадачу"
      @vue:mounted="({ el }) => el.focus()"
      @keyup.enter="addItem(items, newTodoText)"
      @keyup.escape="menuItems[0].editing=false"
    /> <!-- @blur="menuItems[0].editing=false" -->
    <button v-if="menuItems[0].editing" 
      class="projectAR" @click="addItem(items, newTodoText)"> +
    </button>

    <hr>
  </ul>

  <li v-if="!isProject" class="simple-item" >
    <hr>
    L {{ items.level }}
    <input class="toggle" type="checkbox" v-model="items.completed" 
      @change="updateCompletedStatus(items)"/>
    <span class="item-title with-gap" v-show="!isItemEdit" @click="editItem(items, 'isItemEdit')"
      @dblclick="editItem(items, 'isItemEdit')">{{items.title || '...'}}
    </span>
    <input v-if="isItemEdit"
      class="edit" type="text"
      v-model="editedTodo.title"
      @vue:mounted="({ el }) => el.focus()"

      @keyup.enter="doneEdit(items, 'isItemEdit')"
      @keyup.escape="canselEdit(items)"
    /><!--       @blur="doneEdit(items, 'isItemEdit')" -->

    <input v-if="isEditDate"
      class="edit-date" type="datetime-local" v-model="editedTodo.dueDate"
      @vue:mounted="({ el }) => el.focus()"
      @keyup.enter="doneEdit(items, 'isEditDate')"
      @keyup.escape="canselEdit(items, 'isEditDate')"
    />

    <select v-if="isEditCycle"
      class="edit-cycle" v-model="editedTodo.repeat"
      @vue:mounted="({ el }) => el.focus()"
      @blur="doneEdit(items, 'isEditCycle')"
      @keyup.escape="canselEdit(items, 'isEditCycle')"
    ><option v-for="status of repeatStatuses.mainStatus" :value="status">{{ status }}</option></select>
        
    <TaskMenu type="item" :items="items" :underItem="underItem" :i="index" 
      :isItemMenu="isItemMenu" :menuPosition="menuPosition"
      @add-item="addItem" @remove-item="removeItem" @toggle="toggle" 
      @date-edit="editItem" @cycle-edit="editItem" 
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
import TreeItem from './TreeItem.vue';
import TaskMenu from './TaskMenu.vue'
import { repeatStatuses } from '@/plugins/types';

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
  setup() {  },
  data() {
    return {
      menuItems: [
        { label:"Add subtask", editing: false, 
          action: () => {this.menuItems[0].editing = true; } 
        },
        { label: this.items.dueDate || "Установить Дату", 
          action: () => this.editItem(this.items, 'isEditDate')
        },
        { label: this.items.repeat || "Повторять", 
          action: () => this.editItem(this.items, 'isEditCycle')
        },
      ],
      menuPosition: {
        top: 0,
        left: 0
      },
      newTodoText: "",
      isOpen: false,
      editedTodo: null,
      isItemEdit: false,
      isTitleMenu: false,
      isItemMenu: false,
      isElemMenu: false,
      isEditDate: false,
      isEditCycle: false,
      // isRepeat: ['once', 'repeat'],
      repeatStatuses: repeatStatuses
    };
  },
  methods: {

    addItem(parentItem, title) {
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
        title: title.trim(),
        completed: false,
        prevCompleted: false,
        repeat: null,
        dueDate: getTomorrowDate(),
        subItems: [],
      };
      parentItem.subItems.push(newItem);

      this.newTodoText="";
      this.menuItems[0].editing = false;
      if (this.isProject == false) this.isProject = true;
      document.body.style.overflow = '';
    },

    removeProject(parentItem, i) {
      // console.log(parentItem, "| ",i);
      if (Array.isArray(parentItem)) {
        parentItem.splice(i, 1);
      } else {
        parentItem.subItems.splice(i, 1);
      }
    },
    
    removeItem(parentItem, i) {
      if (!parentItem.subItems) {
        parentItem.splice(i, 1)
        // console.log("How does it happend ?")
      } else {
        parentItem.subItems.splice(i, 1);
      }
    },

    editItem(item, variable='isItemEdit') {
      this.isItemMenu=false;
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
      document.body.style.overflow = '';
    },
    canselEdit(item, variable='isItemEdit') {
      this[variable] = false;
      this.editedTodo = null;
      document.body.style.overflow = '';
    },

    toggle(check, variable, event) {
      if(check === true) {
        if(this.isProject) {
          this.isOpen = !this.isOpen
        }
      } else {
        this[variable] = !this[variable]
        if(this[variable]) {
          // this.calculateMenuPosition(event.target)
          document.body.style.overflow = 'hidden';
        } else document.body.style.overflow = '';
      }
    },
    calculateMenuPosition(target) {
      const buttonRect = target.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.menuPosition.top = ((window.innerHeight*0.3 + scrollTop) < (buttonRect.bottom + scrollTop)) ?
      window.innerHeight*0.3 + scrollTop +"px" : buttonRect.bottom + scrollTop +'px';
      this.menuPosition.left = "15px"; // buttonRect.left + "px";
    },

    onItemClick(item) {
      item.action(); 
      this.isTitleMenu = false;
    },
    
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
    /* padding-bottom: 2px; */
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