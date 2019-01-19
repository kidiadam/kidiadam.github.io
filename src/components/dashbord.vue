<template>
  <div>
      <Navbar/> 
      <Alert/>  
    <div class="container-fluid">
      <div class="row">
          <Sidebar/>
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <router-view></router-view>
        </main>
      </div>
    </div>

  </div>
</template>
<script>
import Navbar from './navbar';
import Sidebar from './sidebar';
import Alert from './alertMessage';

export default {
    components:{
        Navbar,
        Sidebar,
        Alert,
    }
}
</script>

