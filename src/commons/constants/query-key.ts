export const QUERY_KEY = {
  FAQ: {
    LIST: "get-faq-list",
    DETAIL: "get-detail-faq",
    CREATE: "create-faq",
    UPDATE: "update-faq",
    DELETE: "delete-faq",
  },
  BOOKS: {
    LIST: "get-books-list",
    DETAIL: "get-books-detail",
    CREATE: "post-create-book",
    UPDATE: "put-update-book",
    DELETE: "delete-book",
  },
  USERS: {
    LIST: "get-users-list",
    DETAIL: "get-users-detail",
    CREATE: "post-create-user",
    UPDATE: "put-update-user",
    DELETE: "delete-user",
  },
  ROLES: {
    LIST: "get-roles-list",
    DETAIL: "get-roles-detail",
    CREATE: "post-create-role",
    UPDATE: "put-update-role",
    DELETE: "delete-role",
  },
  PERMISSIONS: {
    LIST: "get-permission-list",
    DETAIL: "get-permission-detail",
    CREATE: "post-create-permission",
    UPDATE: "put-update-permission",
    DELETE: "delete-permission",
  },
} as const;

type ObjectKey = typeof QUERY_KEY;
export type QueryKey = ObjectKey[keyof ObjectKey][keyof ObjectKey[keyof ObjectKey]];
