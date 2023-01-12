import * as vscode from 'vscode';
import { WireMockInstance } from "./WiremockInstance";

export async function loadParams(promptDir: boolean = true, promptAddress: boolean = true): Promise<boolean> {
    const wireMockInstance = WireMockInstance.getInstance();

    if(wireMockInstance.started) {
        return true;
    }

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

    if(promptAddress) {
        let wiremockAddress = await vscode.window.showInputBox({
            title: "Set wiremock address",
            value: wireMockInstance.address.toString(),
        });

        if(!wiremockAddress) {
            return false;
        }
        
        wireMockInstance.address = vscode.Uri.parse(wiremockAddress, true);
    }

    return true;
}