"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export function useAppActions(appId: string | undefined) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [showLoadingUrl, setShowLoadingUrl] = useState(false);

  const fetchAppData = async () => {
    if (!appId) {
      setDeployedUrl(null);
      return;
    }
    
    try {
      const res = await fetch(`/api/apps/${appId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDeployedUrl(data.deployedUrl || null);
    } catch (e) {
      setDeployedUrl(null);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, [appId]);

  const handleDeploy = async () => {
    if (!appId) return;
    
    setIsDeploying(true);
    setShowLoadingUrl(true);
    const tId = toast.loading("Uploading files to Vercel...");
    
    try {
      const res = await fetch(`/api/apps/${appId}/deploy`, { method: "POST" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Deployment failed");
      
      toast.loading("Files uploaded! Waiting for Vercel to build your app (40s)...", { id: tId });
      
      // Wait for 40 seconds to allow Vercel build to finish
      await new Promise(resolve => setTimeout(resolve, 40000));
      
      setDeployedUrl(data.url);
      setShowLoadingUrl(false);
      toast.success("Successfully deployed to Vercel!", { id: tId });
    } catch (err: any) {
      console.error(err);
      setShowLoadingUrl(false);
      toast.error(err.message || "Failed to deploy. Please check your Vercel Token.", { id: tId });
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeleteDeployment = async () => {
    if (!appId) return;

    setIsDeleting(true);
    const tId = toast.loading("Removing deployment from Vercel...");

    try {
      const res = await fetch(`/api/apps/${appId}/deploy`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Deletion failed");

      setDeployedUrl(null);
      toast.success("Deployment successfully removed.", { id: tId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to remove deployment.", { id: tId });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = async () => {
    if (!appId) return;
    
    setIsDownloading(true);
    const tId = toast.loading("Preparing your project ZIP...");
    
    try {
      const res = await fetch(`/api/apps/${appId}/export`);
      if (!res.ok) throw new Error("Failed to export project");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `app-project-${appId}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Project downloaded successfully!", { id: tId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download project. Please try again.", { id: tId });
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    isDeploying,
    isDeleting,
    deployedUrl,
    showLoadingUrl,
    handleDeploy,
    handleDeleteDeployment,
    handleDownload,
    fetchAppData
  };
}
