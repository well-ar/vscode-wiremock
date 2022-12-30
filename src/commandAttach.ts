import * as vscode from 'vscode';
import { WireMockInstance } from './WiremockInstance';
import { configureFileWatcher } from './configureFileWatcher';
import { loadParams } from './loadParams';

export async function commandAttach() {
    if(!await loadParams()) {
        return;
    }

    const wireMockInstance = WireMockInstance.getInstance();
    wireMockInstance.outputChannel.clear();

    const msg = "WireMock attached on port: " + wireMockInstance.port;
    wireMockInstance.outputChannel.appendLine(msg);
    vscode.window.showInformationMessage(msg);

    configureFileWatcher();
}
