'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html>
            <body className="p-4 bg-red-50 text-red-900 min-h-screen flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-4">Critical Error</h2>
                <p className="mb-2 font-mono text-sm bg-white p-4 rounded border border-red-200 w-full break-all">
                    {error.message || 'Unknown error'}
                </p>
                {error.digest && (
                    <p className="text-xs text-red-400 mb-4">Digest: {error.digest}</p>
                )}
                <div className="text-xs text-left w-full bg-slate-100 p-2 rounded overflow-auto max-h-48 mb-4">
                    {error.stack}
                </div>
                <button
                    className="bg-red-600 text-white px-6 py-2 rounded-full font-bold active:scale-95 transition-transform"
                    onClick={() => reset()}
                >
                    Try again
                </button>
            </body>
        </html>
    );
}
