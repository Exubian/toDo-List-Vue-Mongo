<template>
  <button @click="logout"
    class="exit" hidden>Выйти
  </button>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">Войдите</span>
      <div class="input-field">
        <input 
            id="email"
            type="text"
            v-model.trim="email"
            :class="{invalid: (v$.email.$dirty && v$.email.required.$invalid) || (v$.email.$dirty && v$.email.email.$invalid)}"
        >
        <label for="email">Email</label>
        <small 
          class="helper-text invalid"
          v-if="v$.email.$dirty && v$.email.required.$invalid"
        >Поле Email не должно быть пустым</small>
        <small 
          class="helper-text invalid"
          v-else-if="v$.email.$dirty && v$.email.email.$invalid"
        >Введите корретный Email</small>
      </div>
      <div class="input-field">
        <input 
            id="password"
            type="password"
            v-model.trim="password"
            :class="{invalid: (v$.password.$dirty && v$.password.required.$invalid) || (v$.password.$dirty && v$.password.minLength.$invalid)}"
        >
        <label for="password">Пароль</label>
        <small 
          class="helper-text invalid"
          v-if="v$.password.$dirty && v$.password.required.$invalid"
        >
          Введите пароль
        </small>
        <small 
          class="helper-text invalid"
          v-else-if="v$.password.$dirty && v$.password.minLength.$invalid"
        >
          Пароль должен быть {{v$.password.minLength.$params.min}} символов. Сейчас он {{password.length}}
        </small>
      </div>
    </div>
    <div class="card-action">
      <Loading v-if="isSend" :type="'in'" />
      <div v-else>
        <button
            class="btn waves-effect waves-light auth-submit"
            type="submit"
        >
          Войти
          <i class="material-icons right">send</i>
        </button>
      </div>

    </div>
  </form>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import {email, required, minLength} from '@vuelidate/validators';
import { useAuth } from "@/stores/auth";

export default {
  name:"Login",
  data() {
    return {
      email: '',
      password: '',
      isSend: false,
      wrongAuth: {
        email: false,
        password: false
      }
    }
  },
  mounted() {
    // if (messages[this.$route.query.message]) {
    //   this.$message(messages[this.$route.query.message])
    // }
  },
  methods: {
    async submitHandler() {
      if (this.v$.$invalid) {
        this.v$.$touch()
        return
      }
      const formData = {
        email: this.email,
        password: this.password
      }
      this.isSend = true;
      
        useAuth().login(formData).then((val) => {
          this.isSend = false;
        })
        
        
    },
    logout() {
      useAuth().logout()
    }
  },
  validations() {
    return {
      email: {email, required},
      password: {required, minLength: minLength(6)}
    }
  },
  setup () {
    return { v$: useVuelidate() };
  },
  mounted(){
    document.body.style.backgroundColor='#7e7e7e'
  }
}
</script>

<style scoped>
  @import '/node_modules/materialize-css/dist/css/materialize.min.css';
</style>
