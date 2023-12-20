// mirageServer.js
import { createServer, Model } from 'miragejs';

let server;

export function makeServer({ environment = 'development' } = {}) {
    if (!server) {
        server = createServer({
            environment,

            models: {
                user: Model,
            },

            seeds(server) {
                server.create('user', { username: 'testuser', password: 'testpassword' });
            },

            routes() {
                this.namespace = 'api';

                this.post('/users/signin', (schema, request) => {
                    const { email, password } = JSON.parse(request.requestBody);

                    const user = {
                        email: 'testuser',
                        password: 'testpassword',
                    };

                    if (user) {
                        console.log('User found');
                        // Simulation de génération de token
                        const token = Math.random().toString(36).substring(7);
                        console.log("🚀 ~ file: config.js:34 ~ this.post ~ token:", token)
                        return { token };
                    } else {
                        
                        return { error: 'Invalid username or password' };
                    }
                });

                this.get('/example', () => ({
                    data: 'Hello from Mirage!',
                }));
            },
        });
    }

    return server;
}

export function shutdownServer() {
    if (server) {
        server.shutdown();
        server = null;
    }
}
