// server/api/index.js
// This file acts as the entry point for your Azure Function
// It imports your Express app and uses it to handle HTTP requests.

const { app: functionsApp } = require('@azure/functions'); // Import app from @azure/functions
const createExpressApp = require('../server'); // Import the function that creates your Express app

const expressApp = createExpressApp(); // Create an instance of your Express app

async function httpTrigger(request, context) {
    context.log(`Http function processed request for url "${request.url}"`);

    // Azure Functions v4 (Node.js) expects a specific way to handle Express requests.
    // We'll manually process the request and send the response.
    return new Promise((resolve, reject) => {
        const res = {
            status: (code) => {
                context.res.status = code;
                return res;
            },
            json: (data) => {
                context.res.json(data);
                resolve(context.res);
            },
            send: (data) => {
                context.res.body = data;
                resolve(context.res);
            },
            end: () => {
                resolve(context.res);
            },
            setHeader: (name, value) => {
                if (!context.res.headers) {
                    context.res.headers = {};
                }
                context.res.headers[name] = value;
                return res;
            }
        };

        // Create a mock request object that Express can understand
        const req = {
            method: request.method,
            url: request.url.replace('/api', ''), // Remove /api prefix for Express routing
            headers: request.headers,
            body: request.body,
            query: request.query,
            params: request.params,
        };

        // Let Express handle the request
        expressApp(req, res, (err) => {
            if (err) {
                context.error(err);
                reject(err);
            }
        });
    });
}

// Register the HTTP trigger function
functionsApp.http('httpTrigger', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    route: '{*segments}', // This captures all segments after /api/
    handler: httpTrigger
});
