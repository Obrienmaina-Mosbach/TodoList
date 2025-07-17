// server/api/index.js
// This is the main entry point for your Azure Function
// It acts as an HTTP trigger that routes requests to your Express app.

const { app: functionsApp } = require('@azure/functions');
const createExpressApp = require('../server'); // Import the function that creates your Express app
const expressApp = createExpressApp(); // Create an instance of your Express app

// Define the HTTP trigger function
functionsApp.http('httpTrigger', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous', // For now, allows unauthenticated access
    route: '{*segments}',   // Captures all segments after /api/
    handler: async (request, context) => {
        // Manually create mock req and res objects for Express
        const mockReq = {
            method: request.method,
            url: '/' + (request.params.segments || ''), // Construct URL for Express, removing /api/
            headers: request.headers,
            body: request.body,
            query: request.query,
            params: request.params,
            // Add other properties Express might expect if needed
        };

        const mockRes = {
            status: (code) => {
                context.res.status = code;
                return mockRes;
            },
            json: (data) => {
                context.res.json(data);
                return mockRes;
            },
            send: (data) => {
                context.res.body = data;
                return mockRes;
            },
            end: () => {
                // No explicit action needed for 'end' in this context
            },
            setHeader: (name, value) => {
                if (!context.res.headers) {
                    context.res.headers = {};
                }
                context.res.headers[name] = value;
                return mockRes;
            }
        };

        // Use a Promise to await the Express app's handling
        await new Promise((resolve) => {
            expressApp(mockReq, mockRes, resolve); // Pass resolve as the next() callback
        });

        return context.res; // Return the response populated by Express
    }
});
