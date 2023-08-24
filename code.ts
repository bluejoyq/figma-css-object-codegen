type CSS ={
  [key: string]: string;
}
const kebabToCamelCase = (str: string): string => str.replace(/-([a-z])/g, (_match, char) => char.toUpperCase());
const addQuotesIfNeeded = (value: string): string => {
  return isNaN(parseFloat(value)) || !isFinite(value as any) ? `"${value}"` : value;
};
const cssObjectToCssString = (cssObject:CSS): string => {
  let result = '{\n';

  for (const property of Object.keys(cssObject)) {
    const value = cssObject[property];
    const camelCaseProperty = kebabToCamelCase(property);
    const quotedValue = addQuotesIfNeeded(value);
    result += `\t${camelCaseProperty}: ${quotedValue},\n`;
  }

  return result + '\n}';
};

const genCssStr = async (node : SceneNode ) : Promise<string> => {
  const css = await node.getCSSAsync();
  return cssObjectToCssString(css);
}

figma.codegen.on('generate', async (e : CodegenEvent) => {
  const node = e.node;

  const parentCss = await genCssStr(node);

  return  [{
    title: 'css object',
    code: parentCss,
    language: 'JAVASCRIPT'
  }];
});