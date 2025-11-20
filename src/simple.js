const { htmlTagNames, htmlSpecialTagNames } = require("./html-tag-names");
const { cx } = require("./style");

const renderClass = (className) =>
  Array.isArray(className) ? cx(...className) : className;

const renderAttributes = (attributes) =>
  attributes === undefined
    ? ""
    : ` ${Object.keys(attributes)
        .map(
          (attributeName) =>
            `${attributeName}="${
              attributeName === "class"
                ? renderClass(attributes[attributeName])
                : attributes[attributeName]
            }"`,
        )
        .join(" ")}`;

const renderChildren = (children) => {
  if (!children) {
    return "";
  } else if (Array.isArray(children)) {
    return children.filter(Boolean).join(" ");
  } else {
    return children;
  }
};

const tag = (tagName) => (attributes, children) =>
  `<${tagName}${renderAttributes(attributes)}>${renderChildren(
    children,
  )}</${tagName}>`;

const generateRenderFunctions = (tagNames, namingFunction) =>
  tagNames.reduce(
    (acc, next) => ({
      ...acc,
      [namingFunction === undefined ? next : namingFunction(next)]: tag(next),
    }),
    {},
  );

const simpleHtmlBuiltin = (tagName, is) => (attributes, children) =>
  tag(tagName)({ is, ...attributes }, children);

const Tag = {
  ...generateRenderFunctions(htmlTagNames),
  ...generateRenderFunctions(htmlSpecialTagNames, (tagName) => `${tagName}Tag`),
  simpleHtml: tag,
  simpleHtmlBuiltin,
};

module.exports = Tag;
