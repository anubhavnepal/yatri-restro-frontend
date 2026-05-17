# Premium Restaurant Platform Blueprint

## 1. Project Overview

This project is a premium multilingual restaurant platform for a Nepali cuisine restaurant operating in Japan.

It is not a simple brochure website. It is a modern restaurant management and customer interaction platform with:

- Cinematic premium frontend experience
- CMS-driven content management
- Dynamic food menu management
- Reservation management
- Table availability and locking logic
- Cart and order system
- Dine-in and delivery order types
- Future-ready online payment integration
- Japanese and English multilingual support
- Decoupled frontend and backend architecture

The platform must be:

- Modern
- Fast
- Mobile responsive
- Secure
- SEO-friendly
- Easy for restaurant staff to manage
- Deployable on free-tier infrastructure initially
- Scalable for future production upgrades

---

## 2. Architecture Overview

### Architecture Type

Decoupled full-stack architecture:

```txt
Next.js Frontend
        ↓
REST API Communication
        ↓
Django REST Backend
        ↓
Database + Media Storage
```

### Why This Architecture

This architecture is chosen because:

- Frontend and backend developers can work independently
- The frontend can be deployed separately from the backend
- API contracts keep integration clean
- It supports future mobile app integration
- It scales better than a tightly coupled system
- It allows a professional production-grade workflow

---

## 3. Final Technology Stack

### Frontend Stack

| Technology | Purpose |
|---|---|
| Next.js | Frontend framework |
| React | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| ShadCN UI | UI components |
| Framer Motion | Smooth animations |
| Axios | API communication |
| Zustand | Client state management |
| next-intl | Internationalization |

### Backend Stack

| Technology | Purpose |
|---|---|
| Django | Backend framework |
| Django REST Framework | API creation |
| Django Admin | CMS management |
| SimpleJWT | Authentication |
| SQLite | Local development database |
| PostgreSQL | Production database |
| Cloudinary | Media and image storage |
| Pillow | Image processing |

### Deployment Stack

| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Railway / Render | Backend hosting |
| Cloudinary | Media hosting |
| Stripe | Future payment integration |

---

## 4. Development Strategy

### Current Frontend Strategy

Use **Option A**:

- Build the frontend first with a typed service layer
- Use mock data only where needed
- Keep mock data isolated
- Do not depend on the live backend yet
- Do not hardcode backend assumptions inside components
- Later, replace mock data with real API calls when backend is deployed

### Important Rule

The frontend should be built in a way where switching from mock data to real backend data only requires changes in:

```txt
services/
lib/api-client.ts
.env.local
```

UI components should not need major rewrites.

---

## 5. Frontend Environment Variable

Local frontend environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Production frontend environment:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api/v1
```

Rules:

- Never hardcode the backend URL in components
- Always read API URL from `NEXT_PUBLIC_API_URL`
- All API calls must go through service files
- Components should not directly use Axios

---

## 6. Expected Frontend Folder Structure

```txt
frontend/
├── app/
├── components/
│   ├── common/
│   ├── layout/
│   ├── sections/
│   ├── menu/
│   ├── reservation/
│   ├── cart/
│   ├── forms/
│   └── ui/
├── services/
│   ├── api/
│   ├── menu.service.ts
│   ├── reservation.service.ts
│   ├── order.service.ts
│   ├── gallery.service.ts
│   └── contact.service.ts
├── store/
│   ├── cart.store.ts
│   ├── reservation.store.ts
│   ├── language.store.ts
│   └── ui.store.ts
├── hooks/
├── lib/
│   ├── api-client.ts
│   ├── constants.ts
│   ├── utils.ts
│   └── mock-data/
├── types/
│   ├── api.types.ts
│   ├── menu.types.ts
│   ├── reservation.types.ts
│   ├── order.types.ts
│   └── common.types.ts
├── messages/
│   ├── en.json
│   └── ja.json
├── public/
└── styles/
```

---

## 7. API Architecture

The backend will expose REST APIs under:

```txt
/api/v1
```

Expected endpoint groups:

```txt
/api/v1/menu/
/api/v1/categories/
/api/v1/reservations/
/api/v1/orders/
/api/v1/cart/
/api/v1/gallery/
/api/v1/contact/
/api/v1/newsletter/
```

### Standard API Response Shape

Every API response should follow this structure:

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": []
}
```

Frontend TypeScript type:

```ts
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
```

---

## 8. Frontend and Backend Integration Rules

### Rule 1

Backend developer defines API contracts first.

### Rule 2

Frontend should never hardcode response structures differently from backend contracts.

### Rule 3

All API calls must be isolated inside service files.

Example:

```txt
services/menu.service.ts
services/reservation.service.ts
services/order.service.ts
```

### Rule 4

UI components should consume typed data from services or stores.

### Rule 5

Mock data is temporary.

Mock data must be:

- Isolated
- Typed
- Easy to delete later
- Clearly separated from real API logic

Recommended location:

```txt
lib/mock-data/
```

---

## 9. Core Functional Requirements

## 9.1 Landing Page

Features:

