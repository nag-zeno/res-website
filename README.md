<<<<<<< HEAD
# Design Specification Summary & Implementation Guide

## Overview

This document provides a comprehensive design specification for a **Neumorphic English Learning Web App**. The design follows a mobile-first, touch-first approach with a soft, modern neumorphic aesthetic.

---

## Document Structure

The complete design specification is divided into the following files:

### 1. **design-system.md**

**Core design tokens and component states**

- Color palette (background, text, accent, semantic colors)
- Shadow tokens (raised, inset, subtle variations)
- Border radius scale (12px to 28px)
- Spacing scale (4px to 64px)
- Typography scale (Inter/SF Pro, 12px to 36px)
- Component states (default, hover, pressed, focus, disabled)
- Icon and illustration style guidelines
- Animation timing functions and durations
- Accessibility standards (contrast, focus, touch targets)

### 2. **ia-navigation.md**

**Information architecture and navigation patterns**

- Complete site map based on flowchart
- Navigation patterns (mobile bottom nav, desktop sidebar)
- Global components (top bar, bottom nav, sidebar)
- Screen transitions and loading states
- Modal and overlay patterns
- Responsive breakpoints and layout changes
- Deep linking structure
- Navigation flow examples

### 3. **screens-entry-onboarding.md**

**Entry and onboarding screens (A-D)**

- A. Entry/Loading + Guest creation
- B. Onboarding Step 1: Choose Goal (5 goal cards)
- C. Onboarding Step 2: Choose Level (slider + 5 level cards)
- D. Onboarding Step 3: Preferences (mode, hints, slow mode toggles)

### 4. **screens-home-prechat.md**

**Home and pre-conversation screens (E-G)**

- E. Home (streak card, 6 quick actions, recent sessions, tips)
- F. Pre-chat Setup (topic preview, mode selector, options)
- G. Topic Library (search, category chips, topic grid)

### 5. **screens-permission-conversation.md**

**Permission gate and conversation room (H-I)**

- H. Microphone Permission Gate (allow/deny/blocked states)
- I. Conversation Room (chat bubbles, input bar, hints, help sheet, end session)
  - Voice + text + both modes
  - "Help Me Say This" bottom sheet (Vietnamese input, 3 suggestions)
  - Slow mode toggle
  - End session confirmation

### 6. **screens-report.md**

**Report pipeline and session report (J-K)**

- J. Report Generating Screen (progress, status steps)
- J2. Report Failed Screen (retry, view transcript)
- K. Session Report Screen (4 tabs)
  - K1. Summary (score, strengths, focus next)
  - K2. Mistakes (top 3-5, explanations, practice CTA)
  - K3. Better Ways (rewrites, practice CTA)
  - K4. Practice (practice set preview, start CTA)

### 7. **screens-practice-flashcards-history-settings.md**

**Practice, flashcards, history, and settings (L-O)**

- L. Practice Session (4 item types, text/voice input, feedback, completion)
- M. Flashcards (swipe/flip cards, know/review buttons)
- N. History (session list, filter, empty state)
- O. Settings (profile, preferences, privacy, about, account)

### 8. **interaction-details.md**

**Micro-interactions and animations**

- Button interactions (primary, secondary, icon, text)
- Card interactions (hover, press, swipe, flip)
- Toggle/switch interactions (on/off transitions)
- Input field interactions (focus, error, voice recording)
- Chip interactions (hover, press, dismiss)
- Modal and bottom sheet animations (open/close, drag to dismiss)
- Tab switching animations
- Toast/snackbar animations
- Loading states (spinner, skeleton, progress)
- Scroll behaviors (smooth scroll, pull to refresh, infinite scroll)
- Feedback animations (success, error, confetti)
- Haptic feedback patterns
- Accessibility interactions (focus visible, reduced motion)

### 9. **responsive-design.md**

**Responsive behavior across devices**

- Breakpoint strategy (360px to 1440px+)
- Layout changes by breakpoint
- Component responsive behavior (cards, buttons, inputs, modals, grids)
- Responsive patterns (stacking, multi-column, bottom nav to sidebar)
- Responsive images and icons
- Responsive spacing and shadows
- Orientation handling (portrait/landscape)
- Responsive testing checklist
- Performance considerations

### 10. **microcopy-content.md**

**Content guidelines and microcopy**

- Voice and tone (friendly, professional, supportive, motivating)
- Content principles (clear, concise, conversational, positive)
- Button labels (primary, secondary, destructive)
- Screen titles
- Labels and placeholders
- Status messages (loading, success, error)
- Empty states
- Feedback messages (practice, conversation, report)
- Onboarding copy
- Permission gate copy
- Help Me Say This copy
- Report copy
- Settings copy
- Time/date formatting
- Error messages
- Accessibility labels
- Tips and motivational messages
- Confirmation dialogs
- Content length guidelines
- Localization notes

