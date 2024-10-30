export function handleUnauthorizedHtml() {
  return `
    <html lang="en">
      <head>
        <title>Unauthorized Signup</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            text-align: center;
          }
          .container {
            max-width: 400px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #fff;
          }
          h1 {
            color: #d9534f;
            font-size: 24px;
          }
          p {
            font-size: 16px;
            margin: 16px 0;
          }
          button {
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
        <script>
          async function handleGoHome() {
            try {
              await fetch(window.location.href, { method: 'POST' });
            } catch (error) {
              console.error('Failed to delete user:', error);
            }
            window.location.href = 'http://localhost:3000';
          }
        </script>
      </head>
      <body>
        <div class="container">
          <h1>Unauthorized Signup</h1>
          <p>This username is not authorized to sign up.</p>
          <button onclick="handleGoHome()">Go Home</button>
        </div>
      </body>
    </html>`;
}