- Cinematic hero section
- Restaurant branding
- Signature dishes showcase
- CTA buttons
- Reservation quick access
- Smooth scroll transitions
- Mobile optimized layout
- Premium Japanese-inspired aesthetic

Suggested sections:

- Hero
- About / Story
- Signature Dishes
- Reservation CTA
- Gallery Preview
- Location / Contact
- Footer

---

## 9.2 Food Menu System

Features:

- Dynamic menu categories
- Food variants and sizes
- Add-ons
- Availability status
- Multilingual food details
- Food image gallery
- Search and filter functionality

Admin-managed content from backend:

- Food items
- Categories
- Images
- Availability
- Pricing
- Variants
- Add-ons

Frontend should support:

- Category filtering
- Search
- Available / unavailable state
- Add to cart
- Localized title and description

---

## 9.3 Reservation System

Features:

- Date selection
- Time slot selection
- Guest count
- Customer details
- Available table checking
- Reservation confirmation request
- Reservation status display

Reservation constraints:

- Same table cannot be double-booked
- Backend must prevent reservation conflicts
- Frontend should not be the source of truth for table availability
- Frontend only collects and submits reservation details

Reservation statuses:

```txt
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

Reservation flow:

```txt
User selects date
      ↓
User selects time slot
      ↓
User enters guest count
      ↓
Frontend requests available tables from backend
      ↓
User submits reservation details
      ↓
Backend confirms reservation
      ↓
Frontend shows success or error state
```

---

## 9.4 Order Management System

Features:

- Cart system
- Dine-in / delivery selection
- Customer details collection
- Order summary
- Order submission
- Order status display
- COD / Pay-at-Restaurant support

Order types:

```txt
DINE_IN
DELIVERY
```

Payment methods:

```txt
COD
PAY_AT_RESTAURANT
```

Payment statuses:

```txt
PENDING
PAID
FAILED
```

Future feature:

- Stripe payment integration

Important:

Do not build Stripe payment now unless explicitly requested.

---

## 9.5 CMS Management System

The backend uses Django Admin as the internal CMS.

Manageable content:

- Food items
- Categories
- Homepage sections
- CEO / founder message
- Gallery
- Reservations
- Orders
- Newsletter subscribers
- Site settings

Frontend must be ready to consume CMS-driven content.

Important CMS Rule:

Do not build a separate frontend admin dashboard for the initial version.

The admin/CMS system is handled by Django Admin on the backend. The Next.js frontend is only the public customer-facing website that consumes CMS-managed content through REST APIs.

## 9.6 Gallery and Media

Features:

- Image galleries
- Video embedding
- Cloudinary optimized media
- Lazy loading
- Responsive image delivery

Rules:

- Do not assume local media storage in production
- Use optimized image components
- Lazy-load non-critical media
- Keep gallery performance mobile-friendly

---

## 9.7 Contact and Newsletter

Features:

- Contact form
- Newsletter signup
- Email notification support
- Admin message viewing through backend

Frontend form rules:

- Validate required fields
- Show loading state
- Show success state
- Show error state
- Do not silently fail

---

## 10. Internationalization Strategy

Use:

```txt
next-intl
```

Supported languages:

```txt
English
Japanese
```

Suggested locales:

```txt
en
ja
```

Backend multilingual field strategy:

```txt
title_en
title_ja
description_en
description_ja
```

Frontend rules:

- Avoid hardcoding public-facing text
- Use translation files for static UI text
- Render backend multilingual fields based on active locale
- Keep language switching simple and user-friendly

Translation files:

```txt
messages/en.json
messages/ja.json
```

---

## 11. UI / UX Direction

### Design Style

Modern Japanese luxury dining.

Characteristics:

- Minimal layout
- Elegant typography
- High-quality imagery
- Cinematic hero section
- Dark premium aesthetic
- Smooth subtle animations
- Spacious sections
- Mobile-first responsive layouts

### Preferred Feel

The site should feel:

- Premium
- Calm
- Elegant
- Trustworthy
- Warm
- Restaurant-focused
- Easy to use

### Animation Guidelines

Allowed:

- Fade reveals
- Hover transitions
- Smooth scrolling
- Hero parallax
- Subtle section transitions

Avoid:

- Heavy WebGL
- Complex 3D rendering
- Excessive particle effects
- Distracting animations
- Performance-heavy interactions

---

## 12. State Management Strategy

Use Zustand for shared client-side state.

Recommended stores:

```txt
cartStore
reservationStore
languageStore
uiStore
```

### cartStore

Responsible for:

- Cart items
- Quantity updates
- Add-ons
- Variants
- Order type
- Cart totals
- Clearing cart

### reservationStore

Responsible for:

- Selected date
- Selected time slot
- Guest count
- Customer details
- Reservation step state

### languageStore

Responsible for:

- Active language
- Optional language UI state

### uiStore

Responsible for:

- Mobile nav state
- Modals
- Drawer state
- Toast-like UI state if needed

Rules:

- Do not store server data globally unless necessary
- Keep stores small and focused
- Use TypeScript types for all store data

---

## 13. Form Validation Strategy

Forms required:

- Reservation form
- Contact form
- Newsletter form
- Order checkout form

Validation should include:

- Required fields
- Email format
- Phone number format
- Guest count limits
- Date and time slot requirements
- Delivery address requirement for delivery orders

Rules:

- Frontend validation improves UX
- Backend validation remains the final authority
- Show friendly error messages
- Preserve user input when validation fails

---

## 14. Security Requirements

### Frontend Security

Required practices:

- No exposed secrets
- Use only safe `NEXT_PUBLIC_` variables
- Do not store private tokens unnecessarily
- Validate form inputs
- Sanitize user-generated content where needed
- Do not trust frontend-only validation
- Avoid dangerous HTML rendering unless sanitized

### Backend Security Awareness

Backend handles:

- JWT authentication
- CSRF protection
- CORS configuration
- API validation
- Secure admin access
- Input sanitization
- Database constraints
- Transaction safety

Frontend must not bypass backend authority.

---

## 15. Performance Requirements

Frontend should prioritize:

- Fast initial load
- Optimized images
- Lazy loading
- CDN-delivered assets
- Minimal client-side JavaScript where possible
- Mobile-first layouts
- SEO optimization
- Accessibility-friendly components

Rules:

- Use server components where possible
- Use client components only for interactive UI
- Avoid large unnecessary dependencies
- Keep animations lightweight
- Optimize images and media
- Use loading and empty states

---

## 16. SEO Requirements

Frontend should support:

- Proper metadata
- Page titles
- Descriptions
- Open Graph metadata
- Semantic HTML
- Local business SEO structure where possible
- Multilingual SEO readiness

Important pages should have metadata:

- Home
- Menu
- Reservation
- Gallery
- Contact

---

## 17. Accessibility Requirements

The frontend should include:

- Semantic HTML
- Keyboard-accessible buttons and forms
- Proper labels
- Sufficient color contrast
- Focus states
- Descriptive alt text for images
- Accessible navigation
- Accessible modals and drawers

---

## 18. Core Data Models

### Menu

Main frontend entities:

```txt
Category
FoodItem
Variant
Addon
```

Food item fields may include:

```txt
id
category
title_en
title_ja
description_en
description_ja
price
image
gallery
variants
addons
is_available
is_featured
```

### Reservation

Main frontend entities:

```txt
Table
TimeSlot
Reservation
```

Reservation fields may include:

```txt
id
date
time_slot
guest_count
customer_name
customer_email
customer_phone
status
special_request
```

### Order

Main frontend entities:

```txt
Order
OrderItem
Payment
DeliveryInfo
```

Order fields may include:

```txt
id
items
order_type
customer_name
customer_phone
delivery_address
payment_method
payment_status
order_status
total
```

---

## 19. Development Timeline

Suggested one-week development target:

### Day 1

- Repository setup
- Frontend architecture
- Codex project instructions and skills
- Type definitions
- Mock data strategy

### Day 2

- Layout system
- Navigation
- Footer
- Landing page sections

### Day 3

- Menu page
- Category filtering
- Food item cards
- Add to cart UI

### Day 4

- Cart system
- Checkout/order flow
- Zustand cart store

### Day 5

- Reservation flow
- Reservation form
- Time slot UI
- API-ready service functions

### Day 6

- Contact page
- Newsletter form
- Gallery page
- i18n polish

### Day 7

- Responsive testing
- Accessibility pass
- SEO metadata
- Loading/error states
- Deployment preparation

---

## 20. Deployment Workflow

### Frontend

Deployment flow:

```txt
GitHub Push
      ↓
