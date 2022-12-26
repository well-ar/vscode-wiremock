import * as vscode from 'vscode';
import { WireMockInstance } from './WiremockInstance';
import { commandStart } from './commandStart';
import { commandReset } from './commandReset';
import { commandShutdown } from './commandShutdown';
import { commandAttach } from './commandAttach';
import { commandRequestLogs } from './commandRequestLogs';

export function activate(context: vscode.ExtensionContext) {
	const wireMockInstance = WireMockInstance.getInstance(context);
    wireMockInstance.extensionContext = context;

	const commands = [
		vscode.commands.registerCommand('vscode-wiremock.attach', commandAttach),
		vscode.commands.registerCommand('vscode-wiremock.start', commandStart),
		vscode.commands.registerCommand('vscode-wiremock.reset', commandReset),
		vscode.commands.registerCommand('vscode-wiremock.shutdown', commandShutdown),
		vscode.commands.registerCommand('vscode-wiremock.requestLogs', commandRequestLogs),
	];
	
    commands.forEach(command => context.subscriptions.push(command));

	context.subscriptions.push(vscode.workspace.registerFileSystemProvider('wiremock', wireMockInstance.memFs, { isCaseSensitive: true }));
}

// This method is called when your extension is deactivated
export function deactivate() {
	const wireMockInstance = WireMockInstance.getInstance();
	if(wireMockInstance?.fileWatcher) {
        wireMockInstance.fileWatcher.dispose();
	}

    if (wireMockInstance?.started){
		commandShutdown();
	}
}
