# Theme App Extension & App Block - Complete Guide

## 🎯 What We Built

A **Theme App Extension** that creates an **App Block** that can be:
- ✅ Enabled/Disabled from Theme Customizer
- ✅ Added to any page or section
- ✅ Configured via Admin Panel (Form Builder)
- ✅ Displayed on storefront dynamically

---

## 📋 Step-by-Step Implementation

### Step 1: Create Theme App Extension

**Command:**
```bash
cd cj-custom-app
shopify app generate extension
```

**When prompted:**
- Select: **Theme app extension**
- Name: `form-builder` (or your preferred name)

**What this creates:**
```
extensions/
└── form-builder/
    ├── shopify.extension.toml    # Extension configuration
    ├── blocks/                    # App blocks folder
    ├── assets/                    # Static assets (images, CSS)
    ├── locales/                   # Translation files
    └── snippets/                  # Reusable Liquid snippets
```

---

### Step 2: Configure Extension TOML

**File:** `extensions/form-builder/shopify.extension.toml`

```toml
name = "form-builder"
type = "theme_app_extension"
api_version = "2024-01"

[build]
command = ""
watch = []

[[extension_points]]
target = "app_block"
```

**Key Points:**
- `type = "theme_app_extension"` - Defines it as a theme extension
- `target = "app_block"` - Makes it appear as an App Block in Theme Customizer
- `api_version` - Must match your Shopify API version

---

### Step 3: Create App Block Liquid File

**File:** `extensions/form-builder/blocks/form-builder.liquid`

**Structure:**
```liquid
{% comment %}
  Your App Block Content
{% endcomment %}

{%- if block.settings.enabled -%}
  <!-- Your form HTML here -->
{%- endif -%}

{% schema %}
{
  "name": "Custom Form",
  "target": "section",
  "settings": [
    {
      "type": "checkbox",
      "id": "enabled",
      "label": "Enable Form",
      "default": true
    }
  ]
}
{% endschema %}
```

