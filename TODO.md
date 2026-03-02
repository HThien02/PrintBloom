# TODO - Add Chinese Language Support and Cart Fix

## Completed Tasks:

- [x] lib/translations.ts 1. Update - Add Chinese (zh) translations
- [x] 2. Update lib/language-context.tsx - Add "zh" to Locale type and localStorage check
- [x] 3. Update components/language-switcher.tsx - Fix CN button to use "zh" locale
- [x] 4. Create app/api/cart/route.ts - Database-backed cart API
- [x] 5. Update lib/cart-context.tsx - Support both guest and logged-in users
- [x] 6. Update prisma/schema.prisma - Add Cart and CartItem models
- [x] 7. Update components/header.tsx - Hide cart for guest users, show for logged-in users
