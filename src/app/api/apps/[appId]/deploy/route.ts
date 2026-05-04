import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import fs from "fs";
import path from "path";

export async function POST(
  req: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const { appId } = params;

    const app = await prisma.app.findUnique({
      where: { id: appId },
      include: {
        chats: {
          where: { role: "assistant" },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    const cookieStore = await req.cookies;
    const userVercelToken = cookieStore.get("vercel_token")?.value;
    const VERCEL_TOKEN = userVercelToken || process.env.VERCEL_TOKEN;

    if (!VERCEL_TOKEN) {
      return NextResponse.json({ error: "Vercel API Token not configured. Please add it in Settings." }, { status: 401 });
    }

    const configJson = app.config_json as any;
    const pageData: Record<string, any> = {};
    
    app.chats.forEach(chat => {
      try {
        const msg = JSON.parse(chat.messages);
        if (msg.path && msg.data && !pageData[msg.path]) {
          pageData[msg.path] = msg.data;
        }
      } catch (e) {}
    });

    const usedTypes = new Set(configJson.pages.map((p: any) => p.type?.toLowerCase().trim()));
    const typeToFile: Record<string, string> = {
      "blog_platform": "BlogPlatform.tsx",
      "booking_system": "BookingSystem.tsx",
      "college_discovery": "CollegeDiscovery.tsx",
      "ecommerce": "EcommerceStore.tsx",
      "event_ticketing": "EventTicketing.tsx",
      "job_board": "JobBoard.tsx",
      "portfolio_gallery": "PortfolioGallery.tsx",
      "real_estate": "RealEstateExplorer.tsx",
      "saas_dashboard": "SaaSDashboard.tsx",
      "social_feed": "SocialFeed.tsx"
    };

    const aliases: Record<string, string> = {
      "blog": "blog_platform", "blogplatform": "blog_platform",
      "booking": "booking_system", "bookingsystem": "booking_system",
      "collegediscovery": "college_discovery",
      "ecommerce": "ecommerce", "e_commerce": "ecommerce",
      "events": "event_ticketing", "eventticketing": "event_ticketing",
      "jobboard": "job_board", "portfoliogallery": "portfolio_gallery",
      "portfolio": "portfolio_gallery", "realestate": "real_estate",
      "saasdashboard": "saas_dashboard", "dashboard": "saas_dashboard",
      "social": "social_feed", "socialfeed": "social_feed", "feed": "social_feed"
    };

    const resolvedFiles = new Set<string>();
    usedTypes.forEach(type => {
      const baseType = aliases[type as string] || type;
      const file = typeToFile[baseType as string];
      if (file) resolvedFiles.add(file);
    });

    // Prepare files for Vercel
    const files: any[] = [];

    // App Data
    files.push({
      file: "app/data.ts",
      data: `export const appConfig: any = ${JSON.stringify(configJson, null, 2)};\nexport const appData: Record<string, any> = ${JSON.stringify(pageData, null, 2)};`
    });

    // Templates & Registry
    const templatesDir = path.join(process.cwd(), "src/components/runtime/templates");
    let registryImports = "";
    let registryConfig = "export const componentRegistry: Record<string, any> = {\n";

    resolvedFiles.forEach(file => {
      const content = fs.readFileSync(path.join(templatesDir, file), "utf-8");
      files.push({ file: `components/runtime/templates/${file}`, data: content });
      
      const componentName = file.replace(".tsx", "");
      const registryKey = Object.keys(typeToFile).find(k => typeToFile[k] === file);
      
      registryImports += `import ${componentName} from "@/components/runtime/templates/${componentName}";\n`;
      registryConfig += `  "${registryKey}": ${componentName},\n`;
      
      Object.keys(aliases).forEach(alias => {
        if (aliases[alias] === registryKey && alias !== registryKey) {
          registryConfig += `  "${alias}": ${componentName},\n`;
        }
      });
    });
    registryConfig += "};";
    files.push({ file: "lib/runtime/componentRegistry.ts", data: `${registryImports}\n${registryConfig}` });

    // Core Files
    files.push({ file: "app/globals.css", data: `@import "tailwindcss";` });
    files.push({
      file: "app/layout.tsx",
      data: `import "./globals.css";\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (<html lang="en"><body>{children}</body></html>);\n}`
    });
    files.push({
      file: "app/page.tsx",
      data: `"use client";\nimport React, { Suspense } from "react";\nimport { useSearchParams } from "next/navigation";\nimport { componentRegistry } from "@/lib/runtime/componentRegistry";\nimport { appConfig, appData } from "./data";\nfunction AppContent() {\n  const searchParams = useSearchParams();\n  const path = searchParams.get("path") || "/home";\n  const page = appConfig.pages.find((p: any) => p.path === path) || appConfig.pages[0];\n  const Component = componentRegistry[page.type?.toLowerCase().trim()] || componentRegistry[page.type];\n  const data = (appData[path] as any) || {};\n  if (!Component) return <div>Unsupported page type</div>;\n  return <Component page={page} data={data} />;\n}\nexport default function Page() { return (<Suspense fallback={<div>Loading...</div>}><AppContent /></Suspense>); }`
    });

    // Configs
    const packageJson = {
      name: `${app.name.toLowerCase().replace(/\s+/g, "-")}-spawn-app`,
      version: "0.1.0",
      private: true,
      scripts: { "dev": "next dev", "build": "next build", "start": "next start" },
      dependencies: { "next": "16.2.4", "react": "19.2.4", "react-dom": "19.2.4", "lucide-react": "^1.12.0", "clsx": "^2.1.1", "tailwind-merge": "^3.5.0", "tw-animate-css": "^1.4.0", "framer-motion": "^11.0.0", "sonner": "^2.0.7" },
      devDependencies: { "typescript": "^5", "@types/node": "^20", "@types/react": "^19", "@types/react-dom": "^19", "postcss": "^8", "tailwindcss": "^4" }
    };
    files.push({ file: "package.json", data: JSON.stringify(packageJson, null, 2) });
    files.push({
      file: "tsconfig.json",
      data: JSON.stringify({ compilerOptions: { target: "ES2017", lib: ["dom", "dom.iterable", "esnext"], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, plugins: [{ name: "next" }], paths: { "@/*": ["./*"] } }, include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"], exclude: ["node_modules"] }, null, 2)
    });
    files.push({ file: "next.config.ts", data: `const nextConfig = {
        typescript: {
          ignoreBuildErrors: true,
        },
      }; export default nextConfig;`});
    
    files.push({
      file: "vercel.json",
      data: JSON.stringify({
        cleanUrls: true,
        public: true
      }, null, 2)
    });

    // Deploy to Vercel
    const vercelRes = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: packageJson.name,
        files: files.map(f => ({ file: f.file, data: f.data, encoding: 'utf-8' })),
        projectSettings: { framework: "nextjs" },
        target: "production",
        public: true
      })
    });

    const vercelData = await vercelRes.json();
    if (!vercelRes.ok) throw new Error(vercelData.error?.message || "Vercel deployment failed");

    const deployedUrl = `https://${vercelData.url}`;

    // Update database
    await prisma.app.update({
      where: { id: appId },
      data: { deployedUrl }
    });

    return NextResponse.json({ url: deployedUrl });

  } catch (error: any) {
    console.error("Deploy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  try {
    const params = await context.params;
    const { appId } = params;

    const app = await prisma.app.findUnique({
      where: { id: appId }
    });

    if (!app) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    const cookieStore = await req.cookies;
    const userVercelToken = cookieStore.get("vercel_token")?.value;
    const VERCEL_TOKEN = userVercelToken || process.env.VERCEL_TOKEN;

    if (!VERCEL_TOKEN) {
      return NextResponse.json({ error: "Vercel API Token not configured" }, { status: 401 });
    }

    const projectName = `${app.name.toLowerCase().replace(/\s+/g, "-")}-spawn-app`;

    // Delete project from Vercel
    const vercelRes = await fetch(`https://api.vercel.com/v9/projects/${projectName}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${VERCEL_TOKEN}`
      }
    });

    // We don't strictly throw if the project is already gone (404)
    if (!vercelRes.ok && vercelRes.status !== 404) {
      const errorData = await vercelRes.json();
      throw new Error(errorData.error?.message || "Failed to delete project from Vercel");
    }

    // Update database to reflect deletion
    await prisma.app.update({
      where: { id: appId },
      data: { deployedUrl: null }
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

