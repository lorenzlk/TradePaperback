# Mobile UI Mockups: Scanning Flow
## 5-Screen User Journey from Scan to Listed

---

## 📱 Screen Flow Overview

```
1. SCANNER SCREEN
   ↓ (scan detected)
2. CONFIRMATION SCREEN  
   ↓ (user confirms)
3. PRICING SCREEN
   ↓ (view data)
4. INPUT SCREEN
   ↓ (set price + condition)
5. SUCCESS SCREEN
   ↓ (auto-return to scanner)
```

**Target Time**: <10 seconds total

---

## Screen 1: Scanner Screen

### Purpose
Auto-detect barcodes or capture cover photos

### Layout
```
┌─────────────────────────────────────┐
│  [ ☰ ]              SCAN      [📷] │  ← Header
├─────────────────────────────────────┤
│                                     │
│           [CAMERA FEED]             │
│                                     │
│        ┌─────────────────┐          │
│        │                 │          │
│        │   SCAN FRAME    │          │  ← Targeting box
│        │                 │          │
│        │   ╔═══════╗     │          │
│        │   ║       ║     │          │
│        │   ║       ║     │          │
│        │   ╚═══════╝     │          │
│        │                 │          │
│        └─────────────────┘          │
│                                     │
│      "Position barcode here"        │  ← Instruction
│                                     │
├─────────────────────────────────────┤
│  [🔦 FLASH]  [📖 COVER]  [⌨️ MANUAL]│  ← Actions
└─────────────────────────────────────┘
```

### Components

**Header**:
- Menu icon (left)
- "SCAN" title (center)
- Help icon (right)

**Camera View**:
- Full-screen video feed
- Green scan frame overlay
- Animated scan line (moves up/down)
- Corner brackets (targeting guides)

**Instructions**:
- Dynamic text based on mode:
  - "Position barcode within frame"
  - "Center cover in frame" (cover mode)
  - "Hold steady..."

**Action Bar**:
- **Flash Toggle**: Turn flashlight on/off
- **Cover Mode**: Switch to cover photo capture
- **Manual Entry**: Type UPC manually

### States

**Idle**:
- Scan line animating
- Text: "Position barcode within frame"

**Detecting**:
- Scan line faster animation
- Text: "Hold steady..."

**Success**:
- Green flash
- Haptic vibration
- Text: "✓ Detected!"
- Auto-advance to Confirmation

**Error**:
- Red pulse
- Text: "Barcode not found. Try again."

---

## Screen 2: Confirmation Screen

### Purpose
Verify correct book match before proceeding

### Layout
```
┌─────────────────────────────────────┐
│  [ ← ]        CONFIRM BOOK    [✕]   │
├─────────────────────────────────────┤
│                                     │
│       ┌─────────────────────┐       │
│       │                     │       │
│       │   [COVER IMAGE]     │       │  ← Book cover
│       │                     │       │     (from database)
│       │                     │       │
│       └─────────────────────┘       │
│                                     │
│        Batman Vol 1:                │
│        Court of Owls                │  ← Title
│                                     │
│        DC Comics • 2012             │  ← Publisher
│        Trade Paperback • 144 pages  │  ← Format
│                                     │
│        ISBN: 9781401235420          │  ← ISBN
│                                     │
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────────────┐     │
│     │   ✓ THIS IS CORRECT     │     │  ← Primary button
│     └─────────────────────────┘     │
│                                     │
│     [ TRY AGAIN ]  [ EDIT DETAILS ] │  ← Secondary
│                                     │
└─────────────────────────────────────┘
```

### Components

**Cover Image**:
- High-resolution database image
- Not the user's photo
- Centered, max width 60%
- Subtle drop shadow

**Book Details**:
- **Title**: Large, bold, 18px
- **Publisher + Year**: Medium, 14px, gray
- **Format + Pages**: Small, 12px, light gray
- **ISBN**: Monospace font, 12px

**Buttons**:
- **✓ This is Correct**: Green, 48px height, full width
- **Try Again**: Gray outline, half width
- **Edit Details**: Gray outline, half width

### Variant Selector (if multiple matches)

```
┌─────────────────────────────────────┐
│         WHICH EDITION?              │
├─────────────────────────────────────┤
│                                     │
│  ◉  ┌────┐  Batman Vol 1           │
│     │IMG │  1st Edition (2012)      │  ← Option 1
│     └────┘  DC Comics               │
│                                     │
│  ○  ┌────┐  Batman Vol 1           │
│     │IMG │  2nd Printing (2013)     │  ← Option 2
│     └────┘  DC Comics               │
│                                     │
│  ○  ┌────┐  Batman Vol 1           │
│     │IMG │  Deluxe Ed (2015)        │  ← Option 3
│     └────┘  DC Comics HC            │
│                                     │
│     [ CONFIRM SELECTION ]           │
│                                     │
└─────────────────────────────────────┘
```

