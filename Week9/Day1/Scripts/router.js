"use strict";

import {loadHeader} from "./header";

export class Router {
    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        console.log(`[INFO] Navigating to: ${location.hash.slice(1)}`)
        this.loadRoute(location.hash.slice(1));
    }

    navigate(path) {
        location.hash = path;
    }

    loadRoute(path) {
        console.log(`[INFO] Loading route: ${path}`);

        const basePath = path.split("#")[0];

        if (!this.routes[path]) {
            console.error(`[WARN] Route not found ${basePath}, redirecting to 404`);
            location.hash = "/404";
            path = "/404";
        }

        fetch(this.routes(basePath))
            .then(res => {
                if (!res.ok) throw new Error(`[INFO] Failed to load ${this.routes(basePath)}`);
                return res.text();
            })
            .then(html => {
                document.querySelector("main").innerHTML = html;

                loadHeader().then(() => {
                    //todo
                })
            })
            .catch(err => {
                console.error(`[ERROR] Error loading page: ${err}`);
            })


    }

}