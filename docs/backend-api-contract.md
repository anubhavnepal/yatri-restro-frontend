# DRAFT: Frontend-Needed Backend API Contract

This document is a draft contract based on the current Next.js frontend implementation.

- Status: `DRAFT`
- Purpose: give the Django REST backend team the frontend-needed request/response contract before live API integration starts
- Current frontend mode: `mock` remains the default in `lib/service-runtime.ts`
- Scope: relative API paths only, no deployed backend URL assumed

## Contract Principles

- The frontend currently routes all business API communication through typed service files.
- Components must not call `fetch` or Axios directly for backend business APIs.
- The frontend is currently aligned to a response envelope of:

```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": {}
}
```

- Preferred error envelope:

```json
{
  "success": false,
  "message": "Validation failed.",
  "data": null,
  "errors": [
    {
      "field": "customer_email",
      "message": "Enter a valid email address.",
      "code": "invalid"
    }
  ],
  "statusCode": 400,
  "code": "VALIDATION_ERROR"
}
```

## Backend-Owned Values

The frontend must not become the source of truth for the following:

- Reservation conflict checks
- Reservation availability
- Table assignment
- Final reservation confirmation status
- Final pricing
- Tax
- Delivery fee
- Order acceptance/rejection
- Payment status

The current mock layer already treats those values as backend-owned, and the live API should preserve that boundary.

## Frontend Environment Variable

The frontend currently uses only one public API environment variable:

- `NEXT_PUBLIC_API_URL`

Important Next.js note:

- Next.js only exposes browser-readable environment variables when they are prefixed with `NEXT_PUBLIC_`.
- Non-`NEXT_PUBLIC_` variables must not be relied on by browser-side code.
- Do not place secrets in `NEXT_PUBLIC_*` variables.

## Current Frontend Service Map

| Frontend service function | Suggested method | Suggested relative URL |
| --- | --- | --- |
| `getMenuItems` | `GET` | `/menu/` |
| `getMenuItemBySlug` | `GET` | `/menu/{slug}/` |
| `getMenuCategories` | `GET` | `/categories/` |
| `getReservationAvailability` | `GET` | `/reservations/availability/` |
| `submitReservation` | `POST` | `/reservations/` |
| `submitOrder` | `POST` | `/orders/` |
| `getGalleryEntries` | `GET` | `/gallery/` |
| `submitContactForm` | `POST` | `/contact/` |
| `subscribeToNewsletter` | `POST` | `/newsletter/` |

## Shared DTO Shapes the Frontend Already Uses

### Media object

Preferred image/media shape used across menu and gallery:

```json
{
  "id": "string",
  "url": "string",
  "alt_en": "string | null",
  "alt_ja": "string | null",
  "caption_en": "string | null",
  "caption_ja": "string | null",
  "width": 1600,
  "height": 1067
}
```

### Validation error item

```json
{
  "field": "customer_phone",
  "message": "This field is required.",
  "code": "required"
}
```

If Django REST Framework will return a different validation shape, the frontend live adapter will need an explicit normalization layer.

## Endpoint Details

### 1. Menu list

- Frontend service function: `getMenuItems`
- Suggested method: `GET`
- Suggested URL: `/menu/`

Suggested query params:

```json
{
  "category": "signature",
  "search": "momo",
  "featured": true
}
```

Suggested success payload:

```json
{
  "success": true,
  "message": "Menu items loaded.",
  "data": [
    {
      "id": "item-sekuwa",
      "slug": "charcoal-lamb-sekuwa",
      "category": {
        "id": "cat-grill",
        "slug": "grill",
        "title_en": "Fire & Grill",
        "title_ja": "炭火とグリル",
        "description_en": "Charcoal-finished mains with a Nepali warmth.",
        "description_ja": "ネパールの温もりを感じる炭火仕上げの主菜。",
        "is_active": true,
        "sort_order": 2
      },
      "title_en": "Charcoal Lamb Sekuwa",
      "title_ja": "炭火ラムセクワ",
      "description_en": "Tender lamb skewers finished over charcoal with timur and smoked salt.",
      "description_ja": "ティムールと燻製塩で仕上げた、炭火焼きラムのセクワ。",
      "price": 2480,
      "image": {
        "id": "img-sekuwa",
        "url": "string",
        "alt_en": "string",
        "alt_ja": "string",
        "width": 1600,
        "height": 1067
      },
      "gallery": [],
      "variants": [
        {
          "id": "variant-sekuwa-regular",
          "name_en": "Regular",
          "name_ja": "レギュラー",
          "price": 2480,
          "is_default": true
        }
      ],
      "addons": [
        {
          "id": "addon-sekuwa-achaar",
          "name_en": "House achar",
          "name_ja": "自家製アチャール",
          "price": 280
        }
      ],
      "is_available": true,
      "is_featured": true
    }
  ]
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Menu items could not be loaded.",
  "data": null,
  "code": "MENU_LIST_FAILED"
}
```

