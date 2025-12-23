import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
    // Note: Ensure your backend is running and CORS is enabled for localhost:5173
    // The URL might need adjustment if your backend port changes (currently 7245)
    // The path /openapi/v1.json is the default for .NET 9 OpenApi
    return (
        <div style={{ height: '100vh', overflow: 'auto' }}>
            <SwaggerUI url="https://localhost:7245/openapi/v1.json" />
        </div>
    );
};

export default ApiDocs;
