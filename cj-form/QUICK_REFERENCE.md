# Theme App Extension - Quick Reference

## 🚀 Quick Start (5 Steps)

### 1. Generate Extension
```bash
shopify app generate extension
# Select: Theme app extension
# Name: your-extension-name
```

### 2. Configure TOML
**File:** `extensions/your-extension/shopify.extension.toml`
```toml
name = "your-extension"
type = "theme_app_extension"
api_version = "2024-01"

[[extension_points]]
target = "app_block"  # ← Makes it appear in Theme Customizer
```

### 3. Create Block File
**File:** `extensions/your-extension/blocks/your-block.liquid`
```liquid
{%- if block.settings.enabled -%}
  <!-- Your content -->
{%- endif -%}

{% schema %}
{
  "name": "Your Block Name",
  "target": "section",  # ← ALWAYS "section" (not "app_block")
  "settings": [
    {
      "type": "checkbox",
      "id": "enabled",
      "label": "Enable",
      "default": true
    }
  ]
}
{% endschema %}
```

### 4. Build
```bash
shopify app build
```

### 5. Deploy
```bash
shopify app deploy
```

---

## 🔑 Key Points to Remember

| What | Where | Value |
|------|-------|-------|
| Extension target | `shopify.extension.toml` | `app_block` |
| Schema target | `{% schema %}` | `"section"` |
| Enable/Disable | Block settings | `block.settings.enabled` |
| Metafields | Liquid | `shop.metafields.namespace.key.value` |

---

## 📁 File Structure

```
extensions/
└── your-extension/
    ├── shopify.extension.toml  ← Extension config
    └── blocks/
        └── your-block.liquid   ← Block template + schema
```

---

## ✅ Checklist for Next Time

- [ ] Run `shopify app generate extension`
- [ ] Set `target = "app_block"` in TOML
- [ ] Create `.liquid` file in `blocks/` folder
- [ ] Add `{% schema %}` with `"target": "section"`
- [ ] Include enable/disable setting
- [ ] Wrap content in `{%- if block.settings.enabled -%}`
- [ ] Use `{{ block.id }}` for unique IDs
- [ ] Build: `shopify app build`
- [ ] Test in Theme Customizer

---

## 🎯 Common Settings Types

```json
{
  "type": "checkbox",    // Enable/disable toggle
  "type": "text",        // Text input
  "type": "color",       // Color picker
  "type": "select",      // Dropdown
  "type": "range",       // Slider
  "type": "image_picker" // Image upload
}
```

---

**Full Guide:** See `THEME_APP_EXTENSION_GUIDE.md` for detailed documentation.