Backend decisions still needed:

- Confirm whether `/menu/` is the final list URL
- Confirm whether the backend returns a plain array or paginated results
- Confirm whether `category` should be a nested object, category ID, or slug
- Confirm whether unavailable items should still appear with `is_available: false`
- Confirm ordering and featured-item behavior

### 2. Menu detail by slug

- Frontend service function: `getMenuItemBySlug`
- Suggested method: `GET`
- Suggested URL: `/menu/{slug}/`

Suggested request:

- Path param: `slug`

Suggested success payload:

```json
{
  "success": true,
  "message": "Menu item loaded.",
  "data": {
    "id": "item-sekuwa",
    "slug": "charcoal-lamb-sekuwa",
    "category": {
      "id": "cat-grill",
      "slug": "grill",
      "title_en": "Fire & Grill",
      "title_ja": "炭火とグリル"
    },
    "title_en": "Charcoal Lamb Sekuwa",
    "title_ja": "炭火ラムセクワ",
    "description_en": "Tender lamb skewers finished over charcoal with timur and smoked salt.",
    "description_ja": "ティムールと燻製塩で仕上げた、炭火焼きラムのセクワ。",
    "price": 2480,
    "image": {
      "id": "img-sekuwa",
      "url": "string",
      "alt_en": "string",
      "alt_ja": "string",
      "width": 1600,
      "height": 1067
    },
    "gallery": [],
    "variants": [],
    "addons": [],
    "is_available": true,
    "is_featured": true
  }
}
```

Suggested not-found error payload:

```json
{
  "success": false,
  "message": "Menu item not found.",
  "data": null,
  "statusCode": 404,
  "code": "MENU_ITEM_NOT_FOUND"
}
```

Backend decisions still needed:

- Confirm slug uniqueness rules
- Confirm the 404 response shape
- Confirm whether gallery assets are included here or need a separate endpoint
- Confirm whether localized SEO fields should also be returned on menu detail

### 3. Categories

- Frontend service function: `getMenuCategories`
- Suggested method: `GET`
- Suggested URL: `/categories/`

Suggested success payload:

```json
{
  "success": true,
  "message": "Menu categories loaded.",
  "data": [
    {
      "id": "cat-signature",
      "slug": "signature",
      "title_en": "Signature Courses",
      "title_ja": "シグネチャーコース",
      "description_en": "Curated plates that anchor the evening experience.",
      "description_ja": "夜の体験を支える厳選の一皿。",
      "is_active": true,
      "sort_order": 1
    }
  ]
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Categories could not be loaded.",
  "data": null,
  "code": "CATEGORY_LIST_FAILED"
}
```

Backend decisions still needed:

- Confirm whether categories are a separate endpoint or should be embedded elsewhere
- Confirm active/inactive category behavior
- Confirm sort ordering source of truth

### 4. Reservation availability

- Frontend service function: `getReservationAvailability`
- Suggested method: `GET`
- Suggested URL: `/reservations/availability/`

Suggested request query:

```json
{
  "date": "2026-05-18",
  "guest_count": 2,
  "time_slot": "19-30"
}
```

Suggested success payload:

```json
{
  "success": true,
  "message": "Availability loaded.",
  "data": {
    "available": true,
    "time_slots": [
      {
        "id": "19-30",
        "label": "19:30",
        "start_time": "19:30",
        "end_time": "21:15",
        "is_available": true
      }
    ],
    "note": "Preview only. Final confirmation happens on reservation submission.",
    "is_estimate": true
  }
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Availability could not be loaded.",
  "data": null,
  "errors": [
    {
      "field": "date",
      "message": "Enter a valid date.",
      "code": "invalid"
    }
  ],
  "statusCode": 400,
  "code": "RESERVATION_AVAILABILITY_INVALID"
}
```

