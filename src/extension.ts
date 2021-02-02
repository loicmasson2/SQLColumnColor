// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { close } from "fs";
import * as vscode from "vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "sqlcolorcolumn" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('sqlcolorcolumn.helloWorld', () => {
  // The code you place here will be executed every time your command is executed
  const document = vscode.window.activeTextEditor?.document;
  const numberLines = document?.lineCount;
  const test = vscode.window.createTextEditorDecorationType({
    backgroundColor: "red",
  });
  vscode.window.activeTextEditor?.setDecorations(test, [
    new vscode.Range(new vscode.Position(11, 0), new vscode.Position(11, 10)),
  ]);
  // let text =  vscode.window.activeTextEditor?.document.getText();
  if (!numberLines) {
    console.log("there is no content");
  }

  let linesWithInsert = [];

  if (document && numberLines) {
    for (let index = 0; index < numberLines; index++) {
      if (
        document.getWordRangeAtPosition(
          new vscode.Position(index, 0),
          /(INSERT)/gm
        )
      ) {
        linesWithInsert.push(index);
      }
    }

    let regExp = /\(([^)]+)\)/;
	let matches = regExp.exec(document?.lineAt(25).text);
	const fieldsInOneString = matches[1].replace(/`/g, "").replace(/ /g, "");
	const fields = fieldsInOneString.split(",");

    //matches[1] contains the value between the parentheses
    console.log(fields);
  }

  // console.log(vscode.window.activeTextEditor?.document.getWordRangeAtPosition(new vscode.Position(25,0), /(INSERT)/gm));

  // });

  // context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
