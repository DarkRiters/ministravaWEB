import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import LoginView from "../../features/auth/views/LoginView.vue";
import RegisterView from "../../features/auth/views/RegisterView.vue";
import ForgotPasswordView from "../../features/auth/views/ForgotPasswordView.vue";
import ProfileView from "../../features/user/views/ProfileView.vue";

import { useAuthStore } from "../../features/auth/stores/authStore";

type AppRouteMeta = {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    requiresAdmin?: boolean; // ✅
};

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "dashboard",
        component: DashboardView,
        meta: { requiresAuth: true } satisfies AppRouteMeta,
    },
    {
        path: "/reset-password",
        name: "reset-password",
        component: () => import("../../features/auth/views/ResetPasswordView.vue"),
        meta: { guestOnly: true } satisfies AppRouteMeta,
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: { guestOnly: true } satisfies AppRouteMeta,
    },
    {
        path: "/register",
        name: "register",
        component: RegisterView,
        meta: { guestOnly: true } satisfies AppRouteMeta,
    },
    {
        path: "/forgot-password",
        name: "forgot-password",
        component: ForgotPasswordView,
        meta: { guestOnly: true } satisfies AppRouteMeta,
    },
    {
        path: "/profile",
        name: "profile",
        component: ProfileView,
        meta: { requiresAuth: true } satisfies AppRouteMeta,
    },
    {
        path: "/trainings",
        name: "trainings",
        component: () => import("../../features/training/views/TrainingView.vue"),
        meta: { requiresAuth: true } satisfies AppRouteMeta,
    },
    {
        path: "/trainings/stats",
        name: "trainings-stats",
        component: () => import("../../features/training/views/TrainingStatsView.vue"),
        meta: { requiresAuth: true } satisfies AppRouteMeta,
    },

    // ✅ ADMIN
    {
        path: "/admin/users",
        name: "admin-users",
        component: () => import("../../features/admin/views/AdminUsersView.vue"),
        meta: { requiresAuth: true, requiresAdmin: true } satisfies AppRouteMeta,
    },

    {
        path: "/:pathMatch(.*)*",
        redirect: "/",
    },
];

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

function userIsAdmin(currentUser: unknown): boolean {
    const u: any = currentUser;
    return u?.is_admin === true || (Array.isArray(u?.roles) && u.roles.includes("admin"));
}

// Guard
router.beforeEach(async (to) => {
    const auth = useAuthStore();

    const meta = (to.meta ?? {}) as AppRouteMeta;
    const requiresAuth = Boolean(meta.requiresAuth);
    const guestOnly = Boolean(meta.guestOnly);
    const requiresAdmin = Boolean(meta.requiresAdmin);

    if (requiresAuth && !auth.isLoggedIn) return { name: "login" };
    if (guestOnly && auth.isLoggedIn) return { name: "dashboard" };

    if (requiresAuth && auth.isLoggedIn && !auth.currentUser) {
        try {
            await auth.refreshMe();
        } catch {
            return { name: "login" };
        }
    }

    if (requiresAdmin) {
        if (userIsAdmin(auth.currentUser)) return true;

        try {
            const { AdminService } = await import("../../features/admin/services/AdminService");
            const ok = await AdminService.canAccessAdmin();
            if (!ok) return { name: "dashboard" };
            return true;
        } catch {
            return { name: "dashboard" };
        }
    }

    return true;
});
