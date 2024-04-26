import type { NextApiRequest, NextApiResponse } from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

const url = process.env.NEXT_PUBLIC_API_URL as string;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const proxy = createProxyMiddleware({
  target: url,
  changeOrigin: true,
  pathRewrite: {
    '^/api/get-decoded-2448': '',
  },
  secure: false,
});

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Now use the middleware to handle the request
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        return res
          .status(500)
          .json({ error: 'Proxy error', reason: result.message });
      }
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};

