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
    class="edit-cycle" v-model="editedTodo.repeat.title"
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
    <button class="next-select" :class="{'toggles': selectedStatusValue?.[selectedStatusValue?.indexOf(status)]}" 
      v-if="selectedCycle != 'everyMonthDays' && selectedCycle != 'everyYear'"
      v-for="status in repeatStatusesNext[selectedCycle].next.select" 
      @click="handleStatusButton(repeatStatuses[selectedCycle].next.optionValue, status)"
      >
      {{ status }}
    </button>
    <div v-if="selectedCycle == 'everyMonthDays' || selectedCycle == 'everyYear'">
      <button v-for="status in repeatStatusesNext[selectedCycle].next.select[currentOptionValue[0]]"
        :class="{'toggles': selectedStatusValue?.[currentOptionValue[0]]?.[selectedStatusValue?.[currentOptionValue[0]]?.indexOf(status)]}"
        @click="handleStatusButton(currentOptionValue[0], status)"
        >
        {{ status }}
      </button>
      <div class="vr ms-1 me-1"></div>
      <button v-for="status in repeatStatusesNext[selectedCycle].next.select[currentOptionValue[1]]" class="next-select"
        :class="{'toggles': selectedStatusValue?.[currentOptionValue[1]]?.[selectedStatusValue?.[currentOptionValue[1]]?.indexOf(status)]}"
        @click="handleStatusButton(currentOptionValue[1], status)"
        >
        {{ status }}
      </button>
    </div>
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
import { RepeatStatuses } from '@/plugins/repeatStatuses';
import dateFilter from '@/filters/dateFilter';
import { isEqual } from 'lodash';
import { computed } from 'vue';

export default {
  inject: ['isItemEdit', 'isEditDate', 'isEditCycle', 'isAddingSub', 
    'editedTodo', 'items'
  ],
  emits: ['add-sub','c-a', 'done-edit', 'cansel-edit', 'crutch'],
  data() {
    return {
      newTodoText: "",
      nextCycleOpen: false,
      repeatStatuses: computed(() => {
        if (this.editedTodo) {
          return new RepeatStatuses(this.editedTodo)
        } else return undefined;
      }),
      repeatStatusesNext: computed(() => {
        if (this.editedTodo){
          return this.containsNext(this.editedTodo)
        } else undefined;
      }),
      selectedCycle: this.initCycleStatus() || undefined,
      selectedStatusValue: undefined
    }
  },
  watch: {
    isEditCycle: {
      handler(isEditCycle) {
        if(isEditCycle !== true) {
          this.nextCycleOpen = false
        }
        else if ( this.repeatStatusesNext.hasOwnProperty(this.selectedCycle) ) {
          this.nextCycleOpen = true
          this.selectedCycle = this.initCycleStatus() || undefined
        }
      }
    }
  },
  computed: {
    currentOptionValue() {
      return this.repeatStatuses[this.selectedCycle]?.next?.optionValue || 'static'
    }
  },
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
      this.changeItemRepeatValue(this.editedTodo.repeat, this.currentOptionValue)
      this.isSelected(this.currentOptionValue)
      for (let status in this.repeatStatusesNext) {
        if ( this.repeatStatusesNext[status].title.includes(trg.value) ) {
          this.nextCycleOpen = true; 
           return;
        }
      }
      this.nextCycleOpen = false; return;
    },
    
    initCycleStatus() {
      const statuses = new RepeatStatuses(this.items)
      for (const status in statuses) {
        if (statuses[status].title == this.items.repeat.title) {
          return status
        }
      }
    },

    toggle(variable='nextCycleOpen') {
      this[variable] = !this[variable];
    },

    handleStatusButton(option, status) {
      let repeat = this.editedTodo.repeat
      // this.changeItemRepeatValue(repeat, option)

      if ( !repeat.value[option].includes(status) ) {
        repeat.value[option].push(status)
        const opt = (option == 'day') ? 'week-day' : (option == 'week') ? 
          'word' : (option == 'month') ? 'month' : undefined
        repeat.value[option].customSort(opt)
      }
      else {
        repeat.value[option] = repeat.value[option].filter(item => item !== status)
      }
      repeat.title = this.repeatStatuses[this.selectedCycle].title

      this.isSelected(this.currentOptionValue)
    },
    changeItemRepeatValue(repeat, option) {
      if(typeof this.currentOptionValue != 'object') {
        if (!repeat.value?.[option] || Object.keys(repeat.value).length>1) {
          repeat.value = {};
          // repeat.value[option] = [];
          if (this.repeatStatuses[this.selectedCycle]?.next?.optionValue=='day') {
            repeat.value[option] = [dateFilter(Date.now(), 'day-short')]
          }
          else if (this.repeatStatuses[this.selectedCycle]?.next?.optionValue=='number') {
            repeat.value[option] = [ dateFilter(Date.now(), 'num')]
          } 
          else if (this.repeatStatuses[this.selectedCycle].title) {
            repeat.value[option] = [this.repeatStatuses[this.selectedCycle].title]
          } else repeat.value[option] = ['однократно']
        }
      }
      else {
        const tempVal = {}
        if (!repeat.value?.[option] || !isEqual(Object.keys(repeat.value), this.currentOptionValue)) {
          repeat.value = {}
        }
        for (const key in repeat.value) {
          if (this.currentOptionValue.includes(key)) {
            tempVal[key] = repeat.value[key]
          }
        }
        repeat.value = tempVal
        this.currentOptionValue.forEach(item => {
          if (!repeat.value[item]) {
            repeat.value[item] = 
            [(this.repeatStatuses[this.selectedCycle]?.next?.select?.[item][0] ||
            this.repeatStatuses[this.selectedCycle]?.next?.select)] 
          }
        });
      }
    },
    isSelected(option) {
      if (!option) return undefined;
      if (Array.isArray(option)) {
        this.selectedStatusValue = {}
        for (let value of option) {
          this.selectedStatusValue[value] = this.editedTodo.repeat.value[value] || []
        }
        return this.selectedStatusValue
      }
      this.selectedStatusValue = this.editedTodo?.repeat?.value?.[option] || []
      return this.selectedStatusValue
    },

    containsNext(object) {
      const obj = new RepeatStatuses(object)
      const retObj = {};
      for (const key in obj) {
        if (obj[key].next) {
          retObj[key] = obj[key];
        }
      }
      return retObj;
    }
  },
  mounted() {
    const repeatItems = new RepeatStatuses(this.items)
    const option = repeatItems[this.selectedCycle]?.next?.optionValue
    this.selectedStatusValue = this.items?.repeat?.value?.[option]||this.items?.repeat?.value
    if (this.repeatStatusesNext?.hasOwnProperty(this.selectedCycle)) {
      this.nextCycleOpen = true
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
  .toggles {
    background-color: blue;
  }
  
</style>