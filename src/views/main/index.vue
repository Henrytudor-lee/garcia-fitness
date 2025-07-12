<template>
    <ion-app>
      <ion-page>
          <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
          <ion-tab-bar slot="bottom">
            <ion-tab-button tab="home" href="/pages/home">
              <svg-icon name="home"></svg-icon>
              <ion-label>Home</ion-label>
            </ion-tab-button>
  
            <ion-tab-button tab="action" href="/pages/action">
              <svg-icon name="exercise"></svg-icon>
              <ion-label>Library</ion-label>
            </ion-tab-button>
            <ion-tab-button tab="stat" href="/pages/stat">
              <svg-icon name="static"></svg-icon>
              <ion-label>Statistics</ion-label>
            </ion-tab-button>
  
            <ion-tab-button tab="mine" href="/pages/mine">
              <svg-icon name="mine"></svg-icon>
              <ion-label>Mine</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </ion-page>
    </ion-app>
  </template>
  
  <script setup lang="ts">
  import { IonApp } from "@ionic/vue";
  import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonPage,
    IonRouterOutlet,
  } from "@ionic/vue";
  </script>
  