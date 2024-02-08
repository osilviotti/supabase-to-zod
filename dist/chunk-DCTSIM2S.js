// src/lib/transform-types.ts
import ts2 from "typescript";
import { z } from "zod";

// src/lib/get-node-name.ts
import ts from "typescript";
var getNodeName = (n) => {
  let name;
  n.forEachChild((n2) => {
    if (ts.isIdentifier(n2)) {
      name = n2.text;
    }
  });
  if (!name)
    throw new Error("Cannot get name of node");
  return name;
};

// src/lib/transform-types.ts
var enumFormatterSchema = z.function().args(z.string()).returns(z.string());
var functionFormatterSchema = z.function().args(z.string(), z.string()).returns(z.string());
var tableOrViewFormatterSchema = z.function().args(z.string(), z.string()).returns(z.string());
var transformTypesOptionsSchema = z.object({
  sourceText: z.string(),
  schema: z.string().default("public"),
  enumFormatter: enumFormatterSchema.default(() => (name) => name),
  functionFormatter: functionFormatterSchema.default(
    () => (name, type) => `${name}${type}`
  ),
  tableOrViewFormatter: tableOrViewFormatterSchema.default(
    () => (name, operation) => `${name}${operation}`
  )
});
var transformTypes = z.function().args(transformTypesOptionsSchema).returns(z.string()).implement((opts) => {
  const { schema, tableOrViewFormatter, enumFormatter, functionFormatter } = opts;
  const sourceFile = ts2.createSourceFile(
    "index.ts",
    opts.sourceText,
    ts2.ScriptTarget.Latest
  );
  const typeStrings = [];
  const enumNames = [];
  sourceFile.forEachChild((n) => {
    const processDatabase = (n2) => {
      if (ts2.isPropertySignature(n2)) {
        const schemaName = getNodeName(n2);
        if (schemaName === schema) {
          n2.forEachChild((n3) => {
            if (ts2.isTypeLiteralNode(n3)) {
              n3.forEachChild((n4) => {
                if (ts2.isPropertySignature(n4) && ts2.isIdentifier(n4.name)) {
                  if (["Tables", "Views"].includes(n4.name.text)) {
                    n4.forEachChild((n5) => {
                      if (ts2.isTypeLiteralNode(n5)) {
                        n5.forEachChild((n6) => {
                          if (ts2.isPropertySignature(n6)) {
                            const tableOrViewName = getNodeName(n6);
                            n6.forEachChild((n7) => {
                              if (ts2.isTypeLiteralNode(n7)) {
                                n7.forEachChild((n8) => {
                                  if (ts2.isPropertySignature(n8)) {
                                    const operation = getNodeName(n8);
                                    if (operation) {
                                      n8.forEachChild((n9) => {
                                        if (ts2.isTypeLiteralNode(n9)) {
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
                      if (ts2.isTypeLiteralNode(n5)) {
                        n5.forEachChild((n6) => {
                          const enumName = getNodeName(n6);
                          if (ts2.isPropertySignature(n6)) {
                            n6.forEachChild((n7) => {
                              if (ts2.isUnionTypeNode(n7)) {
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
                      if (ts2.isTypeLiteralNode(n5)) {
                        n5.forEachChild((n6) => {
                          if (ts2.isPropertySignature(n6)) {
                            const functionName = getNodeName(n6);
                            n6.forEachChild((n7) => {
                              if (ts2.isTypeLiteralNode(n7)) {
                                n7.forEachChild((n8) => {
                                  if (ts2.isPropertySignature(n8)) {
                                    const argType = getNodeName(n8);
                                    n8.forEachChild((n9) => {
                                      if (ts2.isTypeReferenceNode(n9)) {
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
    if (ts2.isTypeAliasDeclaration(n) && ts2.isTypeLiteralNode(n.type) && n.name.text === "Database") {
      n.type.members.forEach(processDatabase);
    } else if (ts2.isInterfaceDeclaration(n) && n.name.text === "Database") {
      n.forEachChild(processDatabase);
    }
    if (ts2.isTypeAliasDeclaration(n) && n.name.text === "Json") {
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

// src/lib/get-import-path.ts
import slash from "slash";
import { parse, relative } from "path";
function getImportPath(from, to) {
  const relativePath = slash(relative(from, to).slice(1));
  const { dir, name } = parse(relativePath);
  return `${dir}/${name}`;
}

// src/supabase-to-zod.ts
import { generate } from "ts-to-zod";
import fs from "node:fs/promises";
import { join } from "node:path";
import prettier from "prettier";
import { z as z2 } from "zod";
var simplifiedJSDocTagSchema = z2.object({
  name: z2.string(),
  value: z2.string().optional()
});
var getSchemaNameSchema = z2.function().args(z2.string()).returns(z2.string());
var nameFilterSchema = z2.function().args(z2.string()).returns(z2.boolean());
var jSDocTagFilterSchema = z2.function().args(z2.array(simplifiedJSDocTagSchema)).returns(z2.boolean());
var supabaseToZodOptionsSchema = transformTypesOptionsSchema.omit({ sourceText: true }).extend({
  input: z2.string(),
  output: z2.string(),
  skipValidation: z2.boolean().optional(),
  maxRun: z2.number().optional(),
  nameFilter: nameFilterSchema.optional(),
  jsDocTagFilter: jSDocTagFilterSchema.optional(),
  getSchemaName: getSchemaNameSchema.optional(),
  keepComments: z2.boolean().optional().default(false),
  skipParseJSDoc: z2.boolean().optional().default(false)
});
async function supabaseToZod(opts) {
  const inputPath = join(process.cwd(), opts.input);
  const outputPath = join(process.cwd(), opts.output);
  const sourceText = await fs.readFile(inputPath, "utf-8");
  const parsedTypes = transformTypes({ sourceText, ...opts });
  const { getZodSchemasFile } = generate({
    sourceText: parsedTypes,
    ...opts
  });
  const zodSchemasFile = getZodSchemasFile(
    getImportPath(outputPath, inputPath)
  );
  const prettierConfig = await prettier.resolveConfig(process.cwd());
  await fs.writeFile(
    outputPath,
    await prettier.format(zodSchemasFile, {
      parser: "babel-ts",
      ...prettierConfig
    })
  );
}

export {
  transformTypes,
  supabaseToZodOptionsSchema,
  supabaseToZod
};
//# sourceMappingURL=chunk-DCTSIM2S.js.map