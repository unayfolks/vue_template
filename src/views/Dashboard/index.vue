<template>
  <div>
    <div class="flex justify-around my-10">
      <button class="btn btn-success" @click="toastSuccess">Allert Success</button>
      <button class="btn btn-danger" @click="toastError">Allert Error</button>
      <button class="btn btn-info" @click="toastInfo">Allert Info</button>
      <button class="btn btn-warning" @click="toastWarning">Allert Warning</button>
    </div>
    <div class="flex justify-around">
      <button @click="openAlertDialog">Alert Dialog</button>
      <button @click="openAlertConfirmation">Alert Confirmation</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import Swal from 'sweetalert2';

const toast = useToast();
const isShow = ref(false)
const toastSuccess = () => {
  toast.success(" Login  successfully", {
    pauseOnHover: true,
    timeout: 2000,
  });
}
const toastError = () => {
  toast.error(" Password not match ", {
    pauseOnHover: false,
    timeout: 2000,
  });
}
const toastInfo = () => {
  toast.info(" Info ", {
    pauseOnHover: false,
    timeout: 2000,
  });
}
const toastWarning = () => {
  toast.warning(" Warning ", {
    pauseOnHover: false,
    timeout: 2000,
  });
}
const openAlertDialog = () => {
  Swal.fire("Tersimpan!", "Menu berhasil disimpan", "success");

}
const openAlertConfirmation = () => {
  Swal.fire({
    title: "Apakah data ini ingin dihapus?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Ya",
    denyButtonText: `Jangan`
  }).then(async (result) => {
    if (result.isConfirmed) {
      toast.success("Data berhasil dihapus", {
        pauseOnHover: true,
        timeout: 2000,
      });
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}
</script>
<!--
! ! vue toast documentation !!
* https://github.com/Maronato/vue-toastification
-->
<style lang=""></style>