---

## Screen 3: Pricing Screen

### Purpose
Show marketplace pricing intelligence

### Layout
```
┌─────────────────────────────────────┐
│  [ ← ]      PRICING DATA      [?]   │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐   Batman Vol 1:           │
│  │ IMG  │   Court of Owls           │  ← Mini preview
│  └──────┘                           │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│  💰 MARKETPLACE PRICING              │
│                                     │
│  ┌─────────────────────────────────┐│
│  │         AVERAGE                 ││
│  │         $12.99                  ││  ← Average (large)
│  └─────────────────────────────────┘│
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │   HIGHEST    │  │   LOWEST     ││
│  │   $18.50     │  │   $8.00      ││  ← High/Low
│  └──────────────┘  └──────────────┘│
│                                     │
│  Based on 47 active listings        │  ← Context
│  Last updated: 2 hours ago          │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│  📊 RECENT SALES                     │
│                                     │
│  • $13.50 (Good) - 3 days ago       │
│  • $11.99 (Fair) - 5 days ago       │  ← Sale history
│  • $15.00 (Mint) - 1 week ago       │
│                                     │
├─────────────────────────────────────┤
│     [ CONTINUE TO PRICING ]         │  ← Next step
└─────────────────────────────────────┘
```

### Components

**Mini Preview**:
- Small cover thumbnail (top left)
- Book title next to it

**Average Price Card**:
- Large, centered
- Green background
- Bold, 32px font
- Most prominent element

**High/Low Cards**:
- Side by side
- Smaller than average
- Light gray background
- 24px font

**Context Info**:
- Number of listings
- Last update timestamp
- Builds trust in data

**Recent Sales**:
- 3 most recent sales
- Shows price + condition + date
- Helps seller understand market

---

## Screen 4: Input Screen

### Purpose
Seller sets price and condition

### Layout
```
┌─────────────────────────────────────┐
│  [ ← ]        SET PRICE       [?]   │
├─────────────────────────────────────┤
│                                     │
│  ┌──────┐   Batman Vol 1            │
│  │ IMG  │   Avg: $12.99             │  ← Reference
│  └──────┘                           │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│  💵 YOUR PRICE                       │
│                                     │
│       ┌─────────────────────┐       │
│       │  $   12.99          │       │  ← Price input
│       └─────────────────────┘       │
│                                     │
│       📊 Same as average            │  ← Comparison
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│  📋 CONDITION                        │
│                                     │
│  ┌─────────────────────────────────┐│
│  │  ◉  🟢 MINT                     ││
│  │     Perfect, like new            ││  ← Option 1
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  ○  🟡 GOOD                     ││
│  │     Minor wear, readable         ││  ← Option 2
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  ○  🟠 FAIR                     ││
│  │     Noticeable wear, intact      ││  ← Option 3
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │  ○  🔴 WORN                     ││
│  │     Heavy wear, acceptable       ││  ← Option 4
│  └─────────────────────────────────┘│
│                                     │
├─────────────────────────────────────┤
│       [ LIST THIS BOOK ]            │  ← Submit
└─────────────────────────────────────┘
```

### Components

**Price Input**:
- Large text field
- Dollar sign prefix
- Numeric keyboard
- Pre-filled with average price
- Auto-focus on load

**Price Comparison**:
- Real-time feedback below input
- Examples:
  - "📊 Same as average"
  - "📈 15% above average"
  - "📉 10% below average"
- Green if within ±20%, yellow otherwise

**Condition Selector**:
- Large touch targets (60px height)
- Radio button style
- Color-coded (🟢🟡🟠🔴)
- Clear descriptions
- One must be selected

**List Button**:
- Disabled until price + condition set
- Green background when active
- Full width, 56px height

### Smart Defaults

**Price Suggestions**:
- **MINT**: Average + 10%
- **GOOD**: Average ± 0%
- **FAIR**: Average - 20%
- **WORN**: Average - 50%

Auto-adjust price when condition changes

---

## Screen 5: Success Screen

### Purpose
Confirm listing created, prepare for next scan

