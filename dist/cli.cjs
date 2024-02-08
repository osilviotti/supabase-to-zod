#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/.pnpm/tsup@8.0.1_ts-node@10.9.2_typescript@5.3.3/node_modules/tsup/assets/cjs_shims.js
var getImportMetaUrl = () => typeof document === "undefined" ? new URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
var importMetaUrl = /* @__PURE__ */ getImportMetaUrl();

// src/cli.ts
var import_commander = require("commander");
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path2 = require("path");

// src/supabase-to-zod.ts
var import_ts_to_zod = require("ts-to-zod");
var import_promises = __toESM(require("fs/promises"), 1);
var import_node_path = require("path");
var import_prettier = __toESM(require("prettier"), 1);
var import_zod2 = require("zod");

// src/lib/get-import-path.ts
var import_slash = __toESM(require("slash"), 1);
var import_path = require("path");
function getImportPath(from, to) {
  const relativePath = (0, import_slash.default)((0, import_path.relative)(from, to).slice(1));
  const { dir, name } = (0, import_path.parse)(relativePath);
  return `${dir}/${name}`;
}

// src/lib/transform-types.ts
var import_typescript2 = __toESM(require("typescript"), 1);
var import_zod = require("zod");

// src/lib/get-node-name.ts
var import_typescript = __toESM(require("typescript"), 1);
var getNodeName = (n) => {
  let name;
  n.forEachChild((n2) => {
    if (import_typescript.default.isIdentifier(n2)) {
      name = n2.text;
    }
  });
  if (!name)
    throw new Error("Cannot get name of node");
  return name;
};

