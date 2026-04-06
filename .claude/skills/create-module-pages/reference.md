# Module Pages Reference

For the most up-to-date reference implementation, please consult the files in:

**Examples (FAQ) Module:**
`src/app/(protected)/examples/`

- **List Page**: `src/app/(protected)/examples/page.tsx`
- **Create Page**: `src/app/(protected)/examples/create/page.tsx`
- **Detail Page**: `src/app/(protected)/examples/[id]/page.tsx`
- **Update Page**: `src/app/(protected)/examples/[id]/update/page.tsx`
- **Form Component**: `src/app/(protected)/examples/_components/form/index.tsx`
- **Form Schema**: `src/app/(protected)/examples/_components/form/schema.ts`
- **Hooks**: `src/app/(protected)/examples/_hooks/`

Please read these files directly to understand the current patterns for module pages, including:
- Delete confirmation via inline `mutate()` with `onSuccess` callback
- Query/mutation keys exported as constants from individual hook files
- Proper loading states and error handling
- Route navigation using `ROUTES` object and `generatePath`
