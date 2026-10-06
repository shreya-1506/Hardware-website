"use server";

import { z } from "zod";

import { createEnquiry } from "@/lib/queries";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  company: z.string().trim().max(160).optional().default(""),
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+?91[\s-]?)?[6-9]\d{9}$/,
      "Enter a valid 10-digit Indian mobile number.",
    ),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]),
  product: z.string().trim().max(240).optional().default(""),
  quantity: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Please describe your requirement (at least 10 characters)."),
});

export type EnquiryFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  /** Echoed back so the client can offer "Send on WhatsApp" after saving. */
  reference?: number;
  /** Changes on every submission so the client can react to repeat submits. */
  timestamp?: number;
};

export async function submitEnquiry(
  _prev: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    company: String(formData.get("company") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    product: String(formData.get("product") ?? ""),
    quantity: String(formData.get("quantity") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Simple honeypot — bots fill hidden fields, humans never see them.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return {
      status: "success",
      message: "Thank you. Your enquiry has been received.",
      timestamp: Date.now(),
    };
  }

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please correct the highlighted fields and try again.",
      errors,
      timestamp: Date.now(),
    };
  }

  try {
    const id = createEnquiry({
      ...parsed.data,
      source: String(formData.get("source") ?? "Website"),
    });

    return {
      status: "success",
      message:
        "Thank you — your enquiry has been received. Our team will contact you shortly with price and availability.",
      reference: id,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error("Failed to save enquiry:", error);
    return {
      status: "error",
      message:
        "Sorry, we could not save your enquiry. Please try again, or send it directly on WhatsApp.",
      timestamp: Date.now(),
    };
  }
}
