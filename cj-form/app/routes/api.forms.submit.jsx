import prisma from "../db.server";

export const action = async ({ request }) => {
  // Public API endpoint for form submissions
  // No authentication required - add rate limiting/validation in production
  
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Get shop domain from query params or referer
    const url = new URL(request.url);
    const shop = url.searchParams.get("shop") || "";

    const body = await request.json();
    const { formId, data } = body;

    // Log the submission
    console.log("Form submission received:", {
      shop,
      formId,
      data,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
    });

    // Save to database if FormSubmission model exists
    // Uncomment when you add the model to schema.prisma:
    // try {
    //   await prisma.formSubmission.create({
    //     data: {
    //       shop: shop,
    //       formId: formId,
    //       data: JSON.stringify(data),
    //     },
    //   });
    // } catch (dbError) {
    //   console.error("Database save error:", dbError);
    // }

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
