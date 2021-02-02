#!/usr/bin/env node
//@ts-check
const { Project } = require("ts-morph");
const path = require("path");
const fs = require("fs");
const gulp = require("gulp");

insertPackageNameInNodes();

async function insertPackageNameInNodes() {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

  const pkgJson = require(resolveApp("package.json"));
  const packageName = pkgJson.displayName;

  if (packageName === undefined)
    throw new Error("Package name not specified in package.json");

  const project = new Project({
    tsConfigFilePath: resolveApp("tsconfig.json"),
  });

  const files = project.addSourceFilesFromTsConfig(resolveApp("tsconfig.json"));

  files.forEach((file) => {
    const text = file.getFullText();

    const regex = /@Node/gm;
    let m;

    /** @type {import("ts-morph").ObjectLiteralExpression[]} */
    const argNodes = [];

    while ((m = regex.exec(text)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      /** @type{[import("ts-morph").CallExpression]} */
      // @ts-ignore
      const [callExpression] = file
        .getDescendantAtPos(m.index)
        .getNextSiblings();

      // @ts-ignore
      argNodes.push(callExpression.getArguments()[0]);
    }

    argNodes.forEach((args) => {
      args.addPropertyAssignment({
        name: "pkg",
        initializer: `"${packageName}"`,
      });
    });
  });

  await project.emit();
}

gulp.src("src/**/!(*.{js,ts})").pipe(gulp.dest("out"));