Vercel
      ↓
Automatic Deployment
```

### Backend

Deployment flow:

```txt
GitHub Push
      ↓
Railway / Render
      ↓
Automatic Deployment
```

### Media

Use:

```txt
Cloudinary
```

---

## 21. Production Environment Variables

### Frontend

```env
NEXT_PUBLIC_API_URL=
```

### Backend

```env
SECRET_KEY=
DEBUG=False
DATABASE_URL=
CLOUDINARY_URL=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
```

---

## 22. Scope Restrictions

To finish the initial version quickly, do not build these unless explicitly requested:

- Delivery tracking
- Real-time chat
- Complex dashboards
- Loyalty systems
- Coupon engines
- Inventory systems
- WebSockets
- Microservices
- Stripe checkout
- Advanced analytics

---

## 23. Expected Final Outcome

The final platform should include:

- Premium cinematic frontend
- CMS-driven content
- Dynamic menu system
- Reservation management
- Cart and order flow
- Dine-in and delivery support
- Future-ready payment structure
- Japanese and English support
- Clean API integration layer
- Mobile-first responsive design
- Professional scalable architecture

---

## 24. Codex Working Rules

When using Codex:

- Read this `blueprint.md` before making major decisions
- Do not build features before planning
- Do not hardcode backend assumptions in components
- Keep API logic inside service files
- Keep mock data isolated
- Keep UI mobile-first
- Use TypeScript strictly
- Prefer clean architecture over quick hacks
- Avoid unnecessary packages
- Make focused changes only
- Summarize changes after each task
