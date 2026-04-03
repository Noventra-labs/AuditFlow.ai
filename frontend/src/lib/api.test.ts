import { api } from './api';

// We need to mock global.fetch
const originalFetch = global.fetch;

describe('api client', () => {
  beforeEach(() => {
    // Reset global.fetch before each test
    global.fetch = jest.fn();
    // Reset env vars
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:8080';
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore original fetch
    global.fetch = originalFetch;
    // Restore console.error
    (console.error as jest.Mock).mockRestore();
  });

  describe('fetchApi wrapper', () => {
    it('should correctly parse a successful JSON response', async () => {
      const mockResponse = { data: 'test_data' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      // Using getAgentStatus as a proxy to test fetchApi
      const result = await api.getAgentStatus();

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/v1/agents/status', expect.objectContaining({
        headers: { 'Content-Type': 'application/json' }
      }));
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error with detail message on HTTP failure', async () => {
      const errorDetail = 'Not Found';
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ detail: errorDetail }),
      });

      await expect(api.getAgentStatus()).rejects.toThrow(errorDetail);
    });

    it('should throw an error with HTTP status when detail is unavailable', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Failed to parse JSON'); },
      });

      // Due to current catch logic `catch(() => ({ detail: 'Unknown error' }))`
      // the error will be "Unknown error"
      await expect(api.getAgentStatus()).rejects.toThrow('Unknown error');
    });

    it('should throw an error with HTTP status when no detail is provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 502,
        json: async () => ({}),
      });

      await expect(api.getAgentStatus()).rejects.toThrow('HTTP 502');
    });

    it('should propagate network errors', async () => {
      const networkError = new Error('Network error');
      (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

      await expect(api.getAgentStatus()).rejects.toThrow('Network error');
    });
  });

  describe('buildUrl helper', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
    });

    it('should build url with default company_id', async () => {
      await api.getInvoices();
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/invoices?company_id=demo-company-001',
        expect.any(Object)
      );
    });

    it('should include additional query params and ignore undefined values', async () => {
      await api.getInvoices('pending');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/invoices?company_id=demo-company-001&status=pending',
        expect.any(Object)
      );
    });

    it('should ignore undefined values in query params', async () => {
      // getAlerts with severity undefined, resolved false
      await api.getAlerts(undefined, false);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/alerts?company_id=demo-company-001&resolved=false',
        expect.any(Object)
      );
    });

    it('should handle POST requests correctly', async () => {
      await api.triggerReconciliation('2023-01-01', '2023-01-31');
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8080/v1/reconcile?company_id=demo-company-001&date_from=2023-01-01&date_to=2023-01-31',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });
  });
});
