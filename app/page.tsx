"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testHelloAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch' });
    }
    setLoading(false);
  };

  const testProtectedAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/protected');
      const data = await res.json();
      setApiResponse(data);
    } catch (error) {
      setApiResponse({ error: 'Failed to fetch' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Next.js Backend & Auth Demo
        </h1>

        {/* Authentication Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Authentication Status
          </h2>
          
          {status === "loading" && (
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          )}
          
          {status === "unauthenticated" && (
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You are not signed in
              </p>
              <button
                onClick={() => signIn()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
          
          {status === "authenticated" && session && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Signed in as:{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {session.user?.email || session.user?.name}
                  </span>
                </p>
                {session.user?.role && (
                  <p className="text-gray-600 dark:text-gray-300">
                    Role:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {session.user.role}
                    </span>
                  </p>
                )}
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* API Testing Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Test API Endpoints
          </h2>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={testHelloAPI}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Test /api/hello (Public)
            </button>
            
            <button
              onClick={testProtectedAPI}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Test /api/protected (Requires Auth)
            </button>
          </div>

          {apiResponse && (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                API Response:
              </h3>
              <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            API Endpoints
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/hello
              </code>{" "}
              - Public API endpoint
            </li>
            <li>
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/protected
              </code>{" "}
              - Protected API endpoint (requires auth)
            </li>
            <li>
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                POST /api/auth/register
              </code>{" "}
              - User registration
            </li>
            <li>
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                GET /api/users
              </code>{" "}
              - List users (requires auth)
            </li>
            <li>
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                POST/GET /api/auth/[...nextauth]
              </code>{" "}
              - NextAuth endpoints
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
