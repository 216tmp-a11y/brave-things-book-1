# Brave Things Books - Project Overview

## Project Structure

### Core Application Files
- `src/App.tsx`: Main application router with auth context and routing for all pages
- `src/main.tsx`: Application entry point
- `src/pages/homepage.tsx`: Updated modular marketing homepage with forest/golden theme

### 📚 Interactive Book Implementation (NEW - Phase 18)
**Complete 6-Chapter Book Integration** *(In Progress)*

#### Chapter Files (Optimized Layout Components)
- `src/components/chapters/chapter-1-optimized.tsx`: The Still Pond - Mindfulness ✅
- `src/components/chapters/chapter-2-optimized.tsx`: The Colorful Chameleon - Emotional Awareness ✅ 
- `src/components/chapters/chapter-3-optimized.tsx`: The Brave Bridge - Courage ✅ **(NEW)**
- `src/components/chapters/chapter-4-optimized.tsx`: The Kindness Meadow - Kindness ✅ **(NEW)**
- `src/components/chapters/chapter-5-optimized.tsx`: The Gratitude Garden - Gratitude ✅ **(NEW)**
- `src/components/chapters/chapter-6-optimized.tsx`: The Sharing Tree - Sharing ✅ **(NEW)**

#### Chapter 3 Analysis (NEW)
**Theme**: Courage and Bravery  
**Structure**: 12 spreads with interactive storytelling
**Interactive Cue**: Bravery Badge (🛡️) - Spread 6
**Scene Components Required**:
- `BridgeScene` - Main bridge visual component
- `MaxWorriedBridgeScene` - Character-specific worry scene

**Chapter Scene Components**
Each chapter includes visual components for interactive storytelling:
- Chapter 1: 9 scenes (Golden Leaf cue - Mindfulness)
- Chapter 2: 9 scenes (Rainbow Tail cue - Emotional Awareness)  
- Chapter 3: 2 scenes (Bravery Badge cue - Courage) **(NEW)**
- Chapter 4: 2 scenes (Sparkling Petal cue - Kindness) **(NEW)**
- Chapter 5: Image-only (Gratitude Leaf cue - Gratitude) **(NEW)**
- Chapter 6: Image-only (Dew Cup cue - Sharing) **(NEW)**

**Interactive Cue System**
- `src/components/cue-interaction.tsx`: Universal cue interaction component
- `src/components/cue-popup.tsx`: Enhanced popup modal with character-specific content
- Six unique interactive cues across chapters (Golden Leaf, Rainbow Tail, Bravery Badge, Sparkling Petal, Gratitude Leaf, Dew Cup)
- Character-specific prompts and exercise steps (Wise Frog for Chapter 1, Camille for Chapter 2)
- Consistent interaction patterns with celebration animations
- Progress tracking and cue collection system

### Pages (Marketing & Platform)
- `src/pages/homepage.tsx`: Complete modular website homepage with hero, showcase, features
- `src/pages/catalog.tsx`: Comprehensive book catalog with filtering, search, sorting
- `src/pages/features.tsx`: Comprehensive features showcase with interactive cue demonstrations
- `src/pages/about.tsx`: Complete about page with mission, values, story, and team info
- `src/pages/feedback.tsx`: Thank you page for early readers with feedback links
- `src/pages/404.tsx`: Custom 404 error page

### Auth Pages (User Management)
- `src/pages/auth/login.tsx`: User login page with form validation
- `src/pages/auth/signup.tsx`: User registration page with validation
- `src/pages/auth/forgot-password.tsx`: Password reset request page
- `src/pages/auth/reset-password.tsx`: Password reset confirmation page
- `src/pages/auth/password-recovery.tsx`: Alternative password recovery options
- `src/pages/dashboard/library.tsx`: User library page with book access and progress tracking
- `src/pages/book/wtbtg.tsx`: Token-protected book reading page for WTBTG with access validationress tracking

### Admin Panel (Management Interface)
- `src/pages/admin/admin-dashboard.tsx`: User analytics and system overview
- `src/pages/admin/admin-users.tsx`: User management and detailed analytics
- `src/pages/admin/admin-settings.tsx`: System configuration and token management
- `src/pages/admin/user-analytics.tsx`: Individual user reading analytics and behavior insights
- `src/components/admin/admin-layout.tsx`: Consistent admin panel layout with navigation

### Layout & Navigation Components
- `src/components/layout/header.tsx`: Site navigation with auth controls and updated branding
- `src/components/layout/footer.tsx`: Site footer with brand information and links
- `src/components/auth/auth-guard.tsx`: Protected route wrapper with loading states
- `src/components/auth/admin-guard.tsx`: Admin-only route protection
- `src/contexts/auth-context.tsx`: Authentication context with JWT token management

### Server Infrastructure (API & Database)
- `src/server/routes/auth.ts`: Complete authentication system with registration, login, password reset
- `src/server/routes/book-access.ts`: Token-based book access with validation and progress tracking
- `src/server/routes/admin.ts`: Admin panel APIs for user management and analytics
- `src/server/routes/index.ts`: Route registration and API setup
- `src/server/shared-database.ts`: Mock database with comprehensive user and book management
- `src/server/schema.ts`: Complete Zod schemas for all API endpoints and data validation

### Design System & Styling
- `tailwind.config.ts`: Brand colors (Forest #2D5F3F, Golden #F4D03F, Coral #FF6B6B, Earth #8B4513, Cream #FDF6E3)
- `src/styles/globals.css`: Custom brand theme with nature-inspired color system
- `src/components/ui/`: Complete shadcn/ui component library
- Consistent typography with Nunito and Poppins fonts

### Documentation & Deployment
- `docs/prd.md`: Product Requirements Document
- `docs/overview.md`: This comprehensive project overview
- `docs/todo.md`: Current implementation tasks and progress
- `docs/integration-guide.md`: External book integration documentation
- `docs/deployment-checklist.md`: Production deployment guide
- `docs/return-button-integration.md`: External book return navigation guide

## Current Implementation Status

### ✅ Completed (Production Ready)
- Complete marketing website with all pages
- User authentication and account management
- Admin panel with user analytics and system management
- External book integration with secure token system
- Database schema and API infrastructure
- Production security and performance optimizations

### 📚 Ready for Integration (Phase 18 - Chapter Integration)
- **Primary Focus**: Integrating all 6 chapters into the platform
- **Current Status**: All 6 chapters organized (6/6 complete) ✅
- **Next**: Integration strategy planning and implementation
- **Goal**: Complete interactive book reading experience

### 🔄 Pending Integration
- Complete chapter scene component creation
- Unified chapter navigation system
- Progress tracking across all chapters
- Cue collection system integration
- Activities pages for each chapter
- Performance optimization for full book experience