import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import JSZip from "jszip";
import fs from "fs";
import path from "path";

export async function GET(
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

    const zip = new JSZip();

    // 1. Filter Used Templates
    const configJson = app.config_json as any;
    const usedTypes = new Set(configJson.pages.map((p: any) => {
      const t = p.type?.toLowerCase().trim();
      // Handle potential aliases if necessary, but here we'll just check the base types
      return t;
    }));

    // Mapping of registry keys to their file names
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

    // Also handle aliases from componentRegistry
    const aliases: Record<string, string> = {
      "blog": "blog_platform",
      "blogplatform": "blog_platform",
      "booking": "booking_system",
      "bookingsystem": "booking_system",
      "collegediscovery": "college_discovery",
      "ecommerce": "ecommerce",
      "e_commerce": "ecommerce",
      "events": "event_ticketing",
      "eventticketing": "event_ticketing",
      "jobboard": "job_board",
      "portfoliogallery": "portfolio_gallery",
      "portfolio": "portfolio_gallery",
      "realestate": "real_estate",
      "saasdashboard": "saas_dashboard",
      "dashboard": "saas_dashboard",
      "social": "social_feed",
      "socialfeed": "social_feed",
      "feed": "social_feed"
    };

    const resolvedFiles = new Set<string>();
    usedTypes.forEach(type => {
      const baseType = aliases[type as string] || type;
      const file = typeToFile[baseType as string];
      if (file) resolvedFiles.add(file);
    });

    const pageData: Record<string, any> = {};
    
    // Extract data from chats
    app.chats.forEach(chat => {
      try {
        const msg = JSON.parse(chat.messages);
        if (msg.path && msg.data && !pageData[msg.path]) {
          pageData[msg.path] = msg.data;
        }
      } catch (e) {}
    });

    // Create a data file for the project
    const dataFileContent = `
export const appConfig: any = ${JSON.stringify(configJson, null, 2)};
export const appData: Record<string, any> = ${JSON.stringify(pageData, null, 2)};
    `;
    // USER requested: "home page must be just inside src"
    // I'll put everything in src/ instead of src/app/ to make it flatter if possible
    // But Next.js App Router needs 'app'. I'll use root level 'app' (no src)
    zip.file("app/data.ts", dataFileContent);

    // 2. Templates & Dynamic Registry
    const templatesDir = path.join(process.cwd(), "src/components/runtime/templates");
    
    let registryImports = "";
    let registryConfig = "export const componentRegistry: Record<string, any> = {\n";

    resolvedFiles.forEach(file => {
      const content = fs.readFileSync(path.join(templatesDir, file), "utf-8");
      zip.file(`components/runtime/templates/${file}`, content);
      
      const componentName = file.replace(".tsx", "");
      const registryKey = Object.keys(typeToFile).find(k => typeToFile[k] === file);
      
      registryImports += `import ${componentName} from "@/components/runtime/templates/${componentName}";\n`;
      registryConfig += `  "${registryKey}": ${componentName},\n`;
      
      // Add common aliases for this component to the registry too
      Object.keys(aliases).forEach(alias => {
        if (aliases[alias] === registryKey && alias !== registryKey) {
          registryConfig += `  "${alias}": ${componentName},\n`;
        }
      });
    });

    registryConfig += "};";
    zip.file("lib/runtime/componentRegistry.ts", `${registryImports}\n${registryConfig}`);

    // 3. App Files (Layout, Page, CSS)
    const globalsCss = `@import "tailwindcss";`;
    zip.file("app/globals.css", globalsCss);

    const layoutContent = `
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "${app.name}",
  description: "Built with Spawn App Builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
    `;
    zip.file("app/layout.tsx", layoutContent);

    const pageContent = `
"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { componentRegistry } from "@/lib/runtime/componentRegistry";
import { appConfig, appData } from "./data";

function AppContent() {
  const searchParams = useSearchParams();
  const path = searchParams.get("path") || "/home";
  
  const page = appConfig.pages.find((p: any) => p.path === path) || appConfig.pages[0];
  const pageType = page.type?.toLowerCase().trim();
  const Component = componentRegistry[pageType] || componentRegistry[page.type];
  const data = appData[path] || {};

  if (!Component) return <div>Unsupported page type: {page.type}</div>;

  return <Component page={page} data={data} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContent />
    </Suspense>
  );
}
    `;
    zip.file("app/page.tsx", pageContent);

    // 4. Project Configs
    const packageJson = {
      name: app.name.toLowerCase().replace(/\s+/g, "-"),
      version: "0.1.0",
      private: true,
      scripts: {
        "dev": "next dev",
        "build": "next build",
        "start": "next start"
      },
      dependencies: {
        "next": "16.2.4",
        "react": "19.2.4",
        "react-dom": "19.2.4",
        "lucide-react": "^1.12.0",
        "clsx": "^2.1.1",
        "tailwind-merge": "^3.5.0",
        "tw-animate-css": "^1.4.0",
        "framer-motion": "^11.0.0",
        "sonner": "^2.0.7"
      },
      devDependencies: {
        "typescript": "^5",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "postcss": "^8",
        "tailwindcss": "^4"
      }
    };
    zip.file("package.json", JSON.stringify(packageJson, null, 2));

    const tsConfig = {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    };
    zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));

    const nextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default nextConfig;
    `;
    zip.file("next.config.ts", nextConfig);

    // 5. Generate ZIP
    const blob = await zip.generateAsync({ type: "arraybuffer" });

    return new NextResponse(blob as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${packageJson.name}-project.zip"`
      }
    });

  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
