# Product Requirements Document (PRD)

## Restaurant POS & Inventory Management System — Borondo

---

# 1. Product Overview

## 1.1 Product Name

**Borondo POS**

## 1.2 Product Type

Internal operational system.

## 1.3 Product Description

Borondo POS is a **Point of Sale (POS) and Inventory Management System** designed for restaurant operations.
The system digitizes order management, payment tracking, and inventory control to replace manual processes.

The platform is designed as an **internal transactional system**, prioritizing:

* Operational reliability
* Inventory consistency
* Accurate financial records
* Clear auditability of sales

The system is **not an e-commerce platform** and does not process external payment integrations. It only records payment methods and transactions performed in person.

---

# 2. Problem Statement

Restaurants that operate with manual or partially digital workflows often face problems such as:

* Inaccurate inventory tracking
* Order miscommunication between waiters and cashier
* Lack of traceability for payments
* Difficulty generating sales reports
* Errors during end-of-day cash reconciliation

The goal of Borondo POS is to **centralize operational processes into a reliable digital system**.

---

# 3. Goals and Objectives

## 3.1 Primary Goals

The system must allow the restaurant to:

* Register and manage orders per table
* Track product sales
* Maintain accurate inventory
* Register payments and payment methods
* Generate operational reports
* Support end-of-day cash reconciliation

## 3.2 Success Metrics

Success of the system will be measured by:

* Accurate inventory levels after service
* No duplicated or inconsistent payment records
* Ability to generate reliable sales reports
* Smooth waiter → cashier workflow
* Low operational friction during service hours

---

# 4. Scope Definition

## 4.1 In Scope (MVP)

The MVP will include:

* Product management
* Order creation and management
* Payment registration
* Inventory deduction
* Sales reporting
* Role-based access control

## 4.2 Out of Scope (MVP)

The following features are intentionally excluded:

* Online ordering
* Delivery management
* Payment gateway integration
* Customer accounts
* CRM features
* Multi-branch synchronization
* Advanced analytics dashboards

These may be considered for future versions.

---

# 5. Users and Roles

The system supports three primary user roles.

## 5.1 Waiter

Responsibilities:

* Select table
* Create orders
* Add products to orders
* Send orders to cashier

Interface: **Tablet (PWA)**

---

## 5.2 Cashier

Responsibilities:

* Receive orders
* Print kitchen tickets
* Register payments
* Close orders

Interface: **Desktop dashboard**

---

## 5.3 Admin

Responsibilities:

* Manage products
* Manage inventory
* View reports
* Manage users

Interface: **Administrative dashboard**

---

# 6. Operational Workflow

## 6.1 Start of Day

1. System displays available inventory.
2. Optional: open operational shift.
3. Restaurant begins service.

---

## 6.2 Order Creation

1. Waiter selects a table.
2. Waiter creates a new order.
3. Products are added to the order.
4. System assigns a unique order number.
5. Order is sent to the cashier interface.

Order status becomes:

OPEN → SENT_TO_CASHIER

---

## 6.3 Payment Flow

1. Customer approaches cashier.
2. Cashier selects the order.
3. Cashier selects payment method:

   * Cash
   * Card
   * Bank transfer/app
4. System marks order as **PAID**.
5. Inventory is automatically deducted.
6. Payment record is stored.

---

## 6.4 End of Day

The system generates:

* Sales summary
* Payment breakdown
* Remaining inventory
* Cash reconciliation data

---

# 7. Core Functional Modules

## 7.1 Inventory Module

Capabilities:

* Create and manage products
* Track stock levels
* Register inventory movements
* Manual stock adjustments
* Automatic stock deduction on order payment

All stock modifications must generate an **InventoryMovement record**.

---

## 7.2 Orders Module

Capabilities:

* Create orders per table
* Add/remove products
* Track order status
* Generate unique order numbers
* Record timestamps

Each **OrderItem** stores a **price snapshot** to preserve historical pricing integrity.

Order lifecycle:

OPEN
SENT_TO_CASHIER
PAID

---

## 7.3 Payments Module

