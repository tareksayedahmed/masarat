import React from 'react';
import { AUDIT_LOGS } from '../../constants';

const AdminLogsPage: React.FC = () => {

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('ar-SA', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">سجل النشاط</h1>
           
            {/* Desktop Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto hidden lg:block">
                <table className="w-full">
                    <thead>
                        <tr className="text-right font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50">
                            <th className="px-4 py-3">الوقت</th>
                            <th className="px-4 py-3">المستخدم</th>
                            <th className="px-4 py-3">الإجراء</th>
                            <th className="px-4 py-3">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {AUDIT_LOGS.map(log => (
                            <tr key={log.id} className="text-gray-700">
                                <td className="px-4 py-3 text-sm whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{log.user}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                     <span className="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full">
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
                    <div key={log.id} className="bg-white p-4 rounded-lg shadow">
                         <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-800">{log.user}</p>
                            <span className="px-2 py-1 text-xs font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full whitespace-nowrap">
                                {log.action}
                            </span>
                         </div>
                         <p className="text-sm text-gray-600 mt-2">{log.details}</p>
                         <p className="text-xs text-gray-400 mt-3 text-left">{formatDateTime(log.timestamp)}</p>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AdminLogsPage;
