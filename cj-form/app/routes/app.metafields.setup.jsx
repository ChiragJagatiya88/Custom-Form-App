import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // Create metafield definition for form configuration
  const mutation = `
    mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
          name
          key
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    definition: {
      name: "Form Builder Configuration",
      namespace: "custom_form",
      key: "form_config",
      type: {
        name: "json",
      },
      ownerType: "SHOP",
      access: {
        admin: "MERCHANT_READ_WRITE",
        storefront: "PUBLIC_READ",
      },
    },
  };

  try {
    const response = await admin.graphql(mutation, { variables });
    const data = await response.json();
    
    return { 
      success: true, 
      data: data.data.metafieldDefinitionCreate 
    };
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
};