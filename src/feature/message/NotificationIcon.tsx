// NotificationIcon.tsx
"use client";

import React from 'react';
import {Bell} from 'lucide-react';
import {Badge} from '@/components/ui/atomes/badge';
import {useGetNotificationsCount} from '@/services/api/message/message.api';
import {useAuth} from '@/feature/auth/context/AuthProvider';

interface NotificationIconProps {
    className?: string;
}

export const NotificationIcon: React.FC<NotificationIconProps> = ({className = ""}) => {
    const {user} = useAuth();
    const {data: notifications, isLoading} = useGetNotificationsCount();

    // Afficher uniquement pour les administrateurs
    if (!user || user.role !== 'administrateur') {
        return null;
    }

    const count = notifications?.nouveaux_messages || 0;

    return (
        <div className={`relative ${className}`}>
            <Bell className="h-5 w-5 text-gray-600"/>
            {!isLoading && count > 0 && (
                <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold min-w-[20px] animate-pulse"
                >
                    {count > 99 ? '99+' : count}
                </Badge>
            )}
        </div>
    );
};

export default NotificationIcon;