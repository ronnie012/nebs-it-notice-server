export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>NEBS IT Notice Management API</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 40px;
          background-color: #f4f7f6;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: auto;
          background: #fff;
          padding: 30px 40px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          border-top: 5px solid #007bff;
        }
        h1 {
          color: #007bff;
          text-align: center;
          margin-bottom: 30px;
          font-size: 2.5em;
        }
        p {
          font-size: 1.1em;
          margin-bottom: 20px;
        }
        ul {
          list-style-type: none;
          padding: 0;
        }
        li {
          margin-bottom: 10px;
        }
        a {
          color: #007bff;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        code {
          background-color: #e9ecef;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to the NEBS IT Notice Management API!</h1>
        <p>This is the backend service for managing notices. You can interact with it using various API endpoints.</p>
        <p>Current API Version: <code>1.0.0</code></p>
        <p>For more detailed information, please refer to the project's documentation.</p>
        <h2>Available Endpoints:</h2>
        <ul>
          <li><strong>All Notices:</strong> <a href="/api/notices"><code>GET /api/notices</code></a></li>
          <li><strong>Specific Notice:</strong> <code>GET /api/notices/{id}</code></li>
          <li><strong>Create Notice:</strong> <code>POST /api/notices</code></li>
          <li><strong>Update Notice:</strong> <code>PATCH /api/notices/{id}</code></li>
          <li><strong>Delete Notice:</strong> <code>DELETE /api/notices/{id}</code></li>
        </ul>
        <p>You can test the <code>GET /api/notices</code> endpoint by clicking the link above.</p>
      </div>
    </body>
    </html>
  `);
}