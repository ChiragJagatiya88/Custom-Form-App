import { useState } from "react";
import { useLoaderData, useFetcher } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  
  // Fetch current form configuration from metafields
  const query = `
    query GetShopMetafield($namespace: String!, $key: String!) {
      shop {
        metafield(namespace: $namespace, key: $key) {
          id
          value
        }
      }
    }
  `;

  const response = await admin.graphql(query, {
    variables: {
      namespace: "custom_form",
      key: "form_config",
    },
  });

  const data = await response.json();
  const formConfig = data.data?.shop?.metafield?.value 
    ? JSON.parse(data.data.shop.metafield.value)
    : { fields: [], settings: {} };

  return { formConfig };
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const formConfig = JSON.parse(formData.get("formConfig"));

  // First, get the shop ID
  const shopQuery = `
    query GetShopId {
      shop {
        id
      }
    }
  `;

  const shopResponse = await admin.graphql(shopQuery);
  const shopData = await shopResponse.json();
  const shopId = shopData.data.shop.id;

  // Save form configuration to metafield
  const mutation = `
    mutation UpdateShopMetafield($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    metafields: [
      {
        namespace: "custom_form",
        key: "form_config",
        type: "json",
        value: JSON.stringify(formConfig),
        ownerId: shopId,
      },
    ],
  };

  const response = await admin.graphql(mutation, { variables });
  const data = await response.json();

  if (data.data.metafieldsSet.userErrors.length > 0) {
    return Response.json({ errors: data.data.metafieldsSet.userErrors }, { status: 400 });
  }

  return { success: true };
};

const fieldTypes = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select" },
  { value: "checkbox", label: "Checkbox" },
];

export default function FormsBuilder() {
  const { formConfig } = useLoaderData();
  const fetcher = useFetcher();
  const [fields, setFields] = useState(formConfig.fields || []);
  const [settings, setSettings] = useState(formConfig.settings || {
    labelColor: "#000000",
    buttonText: "Submit",
    alignment: "left",
    spacing: "medium",
    submissionUrl: "", // App URL for form submissions
  });

  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      type: "text",
      label: "",
      required: false,
      placeholder: "",
      options: [],
    };
    setFields([...fields, newField]);
  };

  const updateField = (id, updates) => {
    setFields(fields.map((field) => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const saveForm = () => {
    fetcher.submit(
      { formConfig: JSON.stringify({ fields, settings }) },
      { method: "POST" }
    );
  };

  return (
    <s-page heading="Form Builder">
      <s-button slot="primary-action" onClick={saveForm}>
        Save Form
      </s-button>

      <s-section heading="Form Settings">
        <s-stack direction="block" gap="base">
          <s-form-field label="Label Color">
            <s-input
              type="color"
              value={settings.labelColor}
              onInput={(e) => setSettings({ ...settings, labelColor: e.target.value })}
            />
          </s-form-field>

          <s-form-field label="Button Text">
            <s-input
              value={settings.buttonText}
              onInput={(e) => setSettings({ ...settings, buttonText: e.target.value })}
            />
          </s-form-field>

          <s-form-field label="Alignment">
            <s-select
              value={settings.alignment}
              onInput={(e) => setSettings({ ...settings, alignment: e.target.value })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </s-select>
          </s-form-field>

          <s-form-field label="Spacing">
            <s-select
              value={settings.spacing}
              onInput={(e) => setSettings({ ...settings, spacing: e.target.value })}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </s-select>
          </s-form-field>

          <s-form-field label="Submission URL (Your App URL)">
            <s-input
              type="url"
              value={settings.submissionUrl || ""}
              onInput={(e) => setSettings({ ...settings, submissionUrl: e.target.value })}
              placeholder="https://your-app.ngrok.io"
            />
            <s-text variant="bodyMd" tone="subdued" style={{ marginTop: "0.5rem" }}>
              Enter your app URL (shown when running `shopify app dev`)
            </s-text>
          </s-form-field>
        </s-stack>
      </s-section>

      <s-section heading="Form Fields">
        <s-button onClick={addField}>Add Field</s-button>

        <s-stack direction="block" gap="base" style={{ marginTop: "1rem" }}>
          {fields.map((field) => (
            <s-box
              key={field.id}
              padding="base"
              borderWidth="base"
              borderRadius="base"
            >
              <s-stack direction="block" gap="small">
                <s-form-field label="Field Type">
                  <s-select
                    value={field.type || "text"}
                    onChange={(e) => updateField(field.id, { type: e.target.value })}
                  >
                    <option value="text">Text</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                    <option value="checkbox">Checkbox</option>
                  </s-select>
                </s-form-field>

                <s-form-field label="Label">
                  <s-input
                    value={field.label}
                    onInput={(e) => updateField(field.id, { label: e.target.value })}
                    placeholder="Enter field label"
                  />
                </s-form-field>

                <s-form-field label="Placeholder">
                  <s-input
                    value={field.placeholder}
                    onInput={(e) => updateField(field.id, { placeholder: e.target.value })}
                    placeholder="Enter placeholder text"
                  />
                </s-form-field>

                <s-form-field>
                  <s-checkbox
                    checked={field.required}
                    onInput={(e) => updateField(field.id, { required: e.target.checked })}
                  >
                    Required
                  </s-checkbox>
                </s-form-field>

                {(field.type === "select" || field.type === "checkbox") && (
                  <s-form-field label="Options (comma-separated)">
                    <s-input
                      value={field.options?.join(", ") || ""}
                      onInput={(e) =>
                        updateField(field.id, {
                          options: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </s-form-field>
                )}

                <s-button
                  variant="tertiary"
                  onClick={() => deleteField(field.id)}
                >
                  Delete Field
                </s-button>
              </s-stack>
            </s-box>
          ))}
        </s-stack>
      </s-section>

      {fetcher.data?.success && (
        <s-banner status="success">Form saved successfully!</s-banner>
      )}
    </s-page>
  );
}