Backend decisions still needed:

- Confirm whether this should stay a `GET` endpoint or become `POST`
- Confirm timezone handling for Japan-based reservations
- Confirm whether `available` reflects overall availability or the selected slot only
- Confirm whether `is_estimate` will always be returned
- Confirm how same-day cutoff and closed-day logic should be represented

### 5. Reservation submission

- Frontend service function: `submitReservation`
- Suggested method: `POST`
- Suggested URL: `/reservations/`

Suggested request payload:

```json
{
  "date": "2026-05-18",
  "time_slot": "19-30",
  "guest_count": 2,
  "customer_name": "Jane Doe",
  "customer_email": "jane@example.com",
  "customer_phone": "+81 90 1234 5678",
  "special_request": "Window-side seating if available"
}
```

Suggested success payload:

```json
{
  "success": true,
  "message": "Reservation request submitted.",
  "data": {
    "id": "reservation-123",
    "status": "PENDING",
    "reservation_reference": "RES-20260518-1930",
    "message": "We have received your reservation request."
  }
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Reservation submission failed.",
  "data": null,
  "errors": [
    {
      "field": "time_slot",
      "message": "This slot is no longer available.",
      "code": "slot_unavailable"
    }
  ],
  "statusCode": 409,
  "code": "RESERVATION_CONFLICT"
}
```

Backend decisions still needed:

- Confirm final reservation status enum values
- Confirm conflict/error semantics for double-booked or unavailable slots
- Confirm whether table assignment is internal only or ever surfaced
- Confirm whether reservation references are returned immediately

### 6. Order submission

- Frontend service function: `submitOrder`
- Suggested method: `POST`
- Suggested URL: `/orders/`

Suggested request payload:

```json
{
  "order_type": "DELIVERY",
  "payment_method": "COD",
  "customer_name": "Jane Doe",
  "customer_phone": "+81 90 1234 5678",
  "customer_email": "jane@example.com",
  "delivery_address": {
    "address_line_1": "1-2-3 Example",
    "address_line_2": "Building 5",
    "city": "Tokyo",
    "postal_code": "100-0001"
  },
  "items": [
    {
      "menu_item_id": "item-sekuwa",
      "quantity": 1,
      "variant_id": "variant-sekuwa-regular",
      "addon_ids": ["addon-sekuwa-achaar"]
    }
  ],
  "special_request": "Please call on arrival"
}
```

Suggested success payload:

```json
{
  "success": true,
  "message": "Order request submitted.",
  "data": {
    "id": "order-123",
    "order_reference": "ORD-DELIVERY-123",
    "order_status": "PENDING",
    "payment_status": "PENDING",
    "pricing_preview": {
      "currency": "JPY",
      "subtotal": 2760,
      "estimated_total": 2760,
      "is_estimated": true
    },
    "message": "Order received. Final acceptance and pricing remain subject to backend confirmation."
  }
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Order submission failed.",
  "data": null,
  "errors": [
    {
      "field": "items",
      "message": "One or more items are unavailable.",
      "code": "item_unavailable"
    }
  ],
  "statusCode": 400,
  "code": "ORDER_VALIDATION_FAILED"
}
```

Backend decisions still needed:

- Confirm final order status enum values
- Confirm final payment status enum values
- Confirm whether `payment_method` values stay `COD` and `PAY_AT_RESTAURANT`
- Confirm whether the backend returns preview pricing, final pricing, or both
- Confirm tax, delivery fee, service charge, and minimum-order logic
- Confirm how item-level unavailability or variant/add-on rejection is reported

### 7. Gallery list

- Frontend service function: `getGalleryEntries`
- Suggested method: `GET`
- Suggested URL: `/gallery/`

Suggested success payload:

```json
{
  "success": true,
  "message": "Gallery entries loaded.",
  "data": [
    {
      "id": "gallery-ambience-1",
      "slug": "evening-counter-light",
      "title_en": "Evening Counter Light",
      "title_ja": "夕刻のカウンター",
      "description_en": "A quiet counter setting prepared before first seating.",
      "description_ja": "最初のご案内前に整えられた静かなカウンター席。",
      "image": {
        "id": "gallery-image-1",
        "url": "string",
        "alt_en": "string",
        "alt_ja": "string",
        "width": 1600,
        "height": 1067
      },
      "video_url": null,
      "meta_title_en": null,
      "meta_title_ja": null,
      "meta_description_en": null,
      "meta_description_ja": null
    }
  ]
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Gallery entries could not be loaded.",
  "data": null,
  "code": "GALLERY_LIST_FAILED"
}
```

