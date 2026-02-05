'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // Store the custom JWT token in localStorage
            const customToken = (session.user as any).customToken;
            if (customToken) {
                localStorage.setItem('token', customToken);
                localStorage.setItem('user', JSON.stringify({
                    id: (session.user as any).id,
                    email: session.user.email,
                    name: session.user.name,
                }));
            }

            // Redirect to home page
            router.push('/');
        } else if (status === 'unauthenticated') {
            // Authentication failed, redirect to login
            router.push('/login?error=google_auth_failed');
        }
    }, [status, session, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4a044e] border-t-transparent mx-auto mb-4"></div>
                <h2 className="text-xl font-black text-[#4a044e]">Completing sign-in...</h2>
                <p className="text-gray-600 mt-2">Please wait while we set up your account</p>
            </div>
        </div>
    );
}
