"use client";

import { useAuth } from '@/context/AuthContext';
import { createPlate, getPlateByNormalized, normalizePlate } from '@/services/plateService';
import { createReport } from '@/services/reportService';
import { uploadReportImage } from '@/services/storageService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ReportForm {
    plateNumber: string;
    lat?: number;
    lng?: number;
    notes?: string;
    image?: FileList;
}

export default function NewReportPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ReportForm>();
    const [locationError, setLocationError] = useState<string | null>(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValue('lat', position.coords.latitude);
                setValue('lng', position.coords.longitude);
                setLocationError(null);
            },
            (error) => {
                setLocationError("Unable to retrieve your location");
                console.error(error);
            }
        );
    };

    const onSubmit = async (data: ReportForm) => {
        if (!user) return;

        try {
            const normalized = normalizePlate(data.plateNumber);
            const plateId = normalized; // Use normalized as ID for simplicity

            // Check if plate exists, if not create it
            const existingPlate = await getPlateByNormalized(normalized);
            if (!existingPlate) {
                await createPlate({
                    id: plateId,
                    normalized,
                    raw: data.plateNumber,
                    createdAt: Date.now(),
                });
            }

            // Create Report
            const reportId = await createReport({
                userId: user.id,
                plateId: plateId,
                status: 'lost',
                lat: data.lat,
                lng: data.lng,
                notes: data.notes,
                createdAt: Date.now(),
            });

            // Upload Image if present
            if (data.image && data.image.length > 0) {
                const file = data.image[0];
                const imageUrl = await uploadReportImage(reportId, file);
                // Update report with image URL (need to import updateReport or just do it here)
                // I'll assume createReport handles it or I need to update it.
                // I didn't add updateReport to imports, let's import it dynamically or just assume I can update.
                // Actually I should import updateReport.
                const { updateReport } = await import('@/services/reportService');
                await updateReport(reportId, { imageUrl });
            }

            router.push('/dashboard');
        } catch (error) {
            console.error("Error creating report", error);
            alert("Failed to create report");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Report Lost Plate</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                        <input
                            {...register('plateNumber', { required: "Plate number is required" })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            placeholder="ABC 123"
                        />
                        {errors.plateNumber && <p className="text-red-500 text-xs mt-1">{errors.plateNumber.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <div className="flex space-x-2 mt-1">
                            <input
                                {...register('lat', { valueAsNumber: true })}
                                placeholder="Latitude"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                            <input
                                {...register('lng', { valueAsNumber: true })}
                                placeholder="Longitude"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={getLocation}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-500"
                        >
                            Get Current Location
                        </button>
                        {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photo (Optional)</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            {...register('image')}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notes</label>
                        <textarea
                            {...register('notes')}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
}
