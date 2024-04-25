import type { NextApiRequest, NextApiResponse } from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

const url = process.env.NEXT_PUBLIC_API_URL as string;

// Configuring Next.js API route to disable the default body parser and allow the proxy middleware to handle requests
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
    '^/api/proxy': '',
  },
  secure: false, // Important to avoid SSL validation if the target server is not HTTPS
});

// Type the Next.js API handler properly
const handler = (req: NextApiRequest, res: NextApiResponse) => {
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

export default handler;
