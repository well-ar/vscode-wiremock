import * as vscode from 'vscode';
import { commandImportMappings } from './commandImportMappings';
import { configureFileWatcher } from './configureFileWatcher';
import { ExtensionSettingsEnum } from './ExtensionSettingsEnum';
import { MemFS } from './fileSystemProvider';

export class WireMockInstance {
    private static instance: WireMockInstance;

    constructor(context: vscode.ExtensionContext) {
        this._extensionContext = context;

        this.memFs.onDidChangeFile(async (event) => {
            if (event[0].uri.path === "/mappings.json" 
                && event[0].type === vscode.FileChangeType.Changed  
                && this.autoReset
                && !this.loadingMappings) {
                this.outputChannel.appendLine(`Mappings file changed...`);
                await commandImportMappings(false);
                vscode.window.showInformationMessage('WireMock reset');
            }
        });
    }

    public static getInstance(context?: vscode.ExtensionContext): WireMockInstance {
        if (!WireMockInstance.instance && context) {
            WireMockInstance.instance = new WireMockInstance(context);
            WireMockInstance.instance.init();

            vscode.workspace.onDidChangeConfiguration(() => {
                WireMockInstance.instance.init();
            });
        }

        return WireMockInstance.instance;
    }

    private _outputChannel: vscode.OutputChannel = vscode.window.createOutputChannel('WireMock', 'log');
    private _extensionContext: vscode.ExtensionContext;
    private _address: vscode.Uri = vscode.Uri.parse("http://localhost:8080");
    private _autoReset : boolean = true;
    private _started: boolean = false;
    private _rootDir: vscode.Uri = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri : vscode.Uri.parse(process.cwd());
    private _memFs: vscode.FileSystemProvider = new MemFS();
    private _fileWatcher : vscode.FileSystemWatcher | null = null;
    private _loadingMappings: boolean = false;
    
    private _extensionSettingsPrefix: string = "wiremock";

    private init() {
        this.address = this.getConfiguration<vscode.Uri>(ExtensionSettingsEnum.address) || vscode.Uri.parse("http://localhost:8080");;

        let reset = this.getConfiguration<boolean>(ExtensionSettingsEnum.autoReset);
        this.autoReset =  reset === undefined ? true : reset;

        configureFileWatcher();
    }

    public getConfiguration<T>(setting: ExtensionSettingsEnum): T | undefined {
        const config = vscode.workspace.getConfiguration(this._extensionSettingsPrefix);
        return config.get<T>(setting);
    }

    public async setConfiguration<T>(setting: ExtensionSettingsEnum, value: T): Promise<void> {
        const config = vscode.workspace.getConfiguration(this._extensionSettingsPrefix);
        await config.update(setting, value);
    }

    public getApiUrl(api: string): string {
        return this.address.toString().endsWith("/") ? `${this.address.toString()}${api}` : `${this.address.toString()}/${api}`;
    }

    public get loadingMappings(): boolean {
        return this._loadingMappings;
    }
    public set loadingMappings(value: boolean) {
        this._loadingMappings = value;
    }

    public get extensionSettingsPrefix(): string {
        return this._extensionSettingsPrefix;
    }

    public get started(): boolean {
        return this._started;
    }
    public set started(v: boolean) {
        this._started = v;
    }

    public get memFs(): vscode.FileSystemProvider {
        return this._memFs;
    }
    public set memFs(value: vscode.FileSystemProvider) {
        this._memFs = value;
    }

    public get extensionContext(): vscode.ExtensionContext {
        return this._extensionContext;
    }
    public set extensionContext(v: vscode.ExtensionContext) {
        this._extensionContext = v;
    }

    public get outputChannel(): vscode.OutputChannel {
        return this._outputChannel;
    }
    public set outputChannel(v: vscode.OutputChannel) {
        this._outputChannel = v;
    }

    public get address(): vscode.Uri {
        return this._address;
    }
    public set address(v: vscode.Uri) {
        this._address = v;
    }

    public get host(): string {
        return this._address.authority;
    }

    public get port(): number {
        return parseInt(this._address.authority.split(":")[1]);
    }

    public get useHttps(): boolean {
        return this._address.scheme === "https";
    }

    public get autoReset() : boolean {
        return this._autoReset;
    }
    public set autoReset(v : boolean) {
        this._autoReset = v;
    }

    public get rootDir(): vscode.Uri {
        return this._rootDir;
    }
    public set rootDir(v: vscode.Uri) {
        this._rootDir = v;
    }

    public get fileWatcher() : vscode.FileSystemWatcher | null {
        return this._fileWatcher;
    }
    public set fileWatcher(v : vscode.FileSystemWatcher | null) {
        this._fileWatcher = v;
    }

}