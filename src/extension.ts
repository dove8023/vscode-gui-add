import { workspace, commands, ExtensionContext, window, Uri } from 'vscode';
import { createFile } from './file-helper';
import { invalidFileNames } from './utils';
import { basename } from 'path';

export function activate(context: ExtensionContext) {

	let disposableModuleCommand = commands.registerCommand('extension.GenerateModule', (resource: Uri) => {

		if (workspace === undefined) {
			return window.showErrorMessage('Please select a workspace first');
		} else {
			return window.showInputBox({
				placeHolder: "Please enter module name",
			})
				.then<any>((input) => {
					if (input === undefined) { return; }

					if (invalidFileNames.test(input)) {
						return window.showErrorMessage('Invalid filename');
					}
					console.log('resource: ', resource)
					return createFile({
						name: input,
						type: 'module',
						associatedArray: 'imports',
						uri: resource,
						fullName: input.toLowerCase() + `.module.ts`
					});
				});
		}
	});



	context.subscriptions.push(
		disposableModuleCommand,
	);
}

export function deactivate() { }
