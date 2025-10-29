import React from 'react';
import { AuditLog } from '../../types';

// FIX: Removed import from empty constants.ts file and defined mock data locally.
const AUDIT_LOGS: AuditLog[] = [
    { id: '1', user: 'admin@masarat.com', action: 'تحديث الحجز', timestamp: '2024-07-20T10:00:00Z', details: 'تم تغيير حالة الحجز #MAS-12345 إلى "مؤكد".' },
    { id: '2', user: 'operator@masarat.com', action: 'إضافة سيارة', timestamp: '2024-07-20T09:30:00Z', details: 'تم إضافة سيارة جديدة: هيونداي النترا 2024.' },
    { id: '3', user: 'system', action: 'فشل الدفع', timestamp: '2024-07-19T15:12:00Z', details: 'فشلت محاولة الدفع للحجز #MAS-54321.' },
    { id: '4', user: 'admin@masarat.com', action: 'تعديل الأسعار', timestamp: '2024-07-19T11:05:00Z', details: 'تم تحديث سعر طراز "تويوتا كامري 2024".' },
    { id: '5', user: 'customer@example.com', action: 'إلغاء حجز', timestamp: '2024-07-18T20:45:00Z', details: 'قام العميل بإلغاء الحجز #MAS-98765.' },
];

const AdminLogsPage: React.FC = () => {

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">سجل النشاط</h1>
           
            {/* Desktop Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto hidden lg:block">
                <table className="w-full">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 dark:text-gray-400 uppercase border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                            <th className="px-4 py-3">الوقت</th>
                            <th className="px-4 py-3">المستخدم</th>
                            <th className="px-4 py-3">الإجراء</th>
                            <th className="px-4 py-3">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y dark:divide-gray-700">
                        {AUDIT_LOGS.map(log => (
                            <tr key={log.id} className="text-gray-700 dark:text-gray-300">
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{log.user}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                     <span className="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
                                        {log.action}
                                     </span>
                                </td>
                                <td className="px-4 py-3 whitespace-normal break-words">{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile & Tablet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {AUDIT_LOGS.map(log => (
                    <div key={log.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                         <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{log.user}</p>
                            <span className="px-2 py-1 text-xs font-semibold leading-tight text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-300 rounded-full whitespace-nowrap">
                                {log.action}
                            </span>
                         </div>
                         <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{log.details}</p>
                         <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-left">{formatDateTime(log.timestamp)}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AdminLogsPage;