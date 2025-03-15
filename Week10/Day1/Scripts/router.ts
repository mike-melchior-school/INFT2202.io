"use strict";

import {loadHeader} from "./header";

type RouteMap = {[key:string]: string};

export class Router {

    private routes: RouteMap;

    constructor(routes: RouteMap) {
        this.routes = routes;
        this.init();
    }

    init() {

        window.addEventListener("DOMContentLoaded", () => {
            const path = location.hash.slice(1) || "/";
            console.log(`[INFO] initial page load: ${path}`);
            this.loadRoute(path);
        })

        window.addEventListener("hashchange", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`);
            this.loadRoute(location.hash.slice(1));
        });

        window.addEventListener("popstate", () => {
            console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`)
            this.loadRoute(location.hash.slice(1));
        })
    }

    navigate(path:string) {
        location.hash = path;
        this.loadRoute(path);
    }

    loadRoute(path: string) {
        console.log(`[INFO] Loading route: ${path}`);

        let basePath = path.split("#")[0];

        console.log(basePath, ": base path");

        if (!this.routes[path]) {
            console.error(`[WARN] Route not found ${basePath}, redirecting to 404`);
            location.hash = "/404";
            path = "/404";
        }

        fetch(this.routes[basePath])
            .then(res => {
                if (!res.ok) throw new Error(`[INFO] Failed to load ${this.routes[basePath]}`);
                return res.text();
            })
            .then(html => {
                const mainElement = document.createElement("main");
                if (mainElement) mainElement.innerHTML = html;
                else console.error("Main element not found");

                loadHeader().then(() => {
                    // Dispatch a custom event to notify that a new route have been loaded.
                    document.dispatchEvent(new CustomEvent("routeLoaded", {detail: basePath}));
                })
            })
            .catch(err => {
                console.error(`[ERROR] Error loading page: ${err}`);
            })


    }

}