// src/lib/transform-types.ts
var enumFormatterSchema = import_zod.z.function().args(import_zod.z.string()).returns(import_zod.z.string());
var functionFormatterSchema = import_zod.z.function().args(import_zod.z.string(), import_zod.z.string()).returns(import_zod.z.string());
var tableOrViewFormatterSchema = import_zod.z.function().args(import_zod.z.string(), import_zod.z.string()).returns(import_zod.z.string());
var transformTypesOptionsSchema = import_zod.z.object({
  sourceText: import_zod.z.string(),
  schema: import_zod.z.string().default("public"),
  enumFormatter: enumFormatterSchema.default(() => (name) => name),
  functionFormatter: functionFormatterSchema.default(
    () => (name, type) => `${name}${type}`
  ),
  tableOrViewFormatter: tableOrViewFormatterSchema.default(
    () => (name, operation) => `${name}${operation}`
  )
});
var transformTypes = import_zod.z.function().args(transformTypesOptionsSchema).returns(import_zod.z.string()).implement((opts2) => {
  const { schema, tableOrViewFormatter, enumFormatter, functionFormatter } = opts2;
  const sourceFile = import_typescript2.default.createSourceFile(
    "index.ts",
    opts2.sourceText,
    import_typescript2.default.ScriptTarget.Latest
  );
  const typeStrings = [];
  const enumNames = [];
  sourceFile.forEachChild((n) => {
    const processDatabase = (n2) => {
      if (import_typescript2.default.isPropertySignature(n2)) {
        const schemaName = getNodeName(n2);
        if (schemaName === schema) {
          n2.forEachChild((n3) => {
            if (import_typescript2.default.isTypeLiteralNode(n3)) {
              n3.forEachChild((n4) => {
                if (import_typescript2.default.isPropertySignature(n4) && import_typescript2.default.isIdentifier(n4.name)) {
                  if (["Tables", "Views"].includes(n4.name.text)) {
                    n4.forEachChild((n5) => {
                      if (import_typescript2.default.isTypeLiteralNode(n5)) {
                        n5.forEachChild((n6) => {
                          if (import_typescript2.default.isPropertySignature(n6)) {
                            const tableOrViewName = getNodeName(n6);
                            n6.forEachChild((n7) => {
                              if (import_typescript2.default.isTypeLiteralNode(n7)) {
                                n7.forEachChild((n8) => {
                                  if (import_typescript2.default.isPropertySignature(n8)) {
                                    const operation = getNodeName(n8);
                                    if (operation) {
                                      n8.forEachChild((n9) => {
                                        if (import_typescript2.default.isTypeLiteralNode(n9)) {
                                          typeStrings.push(
                                            `export type ${tableOrViewFormatter(
                                              tableOrViewName,
                                              operation
                                            )} = ${n9.getText(sourceFile)}`
                                          );
                                        }
                                      });
                                    }
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                  if ("Enums" === n4.name.text) {
                    n4.forEachChild((n5) => {
                      if (import_typescript2.default.isTypeLiteralNode(n5)) {
                        n5.forEachChild((n6) => {
                          const enumName = getNodeName(n6);
                          if (import_typescript2.default.isPropertySignature(n6)) {
                            n6.forEachChild((n7) => {
                              if (import_typescript2.default.isUnionTypeNode(n7)) {
                                const formattedName = enumFormatter(enumName);
                                typeStrings.push(
                                  `export type ${formattedName} = ${n7.getText(
                                    sourceFile
                                  )}`
                                );
                                enumNames.push({
                                  formattedName,
                                  name: enumName
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                  if ("Functions" === n4.name.text) {
                    n4.forEachChild((n5) => {
                      if (import_typescript2.default.isTypeLiteralNode(n5)) {
                        n5.forEachChild((n6) => {
                          if (import_typescript2.default.isPropertySignature(n6)) {
                            const functionName = getNodeName(n6);
                            n6.forEachChild((n7) => {
                              if (import_typescript2.default.isTypeLiteralNode(n7)) {
                                n7.forEachChild((n8) => {
                                  if (import_typescript2.default.isPropertySignature(n8)) {
                                    const argType = getNodeName(n8);
                                    n8.forEachChild((n9) => {
                                      if (import_typescript2.default.isTypeReferenceNode(n9)) {
                                        typeStrings.push(
                                          `export type ${functionFormatter(
                                            functionName,
                                            argType
                                          )} = ${n9.getText(sourceFile)}`
                                        );
                                      }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      }
    };
    if (import_typescript2.default.isTypeAliasDeclaration(n) && import_typescript2.default.isTypeLiteralNode(n.type) && n.name.text === "Database") {
      n.type.members.forEach(processDatabase);
    } else if (import_typescript2.default.isInterfaceDeclaration(n) && n.name.text === "Database") {
      n.forEachChild(processDatabase);
    }
    if (import_typescript2.default.isTypeAliasDeclaration(n) && n.name.text === "Json") {
      typeStrings.push(n.getText(sourceFile));
    }
  });
  let parsedTypes = typeStrings.filter((s) => !s.includes("Record<number")).join(";\n");
  for (const { name, formattedName } of enumNames) {
    parsedTypes = parsedTypes.replaceAll(
      `Database["${schema}"]["Enums"]["${name}"]`,
      formattedName
    );
    parsedTypes = parsedTypes.replaceAll(
      `Database['${schema}']['Enums']['${name}']`,
      formattedName
    );
  }
  return parsedTypes;
});

// src/supabase-to-zod.ts
var simplifiedJSDocTagSchema = import_zod2.z.object({
  name: import_zod2.z.string(),
  value: import_zod2.z.string().optional()
});
var getSchemaNameSchema = import_zod2.z.function().args(import_zod2.z.string()).returns(import_zod2.z.string());
var nameFilterSchema = import_zod2.z.function().args(import_zod2.z.string()).returns(import_zod2.z.boolean());
var jSDocTagFilterSchema = import_zod2.z.function().args(import_zod2.z.array(simplifiedJSDocTagSchema)).returns(import_zod2.z.boolean());
var supabaseToZodOptionsSchema = transformTypesOptionsSchema.omit({ sourceText: true }).extend({
  input: import_zod2.z.string(),
  output: import_zod2.z.string(),
  skipValidation: import_zod2.z.boolean().optional(),
  maxRun: import_zod2.z.number().optional(),
  nameFilter: nameFilterSchema.optional(),
  jsDocTagFilter: jSDocTagFilterSchema.optional(),
  getSchemaName: getSchemaNameSchema.optional(),
  keepComments: import_zod2.z.boolean().optional().default(false),
  skipParseJSDoc: import_zod2.z.boolean().optional().default(false)
});
async function supabaseToZod(opts2) {
  const inputPath = (0, import_node_path.join)(process.cwd(), opts2.input);
  const outputPath = (0, import_node_path.join)(process.cwd(), opts2.output);
  const sourceText = await import_promises.default.readFile(inputPath, "utf-8");
  const parsedTypes = transformTypes({ sourceText, ...opts2 });
  const { getZodSchemasFile } = (0, import_ts_to_zod.generate)({
    sourceText: parsedTypes,
    ...opts2
  });
  const zodSchemasFile = getZodSchemasFile(
    getImportPath(outputPath, inputPath)
  );
  const prettierConfig = await import_prettier.default.resolveConfig(process.cwd());
  await import_promises.default.writeFile(
    outputPath,
    await import_prettier.default.format(zodSchemasFile, {
      parser: "babel-ts",
      ...prettierConfig
    })
  );
}

// src/cli.ts
var url = __toESM(require("url"), 1);
var __dirname = url.fileURLToPath(new URL(".", importMetaUrl));
var defaultPackageJsonPath = (0, import_node_path2.join)(__dirname, "package.json");
var packageJsonPath = import_node_fs.default.existsSync(defaultPackageJsonPath) ? defaultPackageJsonPath : (0, import_node_path2.join)(__dirname, "../package.json");
var packageJson = JSON.parse(
  import_node_fs.default.readFileSync(packageJsonPath, {}).toString()
);
import_commander.program.name(packageJson.name).version(packageJson.version).option("-i, --input <input>", "Path to the types generated by supabase cli").option("-o, --output <output>", "Path to the output file").option("-s, --schema [schema]", "Specify schema", "public").parse(process.argv);
var opts = supabaseToZodOptionsSchema.parse(import_commander.program.opts());
void (async () => {
  try {
    await supabaseToZod(opts);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
//# sourceMappingURL=cli.cjs.map