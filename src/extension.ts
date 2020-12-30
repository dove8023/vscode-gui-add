import { workspace, commands, ExtensionContext, window, Uri } from 'vscode';
import { createFile } from './file-helper';
import { invalidFileNames } from './utils';

export function activate(context: ExtensionContext) {

	let disposableModuleCommand = commands.registerCommand('extension.GenerateModule', (resource: Uri) => {

		if (workspace === undefined) {
			return window.showErrorMessage('Please select a workspace first');
		}


		window.showInputBox({
			placeHolder: "Please enter component name",
		})
			.then<any>((input) => {


				let s = window.showQuickPick(["a", "b", "c"])
				console.log(s)

				if (input === undefined) { return; }


				if (invalidFileNames.test(input)) {
					return window.showErrorMessage('Invalid filename');
				}
				console.log('resource: ', resource)
				return createFile({
					name: input,
					uri: resource,
					fullName: input.toLowerCase() + `.vue`
				});
			});
	});



	context.subscriptions.push(
		disposableModuleCommand,
	);
}

export function deactivate() { }
