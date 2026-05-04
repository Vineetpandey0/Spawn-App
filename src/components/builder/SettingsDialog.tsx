"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, CloudUpload, Download, ExternalLink, Loader2, Info } from "lucide-react";
import { useAppActions } from "@/hooks/useAppActions";
import { useParams } from "next/navigation";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const params = useParams();
  const appId = params?.appId as string;
  const {
    isDownloading,
    isDeploying,
    isDeleting,
    deployedUrl,
    handleDeploy,
    handleDeleteDeployment,
    handleDownload,
  } = useAppActions(appId);

  const [geminiKey, setGeminiKey] = useState("");
  const [vercelToken, setVercelToken] = useState("");

  useEffect(() => {
    const geminiMatch = document.cookie.match(/(^| )gemini_api_key=([^;]+)/);
    if (geminiMatch) setGeminiKey(geminiMatch[2]);

    const vercelMatch = document.cookie.match(/(^| )vercel_token=([^;]+)/);
    if (vercelMatch) setVercelToken(vercelMatch[2]);
  }, []);

  const handleGeminiKeyChange = (val: string) => {
    setGeminiKey(val);
    document.cookie = `gemini_api_key=${val}; path=/; max-age=31536000`;
  };

  const handleVercelTokenChange = (val: string) => {
    setVercelToken(val);
    document.cookie = `vercel_token=${val}; path=/; max-age=31536000`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <div className="px-6 border-b border-gray-100 bg-gray-50/50">
            <TabsList className="bg-transparent border-none p-0 h-12 gap-6">
              <TabsTrigger
                value="api"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-violet-600 rounded-none h-full px-0 text-sm font-medium text-gray-500 transition-all"
              >
                API Keys
              </TabsTrigger>
              <TabsTrigger
                value="deployment"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-violet-600 rounded-none h-full px-0 text-sm font-medium text-gray-500 transition-all"
              >
                Deployment & Export
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="api" className="mt-0 space-y-6 animate-in fade-in duration-300">
              {/* Gemini Key */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Key className="w-4 h-4 text-violet-500" />
                    Google Gemini API Key
                  </label>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-violet-600 hover:underline flex items-center gap-1"
                  >
                    Get API Key <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="Paste your Gemini API key here..."
                  value={geminiKey}
                  onChange={(e) => handleGeminiKeyChange(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all bg-gray-50/50"
                />
                <div className="flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    This key is used to generate app layouts and content. You can get one for free from Google AI Studio. It is stored only in your browser cookies.
                  </p>
                </div>
              </div>

              {/* Vercel Token */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <CloudUpload className="w-4 h-4 text-indigo-500" />
                    Vercel API Token
                  </label>
                  <a
                    href="https://vercel.com/account/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Get Vercel Token <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="Paste your Vercel Token here..."
                  value={vercelToken}
                  onChange={(e) => handleVercelTokenChange(e.target.value)}
                  className="w-full text-sm px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-gray-50/50"
                />
                <div className="flex items-start gap-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    This token allows Spawn to deploy your apps directly to your Vercel account. It is stored only in your browser cookies.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deployment" className="mt-0 space-y-6 animate-in fade-in duration-300">
              {!appId ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <CloudUpload className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">No App Selected</h3>
                  <p className="text-xs text-gray-500 max-w-[240px]">
                    Open or generate an app to access deployment and export options.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Deployment Section */}
                  <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${deployedUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-violet-100 text-violet-600'}`}>
                          <CloudUpload className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Vercel Deployment</h4>
                          <p className="text-[11px] text-gray-500">Host your app live on the web</p>
                        </div>
                      </div>
                      {deployedUrl && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-bold uppercase tracking-wider">
                          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                          Live
                        </div>
                      )}
                    </div>

                    {deployedUrl ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                          <span className="text-xs text-gray-600 truncate flex-1">{deployedUrl}</span>
                          <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-gray-50 rounded-lg transition">
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                          </a>
                        </div>
                        <button
                          onClick={handleDeleteDeployment}
                          disabled={isDeleting}
                          className="w-full py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition disabled:opacity-50"
                        >
                          {isDeleting ? "Removing..." : "Remove Deployment"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleDeploy}
                        disabled={isDeploying}
                        className="w-full py-3 bg-violet-600 text-white hover:bg-violet-700 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isDeploying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Deploying (~40s)...
                          </>
                        ) : "Deploy to Vercel"}
                      </button>
                    )}
                  </div>

                  {/* Export Section */}
                  <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">Export Source Code</h4>
                          <p className="text-[11px] text-gray-500">Download project as a .zip file</p>
                        </div>
                      </div>
                      <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="px-6 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                        Download .zip
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
