<template>
  <ion-app>
    <ion-page>
      <ion-router-outlet></ion-router-outlet>
    </ion-page>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp } from "@ionic/vue";
import {
  IonPage,
  IonRouterOutlet,
} from "@ionic/vue";
</script>
