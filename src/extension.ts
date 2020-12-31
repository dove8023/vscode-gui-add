import { workspace, commands, ExtensionContext, window, Uri } from 'vscode';
import { createFile } from './file-helper';
import { invalidFileNames } from './utils';

export function activate(context: ExtensionContext) {

	let disposableModuleCommand = commands.registerCommand('extension.createTemplate', async (resource: Uri) => {

		if (workspace === undefined) {
			return window.showErrorMessage('Please select a workspace first');
		}

		let selectTemplate = await window.showQuickPick(["basicTable2", "drawerForm"])
		console.log(selectTemplate, resource)

		if (!selectTemplate) {
			return;
		}

		return createFile({
			name: selectTemplate,
			uri: resource,
			fullName: selectTemplate.toLowerCase() + `.vue`
		});

		// window.showInputBox({
		// 	placeHolder: "Please enter component name",
		// })
		// 	.then<any>((input) => {



		// 		if (input === undefined) { return; }


		// 	if (invalidFileNames.test(input)) {
		// 		return window.showErrorMessage('Invalid filename');
		// 	}
		// 	console.log('resource: ', resource)
		// 	return createFile({
		// 		name: input,
		// 		uri: resource,
		// 		fullName: input.toLowerCase() + `.vue`
		// 	});
		// });
	});



	context.subscriptions.push(
		disposableModuleCommand,
	);
}

export function deactivate() { }
