import { handleContactRequest } from "@/features/contact/server/handle-contact-request";

export function POST(request: Request) {
  return handleContactRequest(request);
}
