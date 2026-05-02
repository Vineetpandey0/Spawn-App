'use client'
import axios from 'axios';
import { useEffect, useState } from 'react'
import { LayoutGrid, ArrowRight } from 'lucide-react'
import Link from 'next/link';
import { useAppStore } from '@/store/appStore';

export default function Apps() {
    const [apps, setApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { setAppData } = useAppStore();

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await axios.get("/api/app/get-apps")
                setApps(res.data)
                setAppData(res.data);
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        fetchApps()
    }, [])

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 " data-lenis-prevent>

            {/* Header */}
            <div className="border-b border-gray-200 px-10 py-6 flex items-end justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">My Apps</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage and view your connected applications</p>
                </div>
                {!loading && (
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-md px-2.5 py-1">
                        {apps.length} {apps.length === 1 ? 'app' : 'apps'}
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="px-10 py-8">

                {/* Loading State */}
                {loading && (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && apps.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                            <LayoutGrid className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">No apps found</p>
                        <p className="text-xs text-gray-400 mt-1">Your connected apps will appear here</p>
                    </div>
                )}

                {/* Table */}
                {!loading && apps.length > 0 && (
                    <div>
                        {/* Column Headers */}
                        <div className="grid grid-cols-[2fr_1.5fr_2fr_auto] px-4 pb-2.5 border-b border-gray-100">
                            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">Name</span>
                            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">Created</span>
                            <span className="text-[11px] font-medium uppercase tracking-widest text-gray-400">Config</span>
                            <span className="w-5" />
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-gray-100">
                            {apps.map((app) => (
                                <Link
                                    href={`/apps/${app.id}`}
                                    key={app.id}
                                    className="block"
                                >
                                    <div className="grid grid-cols-[2fr_1.5fr_2fr_auto] items-center px-4 py-4 hover:bg-gray-100 transition-colors duration-100 rounded-lg group cursor-pointer">

                                        {/* Name */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-gray-800 truncate">
                                                {app.name}
                                            </span>
                                        </div>

                                        {/* Created At */}
                                        <span className="text-sm text-gray-400 font-normal">
                                            {formatDate(app.createdAt)}
                                        </span>

                                        {/* Config */}
                                        <div className="max-w-xs">
                                            {app.config_json ? (
                                                <code className="text-xs font-mono text-gray-500 bg-gray-100 border border-gray-200 rounded px-2 py-0.5 truncate block max-w-[240px]">
                                                    {typeof app.config_json === 'object'
                                                        ? JSON.stringify(app.config_json)
                                                        : app.config_json}
                                                </code>
                                            ) : (
                                                <span className="text-sm text-gray-300">—</span>
                                            )}
                                        </div>

                                        {/* Arrow */}
                                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors duration-150" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}