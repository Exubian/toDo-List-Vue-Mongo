<template>
  <nav class="navbar orange lighten-1">
    <div class="nav-wrapper">
      <div class="navbar-left">
        <span class="black-text">{{ $filters.dateFilter(date, 'datetime') }}</span>
      </div>

      <ul class="right hide-on-small-and-down">
        <li>
          <a class="dropdown-trigger black-text"
            href="" data-target="dropdown" ref="dropdown"
          >
          {{ UId || '{anonymys}' }}
            <i class="material-icons right">arrow_drop_down</i>
          </a>  

          <ul id='dropdown' class='dropdown-content'>
            
            <li>
              <a href="" @click.prevent="logout">
                <i class="material-icons">assignment_return</i>Выйти
              </a>
            </li>

          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { useAuth } from "@/stores/auth"
import { useStructure } from "@/stores/list";

export default {
  name: 'NavBar',
  data() {
    return{
      date: new Date(),
      interval: null,
      dropdown: null,
    }
  },
  computed: {
    UId() {
      return useStructure().uid;
    }
  },
  methods: {
    logout() {
      useAuth().logout();
      this.$router.push('/login?message=logout')
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.date = new Date()
    }, 1000)
    this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false
    })
  },
  beforeDestroy() {
    clearInterval(this.interval)
    if (this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy()
    }
  }
}
</script>

<style>
  .navbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px !important;
    padding: 0 2rem;
    z-index: 1;
  }
  .nav-wrapper,
  .navbar-left {
    justify-content: space-between;
    display: flex;
    align-items: center
  }
  .navbar-left>a {
    margin-right: 1rem
  }
  .right.hide-on-small-and-down {
    position: absolute;
    right: 0;
  }
  .black-text{
    font-weight: 600;
  }

</style>
