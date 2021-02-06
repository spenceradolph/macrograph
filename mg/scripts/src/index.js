#!/usr/bin/env node
//@ts-check
const { Project } = require("ts-morph");
const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const ts = require("gulp-typescript");

var Transform = require("stream").Transform;

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const pkgJson = require(resolveApp("package.json"));
const packageName = pkgJson.displayName;

const transform = () => {
  // Monkey patch Transform or create your own subclass,
  // implementing `_transform()` and optionally `_flush()`
  var transformStream = new Transform({ objectMode: true });
  /**
   * @param {Buffer|string|any} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object): void=} callback - Call this function (optionally with an
   *          error argument and data) when you are done processing the supplied chunk.
   */
  transformStream._transform = async function (file, encoding, callback) {
    const project = new Project();
    const text = typeof file === "string" ? file : file.contents.toString();
    const astFile = project.createSourceFile("test.ts", text);
    

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
      const [callExpression] = astFile
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

    file.contents = Buffer.from(project.getSourceFile("test.ts").getFullText());

    callback(null, file);
  };

  return transformStream;
};

const tsProject = ts.createProject("tsconfig.json");

gulp.src(["src/**/*", "!src/**/*.ts"]).pipe(gulp.dest("out"));
gulp.src("src/**/*.ts").pipe(transform()).pipe(tsProject()).pipe(gulp.dest("out"));
