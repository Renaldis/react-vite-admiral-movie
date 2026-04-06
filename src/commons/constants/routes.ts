export const ROUTES = {
  faq: {
    list: "/examples/",
    create: "/examples/create",
    update: "/examples/:id/update",
    detail: "/examples/:id",
  },
  dashboard: "/dashboard",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    callback: "/auth/oauth-callback",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  iam: {
    users: {
      list: "/iam/users",
      create: "/iam/users/create",
      detail: "/iam/users/:id/detail",
      update: "/iam/users/:id/update",
      delete: "/iam/users/:id/delete",
    },
    roles: {
      list: "/iam/roles",
      create: "/iam/roles/create",
      detail: "/iam/roles/:id/detail",
      update: "/iam/roles/:id/update",
      delete: "/iam/roles/:id/delete",
    },
    permissions: {
      list: "/iam/permissions",
      create: "/iam/permissions/create",
      detail: "/iam/permissions/:id/detail",
      update: "/iam/permissions/:id/update",
      delete: "/iam/permissions/:id/delete",
    },
  },
  movies: {
    list: "/movies",
    create: "/movies/create",
    detail: "/movies/:id/detail",
    update: "/movies/:id/update",
    delete: "/movies/:id/delete",
  },
};
