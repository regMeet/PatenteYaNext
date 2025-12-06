"use client";

import { useAuth } from '@/context/AuthContext';
import { getReportsByUser } from '@/services/reportService';
import { Report } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);

    useEffect(() => {
        if (user) {
            getReportsByUser(user.id)
                .then(setReports)
                .catch(console.error)
                .finally(() => setLoadingReports(false));
        }
    }, [user]);

    if (!user) return null; // Middleware handles redirect

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">PatenteYA</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">Hello, {user.displayName}</span>
                            <button
                                onClick={() => logout()}
                                className="text-sm text-red-600 hover:text-red-800"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Your Reports</h2>
                        <Link
                            href="/report/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Report Lost Plate
                        </Link>
                    </div>

                    {loadingReports ? (
                        <div className="text-center py-10">Loading reports...</div>
                    ) : reports.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center text-gray-500">
                            You haven't reported any lost plates yet.
                        </div>
                    ) : (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <ul className="divide-y divide-gray-200">
                                {reports.map((report) => (
                                    <li key={report.id}>
                                        <Link href={`/report/${report.id}`} className="block hover:bg-gray-50">
                                            <div className="px-4 py-4 sm:px-6">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium text-blue-600 truncate">
                                                        Plate ID: {report.plateId}
                                                    </p>
                                                    <div className="ml-2 flex-shrink-0 flex">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'lost' ? 'bg-red-100 text-red-800' :
                                                                report.status === 'found' ? 'bg-green-100 text-green-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {report.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:flex sm:justify-between">
                                                    <div className="sm:flex">
                                                        <p className="flex items-center text-sm text-gray-500">
                                                            {new Date(report.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