---

## Key Design Principles

### 1. Neumorphic Aesthetic

- **Soft shadows**: Dual shadows (light + dark) create depth
- **Subtle elevation**: Elements appear to float or sink into the surface
- **Minimal color**: Off-white background (#F2F4F7) with pastel accents
- **Large border radius**: 16-28px for cards, buttons, and containers
- **Smooth transitions**: 150-250ms for most interactions

### 2. Mobile-First, Touch-First

- **44x44px minimum touch targets** (48x48px recommended)
- **Bottom navigation** on mobile/tablet
- **Large, clear typography** (16px minimum for body text)
- **Generous spacing** between interactive elements
- **Thumb-friendly layouts** (important actions within reach)

### 3. Accessibility

- **AAA contrast** for body text (7:1)
- **Focus indicators** always visible on keyboard navigation
- **Screen reader support** with proper ARIA labels
- **Reduced motion** support for animations
- **Keyboard navigation** for all interactive elements

### 4. Progressive Enhancement

- **Core functionality** works on all devices
- **Enhanced interactions** on larger screens (hover states, multi-column layouts)
- **Graceful degradation** for older browsers

---

## Implementation Workflow

### Phase 1: Foundation (Week 1)

1. **Set up design tokens** (CSS variables)
   - Colors, shadows, spacing, typography, border radius
2. **Create base styles** (reset, typography, layout utilities)
3. **Build design system components** (buttons, inputs, cards, chips, toggles)
4. **Test component states** (default, hover, pressed, focus, disabled)

### Phase 2: Navigation & Layout (Week 2)

1. **Implement global navigation** (top bar, bottom nav, sidebar)
2. **Create layout templates** (mobile, tablet, desktop)
3. **Build modal and bottom sheet components**
4. **Implement page transitions**

### Phase 3: Core Screens (Week 3-4)

1. **Entry & Onboarding** (A-D)
   - Loading screen, guest creation
   - 3 onboarding steps
2. **Home & Pre-chat** (E-G)
   - Home screen with quick actions
   - Pre-chat setup
   - Topic library with search
3. **Conversation** (H-I)
   - Permission gate
   - Conversation room (voice + text)
   - Help Me Say This bottom sheet

### Phase 4: Report & Practice (Week 5-6)

1. **Report Pipeline** (J-K)
   - Generating screen with progress
   - Failed screen with retry
   - Session report with 4 tabs
2. **Practice Session** (L)
   - 4 practice item types
   - Text and voice input
   - Feedback and completion screens
3. **Flashcards** (M)
   - Swipe and flip animations
   - Know/review buttons

### Phase 5: History & Settings (Week 7)

1. **History** (N)
   - Session list with filters
   - Empty state
2. **Settings** (O)
   - Profile, preferences, privacy
   - Account management

### Phase 6: Polish & Testing (Week 8)

1. **Micro-interactions** (all animations and transitions)
2. **Responsive testing** (all breakpoints)
3. **Accessibility audit** (keyboard, screen reader, contrast)
4. **Performance optimization** (lazy loading, code splitting)
5. **Cross-browser testing** (Chrome, Safari, Firefox, Edge)
6. **User testing** (usability, feedback)

---

## Design Deliverables Checklist

### Design System

- [ ] Color palette defined
- [ ] Shadow tokens defined
- [ ] Typography scale defined
- [ ] Spacing scale defined
- [ ] Border radius scale defined
- [ ] Component states documented
- [ ] Animation guidelines documented

### Screens

- [ ] All 15+ screens designed (A-O)
- [ ] All states designed (default, hover, pressed, focus, disabled, loading, error, empty)
- [ ] All breakpoints designed (mobile, tablet, desktop)
- [ ] All interactions documented

### Components

- [ ] Buttons (primary, secondary, icon, text)
- [ ] Cards (standard, swipeable, selectable)
- [ ] Inputs (text, voice, toggle, segmented control)
- [ ] Chips (standard, active, dismissible)
- [ ] Modals (centered, full-screen)
- [ ] Bottom sheets (standard, draggable)
- [ ] Navigation (top bar, bottom nav, sidebar)
- [ ] Tabs (horizontal, with indicator)
- [ ] Progress indicators (spinner, skeleton, bar, circular)
- [ ] Toasts/snackbars

### Content

- [ ] All button labels defined
- [ ] All screen titles defined
- [ ] All placeholders defined
- [ ] All error messages defined
- [ ] All empty states defined
- [ ] All success messages defined
- [ ] All microcopy defined

### Documentation

- [ ] Design system documented
- [ ] IA and navigation documented
- [ ] All screens documented
- [ ] All interactions documented
- [ ] Responsive behavior documented
- [ ] Content guidelines documented
- [ ] Accessibility guidelines documented

---

## Developer Handoff Notes

### CSS Architecture

- Use **CSS custom properties** for design tokens
- Use **BEM naming convention** for classes
- Use **CSS Grid** and **Flexbox** for layouts
- Use **CSS animations** over JavaScript (better performance)
- Use **media queries** for responsive design
- Consider **CSS-in-JS** if using React/Vue (styled-components, emotion)

### Component Library

- Build **reusable components** (buttons, cards, inputs, etc.)
- Use **prop-based variants** (size, color, state)
- Document **component API** (props, events, slots)
- Create **Storybook** or similar for component showcase

### Accessibility

- Use **semantic HTML** (header, nav, main, section, article, footer)
- Add **ARIA labels** where needed (aria-label, aria-describedby)
- Ensure **keyboard navigation** works (tab order, focus management)
- Test with **screen readers** (NVDA, JAWS, VoiceOver)
- Respect **prefers-reduced-motion** media query

### Performance

- **Lazy load** images and components
- **Code split** by route
- **Optimize images** (WebP, responsive images)
- **Minimize JavaScript bundle** (tree shaking, minification)
- **Use CDN** for static assets
- **Implement caching** (service workers, HTTP caching)

### Testing

- **Unit tests** for components
- **Integration tests** for user flows
- **E2E tests** for critical paths (onboarding, conversation, practice)
- **Visual regression tests** (Percy, Chromatic)
- **Accessibility tests** (axe, Lighthouse)
- **Performance tests** (Lighthouse, WebPageTest)

---

## Design Tools & Resources

### Recommended Tools

- **Figma**: For high-fidelity mockups and prototypes
- **Storybook**: For component library documentation
- **Zeplin/Figma Inspect**: For developer handoff
- **Lottie**: For complex animations (if needed)

### Font Resources

- **Inter**: <https://fonts.google.com/specimen/Inter>
- **SF Pro**: <https://developer.apple.com/fonts/> (Apple devices)

### Icon Resources

- **Lucide Icons**: <https://lucide.dev/> (recommended for neumorphic style)
- **Heroicons**: <https://heroicons.com/>
- **Feather Icons**: <https://feathericons.com/>

### Color Tools

- **Coolors**: <https://coolors.co/> (palette generation)
- **Contrast Checker**: <https://webaim.org/resources/contrastchecker/>

### Animation Tools

- **Cubic Bezier**: <https://cubic-bezier.com/> (easing functions)
- **Animista**: <https://animista.net/> (CSS animations)

---

## Flowchart Coverage

This design specification covers **all nodes and flows** from the provided flowchart:

✅ Entry + Guest User Creation  
✅ Onboarding (3 steps)  
✅ Home (6 entry points)  
✅ Pre-chat Setup  
✅ Topic Library  
✅ Microphone Permission Gate (grant/deny/blocked)  
✅ Conversation Room (voice/text/both, hints, help sheet, slow mode, end session)  
✅ Report Pipeline (generating, failed, success)  
✅ Session Report (4 tabs: Summary, Mistakes, Better Ways, Practice)  
✅ Practice Session (4 item types, pass/fail, completion)  
✅ Flashcards (swipe, flip, know/review)  
✅ History (session list, open report)  
✅ Settings (profile, preferences, privacy)  

**All branches and fallbacks are designed**, including:

- Permission denied → Fallback to text mode
- Report failed → Retry or view transcript
- Practice fail → Hint + try again
- Empty states for all screens
- Error states for all interactions

---

## Final Notes

This design specification is **comprehensive and implementation-ready**. Developers can use these documents to build the entire application without needing additional design decisions.

**Key Success Metrics**:

- **Visual Excellence**: Neumorphic design that wows users
- **Usability**: Intuitive navigation and clear feedback
- **Accessibility**: Works for all users, all devices
- **Performance**: Fast load times, smooth animations
- **Consistency**: Same design language throughout

**Next Steps**:

1. Review all documents with the team
2. Create high-fidelity mockups in Figma (optional, but recommended)
3. Build component library (design system)
4. Implement screens following the workflow
5. Test and iterate based on user feedback

---

**Design Specification Version**: 1.0  
**Last Updated**: January 18, 2026  
**Designer**: Senior UI/UX Designer  
**Status**: Ready for Implementation
=======
# res-website
>>>>>>> 7302bc5c90c8105c368bd5250203cd2b0ba1bd10
