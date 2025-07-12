import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import piniaPersistedState from "pinia-plugin-persistedstate";
import 'virtual:svg-icons-register'  // 必须引入一次，才能注册所有 <symbol>
import SvgIcon from '@/components/SvgIcon.vue'
import { IonicVue } from "@ionic/vue";

import {
  IonTabBar,
  IonBackButton,
  IonTabButton,
  IonTabs,
  IonNav,
  IonIcon,
  IonApp,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonContent,
  IonHeader,
  IonList,
  IonItem,
  IonTitle,
  IonCol,
  IonRow,
  IonGrid,
  IonInput,
  IonButton,
} from "@ionic/vue";

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
import "@ionic/vue/css/palettes/dark.system.css";
import "./assets/css/input.css";
/* Theme variables */
import "./theme/variables.css";

const pinia = createPinia();
pinia.use(piniaPersistedState);
const app = createApp(App).use(pinia).use(IonicVue).use(router);
app.component("IonTabBar", IonTabBar);
app.component("IonBackButton", IonBackButton);
app.component("IonNav", IonNav);
app.component("IonApp", IonApp);
app.component("IonTabButton", IonTabButton);
app.component("IonTabs", IonTabs);
app.component("IonLabel", IonLabel);
app.component("IonIcon", IonIcon);
app.component("IonPage", IonPage);
app.component("IonRouterOutlet", IonRouterOutlet);
app.component("IonContent", IonContent);
app.component("IonHeader", IonHeader);
app.component("IonList", IonList);
app.component("IonItem", IonItem);
app.component("IonTitle", IonTitle);
app.component("IonRow", IonRow);
app.component("IonCol", IonCol);
app.component("IonGrid", IonGrid);
app.component("IonInput", IonInput);
app.component("IonButton", IonButton);
app.component("SvgIcon", SvgIcon);
router.isReady().then(() => {
  app.mount("#app");
});
