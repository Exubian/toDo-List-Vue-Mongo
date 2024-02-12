<template>
  <nav class="navbar navbar-expand-lg bg-warning">
    <div class="container-fluid">
      <div class="navbar-left">
        <span class="black-text">{{ $filters.dateFilter(date, 'datetime') }}</span>
      </div>

      <ul class="navbar-nav mb-2 mb-lg-0">
        <li class="nav-item dropdown bg-light rounded-3">
          <a class="nav-link dropdown-toggle black-text"
            href="" role="button" data-bs-toggle="dropdown" aria-expanded="false"
          >
          {{ UId || '{anonymys}' }}
          </a>  

          <ul class='dropdown-menu'>
            <li>
              <a class="dropdown-item" href="" @click.prevent="logout">
                <i class="material-icons">assignment_return</i> Выйти
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
    /* this.dropdown = M.Dropdown.init(this.$refs.dropdown, {
      constrainWidth: false
    }) */
  },
  beforeDestroy() {
    clearInterval(this.interval)
    if (this.dropdown && this.dropdown.destroy) {
      this.dropdown.destroy()
    }
  }
}
</script>

<style scoped>
  .navbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 64px !important;
    margin-bottom: 1em;
    padding: 0 2rem;
    z-index: 1;
  }
  .black-text{
    font-weight: 600;
  }

</style>
