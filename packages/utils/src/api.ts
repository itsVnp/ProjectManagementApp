/**
 * API utility functions
 */

/**
 * API configuration
 */
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

/**
 * Default API configuration
 */
export const defaultApiConfig: ApiConfig = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * API request options
 */
export interface ApiRequestOptions {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * API response
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * API error
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

/**
 * Makes an API request
 */
export async function apiRequest<T = any>(
  options: ApiRequestOptions,
  config: ApiConfig = defaultApiConfig
): Promise<ApiResponse<T>> {
  const { method, url, data, params, headers, timeout } = options;

  // Build URL with query parameters
  let fullUrl = `${config.baseURL}${url}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    fullUrl += `?${searchParams.toString()}`;
  }

  // Prepare headers
  const requestHeaders = {
    ...config.headers,
    ...headers,
  };

  // Create request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    signal: timeout ? AbortSignal.timeout(timeout) : undefined,
  };

  // Add body for non-GET requests
  if (method !== 'GET' && data) {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(fullUrl, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw new Error('API request failed');
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(
  url: string,
  params?: Record<string, string>,
  config?: ApiConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>({ method: 'GET', url, params }, config);
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  url: string,
  data?: any,
  config?: ApiConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>({ method: 'POST', url, data }, config);
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  url: string,
  data?: any,
  config?: ApiConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>({ method: 'PUT', url, data }, config);
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  url: string,
  data?: any,
  config?: ApiConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>({ method: 'PATCH', url, data }, config);
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  url: string,
  config?: ApiConfig
): Promise<ApiResponse<T>> {
  return apiRequest<T>({ method: 'DELETE', url }, config);
}

/**
 * Creates an API client with authentication
 */
export function createApiClient(token?: string, config?: Partial<ApiConfig>) {
  const apiConfig: ApiConfig = {
    ...defaultApiConfig,
    ...config,
    headers: {
      ...defaultApiConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...config?.headers,
    },
  };

  return {
    get: <T = any>(url: string, params?: Record<string, string>) =>
      apiGet<T>(url, params, apiConfig),
    post: <T = any>(url: string, data?: any) =>
      apiPost<T>(url, data, apiConfig),
    put: <T = any>(url: string, data?: any) =>
      apiPut<T>(url, data, apiConfig),
    patch: <T = any>(url: string, data?: any) =>
      apiPatch<T>(url, data, apiConfig),
    delete: <T = any>(url: string) =>
      apiDelete<T>(url, apiConfig),
  };
}

/**
 * Handles API errors
 */
export function handleApiError(error: any): ApiError {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }
  
  if (error.response) {
    return {
      message: error.response.data?.message || 'API request failed',
      status: error.response.status,
      code: error.response.data?.code,
      details: error.response.data,
    };
  }
  
  return {
    message: 'Network error',
    status: 0,
  };
}

/**
 * Retries an API request
 */
export async function retryApiRequest<T = any>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

/**
 * Uploads a file
 */
export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
  config?: ApiConfig
): Promise<ApiResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const apiConfig: ApiConfig = {
    ...defaultApiConfig,
    ...config,
    headers: {
      // Don't set Content-Type for FormData
    },
  };

  return apiRequest({
    method: 'POST',
    url,
    data: formData,
  }, apiConfig);
} 