**Important Notes:**
- **`target: "section"`** in schema (NOT "app_block" - that's in TOML)
- **`block.settings.enabled`** - Controls enable/disable toggle
- **Schema settings** - Appear in Theme Customizer sidebar

---

### Step 4: Schema Configuration Options

**Common Setting Types:**

```json
{
  "settings": [
    {
      "type": "checkbox",
      "id": "enabled",
      "label": "Enable Form",
      "default": true
    },
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Contact Us"
    },
    {
      "type": "color",
      "id": "bg_color",
      "label": "Background Color",
      "default": "#ffffff"
    },
    {
      "type": "select",
      "id": "alignment",
      "label": "Alignment",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ],
      "default": "left"
    },
    {
      "type": "range",
      "id": "spacing",
      "label": "Spacing",
      "min": 0,
      "max": 100,
      "step": 5,
      "default": 20,
      "unit": "px"
    },
    {
      "type": "product",
      "id": "product",
      "label": "Select Product"
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Select Collection"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Image"
    },
    {
      "type": "richtext",
      "id": "description",
      "label": "Description"
    }
  ]
}
```

**Access Settings in Liquid:**
```liquid
{{ block.settings.enabled }}
{{ block.settings.title }}
{{ block.settings.bg_color }}
{{ block.settings.alignment }}
```

---

### Step 5: Access Metafields in Liquid

**Reading Shop Metafields:**
```liquid
{%- liquid
  assign form_config = shop.metafields.custom_form.form_config.value
  if form_config == blank
    assign form_config = '{"fields":[],"settings":{}}'
  endif
  
  assign config = form_config | parse_json
  assign fields = config.fields
  assign settings = config.settings
-%}
```

**Metafield Namespace Format:**
- Namespace: `custom_form`
- Key: `form_config`
- Access: `shop.metafields.custom_form.form_config.value`

---

### Step 6: Build & Deploy

**Development:**
```bash
shopify app dev
```

**Build Extension:**
```bash
shopify app build
```

**Deploy:**
```bash
shopify app deploy
```

---

## 🔑 Key Concepts

### 1. **Extension Points**

| Target | Use Case |
|--------|----------|
| `app_block` | Appears in Theme Customizer → Add block → App blocks |
| `section` | Full section (not used in our case) |
| `snippet` | Reusable code snippets |

### 2. **File Structure**

```
extensions/
└── your-extension/
    ├── shopify.extension.toml    # REQUIRED - Extension config
    ├── blocks/                   # App blocks
    │   └── your-block.liquid     # Block template + schema
    ├── assets/                   # Static files
    │   └── image.png
    ├── locales/                  # Translations
    │   └── en.default.json
    └── snippets/                 # Reusable snippets
        └── helper.liquid
```

### 3. **Schema vs TOML**

| File | Purpose | `target` Value |
|------|---------|----------------|
| `shopify.extension.toml` | Extension config | `app_block` |
| `{% schema %}` in Liquid | Block settings | `section` |

**Important:** Schema `target` is ALWAYS `"section"`, even for app blocks!

---

## 📝 Best Practices

### 1. **Enable/Disable Pattern**

Always wrap your content:
```liquid
{%- if block.settings.enabled -%}
  <!-- Your content -->
{%- endif -%}
```

### 2. **Unique IDs**

Use block ID for unique identifiers:
```liquid
id="custom-form-{{ block.id }}"
```

### 3. **Error Handling**

Handle missing metafields:
```liquid
{%- if shop.metafields.namespace.key.value != blank -%}
  {%- assign data = shop.metafields.namespace.key.value | parse_json -%}
{%- else -%}
  {%- assign data = '{"default": "value"}' | parse_json -%}
{%- endif -%}
```

### 4. **Styling**

Include styles in the same file:
```liquid
<style>
  .your-class {
    /* Styles */
  }
</style>
```

### 5. **JavaScript**

Include scripts at the bottom:
```liquid
<script>
  (function() {
    const form = document.getElementById('form-{{ block.id }}');
    // Your JavaScript
  })();
</script>
```

---

## 🚀 Testing Checklist

- [ ] Extension builds without errors: `shopify app build`
- [ ] App Block appears in Theme Customizer
- [ ] Enable/Disable toggle works
- [ ] Settings appear in sidebar
- [ ] Content displays on storefront when enabled
- [ ] Metafields load correctly
- [ ] Styling works on mobile/desktop
- [ ] JavaScript functions correctly

---

## 🐛 Common Issues & Solutions

### Issue 1: Block Not Appearing in Customizer

**Solution:**
- Check `shopify.extension.toml` has `target = "app_block"`
- Verify schema has `"target": "section"`
- Run `shopify app build`
- Refresh Theme Customizer

### Issue 2: Settings Not Showing

**Solution:**
- Check schema JSON is valid
- Ensure settings array is correct
- Verify setting IDs don't have spaces/special chars

### Issue 3: Metafields Not Loading

**Solution:**
- Verify metafield namespace/key
- Check metafield access permissions (storefront: PUBLIC_READ)
- Use `parse_json` filter for JSON metafields

### Issue 4: Styling Not Applied

**Solution:**
- Check CSS is inside `<style>` tags
- Verify class names are unique (use `block.id`)
- Check for CSS conflicts with theme

---

## 📚 Reference Files

### Complete Example: `form-builder.liquid`

```liquid
{%- liquid
  assign form_config = shop.metafields.custom_form.form_config.value
  if form_config == blank
    assign form_config = '{"fields":[],"settings":{}}'
  endif
  assign config = form_config | parse_json
-%}

{%- if block.settings.enabled -%}
<div class="custom-form-{{ block.id }}">
  <!-- Your content -->
</div>

<style>
  .custom-form-{{ block.id }} {
    /* Styles */
  }
</style>

<script>
  // JavaScript
</script>
{%- endif -%}

{% schema %}
{
  "name": "Custom Form",
  "target": "section",
  "settings": [
    {
      "type": "checkbox",
      "id": "enabled",
      "label": "Enable Form",
      "default": true
    }
  ]
}
{% endschema %}
```

---

## 🎓 Next Steps

1. **Add More Settings** - Customize appearance, behavior
2. **Multiple Blocks** - Create different block variations
3. **Assets** - Add images, custom CSS files
4. **Translations** - Add locale files for multiple languages
5. **Snippets** - Create reusable Liquid snippets

---

## 📖 Resources

- [Shopify Theme App Extensions Docs](https://shopify.dev/docs/apps/online-store/theme-app-extensions)
- [App Blocks Guide](https://shopify.dev/docs/apps/online-store/theme-app-extensions/getting-started#app-blocks)
- [Liquid Schema Reference](https://shopify.dev/docs/themes/architecture/sections/section-schema)
- [Metafields API](https://shopify.dev/docs/api/admin-graphql/latest/objects/Metafield)

---

## ✅ Summary

**To create a Theme App Extension with App Block:**

1. ✅ Run `shopify app generate extension` → Select "Theme app extension"
2. ✅ Configure `shopify.extension.toml` with `target = "app_block"`
3. ✅ Create `.liquid` file in `blocks/` folder
4. ✅ Add `{% schema %}` with `"target": "section"`
5. ✅ Include enable/disable setting
6. ✅ Access metafields via `shop.metafields.namespace.key`
7. ✅ Build: `shopify app build`
8. ✅ Deploy: `shopify app deploy`

**Key Reminder:** 
- TOML: `target = "app_block"` 
- Schema: `"target": "section"` ✅

---

**You're all set! 🎉**
