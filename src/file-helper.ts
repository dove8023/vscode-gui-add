import { window, Uri, workspace, FileType } from 'vscode';
import { render } from 'mustache';
import * as fs from 'fs-extra';
import { join, basename } from 'path';
import { TextEncoder, TextDecoder } from 'util';
import { getPascalCase, getRelativePathForImport, getClassName, getCamelCase } from './utils';
interface ComponentFile {
    name: string;
    fullName: string;
    uri: Uri;
}

export async function createFile(file: ComponentFile) {

    if (fs.existsSync(join(file.uri.fsPath, file.name.toLowerCase() + `.vue`))) {
        return window.showErrorMessage('A file already exists with the same name.');
    }

    const stats = await workspace.fs.stat(file.uri);

    if (stats.type === FileType.Directory) {
        file.uri = Uri.parse(file.uri.path + '/' + file.fullName);
    } else {
        file.uri = Uri.parse(file.uri.path.replace(basename(file.uri.path), '') + '/' + file.fullName);
    }

    return getFileTemplate(file)
        .then((data) => {
            return workspace.fs.writeFile(file.uri, new TextEncoder().encode(data));
        })
        .then(() => {
            return true;
        })
        .catch(err => {
            return window.showErrorMessage('错误：模板未找到');
        });
}


export async function getFileTemplate(file): Promise<string> {
    return fs.readFile(join(__dirname, `/templates/${file.name}.mustache`), 'utf8')
        .then((data) => {
            const name = getClassName(file.name);
            const type = getPascalCase(basename(file.uri.path).split('.')[1]);
            let view = {
                Name: name,
                Type: type,
                VarName: getCamelCase(name) + type
            };
            return render(data, view);
        });
}