### Layout
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│          ┌─────────────┐            │
│          │             │            │
│          │   ✓         │            │  ← Big checkmark
│          │             │            │     (animated)
│          └─────────────┘            │
│                                     │
│         BOOK LISTED!                │  ← Success message
│                                     │
│  ┌──────┐   Batman Vol 1            │
│  │ IMG  │   Listed at $12.99        │  ← Summary
│  └──────┘   Condition: Good         │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│  📊 YOUR LISTINGS                    │
│                                     │
│  Total Listed: 47 books             │
│  This Week: 5 books                 │  ← Stats
│  Total Value: $623.50               │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│  [ SCAN ANOTHER BOOK ]              │  ← Primary action
│                                     │
│  [ VIEW MY LISTINGS ]               │  ← Secondary
│                                     │
└─────────────────────────────────────┘
```

### Animation Sequence

1. **Green checkmark** fades in + scales up (0.5s)
2. **Success message** fades in (0.3s delay)
3. **Book summary** slides up (0.5s delay)
4. **Stats** fade in (0.7s delay)
5. **Buttons** fade in (1s delay)

**Auto-return**: After 3 seconds, automatically return to Scanner Screen

---

## 🎨 Design System

### Colors

**Primary (Green)**:
- `#00D084` - Success, primary buttons
- `#00B874` - Hover states
- `#009964` - Active states

**Condition Colors**:
- 🟢 MINT: `#10B981` (Green)
- 🟡 GOOD: `#F59E0B` (Amber)
- 🟠 FAIR: `#F97316` (Orange)
- 🔴 WORN: `#EF4444` (Red)

**Neutrals**:
- Background: `#FFFFFF` (White)
- Card BG: `#F9FAFB` (Light Gray)
- Border: `#E5E7EB` (Gray)
- Text: `#111827` (Black)
- Subtext: `#6B7280` (Medium Gray)

### Typography

**Headings**:
- Screen Title: 18px, Bold, #111827
- Section Title: 16px, Semibold, #111827
- Card Title: 14px, Medium, #111827

**Body**:
- Primary: 14px, Regular, #111827
- Secondary: 12px, Regular, #6B7280
- Small: 11px, Regular, #9CA3AF

**Prices**:
- Large Price: 32px, Bold, #111827
- Medium Price: 24px, Semibold, #111827
- Small Price: 16px, Medium, #111827

### Spacing

**Padding**:
- Screen edges: 16px
- Card padding: 16px
- Section spacing: 24px
- Element spacing: 12px

**Buttons**:
- Height: 48px (primary), 40px (secondary)
- Border radius: 8px
- Font size: 16px, Semibold

### Components

**Cards**:
```css
.card {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

**Buttons**:
```css
.btn-primary {
  background: #00D084;
  color: white;
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,208,132,0.3);
}

.btn-secondary {
  background: white;
  color: #6B7280;
  border: 1px solid #E5E7EB;
  height: 40px;
  border-radius: 8px;
}
```

**Input Fields**:
```css
.input {
  height: 48px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 16px;
}

.input:focus {
  border-color: #00D084;
  outline: none;
}
```

---

## 📐 Responsive Breakpoints

### Mobile (Primary)
- Width: 375px - 414px
- Optimized for iPhone SE, 12, 13, 14
- Single column layout
- Full-width buttons

### Tablet
- Width: 768px+
- Two-column layout for listings
- Larger touch targets
- Side-by-side pricing cards

### Desktop (Web App)
- Width: 1024px+
- Fixed max-width (600px)
- Centered content
- Keyboard shortcuts enabled

---

## ⚡ Performance Targets

**Load Times**:
- Scanner → Camera active: <1s
- Scan → Confirmation: <2s
- API response: <2s
- Screen transitions: <300ms

**Animations**:
- Smooth 60fps
- Use transform/opacity only
- Hardware acceleration enabled

---

## 🎭 Interaction States

### Buttons

**Default**: 
- Solid color
- Drop shadow

**Hover** (web):
- Lighten 5%
- Lift shadow

**Active** (tap):
- Darken 10%
- Scale 98%
- Haptic feedback

**Disabled**:
- Opacity 40%
- No shadow
- No interaction

### Input Fields

**Default**:
- Gray border
- White background

**Focus**:
- Green border
- Keyboard appears

**Error**:
- Red border
- Error message below

**Success**:
- Green border
- Checkmark icon

---

## 🧪 Prototyping Tools

**Recommended**:
- **Figma**: Full designs + prototypes
- **Framer**: Interactive prototypes
- **InVision**: User testing

**Deliverables**:
1. Figma file with all 5 screens
2. Component library (buttons, cards, inputs)
3. Interactive prototype (clickable flow)
4. Design specs (spacing, colors, fonts)

---

## ✅ Implementation Checklist

- [ ] Create Figma file with 5 screens
- [ ] Design component library (buttons, cards, etc.)
- [ ] Build interactive prototype
- [ ] Test on actual device (mobile)
- [ ] Get feedback from 3 shop owners
- [ ] Iterate based on feedback
- [ ] Hand off to developer with specs
- [ ] Build HTML/CSS/JS implementation

---

**Ready to prototype? I can help you create a clickable Figma prototype or write the HTML/CSS for these screens.**

