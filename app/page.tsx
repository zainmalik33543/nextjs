"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  requiresAuth: boolean;
  requiresAdmin?: boolean;
  params?: { name: string; type: string; required: boolean }[];
  body?: { name: string; type: string; required: boolean }[];
}

const API_ENDPOINTS: ApiEndpoint[] = [
  {
    method: "GET",
    path: "/api/hello",
    description: "Public API test endpoint",
    requiresAuth: false,
  },
  {
    method: "POST",
    path: "/api/hello",
    description: "Public API with POST data",
    requiresAuth: false,
    body: [
      { name: "message", type: "string", required: false },
    ],
  },
  {
    method: "GET",
    path: "/api/protected",
    description: "Protected endpoint (requires authentication)",
    requiresAuth: true,
  },
  {
    method: "POST",
    path: "/api/auth/register",
    description: "Register new user",
    requiresAuth: false,
    body: [
      { name: "name", type: "string", required: true },
      { name: "email", type: "string", required: true },
      { name: "password", type: "string", required: true },
    ],
  },
  {
    method: "GET",
    path: "/api/users",
    description: "List all users",
    requiresAuth: true,
  },
  {
    method: "POST",
    path: "/api/users",
    description: "Create new user",
    requiresAuth: true,
    body: [
      { name: "name", type: "string", required: true },
      { name: "email", type: "string", required: true },
    ],
  },
  {
    method: "GET",
    path: "/api/admin/users",
    description: "List users with pagination (Admin only)",
    requiresAuth: true,
    requiresAdmin: true,
    params: [
      { name: "page", type: "number", required: false },
      { name: "limit", type: "number", required: false },
      { name: "search", type: "string", required: false },
    ],
  },
  {
    method: "PATCH",
    path: "/api/admin/users",
    description: "Update user role (Admin only)",
    requiresAuth: true,
    requiresAdmin: true,
    body: [
      { name: "userId", type: "string", required: true },
      { name: "role", type: "string", required: true },
    ],
  },
  {
    method: "DELETE",
    path: "/api/admin/users",
    description: "Delete user (Admin only)",
    requiresAuth: true,
    requiresAdmin: true,
    params: [
      { name: "id", type: "string", required: true },
    ],
  },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [selectedApi, setSelectedApi] = useState<ApiEndpoint | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [bodyParams, setBodyParams] = useState<Record<string, string>>({});

  const handleSelectApi = (api: ApiEndpoint) => {
    setSelectedApi(api);
    setApiResponse(null);
    setQueryParams({});
    setBodyParams({});
  };

  const handleTestApi = async () => {
    if (!selectedApi) return;

    setLoading(true);
    setApiResponse(null);

    try {
      // Build URL with query parameters
      let url = selectedApi.path;
      if (selectedApi.params && Object.keys(queryParams).length > 0) {
        const params = new URLSearchParams(
          Object.entries(queryParams).filter(([_, value]) => value !== "")
        );
        url += `?${params.toString()}`;
      }

      // Build request options
      const options: RequestInit = {
        method: selectedApi.method,
      };

      // Add body for POST/PATCH/PUT requests
      if (["POST", "PATCH", "PUT"].includes(selectedApi.method) && selectedApi.body) {
        const body: Record<string, any> = {};
        selectedApi.body.forEach((field) => {
          if (bodyParams[field.name]) {
            body[field.name] = bodyParams[field.name];
          }
        });
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
      }

      const res = await fetch(url, options);
      const data = await res.json();
      
      setApiResponse({
        status: res.status,
        statusText: res.statusText,
        data: data,
      });
    } catch (error) {
      setApiResponse({
        status: 0,
        statusText: "Error",
        data: { error: "Failed to fetch: " + (error as Error).message },
      });
    } finally {
      setLoading(false);
    }
  };

  const canAccessApi = (api: ApiEndpoint) => {
    if (!api.requiresAuth) return true;
    if (!session) return false;
    if (api.requiresAdmin && session.user.role !== "admin") return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Next.js API Testing Dashboard
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Available APIs
            </h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {API_ENDPOINTS.map((api, index) => {
                const canAccess = canAccessApi(api);
                const isSelected = selectedApi === api;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectApi(api)}
                    disabled={!canAccess}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    } ${
                      !canAccess
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded ${
                              api.method === "GET"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : api.method === "POST"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : api.method === "PATCH"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {api.method}
                          </span>
                          <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                            {api.path}
                          </code>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {api.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {api.requiresAuth && (
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                            Auth
                          </span>
                        )}
                        {api.requiresAdmin && (
                          <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    {!canAccess && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                        {!session
                          ? "Sign in required"
                          : "Admin access required"}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Test API
            </h2>

            {!selectedApi ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Select an API from the list to test it
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Selected API Info */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded ${
                        selectedApi.method === "GET"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : selectedApi.method === "POST"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : selectedApi.method === "PATCH"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {selectedApi.method}
                    </span>
                    <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {selectedApi.path}
                    </code>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedApi.description}
                  </p>
                </div>

                {/* Query Parameters */}
                {selectedApi.params && selectedApi.params.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Query Parameters
                    </h3>
                    <div className="space-y-2">
                      {selectedApi.params.map((param) => (
                        <div key={param.name}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {param.name}
                            {param.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                            <span className="text-xs text-gray-500 ml-2">
                              ({param.type})
                            </span>
                          </label>
                          <input
                            type="text"
                            value={queryParams[param.name] || ""}
                            onChange={(e) =>
                              setQueryParams({
                                ...queryParams,
                                [param.name]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder={`Enter ${param.name}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Body Parameters */}
                {selectedApi.body && selectedApi.body.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Request Body
                    </h3>
                    <div className="space-y-2">
                      {selectedApi.body.map((param) => (
                        <div key={param.name}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {param.name}
                            {param.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                            <span className="text-xs text-gray-500 ml-2">
                              ({param.type})
                            </span>
                          </label>
                          <input
                            type={param.type === "password" ? "password" : "text"}
                            value={bodyParams[param.name] || ""}
                            onChange={(e) =>
                              setBodyParams({
                                ...bodyParams,
                                [param.name]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder={`Enter ${param.name}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test Button */}
                <button
                  onClick={handleTestApi}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? "Testing..." : "Test API"}
                </button>

                {/* Response */}
                {apiResponse && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Response
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          apiResponse.status >= 200 && apiResponse.status < 300
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : apiResponse.status >= 400
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {apiResponse.status} {apiResponse.statusText}
                      </span>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400 font-mono">
                        {JSON.stringify(apiResponse.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
