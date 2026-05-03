import { prisma } from "@/lib/db/prisma"
import { callGeminiForData } from "@/lib/gemini"
import { componentRegistry } from "@/lib/runtime/componentRegistry"

export default async function AppRenderer({
  appId,
  path
}: {
  appId: string
  path: string
}) {
  const app = await prisma.app.findUnique({
    where: { id: appId }
  })

  if (!app) return <div>App not found</div>

  const config = app.config_json as any
  let page = config.pages.find((p: any) => p.path === path)

  // Fallback: If path not found, or it defaulted to "/home" but the AI generated something else like "/", use the first page
  if (!page && config.pages && config.pages.length > 0) {
    page = config.pages[0];
  }

  if (!page) return <div>Page not found</div>

  const Component = componentRegistry[page.type]
  if (!Component) return <div>Unsupported page type: {page.type}</div>

  let data: any = {}

  // Check if we already generated data for this path (stored in chats)
  let existingData = null;
  const previousChats = await prisma.chats.findMany({
    where: { appId: app.id, role: "assistant" }
  });

  for (const chat of previousChats) {
    try {
      const parsed = JSON.parse(chat.messages);
      if (parsed.path === path && parsed.data) {
        existingData = parsed.data;
        break;
      }
    } catch (e) {
      // Ignore chats that aren't valid JSON with our path/data structure
    }
  }

  // Generate dynamic runtime data via Gemini
  if (existingData) {
    data = existingData; // Use cached data to save API tokens
  } else {
    data = await callGeminiForData(app.name, config, page);
    
    // Store the generated data in chats as the assistant's response
    try {
      await prisma.chats.create({
        data: {
          appId: app.id,
          userId: app.userId,
          role: "assistant",
          messages: JSON.stringify({ path, data })
        }
      });
    } catch (e) {
      console.error("Failed to store generated data in chats:", e);
    }
  }

  return <Component page={page} data={data} />
}
