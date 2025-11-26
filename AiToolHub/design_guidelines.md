# AI Tools Platform - Design Guidelines

## Design Approach
**Hybrid Modern SaaS Aesthetic** - Drawing inspiration from ChatGPT, Notion AI, and Linear with a clean, tech-forward interface that balances visual appeal with utility.

## Core Design Principles
- **Clarity First**: Every tool interface must be immediately understandable
- **Progressive Disclosure**: Show simple inputs first, reveal advanced options on demand
- **Visual Hierarchy**: Clear distinction between input areas, action buttons, and results
- **Trust & Professionalism**: Clean layouts that inspire confidence in AI capabilities

---

## Typography System

**Font Stack**: Inter (primary), JetBrains Mono (code/technical content) via Google Fonts

**Hierarchy**:
- Hero Headlines: text-5xl to text-6xl, font-bold
- Page Titles: text-4xl, font-bold
- Section Headers: text-2xl to text-3xl, font-semibold
- Tool Names: text-xl, font-semibold
- Body Text: text-base, font-normal
- Descriptions: text-sm, text-gray-600
- Labels: text-sm, font-medium, uppercase tracking

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, mt-8, py-12, space-y-16, mb-24)

**Container Strategy**:
- Landing page: Full-width sections with inner max-w-7xl
- Tool pages: max-w-4xl centered containers for forms
- Results areas: max-w-6xl for wider content display

**Grid Patterns**:
- Tool cards on landing: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- Feature lists: grid-cols-1 md:grid-cols-2 with gap-8
- All grids collapse to single column on mobile

---

## Component Library

### Navigation
- Sticky header with logo (left), nav links (center), "Get Started" CTA (right)
- Logo: Bold text or simple icon + text combination
- Mobile: Hamburger menu with slide-out drawer

### Landing Page Structure
1. **Hero Section** (80vh):
   - Large headline emphasizing "AI-Powered Tools"
   - Subheadline explaining value proposition
   - Primary CTA button ("Explore Tools") + secondary text link
   - Subtle gradient background (top-to-bottom fade)
   - NO large hero image - focus on clean typography

2. **Tools Grid Section**:
   - 6 tool cards (5 active + 1 "Database Speaks" marked as "Coming Soon")
   - Each card: Icon, tool name, 2-line description, "Try Now" button
   - Cards have subtle border, slight hover lift effect

3. **Features Section** (3 columns):
   - "Instant Results", "No Setup Required", "Download & Export"
   - Icon + title + description format

4. **CTA Section**:
   - "Ready to boost your productivity?"
   - Large centered button with supporting text

5. **Footer**:
   - Logo, brief tagline
   - Quick links (Tools, About, Privacy)
   - Copyright notice

### Tool Pages Layout
**Consistent Structure**:
- Tool name + icon header (text-3xl)
- Brief description paragraph
- **Two-column layout on desktop**:
  - Left: Input form area (sticky if long)
  - Right: Results/output area (scrollable)
- Single column stack on mobile (input above results)

### Form Components
- **Text Inputs**: Rounded-lg border with focus ring, generous padding (p-3)
- **Textareas**: Min-height of h-32, resize-y enabled
- **Select Dropdowns**: Custom styled with consistent border treatment
- **Action Buttons**: 
  - Primary: Solid background, prominent, px-8 py-3
  - Secondary: Outlined variant
  - Loading state: Spinner + "Processing..." text

### Result Displays
- **PersonaFlow Chat**: Message bubbles (user right, AI left), chat history scrollable
- **Summarizer**: Formatted text blocks with headings, bullet points
- **Blog Writer**: Article preview with clear typography hierarchy
- **Flowchart**: Embedded SVG/image display with download button
- **Course Generator**: Accordion-style modules, expandable sections

### Cards & Containers
- Tool cards: Rounded-xl, subtle shadow, border, p-6
- Result containers: Rounded-lg, background slightly different from page
- Code blocks (if needed): JetBrains Mono, rounded borders, copy button

### Buttons & CTAs
- Border-radius: rounded-lg
- Primary CTAs: Larger size (px-6 py-3), bold text
- Icon buttons: Square aspect ratio with centered icon
- **Blur background for buttons on images**: bg-white/20 backdrop-blur-md (glass effect)

---

## Visual Treatment

**Subtle Gradients**:
- Hero: Linear gradient from soft purple/blue to white
- Section backgrounds: Alternate between white and very light gray
- Card hover: Slight gradient shift

**Borders & Shadows**:
- Cards: border + shadow-sm on hover to shadow-md
- Inputs: border-gray-300 to border-blue-500 on focus
- Elevation: Use sparingly, max shadow-lg for modals

---

## Interaction Patterns

**Minimal Animations**:
- Card hover: Slight y-translate (-2px) with shadow increase (duration-200)
- Button click: Scale down briefly (scale-95)
- Page transitions: Simple fade-in for results
- NO complex scroll-triggered animations

**Loading States**:
- Spinner icon with "Processing..." text
- Disable submit button during processing
- Show skeleton loader for result areas

---

## Images

**NO large hero image** - Typography-focused hero with gradient background

**Tool Icons**: Use Heroicons library via CDN
- PersonaFlow: ChatBubbleLeftRightIcon
- Summarizer: DocumentTextIcon
- Blog Writer: PencilSquareIcon
- Flowchart: ChartBarIcon
- Course Generator: AcademicCapIcon

**Result Previews**: 
- Flowchart tool displays generated diagram image
- Blog previews may include placeholder article images if applicable

---

## Responsive Behavior

**Breakpoints**:
- Mobile: Base styles (single column)
- Tablet: md: (768px) - 2 columns where appropriate
- Desktop: lg: (1024px) - Full multi-column layouts

**Mobile Adjustments**:
- Stack all columns vertically
- Full-width buttons
- Reduced padding (p-4 instead of p-8)
- Hide less critical information

---

## Accessibility & Quality

- All form inputs have visible labels
- Sufficient color contrast (WCAG AA minimum)
- Focus indicators on all interactive elements
- Loading states clearly communicated
- Error messages displayed near relevant fields
- Consistent spacing and alignment throughout