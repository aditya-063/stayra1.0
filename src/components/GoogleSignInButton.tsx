'use client';

import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

interface GoogleSignInButtonProps {
    mode?: 'signin' | 'signup';
}

export function GoogleSignInButton({ mode = 'signin' }: GoogleSignInButtonProps) {
    const handleGoogleSignIn = async () => {
        try {
            await signIn('google', {
                callbackUrl: '/auth/callback/google',
                redirect: true,
            });
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-14 rounded-2xl bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 transition-all flex items-center justify-center gap-3 font-bold text-gray-700 shadow-sm hover:shadow-md"
        >
            <FcGoogle className="w-6 h-6 " />
            <span>{mode === 'signin' ? 'Continue' : 'Sign up'} with Google</span>
        </button>
    );
}