Backend decisions still needed:

- Confirm whether gallery is paginated
- Confirm whether `video_url` is expected long-term
- Confirm whether SEO fields belong here or in a separate CMS payload

### 8. Contact submission

- Frontend service function: `submitContactForm`
- Suggested method: `POST`
- Suggested URL: `/contact/`

Suggested request payload:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+81 90 1234 5678",
  "subject": "Private dining question",
  "message": "Can your private dining menu support shellfish-free guests?"
}
```

Suggested success payload:

```json
{
  "success": true,
  "message": "Contact request submitted.",
  "data": {
    "id": "contact-123",
    "received": true,
    "received_at": "2026-05-18T10:30:00Z"
  }
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Contact submission failed.",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "Enter a valid email address.",
      "code": "invalid"
    }
  ],
  "statusCode": 400,
  "code": "CONTACT_VALIDATION_FAILED"
}
```

Backend decisions still needed:

- Confirm whether contact messages are stored, emailed, or both
- Confirm spam protection approach
- Confirm whether duplicate submissions need throttling or idempotency handling

### 9. Newsletter submission

- Frontend service function: `subscribeToNewsletter`
- Suggested method: `POST`
- Suggested URL: `/newsletter/`

Suggested request payload:

```json
{
  "email": "jane@example.com",
  "locale": "ja"
}
```

Suggested success payload:

```json
{
  "success": true,
  "message": "Newsletter subscription submitted.",
  "data": {
    "subscribed": true,
    "received_at": "2026-05-18T10:30:00Z"
  }
}
```

Suggested error payload:

```json
{
  "success": false,
  "message": "Newsletter subscription failed.",
  "data": null,
  "errors": [
    {
      "field": "email",
      "message": "This email is already subscribed.",
      "code": "already_exists"
    }
  ],
  "statusCode": 400,
  "code": "NEWSLETTER_VALIDATION_FAILED"
}
```

Backend decisions still needed:

- Confirm duplicate-subscription behavior
- Confirm whether locale should be stored per subscriber
- Confirm opt-in / consent wording requirements

## Frontend Gaps / Backend Confirmation Needed

These are the main places where the frontend already makes assumptions that still need explicit backend confirmation:

1. Pagination
   - Current menu and gallery services expect `data` to be a plain array.
   - If DRF pagination is enabled, the frontend live adapter will need a mapper from paginated `results` into the current service return shape.

2. Category shape inside menu items
   - `MenuItemDTO` currently allows `category` to be either a nested object or a string.
   - The UI works best if the backend returns a nested localized category object on list and detail endpoints.

3. Validation error shape
   - The frontend currently normalizes best when validation errors arrive as `errors: [{ field, message, code? }]`.
   - DRF default serializer errors may need adapter logic if they remain nested by field name.

4. Reservation timezone and slot semantics
   - Reservation availability and submission need explicit Japan timezone agreement.
   - The backend should confirm whether `time_slot` IDs are stable identifiers or derived labels.

5. Order totals
   - The frontend already treats pricing as preview-only.
   - The backend must confirm whether response payloads return preview totals, final totals, or both.

6. Media object shape
   - The frontend currently expects `url`, optional localized alt/caption fields, and optional dimensions.
   - If the backend uses a different media serializer, the live adapter will need normalization.

## Backend Handoff Checklist

- Confirm final endpoint URLs
- Confirm request field names and response field names
- Confirm pagination strategy
- Confirm image/media object shape
- Confirm validation error shape
- Confirm CORS allowed origin for the frontend
- Confirm timezone handling for Japan reservations
- Confirm whether OpenAPI / Swagger docs will be available

## Frontend-to-Backend Integration Notes

- Mock mode must remain the default until the backend contract and base URL are confirmed.
- No real backend connection should be attempted until:
  - `NEXT_PUBLIC_API_URL` is set
  - endpoint URLs are confirmed
  - response envelope shape is confirmed
  - error normalization requirements are known
- When live integration starts, the preferred change is to keep component code untouched and update only:
  - live service calls
  - any adapter normalization needed for backend response differences
  - `SERVICE_DATA_SOURCE` in `lib/service-runtime.ts`
