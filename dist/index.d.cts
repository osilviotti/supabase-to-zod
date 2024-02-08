import { z } from 'zod';

declare const supabaseToZodOptionsSchema: z.ZodObject<{
    schema: z.ZodDefault<z.ZodString>;
    enumFormatter: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodString>>;
    functionFormatter: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodString], z.ZodUnknown>, z.ZodString>>;
    tableOrViewFormatter: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodString], z.ZodUnknown>, z.ZodString>>;
    input: z.ZodString;
    output: z.ZodString;
    skipValidation: z.ZodOptional<z.ZodBoolean>;
    maxRun: z.ZodOptional<z.ZodNumber>;
    nameFilter: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodBoolean>>;
    jsDocTagFilter: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        value: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        value?: string | undefined;
    }, {
        name: string;
        value?: string | undefined;
    }>, "many">], z.ZodUnknown>, z.ZodBoolean>>;
    getSchemaName: z.ZodOptional<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodString>>;
    keepComments: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    skipParseJSDoc: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    schema: string;
    enumFormatter: (args_0: string, ...args_1: unknown[]) => string;
    functionFormatter: (args_0: string, args_1: string, ...args_2: unknown[]) => string;
    tableOrViewFormatter: (args_0: string, args_1: string, ...args_2: unknown[]) => string;
    input: string;
    output: string;
    keepComments: boolean;
    skipParseJSDoc: boolean;
    skipValidation?: boolean | undefined;
    maxRun?: number | undefined;
    nameFilter?: ((args_0: string, ...args_1: unknown[]) => boolean) | undefined;
    jsDocTagFilter?: ((args_0: {
        name: string;
        value?: string | undefined;
    }[], ...args_1: unknown[]) => boolean) | undefined;
    getSchemaName?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
}, {
    input: string;
    output: string;
    schema?: string | undefined;
    enumFormatter?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
    functionFormatter?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
    tableOrViewFormatter?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
    skipValidation?: boolean | undefined;
    maxRun?: number | undefined;
    nameFilter?: ((args_0: string, ...args_1: unknown[]) => boolean) | undefined;
    jsDocTagFilter?: ((args_0: {
        name: string;
        value?: string | undefined;
    }[], ...args_1: unknown[]) => boolean) | undefined;
    getSchemaName?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
    keepComments?: boolean | undefined;
    skipParseJSDoc?: boolean | undefined;
}>;
type SupabaseToZodOptions = z.infer<typeof supabaseToZodOptionsSchema>;
declare function supabaseToZod(opts: SupabaseToZodOptions): Promise<void>;

declare const transformTypesOptionsSchema: z.ZodObject<{
    sourceText: z.ZodString;
    schema: z.ZodDefault<z.ZodString>;
    enumFormatter: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString], z.ZodUnknown>, z.ZodString>>;
    functionFormatter: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodString], z.ZodUnknown>, z.ZodString>>;
    tableOrViewFormatter: z.ZodDefault<z.ZodFunction<z.ZodTuple<[z.ZodString, z.ZodString], z.ZodUnknown>, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    sourceText: string;
    schema: string;
    enumFormatter: (args_0: string, ...args_1: unknown[]) => string;
    functionFormatter: (args_0: string, args_1: string, ...args_2: unknown[]) => string;
    tableOrViewFormatter: (args_0: string, args_1: string, ...args_2: unknown[]) => string;
}, {
    sourceText: string;
    schema?: string | undefined;
    enumFormatter?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
    functionFormatter?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
    tableOrViewFormatter?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
}>;
type TransformTypesOptions = z.infer<typeof transformTypesOptionsSchema>;
declare const transformTypes: (args_0: {
    sourceText: string;
    schema?: string | undefined;
    enumFormatter?: ((args_0: string, ...args_1: unknown[]) => string) | undefined;
    functionFormatter?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
    tableOrViewFormatter?: ((args_0: string, args_1: string, ...args_2: unknown[]) => string) | undefined;
}, ...args_1: unknown[]) => string;

export { type TransformTypesOptions, supabaseToZod as default, transformTypes };
