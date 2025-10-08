
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ToggleSwitch from '../../components/ui/ToggleSwitch';

interface NotificationSetting {
    id: string;
    label: string;
    description: string;
    enabled: boolean;
}

const initialSettings: NotificationSetting[] = [
    {
        id: 'new-booking',
        label: 'حجز جديد',
        description: 'إرسال إشعار عند إنشاء حجز جديد من قبل العميل.',
        enabled: true,
    },
    {
        id: 'booking-cancellation',
        label: 'إلغاء حجز',
        description: 'إرسال إشعار عند قيام العميل بإلغاء حجزه.',
        enabled: true,
    },
    {
        id: 'overdue-return',
        label: 'تذكير بتأخر التسليم',
        description: 'إرسال تذكير تلقائي للعميل عند تأخر تسليم السيارة.',
        enabled: false,
    },
    {
        id: 'booking-confirmation',
        label: 'تأكيد الحجز',
        description: 'إرسال بريد إلكتروني للعميل عند تأكيد الحجز من قبل الموظف.',
        enabled: true,
    }
];

const AdminSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (id: string, enabled: boolean) => {
        setSettings(prevSettings =>
            prevSettings.map(setting =>
                setting.id === id ? { ...setting, enabled } : setting
            )
        );
    };
    
    const handleSaveChanges = () => {
        setIsSaving(true);
        // Simulate an API call
        setTimeout(() => {
            setIsSaving(false);
            alert('تم حفظ الإعدادات بنجاح!');
        }, 1000);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">الإعدادات</h1>
            
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-1">إشعارات البريد الإلكتروني</h2>
                <p className="text-gray-500 mb-6">تحكم في رسائل البريد الإلكتروني التلقائية المرسلة من النظام.</p>

                <div className="divide-y divide-gray-200">
                    {settings.map(setting => (
                        <div key={setting.id} className="flex items-center justify-between py-4">
                            <div>
                                <p className="font-medium text-gray-800">{setting.label}</p>
                                <p className="text-sm text-gray-500">{setting.description}</p>
                            </div>
                            <ToggleSwitch
                                id={setting.id}
                                checked={setting.enabled}
                                onChange={(checked) => handleToggle(setting.id, checked)}
                            />
                        </div>
                    ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default AdminSettingsPage;
