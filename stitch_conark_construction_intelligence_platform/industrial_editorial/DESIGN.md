---
name: Industrial Editorial
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d8'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1edec'
  surface-container-high: '#ebe7e6'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#444748'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1d1b1a'
  on-tertiary-container: '#868381'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e6e1df'
  tertiary-fixed-dim: '#cac6c3'
  on-tertiary-fixed: '#1d1b1a'
  on-tertiary-fixed-variant: '#484645'
  background: '#fdf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 110px
    letterSpacing: 0.02em
  display-lg:
    fontFamily: Anton
    fontSize: 64px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 36px
  technical-data:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
  technical-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 48px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 40px
  section-gap: 80px
---

## Brand & Style

This design system establishes a high-fidelity editorial aesthetic for industrial intelligence. It rejects the soft, translucent tropes of modern SaaS in favor of a "Physical Digital" philosophy. The visual language is inspired by technical manuals, architectural blueprints, and high-end broadsheet journalism.

The personality is authoritative, precise, and utilitarian. It treats data as a first-class citizen, using stark typography and high-contrast color blocks to communicate urgency and architectural scale. The layout emphasizes verticality and modularity, mimicking the tactile feel of stacked physical folders or printed logistics manifests.

Key stylistic pillars:
- **Structural Integrity:** Heavy use of solid borders and defined grid lines.
- **Data Density:** Technical information is presented with mono-spaced clarity.
- **Physical Depth:** Instead of shadows, depth is communicated through stacking, offsets, and distinct color-coded "tickets."
- **Editorial Whitespace:** Generous vertical tracking and wide margins to allow complex information to breathe.

## Colors

The palette uses a warm, parchment-like gray (`#EDECE7`) as the foundation to reduce visual fatigue and provide a more "printed" feel than pure white. 

- **Functional Color Blocks:** Use the high-visibility accents (Blue, Chartreuse, Mint, Magenta) to categorize data types or status levels. 
- **The "Ticket" System:** Large cards should utilize these vibrant backgrounds with black text to denote specific modules (e.g., Risk, Schedule, Optimization).
- **Surface Layering:** Use the Cream (`#F5F3E3`) color for secondary backgrounds or input areas to create subtle distinction without losing the warm tonality.
- **Stark Contrast:** Typography and primary borders must remain strict Black (`#111111`) to ensure legibility and an authoritative tone.

## Typography

The typographic hierarchy is the core engine of this design system, blending three distinct voices:

1.  **The Impact (Anton):** Reserved for high-level branding, main headers, and critical numerical data. It should always be used in uppercase for a cinematic, industrial feel.
2.  **The Technical (JetBrains Mono):** Used for all data-heavy outputs, timestamps, labels, and status indicators. It communicates the "under-the-hood" intelligence of the platform.
3.  **The Narrative (Inter):** Used for AI-generated insights, descriptions, and long-form reading. It provides a human, legible contrast to the starkness of the other two fonts.

Always ensure ample line height for Inter to maintain the editorial feel. For Anton, tighter line heights are encouraged to create a "wall of text" effect for primary headings.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model with a hard-coded 12-column structure for desktop.

- **Verticality:** Emphasis is placed on vertical stacking. Elements should feel like they are layered one after another on a conveyor belt. Use large gaps (`80px+`) between major sections to emphasize the scale.
- **The "Safety Margin":** Maintain a consistent `48px` margin around the viewport to isolate the content from the screen edges, reinforcing the "sheet of paper" metaphor.
- **Component Density:** Internal component padding should be generous. Labels should be tucked into corners or placed atop heavy borders to maximize the usable "canvas" within each module.
- **Mobile Reflow:** On mobile, the 12-column grid collapses to a single column. Horizontal "tickets" transition into vertical cards, maintaining their specific accent colors.

## Elevation & Depth

Depth is achieved through **Structural Layering** rather than optical illusions like shadows or blurs.

- **The Stack:** Elements are "placed" on the background. Use 1px solid black borders to define boundaries.
- **Physical Offsets:** To indicate interactivity or focus, use a "staggered" approach where a card appears to sit slightly offset from its background container.
- **Tiered Tones:** The `#EDECE7` base serves as the floor. White (`#FFFFFF`) or Cream (`#F5F3E3`) surfaces represent the first layer of interaction. Color-coded "tickets" represent the top layer of critical data.
- **Lines as Structure:** Thin horizontal and vertical lines (1px) should be used to separate metadata within a card, resembling a technical drawing or a printed form.

## Shapes

The shape language is predominantly **geometric and sharp**. 

- **Primary Radius:** Use a very slight `4px` (Soft) radius for primary cards and buttons to prevent the UI from feeling hostile, but maintain the industrial rigor.
- **Inner Elements:** Elements nested inside cards (like input fields or internal data blocks) should remain perfectly sharp (`0px`) to emphasize their integration into the container.
- **Circular Accents:** Use perfect circles only for status indicators (LED style) or small utility icons to provide a point of visual relief from the dominant rectangular grid.

## Components

- **Ticket Cards:** The signature component. Large, full-width blocks with a solid accent color background. Header text (Anton) should be large, with metadata (JetBrains Mono) pinned to the corners.
- **Action Buttons:** Stark black boxes with white uppercase text. Use no roundedness for primary actions to maximize the industrial feel. Hover states should invert colors (White background, Black text).
- **Technical Chips:** Small, mono-spaced labels with a 1px border. Use these for status tags (e.g., "GROUNDED", "HIGH RISK").
- **Data Tables:** No vertical dividers. Use only 1px horizontal black lines. Headers should be in `technical-label` style.
- **Input Fields:** Rectangular boxes with the `#F5F3E3` (Cream) background and a bottom-only 2px black border.
- **Progress Gauges:** Use heavy, solid bars with no rounding. Fill colors must match the functional color of the category (e.g., Blue for Risk).
- **Section Dividers:** Use a thick 4px black line followed by a 1px line to create a "double-rule" editorial look.