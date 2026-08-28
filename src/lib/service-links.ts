/**
 * Maps service CMS ids to their SEO landing-page slugs under /services/.
 * Landing pages are server-rendered Astro pages, so links to them must be
 * plain <a> tags (full navigation), not react-router <Link>s.
 */
const SERVICE_SLUGS: Record<string, string> = {
  '3b2fc79b-6a3d-4a93-9681-7cae2be6aa34': 'snow-removal',
  '4ac9e78b-4988-4973-a2e3-8bb307df0c49': 'bathroom-remodeling',
  '1823312c-339b-43ef-9662-1277b00b7a2c': 'kitchen-remodeling',
  '1e4ace39-d84a-4d91-a9e8-709876055ceb': 'interior-remodeling',
  '624af629-0956-4d7c-be69-8558f5e5479a': 'exterior-construction',
  '3275831a-2334-49d3-883c-83c750839686': 'residential-construction',
  '3352477f-2461-402a-8038-8a1b55297782': 'concrete-contractor',
  '83ac1998-f3f9-452c-9807-502085b3017f': 'home-renovation',
};

export function serviceUrl(serviceId: string | undefined | null): string {
  if (!serviceId) return '/services';
  return `/services/${SERVICE_SLUGS[serviceId] ?? serviceId}`;
}
