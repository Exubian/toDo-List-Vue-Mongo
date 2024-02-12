<template>
  <div>
    <NavBar></NavBar>
    <div class="main-wrap">
      <h2>Вже не Дуже паскудний планувальник завдань</h2>
      <button @click="upgradeFields(items)">
        upgFiel
      </button>
      <button @click="getUserData(UId)">
        Send request
      </button>
      <input type="text" v-model="newTodoText" class="new-todo" 
        style="margin: 0 5px 0 5px"
        placeholder="Добавить Прооект"
        @keyup.enter="addItem(items, newTodoText)">
      <button class="projectAR" @click="addItem(items, newTodoText)">+</button>
      <div class="tasks-block mt-3">
        <ul v-if="items" class="tree-item0" v-for="item, i of filteredTodos" :key="item.id">
          <tree-item :items="item"  :underItem="filteredTodos" :index="i"> 
          </tree-item> 
        </ul>
      </div>
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        <span>{{ remaining > 4 || remaining === 0 ? ' завдань' : ' завдання' }} залишилося</span>
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">Усі</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">Активні</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">Завершені</a>
        </li>
      </ul>
    </div>
  </div>
  <div class="left-hang" v-if="logVisible" @click.right.prevent="logVisible=false">
    <p>Вцілому </p><p>не скаржусь</p> на <b>Вю</b> <br>
    <button @click="cnsLg">log items</button>
  </div> 
  <div class="replacement" v-if="!logVisible" @click="logVisible=true"></div>
</template>

<script>
const STORAGE_KEY = 'to-do-list'
const filters = {
  all: (items) => items,
  active: (items) => items.filter((item) => !item.completed),
  completed: (items) => items.filter((item) => item.completed)
}
const fieldsArr = ['id','level','title','description','completed','prevCompleted','repeat',
  'dueDate','subItems'
]

import TreeItem from './subcomponents/TreeItem.vue';
import { useStructure } from '/src/stores/list';
import { useAuth } from '@/stores/auth';
import axios from 'axios';


export default {  
  name:"MainPage",
  components: {
    TreeItem
  },
  data() {
    return {
      store: useStructure(),
      items: useStructure().items,
      level: 0,
      newTodoText: "",
      visibility: 'all',
      logVisible : true
    };
  },
  watch: {
    items: {
      handler(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        this.writeUserData(items);
      },
      deep: true
    }
  },
  computed: {
    filteredTodos() {
      return filters[this.visibility](this.items)
    },
    remaining() {
      return filters.active(this.items).length
    },
    UId() {
      return useStructure().uid
    }
  },
  methods: {
    addItem(parentItem, title) {
      if (!title) return;
      let maxId = 1; title = title.trim()
      for(let item of this.items) {
        if(item.id > maxId) maxId = item.id;
      }
      maxId++;
      
      const newItem = {
        id: maxId,
        level: 1,
        title: title || 'Project № '+maxId,
        description: '',
        completed: false,
        prevCompleted: false,
        repeat: { title: 'однократно', value: 'once' },
        dueDate: new Date(Date.now()+86400*1000),
        subItems: [],
      };
      if (!parentItem) {
        this.items.push(newItem);
      } else {
        parentItem.push(newItem);
      }
      this.newTodoText = "";
    },

    removeItem(parentItem, i) {
      if (!parentItem) {
        this.items.splice(i, 1);
      } else {
        parentItem.splice(i, 1);
      }
    },

    cnsLg() {
      console.log(this.items); console.log(useStructure().items)
    },

    async writeUserData(items) {
      try {
          const response = await axios.post(`http://localhost:3000/todos/${this.UId}`, items);
          console.log(`Data saved ${getCustomDate()}-${useStructure().count++}:`, response.data);
        } catch (error) {
          console.error('Error saving data:', error);
        }
    },

    async getUserData(uid) {
      try {
        const response = await axios.get(`http://localhost:3000/todos/${uid}`);
        console.log(`Responsed data ${getCustomDate()}:`, response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    onHashChange() {
      let visibility = window.location.hash.replace(/#\/?/, '')
      if (filters[visibility]) {
        this.visibility = visibility
      } else {
        window.location.hash = ''
        this.visibility = 'all'
      }
    },
    
    upgradeFields(obj, ...fields) {
      fields.length ? fields : fields = fieldsArr
      for (let i = 0; i < fields.length; i++) {
        if (Array.isArray(obj)) {
          for (let task of obj) {
            if (!task.subItems || !Array.isArray(task.subItems)) { 
              task.subItems = [] 
            };
            if( typeof task.repeat !== 'object' || task.repeat===null ) {
              task.repeat = {}
              task.repeat.title = "однократно"
              task.repeat.value = {}
            } 
            if (!task.repeat.title) {
              task.repeat.title = "однократно"
            }
            if (!task.repeat.value || typeof task.repeat.value!='object') {
              task.repeat.value = {};
            }
            if (!Object.keys(task).includes(fields[i]) ||task[fields[i]]=='unSet') {
              task[fields[i]] = '';
            }
          }  // recursion call
          if (obj[i]?.subItems?.length)this.upgradeFields( obj[i].subItems, ...fields )
        } 
        else if (!Object.keys(obj).includes(fields[i])) {
          for (let i = 0; i < Object.keys(obj).length; i++) {
            let task = (obj[i]);
            if (task.fields[i] == 'subItems') task.fields[i] = []
             else task[fields[i]] = ''
          }
        };
      }
      if (obj.subItems?.length) this.upgradeFields( obj.subItems, ...fields);
    },
    upgradeFields2(obj, ...fields) {
      if (Array.isArray(obj)) {
        for (let task of obj) {
          if (!task.subItems) {
            task.subItems = [];
          }
          for (let field of fields) {
            if (!Object.keys(task).includes(field) || task[field] === 'unSet') {
              task[field] = '';
            }
          }
          if (task.subItems.length) {
            this.upgradeFields2(task.subItems, ...fields);
          }
        }
      } else {
        for (let field of fields) {
          if (field === 'subItems' && !Array.isArray(obj[field])) {
            obj[field] = [];
          } else if (field === 'repeat' && typeof obj[field] !== 'object') {
            obj[field] = {};
          } else if (!Object.keys(obj).includes(field)) {
            obj[field] = '';
          }
        }
        if (obj.subItems?.length) {
          this.upgradeFields2(obj.subItems, ...fields);
        }
      }
    },
    
    logout() {
      useAuth().logout();
    }

  },

  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
    document.querySelector('body').style.backgroundColor='#ffffff'
    import('@/plugins/windowResize')
    
  },
};

</script>

<style>
  .tree-item0 {
    border: 2px solid red;
    margin-bottom: 5px;
  }
  .left-hang {
    position: absolute;
    left: 1%;
    bottom: 50%;
    display: inline-block;
  }
  .left-hang p {
    margin-bottom: 0;
  }
  .replacement {
    position: fixed;
    top: 50%;
    left: 1%;
    height: 3rem;
    width: 3rem;
    background-color: #4e82e1;
  }

</style>
