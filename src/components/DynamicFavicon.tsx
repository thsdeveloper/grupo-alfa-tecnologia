import { getOrganizationSettings } from "@/lib/services/organization";

export default async function DynamicFavicon() {
  const settings = await getOrganizationSettings();
  
  return (
    <>
      <link rel="icon" href={settings.favicon_url || "/favicon.ico"} />
      <link rel="apple-touch-icon" href={settings.favicon_url || "/apple-touch-icon.png"} />
    </>
  );
}

