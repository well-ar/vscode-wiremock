import * as vscode from 'vscode';
import { commandStart } from './commandStart';
import { commandReset } from './commandReset';
import { commandShutdown } from './commandShutdown';
import { WireMockInstance } from './WiremockInstance';

export function activate(context: vscode.ExtensionContext) {
	const wireMockInstance = WireMockInstance.getInstance(context);
    wireMockInstance.extensionContext = context;

	const commands = [
		vscode.commands.registerCommand('vscode-wiremock.start', commandStart),
		vscode.commands.registerCommand('vscode-wiremock.reset', commandReset),
		vscode.commands.registerCommand('vscode-wiremock.shutdown', commandShutdown),
	];
	
    commands.forEach(command => context.subscriptions.push(command));
}

// This method is called when your extension is deactivated
export function deactivate() {
	commandShutdown();
}
