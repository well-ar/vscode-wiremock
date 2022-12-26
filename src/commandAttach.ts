import * as vscode from 'vscode';
import { WireMockInstance } from './WiremockInstance';
import { configureFileWatcher } from './configureFileWatcher';

export async function commandAttach() {
    const wireMockInstance = WireMockInstance.getInstance();
    
    if(!await loadParams(wireMockInstance)) {
        return;
    }

    wireMockInstance.outputChannel.clear();

    const msg = "WireMock attached on port: " + wireMockInstance.port;
    wireMockInstance.outputChannel.appendLine(msg);
    vscode.window.showInformationMessage(msg);

    configureFileWatcher();
}

async function loadParams(wireMockInstance: WireMockInstance): Promise<boolean> {
    let wireMockRootDir = await vscode.window.showOpenDialog({
        title: "Sets the root directory, under which mappings and __files reside.",
        defaultUri: wireMockInstance.rootDir,
        canSelectFiles: false,
        canSelectFolders: true,
    });

    if(!wireMockRootDir?.length) {
        return false;
    }

    let wireMockPort = await vscode.window.showInputBox({
        title: "Set the HTTP port number (default: 8080). Use 0 to dynamically determine a port.",
        value: wireMockInstance.port.toString(),
    });

    if(!wireMockPort) {
        return false;
    }

    wireMockInstance.rootDir = wireMockRootDir[0];
    wireMockInstance.port = wireMockPort ? parseInt(wireMockPort) : wireMockInstance.port;

    return true;
}