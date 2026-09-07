# Honey Harvest — Design & Asset Documentation

## 1. Directory Structure (`/assets`)

All production images are located in [`c:\Users\AlekeyG11\Documents\VsCode\bee_web\assets`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets):

| Asset File | Description | Resolution & Format |
|------------|-------------|---------------------|
| [`assets/logo_emblem.webp`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/logo_emblem.webp) | Modern gold foil emblem of a honeybee inside a geometric hexagon | 1:1 Hexagon Badge |
| [`assets/honey_jar_hero.webp`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/honey_jar_hero.webp) | High-detail studio macro photo of artisan glass honey jar with glowing honey & wooden lid | 3:4 High-Res Hero |
| [`assets/wildflower_field.webp`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/wildflower_field.webp) | Sun-drenched wildflower valley landscape during golden hour sunrise | 16:9 Landscape Parallax |
| [`assets/beehive_frame_light.webp`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/beehive_frame_light.webp) | Macro photograph of a light wooden beehive frame overflowing with glistening raw honeycomb | 1:1 Square Frame |
| [`assets/honey_flow_drip.webp`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/honey_flow_drip.webp) | Macro photo of thick viscous golden honey dripping smoothly off a wooden honey dipper | 16:9 Panoramic Layer |

## 2. Design System & Palette

- **Primary Dark (Background):** `#0f0903` (Deep mahogany honeycomb dark)
- **Primary Ink (Text Dark):** `#2d1810` (Rich honey wood brown)
- **Paper Light:** `#fef9f0` (Warm honey cream)
- **Accent Gold:** `#f59e0b` (Golden honey nectar)
- **Glow Amber:** `#fbbf24` (Warm sun glow)
- **Deep Amber:** `#d97706` & `#92400e` (Extracted raw honey)

## 3. Typography

- **Display Serif:** `Playfair Display` (Ogg alternative for high-end boutique aesthetic)
- **Body Sans:** `Plus Jakarta Sans` / `Inter` (Modern clean legibility)

## 4. Parallax Layer Composition

1. **Sky Layer (`#layer-sky`):** Golden hour radial sunrise gradient.
2. **Bee Glow Layer (`#layer-glow`):** Soft ambient light dust particle layer.
3. **Wildflower Layer (`#layer-wildflowers`):** Photorealistic landscape [`assets/wildflower_field.jpg`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/wildflower_field.jpg).
4. **Splitframe Beehive Left & Right (`#layer-split-left` / `#layer-split-right`):** Symmetric split frame photo [`assets/beehive_frame_light.webp`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/beehive_frame_light.webp).
5. **Golden Honey Jar ("The Bridge" - `#layer-jar`):** Glass jar photo [`assets/honey_jar_hero.jpg`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/honey_jar_hero.jpg).
6. **Honey Flow Layer (`#layer-honey-flow`):** Viscous honey drip photo [`assets/honey_flow_drip.jpg`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/assets/honey_flow_drip.jpg).
7. **Ambient Bees Canvas (`#ambient-bees-canvas`):** Floating golden bee particles with organic flight physics.

## 5. Product Catalog (Sight Cards)

1. **Raw Spring Honey** — $24.00 (Seasonal)
2. **Wildflower Gold** — $28.00 (Best Seller)
3. **Honey Butter Cream** — $26.00 (Velvety)
4. **Bee's Shield Propolis** — $32.00 (Health)
5. **Pure Cut Honeycomb** — $35.00 (Raw)

## 6. How to Customize Images & Spotlight Size

### Changing Background Images
- **Base Atmospheric Background Layer 1 (`#layer-sky`):** Edit `.sky-gradient` in [`styles.css`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/styles.css) or replace `.sky-gradient` with an `<img>` tag in [`index.html`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/index.html).
- **Spotlight Revealed Image Layer 2 (`.spotlight-reveal-layer`):** To change the revealed image, replace `src="assets/wildflower_field.jpg"` in line 83 of [`index.html`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/index.html) with your desired image path.

### Adjusting Spotlight Size & Softness
- Open [`styles.css`](file:///c:/Users/AlekeyG11/Documents/VsCode/bee_web/styles.css) and edit the `--spotlight-radius` property in `:root`:
  ```css
  --spotlight-radius: clamp(160px, 24vw, 320px); /* Adjust min/max radius */
  ```
- To change edge softness, adjust the percentages inside `radial-gradient` in `.spotlight-reveal-layer`:
  ```css
  mask-image: radial-gradient(
    circle var(--spotlight-radius) at var(--spotlight-x) var(--spotlight-y),
    rgba(0, 0, 0, 1) 0%,   /* Center opacity */
    rgba(0, 0, 0, 0.7) 45%,/* Mid blur transition */
    rgba(0, 0, 0, 0) 100%  /* Soft outer boundary */
  );
  ```

