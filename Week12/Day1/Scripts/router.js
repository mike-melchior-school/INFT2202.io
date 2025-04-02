"use strict";
import { loadHeader } from "./header.js";
export class Router {
    routes;
    constructor(routes) {
        this.routes = routes;
        this.init();
    }
    init() {
        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] initial page load: ${path}`);
            this.loadRoute(path);
        });
        window.addEventListener("hashchange", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });
        // window.addEventListener("popstate", () => {
        //     console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`)
        //     this.loadRoute(location.hash.slice(1));
        // })
    }
    navigate(path) {
        location.hash = path;
        this.loadRoute(path);
    }
    loadRoute(path) {
        console.log(`[INFO] Loading route: ${path}`);
        let basePath = path.split("#")[0];
        // extract known route
        if (basePath.includes("edit")) {
            basePath = "/edit";
        }
        if (!this.routes[basePath]) {
            console.error(`[WARN] Route not found ${basePath}, redirecting to 404`);
            location.hash = "/404";
            path = "/404";
        }
        fetch(this.routes[basePath])
            .then(res => {
            if (!res.ok)
                throw new Error(`[INFO] Failed to load ${this.routes[basePath]}`);
            return res.text();
        })
            .then(html => {
            loadHeader().then(() => {
                document.dispatchEvent(new CustomEvent("routeLoaded", { detail: basePath }));
            });
            const mainElement = document.querySelector("main");
            if (mainElement) {
                mainElement.innerHTML = html;
            }
            else
                console.error("Main element not found");
        })
            .catch(err => {
            console.error(`[ERROR] Error loading page: ${err}`);
        });
    }
}
//# sourceMappingURL=router.js.map