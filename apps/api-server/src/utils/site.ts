import { nanoid } from "nanoid";

export function generatePublicSiteId() {
  return `site_${nanoid(10)}`;
}
