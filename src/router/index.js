import Vue from "vue";
import VueRouter from "vue-router";
import VueCookies from "vue-cookies";
import store from "@/store";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../views/defaultViews/DefaultView.vue"),
    redirect: "/login",
    children: [
      {
        path: "admin",
        name: "admin",
        component: () => import("../views/defaultViews/AdminDefaultView.vue"),
        children: [
          {
            path: "main",
            name: "main",
            component: () =>
              import("../views/defaultViews/MainDefaultView.vue"),
            children: [
              {
                path: "person-emitter",
                name: "person-emitter",
                component: () => import("../views/defaultViews/PersonEmitterDefault.vue"),
                children: [
                  {
                    path: "list",
                    name: "person-emitter-list",
                    component: () => import("../views/mainViews/PersonEmitterList.vue"),
                  },
                  {
                    path: ":id",
                    name: "person-emitter-content",
                    component: () => import("../views/mainViews/PersonEmitterContent.vue"),
                  },
                ]
              },
              {
                path: "emitter-collector",
                name: "emitter-collector",
                component: () => import("../views/mainViews/EmitterCollectorList.vue"),
              },
              {
                path: "chart",
                name: "chart",
                component: () => import("../views/mainViews/ChartView.vue"),
              },
              {
                path: "emitter-collector/:id",
                name: "content",
                component: () =>
                  import("../views/mainViews/EmitterCollectorContent.vue"),
              },
              {
                path: "add-admin",
                name: "add-admin",
                component: () => import("../views/mainViews/addAdmin.vue"),
                // ?????? ???????????? ????????? ??? ????????? ??????
                meta: { adminKing: true },
              },
              {
                path: "geo",
                name: "geo",
                component: () => import("../views/defaultViews/ChatDefaultView.vue"),
                children: [
                  {
                    path: "latlng",
                    name: "latlng",
                    component: () => import("../views/mainViews/LatLng.vue"),
                  },
                ]
              },
              {
                path: "emissions",
                name: "emissions",
                component: () =>
                  import("../views/defaultViews/EmissionsDefaultView.vue"),
                children: [
                  {
                    path: "list",
                    name: "emissions-list",
                    component: () => import("../views/mainViews/EmissionsList.vue"),
                  },
                  {
                    path: ":id",
                    name: "emissions-content",
                    component: () => import("../views/mainViews/EmissionsContent.vue"),
                  },
                ]
              },
              {
                path: "biddings",
                name: "biddings",
                component: () =>
                  import("../views/defaultViews/BiddingsDefaultView.vue"),
                children: [
                  {
                    path: "list",
                    name: "biddings-list",
                    component: () => import("../views/mainViews/BiddingsList.vue"),
                  },
                  {
                    path: ":id",
                    name: "biddings-content",
                    component: () => import("../views/mainViews/BiddingsContent.vue"),
                  },
                ]
              },
              {
                path: "transaction",
                name: "transaction",
                component: () =>
                  import("../views/defaultViews/TransActionDefaultView.vue"),
                children: [
                  {
                    path: "list",
                    name: "transaction-list",
                    component: () => import("../views/mainViews/TransActionList.vue"),
                  },
                  {
                    path: ":id",
                    name: "transaction-content",
                    component: () => import("../views/mainViews/TransActionContent.vue"),
                  },
                ]
              },
              {
                path: "report",
                name: "report",
                component: () =>
                  import("../views/defaultViews/ReportDefaultView.vue"),
                children: [
                  {
                    path: "list",
                    name: "report-list",
                    component: () => import("../views/mainViews/ReportList.vue"),
                  },
                  {
                    path: ":id",
                    name: "report-content",
                    component: () => import("../views/mainViews/ReportContent.vue"),
                  },
                ]
              },
              {
                path: "log",
                name: "log",
                component: () =>
                  import("../views/defaultViews/LogDefaultView.vue"),
                children: [
                  {
                    path: "list",
                    name: "log-list",
                    component: () => import("../views/mainViews/LogList.vue"),
                  },

                ]
              },
              {
                path: "not-member",
                name: "not-member",
                component: () =>
                  import("../views/defaultViews/NotMemberDefaultView.vue"),
                children: [
                  {
                    path: "list",
                    name: "not-member-list",
                    component: () => import("../views/mainViews/NotMemberList.vue"),
                  },
                  {
                    path: ":id",
                    name: "not-member-content",
                    component: () => import("../views/mainViews/NotMemberContent.vue"),
                  },

                ]
              },
              {
                path: "note-list",
                name: "note-list",
                component: () =>
                  import("../views/defaultViews/NoteListDefaultView.vue"),
                children: [
                  {
                    path: "list",
                    name: "note-list-list",
                    component: () => import("../views/mainViews/NoteList.vue"),
                  },
                  {
                    path: ":id",
                    name: "note-content",
                    component: () => import("../views/mainViews/NoteContent.vue"),
                  },

                ]
              },

            ],
          },
        ],
      },
      {
        path: "login",
        name: "login",
        component: () => import("../views/LoginView.vue"),
        meta: { unauthorized: true },
      },
      {
        path: "logout",
        name: "logout",
        component: () => import("../views/LogoutView.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  // ?????? ???????????? ????????? ????????? ??? ????????? ?????????.
  // ????????? ??? ???????????? login ?????? ????????????????????? ?????? ???????????? ????????????
  if (to.matched.some((record) => record.meta.unauthorized)) {
    if (VueCookies.get("token")) {
      return next("/admin/main/emitter-collector");
    }
    return next();
  }
  //
  if (to.name == "login" && VueCookies.get("token")) {
    return next("/admin/main/emitter-collector");
  }
  // ?????? ??????????????? ??????????????? ??????,
  if (to.matched.some((record) => record.meta.adminKing)) {
    // ?????? ??????????????? ????????? ??? ?????????
    if (store.getters["auth/canYouComeHere1"]) {
      next();
    } else {
      alert("????????? ????????????.");
      return next(from);
    }
  }

  return next();
});

export default router;
