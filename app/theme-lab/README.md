# Theme Lab

A comprehensive visual theme editor for Next.js + Tailwind CSS + shadcn/ui projects. Build, preview, and share color themes with accessibility checks and perceptually uniform color scales.

## Features

### 🎨 Palette Management

- **10 Base Colors**: Linen, Mistral, Celadon, Bayleaf, Fern (brand), Kalamata, Eucalyptus, Ferrum (brand), Aventurine, Creamsicle
- **HSL Triplet Format**: All colors stored as `"H S% L%"` strings for consistency
- **Brand Locks**: Fern and Ferrum are locked by default to maintain brand consistency
- **Color Scale Generation**: Generate 11-stop shade scales (50-950) using OKLCH for perceptual uniformity
- **Visual Swatches**: See live color previews with hex values

### 🎯 Semantic Role Mapping

- **19 Semantic Roles**: background, foreground, primary, secondary, accent, destructive, card, popover, muted, border, input, ring, and their foreground pairs
- **Lock Indicators**: Visual 🔒 icons show which colors are locked
- **Shade Selection**: Choose from generated shade scales when available
- **Live Preview**: See changes instantly in the preview pane

### ♿ Accessibility (WCAG 2.1)

- **Contrast Ratio Checks**: Real-time contrast calculations for all color pairs
- **Pass/Fail Badges**: Visual indicators showing AA/AAA compliance
- **Multiple Targets**: 4.5:1 for normal text, 3.0:1 for large text/UI elements
- **Suggestions**: Inline hints when contrast ratios fail

### 🌓 Light & Dark Schemes

- **Dual Schemes**: Independent mappings for light and dark modes
- **Quick Toggle**: Press `D` or click the scheme button
- **Smart Defaults**:
  - Light: Linen background, Kalamata text
  - Dark: Kalamata background, Linen text

### 🔄 Compare Mode

- **Side-by-Side Preview**: View two theme variations simultaneously
- **Copy Mappings**: Transfer mappings from A to B with one click
- **Perfect for Experimentation**: Test alternative accent colors or dark mode variations

### 💾 Persistence & Sharing

- **Auto-save**: Changes saved to localStorage (debounced 1s)
- **Import/Export**: Full JSON import/export with validation
- **URL Sharing**: Share themes via base64-encoded URL parameter
- **Copy to Clipboard**: One-click shareable link generation

### 🎭 Live Preview Gallery

- **Forms**: Buttons (all variants), Inputs, Labels
- **Surfaces**: Cards, Popovers, Muted backgrounds
- **Content**: Typography, Lists, Code blocks, Links
- **States**: Hover, Focus, Active, Disabled states

### ⌨️ Keyboard Shortcuts

- `I` - Import theme
- `E` - Export theme
- `S` - Share (copy URL)
- `D` - Toggle dark/light
- `C` - Toggle compare mode
- `R` - Reset to example

## Usage

### Accessing the Theme Lab

Navigate to `/theme-lab` in your browser:

```
http://localhost:3000/theme-lab
```

### Editing Colors

1. **Palette Pane** (left):

   - Edit HSL values directly
   - Click "Generate Scale" to create shade stops
   - Delete unlocked colors if needed

2. **Mapping Pane** (center):

   - Assign semantic roles to base colors
   - Select specific shades when scales exist
   - Monitor contrast ratios in real-time

3. **Preview Pane** (right):
   - See your theme applied to UI components
   - Switch between Forms, Surfaces, Content, and States tabs
   - Toggle light/dark mode

### Importing a Theme

1. Click "Import" or press `I`
2. Select a JSON file with valid theme tokens
3. Errors will be displayed if validation fails

### Exporting a Theme

1. Click "Export" or press `E`
2. A JSON file will download automatically
3. File name based on theme name

### Sharing a Theme

1. Click "Share" or press `S`
2. URL with base64-encoded theme is copied to clipboard
3. Share the URL with others
4. Theme loads automatically from URL parameter

### Compare Mode

1. Click "Compare" or press `C`
2. Two previews appear side-by-side
3. Edit either theme independently
4. Use "Copy to B" to transfer mappings
5. Press `C` again to exit

## Technical Details

### File Structure

```
app/theme-lab/
  page.tsx                    # Main Theme Lab page

components/theme/
  ThemeProvider.tsx           # Applies CSS vars and context
  useThemeTokens.ts           # State management hook
  ColorScaleEditor.tsx        # Base color editor
  RoleMappingEditor.tsx       # Semantic role assignments
  ContrastBadge.tsx           # WCAG contrast checker
  PreviewGallery/
    index.tsx                 # Gallery container
    FormsPreview.tsx          # Form components
    SurfacesPreview.tsx       # Cards and surfaces
    ContentPreview.tsx        # Typography
    StatesPreview.tsx         # Interactive states

lib/
  color.ts                    # HSL utils, contrast, scale gen
  storage.ts                  # localStorage persistence
  url.ts                      # URL encoding/decoding

types/
  theme.ts                    # TypeScript types

schemas/
  theme.ts                    # Zod validation

data/
  example-theme.json          # Default palette
```

### Color Scale Generation

The Theme Lab uses **culori** for perceptually uniform color scaling:

1. Converts HSL → OKLCH (perceptual color space)
2. Generates 11 stops by varying lightness
3. Clamps to sRGB gamut
4. Converts back to HSL

Fallback: Simple HSL-based scaling if culori unavailable.

### Data Format

Theme tokens follow this structure:

```typescript
{
  name: string;
  version: 1;
  metadata?: Record<string, any>;
  palette: BaseColor[];      // 10 base colors
  schemes: {
    light: RoleMapping;      // 19 semantic roles
    dark: RoleMapping;
  };
}
```

### CSS Variable Integration

Tailwind CSS v4 reads colors from CSS variables defined in `globals.css`:

```css
:root {
  --background: 44 48% 94%;
  --foreground: 48 4% 22%;
  /* ... */
}
```

The ThemeProvider component dynamically sets these variables based on the current theme.

## Brand Guidelines

### Locked Colors

**Fern** (primary green) and **Ferrum** (accent orange) are locked by default:

- **Fern**: `118 19% 41%` - Primary brand color
- **Ferrum**: `22 77% 43%` - Secondary/accent brand color

To unlock, manually edit the JSON or remove the `locked` property.

### Default Scheme Rules

**Light Mode:**

- Background must be Linen
- Foreground must be Kalamata
- Primary must use Fern
- Secondary/Destructive must use Ferrum

**Dark Mode:**

- Background typically Kalamata
- Foreground typically Linen
- Brand colors remain consistent

## Troubleshooting

### Colors not updating

- Check browser console for validation errors
- Ensure HSL format is correct: `"H S% L%"`
- Clear localStorage and reload

### Import fails

- Validate JSON syntax
- Check all required fields exist
- Ensure palette has at least one color

### Contrast warnings

- Adjust lightness values
- Use "Generate Scale" for more options
- Consider swapping foreground/background pairs

## Best Practices

1. **Start with the example**: Build on the provided palette
2. **Generate scales early**: Create shade variations before mapping
3. **Check contrast often**: Monitor badges while editing
4. **Use compare mode**: Test variations side-by-side
5. **Export frequently**: Save your work as JSON backups

## License

Part of the Portfolio project by russellbomer.