Capabilities:

* Register payment method
* Prevent duplicate payments
* Link payment to order
* Record payment timestamp

All payment operations must execute inside **database transactions**.

---

## 7.4 Reporting Module

Reports must support:

* Sales per product
* Sales per time range
* Daily revenue
* Weekly revenue
* Monthly revenue
* Payment method breakdown
* Remaining inventory

All calculations should be performed using **database aggregations**, not frontend logic.

---

## 7.5 Shift Module (Phase 2)

Capabilities:

* Open shift
* Close shift
* Expected revenue calculation
* Cash reconciliation
* Difference detection

---

# 8. Functional Requirements

## 8.1 Product Management

The system must allow:

* Create product
* Update product
* Archive product
* Assign product category
* Define price
* Define initial stock

---

## 8.2 Order Management

The system must allow:

* Create order per table
* Add products
* Remove products
* Update quantities
* Send order to cashier

---

## 8.3 Payment Processing

The system must:

* Register payment method
* Prevent duplicate payments
* Mark order as PAID
* Trigger inventory deduction
* Store payment record

---

## 8.4 Inventory Updates

The system must:

* Deduct inventory when order is paid
* Log every inventory change
* Prevent negative inventory when configured

---

# 9. Non-Functional Requirements

## 9.1 Performance

* Order creation must be under **300 ms**
* Payment processing under **500 ms**

---

## 9.2 Reliability

* Inventory updates must be **transaction-safe**
* No duplicate payments allowed
* ACID database guarantees required

---

## 9.3 Concurrency

The system must support:

* Multiple waiters creating orders simultaneously
* Cashier processing payments concurrently
* Safe inventory updates under concurrent load

---

## 9.4 Security

Security requirements include:

* JWT authentication
* Role-based access control
* Input validation
* Protection against duplicate transactions
* Audit logs for critical operations

---

# 10. Technical Architecture

Architecture style:

**Modular Monolith (Client–Server)**

```
Tablet (Waiters UI)
        ↓
Backend REST API
        ↓
PostgreSQL Database
        ↓
Cashier Dashboard
```

Key characteristics:

* Stateless backend
* Business logic enforced server-side
* ACID database transactions
* Clear separation of responsibilities

---

# 11. Technology Stack

## Frontend

* React
* TypeScript
* Vite
* Progressive Web App (PWA)
* Zustand or Redux Toolkit
* TailwindCSS or Material UI

Interfaces:

* Waiter UI (tablet)
* Cashier UI (desktop)

---

## Backend

* Node.js
* Express
* Prisma ORM
* REST API

Responsibilities:

* Order lifecycle
* Inventory updates
* Payment processing
* Validation rules
* Reporting queries

---

## Database

* PostgreSQL

Reasons:

* Strong relational integrity
* Reliable transactions
* Efficient aggregations
* Concurrency support

---

# 12. Release Plan

## Phase 1 — MVP

Features:

* Product CRUD
* Order creation
* Payment registration
* Inventory deduction
* Basic reporting

---

## Phase 2 — Operational Stability

Features:

* Shift management
* Role permissions
* Manual inventory adjustments
* Improved reporting

---

## Phase 3 — Optimization

Features:

* Offline support
* Audit logs
* Data export (CSV/Excel)
* Performance improvements

---

# 13. Risks and Technical Challenges

Potential risks:

* Race conditions during payment
* Concurrent inventory updates
* Inconsistent order states
* Incorrect inventory deduction

Mitigation strategies:

* Database transactions
* Strict order state machine
* Backend validation
* Inventory movement logs

---

# 14. Future Enhancements

Potential future capabilities:

* Recipe-based inventory deduction
* Kitchen Display System (KDS)
* Multi-branch management
* Accounting integrations
* Advanced analytics dashboard
* Export functionality

---

# 15. Product Philosophy

Borondo POS prioritizes:

* Operational reliability
* Data integrity
* Clear domain modeling
* Incremental feature development
* Maintainable architecture

The system is designed as a **stable operational backbone for restaurant operations** rather than a feature-heavy platform.

---
