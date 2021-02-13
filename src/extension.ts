import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {

  const document = vscode.window.activeTextEditor?.document;

  const numberLines = document?.lineCount;
  
  const palette = [
    vscode.window.createTextEditorDecorationType({
      color: "#118AB2",
    }),
    vscode.window.createTextEditorDecorationType({
      color: "#2A9D8F",
    }),
    vscode.window.createTextEditorDecorationType({
      color: "#E9C46A",
    }),
    vscode.window.createTextEditorDecorationType({
      color: "#F4A261",
    }),
    vscode.window.createTextEditorDecorationType({
      color: "#E76F51",
    }),
    vscode.window.createTextEditorDecorationType({
      color: "#EF476F",
    }),
    vscode.window.createTextEditorDecorationType({
      color: "#FFD166",
    }),
  ];

  if (!numberLines) {
    console.error("there is no content");
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
    let matchesForFields = regExp.exec(
      document?.lineAt(linesWithInsert[0]).text
    );

    if (matchesForFields) {
      const fieldsWithoutBackQuote = matchesForFields[1]
        .replace(/`/g, "")
        .replace(/ /g, "");
      const fieldsInOneArray = fieldsWithoutBackQuote.split(",");

      const rangeArrayForColoring: vscode.Range[][] = [];
      for (var i = 0; i < fieldsInOneArray.length; i++) {
        rangeArrayForColoring.push([
          getRangeForWordInLine(
            document?.lineAt(linesWithInsert[0]).text,
            fieldsInOneArray[i],
            linesWithInsert[0],
            0
          ),
        ]);
      }

      for (
        let currentLine = linesWithInsert[0] + 1;
        currentLine < numberLines;
        currentLine++
      ) {
        let matchesForValue = regExp.exec(document?.lineAt(currentLine).text);

        if (matchesForValue) {
          const valuesWithoutDoubleQuote = matchesForValue[1].replace(/ /g, "");

          const valuesInOneArray = valuesWithoutDoubleQuote.split(",");
          let previousPositionWord = 0;
          valuesInOneArray.forEach((elem, index) => {
            const rangeForWord = getRangeForWordInLine(
              document?.lineAt(currentLine).text,
              elem,
              currentLine,
              previousPositionWord
            );
            previousPositionWord = rangeForWord.end.character;
            rangeArrayForColoring[index].push(rangeForWord);

            if (valuesInOneArray.length !== fieldsInOneArray.length) {
              console.error(
                "There is a mismatch between the number of fields to insert and the number of values sent"
              );
            }
          });
        } else {
          console.error("THere is not value after the insert");
        }

        rangeArrayForColoring.forEach((elem, index) => {
          vscode.window.activeTextEditor?.setDecorations(
            palette[index],
            rangeArrayForColoring[index]
          );
        });
      }
    } else {
      console.error("no values in the insert");
    }
  }
}

function getRangeForWordInLine(
  textAtLine: string,
  word: string,
  line: number,
  previousPositionWord: number
): vscode.Range {
  const startPositionWord = textAtLine.indexOf(word, previousPositionWord);
  const endPositionWord = startPositionWord + word.length;
  const rangeForWord = new vscode.Range(
    new vscode.Position(line, startPositionWord),
    new vscode.Position(line, endPositionWord)
  );
  return rangeForWord;
}
