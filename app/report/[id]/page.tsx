"use client";

import { useAuth } from '@/context/AuthContext';
import { getReport, updateReport } from '@/services/reportService';
import { Report } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReportDetailPage() {
    const { id } = useParams() as { id: string };
    const { user } = useAuth();
    const router = useRouter();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editNotes, setEditNotes] = useState('');
    const [editStatus, setEditStatus] = useState<Report['status']>('lost');

    useEffect(() => {
        if (id) {
            getReport(id)
                .then((data) => {
                    setReport(data);
                    if (data) {
                        setEditNotes(data.notes || '');
                        setEditStatus(data.status);
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleSave = async () => {
        if (!report) return;
        try {
            await updateReport(report.id, {
                notes: editNotes,
                status: editStatus,
            });
            setReport({ ...report, notes: editNotes, status: editStatus });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating report", error);
            alert("Failed to update report");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!report) return <div className="p-8 text-center">Report not found</div>;

    const isOwner = user?.id === report.userId;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Report Details
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Report ID: {report.id}
                        </p>
                    </div>
                    {isOwner && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Edit
                        </button>
                    )}
                    {isOwner && isEditing && (
                        <div className="space-x-2">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Plate Number</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {report.plateId}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value as Report['status'])}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                                    >
                                        <option value="lost">Lost</option>
                                        <option value="found">Found</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                ) : (
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.status === 'lost' ? 'bg-red-100 text-red-800' :
                                            report.status === 'found' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {report.status}
                                    </span>
                                )}
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Notes</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {isEditing ? (
                                    <textarea
                                        rows={3}
                                        value={editNotes}
                                        onChange={(e) => setEditNotes(e.target.value)}
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md border p-2"
                                    />
                                ) : (
                                    report.notes || 'No notes'
                                )}
                            </dd>
                        </div>
                        {report.imageUrl && (
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Image</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <img src={report.imageUrl} alt="Report" className="max-w-full h-auto rounded-lg" />
                                </dd>
                            </div>
                        )}
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {report.lat && report.lng ? (
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${report.lat},${report.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View on Maps ({report.lat.toFixed(4)}, {report.lng.toFixed(4)})
                                    </a>
                                ) : (
                                    'No location provided'
                                )}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
