import * as vscode from 'vscode';
import { WireMockInstance } from "./WiremockInstance";

export async function loadParams(promptDir: boolean = true, promptHost: boolean = false, promptPort: boolean = true): Promise<boolean> {
    const wireMockInstance = WireMockInstance.getInstance();

    if(promptDir) {
        let wireMockRootDir = await vscode.window.showOpenDialog({
            title: "Sets the root directory, under which mappings and __files reside.",
            defaultUri: wireMockInstance.rootDir,
            canSelectFiles: false,
            canSelectFolders: true,
        });

        if(!wireMockRootDir?.length) {
            return false;
        }

        wireMockInstance.rootDir = wireMockRootDir[0];
    }

    if(promptHost) {
        let wiremockHost = await vscode.window.showInputBox({
            title: "Set wiremock host address",
            value: wireMockInstance.host,
        });

        if(!wiremockHost) {
            return false;
        }
        
        wireMockInstance.host = wiremockHost;
    }

    if(promptPort) {
        let wireMockPort = await vscode.window.showInputBox({
            title: "Set the HTTP port number (default: 8080). Use 0 to dynamically determine a port.",
            value: wireMockInstance.port.toString(),
        });

        if(!wireMockPort) {
            return false;
        }
        
        wireMockInstance.port = wireMockPort ? parseInt(wireMockPort) : wireMockInstance.port;
    }

    return true;
}