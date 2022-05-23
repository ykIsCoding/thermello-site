import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store/index";
import { NDatePicker, NButton,NCard,NDivider,NInput,NForm,NFormItem,NInputGroup,NSpace,NInputNumber} from 'naive-ui'

//import Buefy from "buefy"


const app = createApp(App)
app.component('NButton',NButton)
app.component("NInputNumber",NInputNumber)
app.component("NDivider",NDivider)
app.component("NDatePicker",NDatePicker)
app.component("NCard",NCard)
app.component("NForm",NForm)
app.component("NSpace",NSpace)
app.component("NInputGroup",NInputGroup)
app.component("NFormItem",NFormItem)
app.component("NInput",NInput)
app.use(store)
app.use(router)

app.mount("#app");
