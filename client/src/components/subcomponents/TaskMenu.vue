<template>
  <div v-if="type=='main' && !menuItems?.[0]?.editing" class="main-buttons">
    <button class="toggle-button" @click="$emit('toggle', true)">{{ isOpen ? '▽' : '▶' }}</button>
    <button class="remove-button" @click="$emit('removeProject', underItem, i)">
      <i class="small material-icons">clear</i>
    </button>
    
  </div>
  
  <div v-if="type=='menu' && !menuItems?.[0]?.editing" class="menu-buttons">
    <button @click="$emit('toggle', '','isTitleMenu', $event)" ref="titleMenuButton">
      ︙
    </button>
  </div>

  <div class="task-info-menu" v-if="isTitleMenu&&type=='menu'" 
  @click.stop="$emit('toggle', '','isTitleMenu')"   >
    <div class="menu-content" @click.stop> 
      <span class="item-title">{{ items.title }}</span>
      <button v-for="button in menuItems" :key="button.label" @click.stop="$emit('on-item-click', button)">
        {{ button.label }}
      </button>
    </div>
  </div>
  <div class="task-info-menu" v-if="isItemMenu&&type=='item'" 
  @click.stop="$emit('toggle', '','isItemMenu')"    >
    <div class="menu-content" @click.stop>
      <span class="item-title">{{ items.title }}</span>
      <button @click.stop="$emit('date-edit', items, 'isEditDate')">
        {{ items.dueDate || "Установить Дату" }}
      </button>
      <button @click.stop="$emit('cycle-edit', items, 'isEditCycle')">
        {{ items.repeat || "Повторять" }}
      </button>
    </div>
  </div>

  <div v-if="type=='item'" class="item">
    <button class="projectAR" @click="$emit('add-item', items, 'titleSubEl')">+</button>
    <button @click="$emit('remove-item', underItem, i)" class="remove-button">
      <i class="small material-icons">clear</i>
    </button>
    <button @click="$emit('toggle', '','isItemMenu', $event)" 
      > <!--@blur="toggle('','isItemMenu')"-->
      ︙
    </button>
    
  </div>
</template>

<script>

export default {
  name: 'TaskMenu',
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
    isTitleMenu: {
      type: Boolean
    },
    isItemMenu: {
      type: Boolean
    },
    menuPosition: {
      type: Object
    },
    menuItems: {
      type: Array
    },
    items: {
      type: Object
    }
  },
  emits: ['toggle', 'removeProject', 'on-item-click', 'add-item', 'remove-item', 
    'date-edit', 'cycle-edit'
  ],

}
</script>

<style scoped>
  .main-buttons, .menu-buttons, .item{
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
}
.menu-content {
  left: 15px;
  width: 98.9%;
  height: 105%;
  background-color: #feebeb;
  border: 1px solid black;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  padding: 10px 20%;
  /* box-sizing: border-box; */
}
.task-info-menu button, .item-title{
  margin-right: 10px;
}


</style>