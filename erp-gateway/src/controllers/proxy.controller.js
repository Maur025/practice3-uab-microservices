import peopleClient from '../clients/people.client.js';
import { asyncHandler, forwardResponse, handleAxiosError } from '../utils/response.js';

const buildHeaders = (req) => {
  const headers = {};
  if (req.headers.authorization) {
    headers.Authorization = req.headers.authorization;
  }
  return headers;
};

class ProxyController {
  proxyGet = (path) => asyncHandler(async (req, res) => {
    try {
      const response = await peopleClient.get(path, { headers: buildHeaders(req) });
      forwardResponse(res, response);
    } catch (error) {
      handleAxiosError(error);
    }
  });

  proxyPost = (path) => asyncHandler(async (req, res) => {
    try {
      const response = await peopleClient.post(path, req.body, { headers: buildHeaders(req) });
      forwardResponse(res, response);
    } catch (error) {
      handleAxiosError(error);
    }
  });

  proxyPut = (path) => asyncHandler(async (req, res) => {
    try {
      const response = await peopleClient.put(path, req.body, { headers: buildHeaders(req) });
      forwardResponse(res, response);
    } catch (error) {
      handleAxiosError(error);
    }
  });

  proxyDelete = (path) => asyncHandler(async (req, res) => {
    try {
      const response = await peopleClient.delete(path, { headers: buildHeaders(req) });
      forwardResponse(res, response);
    } catch (error) {
      handleAxiosError(error);
    }
  });
}

export default new ProxyController();
