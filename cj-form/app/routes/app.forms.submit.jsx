import { unauthenticated } from "../shopify.server";
import prisma from "../db.server";

export const action = async ({ request }) => {
  // This is a public endpoint for form submissions from the storefront
  // Using unauthenticated to allow public access
  
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get shop domain from request headers or query params
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop") || 
                 request.headers.get("x-shopify-shop-domain") ||
                 "";

    const body = await request.json();
    const { formId, data } = body;

    // Log the submission
    console.log("Form submission received:", {
      shop,
      formId,
      data,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    });

    // Save to database if Prisma is set up
    // Note: You'll need to add FormSubmission model to schema.prisma first
    try {
      // Uncomment when FormSubmission model is added:
      // await prisma.formSubmission.create({
      //   data: {
      //     shop: shop,
      //     formId: formId,
      //     data: JSON.stringify(data),
      //   },
      // });
    } catch (dbError) {
      console.error("Database save error (non-critical):", dbError);
      // Continue even if DB save fails
    }

    return { 
      success: true, 
      message: "Form submitted successfully" 
    };
  } catch (error) {
    console.error("Form submission error:", error);
    return Response.json({ 
      success: false, 
      error: "Failed to submit form" 
    }, { status: 500 });
  }
};
