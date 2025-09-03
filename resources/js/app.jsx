import '../css/app.css';
import './bootstrap';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import {MantineProvider} from "@mantine/core";
import {Notifications} from "@mantine/notifications";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme={'light'}>
                <Notifications />
                <App {...props} />
            </MantineProvider>);
    },
    progress: {
        color: '#4B5563',
    },
});
