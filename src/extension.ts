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
  const palette = [
    vscode.window.createTextEditorDecorationType({
      backgroundColor: "#605B56",
    }),
    vscode.window.createTextEditorDecorationType({
      backgroundColor: "#837A75",
    }),
    vscode.window.createTextEditorDecorationType({
      backgroundColor: "#DAFEB7",
    }),
    vscode.window.createTextEditorDecorationType({
      backgroundColor: "#F2FBE0",
    }),
    vscode.window.createTextEditorDecorationType({
      backgroundColor: "#241023",
    }),
    vscode.window.createTextEditorDecorationType({
      backgroundColor: "#6B0504",
    }),
    vscode.window.createTextEditorDecorationType({
      backgroundColor: "#ACC18A",
    }),
  ];

  if (!numberLines) {
    console.error("there is no content");
  }

  let linesWithInsert = [];

  if (document && numberLines) {
    // ** FIND INSET IN DOCUMENT
    // ? can be changed by vanilla JS getting the entire text and then get which line it is
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
    let matchesForFields = regExp.exec(
      document?.lineAt(linesWithInsert[0]).text
    );
    console.log("COUCOUCOU");

    if (matchesForFields) {
      const fieldsWithoutBackQuote = matchesForFields[1]
        .replace(/`/g, "")
        .replace(/ /g, "");
      const fieldsInOneArray = fieldsWithoutBackQuote.split(",");

      // const rangeFieldOne = getRangeForWordInLine(document?.lineAt(linesWithInsert[0]).text, fieldsInOneArray[0], currentLine);
      // const rangeFieldTwo = getRangeForWordInLine(document?.lineAt(linesWithInsert[0]).text, fieldsInOneArray[1], currentLine);
      // const rangeFieldThird = getRangeForWordInLine(document?.lineAt(linesWithInsert[0]).text, fieldsInOneArray[2], currentLine);
      // const rangeFieldFour = getRangeForWordInLine(document?.lineAt(linesWithInsert[0]).text, fieldsInOneArray[3], currentLine);
      // const rangeFieldFive = getRangeForWordInLine(document?.lineAt(linesWithInsert[0]).text, fieldsInOneArray[4], currentLine);
      // const rangeFieldSix = getRangeForWordInLine(document?.lineAt(linesWithInsert[0]).text, fieldsInOneArray[5], currentLine);
      // const rangeFieldSeven = getRangeForWordInLine(document?.lineAt(linesWithInsert[0]).text, fieldsInOneArray[6], currentLine);

      const rangeArrayForColoring: vscode.Range[][] = [];
      for (var i = 0; i < fieldsInOneArray.length; i++) {
        rangeArrayForColoring.push([
          getRangeForWordInLine(
            document?.lineAt(linesWithInsert[0]).text,
            fieldsInOneArray[i],
            linesWithInsert[0]
          ),
        ]);
      }

      for (
        let currentLine = linesWithInsert[0] + 1;
        currentLine < numberLines;
        currentLine++
      ) {
        let matchesForValue = regExp.exec(
          document?.lineAt(currentLine).text
        );

        if (matchesForValue) {
          const valuesWithoutDoubleQuote = matchesForValue[1].replace(/ /g, "");

          const valuesInOneArray = valuesWithoutDoubleQuote.split(",");
          valuesInOneArray.forEach((elem, index) => {
            const rangeForWord = getRangeForWordInLine(
              document?.lineAt(currentLine).text,
              elem,
              currentLine
            );
            console.log(rangeForWord);
            rangeArrayForColoring[index].push(rangeForWord);
            
  
            if (valuesInOneArray.length !== fieldsInOneArray.length) {
              console.error(
                "There is a mismatch between the number of fields to insert and the number of values sent"
              );
            }
          })
          
        } else {
          console.error("THere is not value after the insert");
        }

        rangeArrayForColoring.forEach((elem,index) => {
          vscode.window.activeTextEditor?.setDecorations(
            palette[index],
            rangeArrayForColoring[index]
          );
        })
       
      }
    } else {
      console.error("no values in the insert");
    }
  }

  // console.log(vscode.window.activeTextEditor?.document.getWordRangeAtPosition(new vscode.Position(25,0), /(INSERT)/gm));

  // });

  // context.subscriptions.push(disposable);
}

// * DONT FORGET TO MAKE THIS FUNCTION WORK IF THERE IS SEVERAL INSTANCE OF THE SAME WORD IN THE SAME LINE
function getPositionStartEndWord(textAtLine: string, word: string) {
  return textAtLine.indexOf(word);
}

function getRangeForWordInLine(
  textAtLine: string,
  word: string,
  line: number
): vscode.Range {
  const startPositionWord = getPositionStartEndWord(textAtLine, word);
  const endPositionWord = startPositionWord + word.length;
  console.log(`start ${startPositionWord}`);
  console.log(`end ${endPositionWord}`);

  const rangeForWord = new vscode.Range(
    new vscode.Position(line, startPositionWord),
    new vscode.Position(line, endPositionWord)
  );
  return rangeForWord;
}

// this method is called when your extension is deactivated
export function deactivate() {}
