const { htmlTagNames, htmlSpecialTagNames } = require("./html-tag-names");
const { cx } = require("./style");

const renderClass = (className) =>
  Array.isArray(className) ? cx(...className) : className;

const renderAttributes = (attributes) =>
  attributes !== undefined
    ? ` ${Object.keys(attributes)
        .map(
          (attributeName) =>
            `${attributeName}="${
              attributeName === "class"
                ? renderClass(attributes[attributeName])
                : attributes[attributeName]
            }"`
        )
        .join(" ")}`
    : "";

const renderChildren = (children) => {
  if (!children) {
    return "";
  } else if (Array.isArray(children)) {
    return children.filter(Boolean).join(" ");
  } else {
    return children;
  }
};

const tag = (tagName, attributes, children) =>
  `<${tagName}${renderAttributes(attributes)}>${renderChildren(
    children
  )}</${tagName}>`;

const t = (tagName) => (attributes, children) =>
  tag(tagName, attributes, children);

const Tag = htmlTagNames.reduce(
  (acc, next) => ({ ...acc, [next]: t(next) }),
  {}
);

const TagSpecial = htmlSpecialTagNames.reduce(
  (acc, next) => ({ ...acc, [`${next}Tag`]: t(next) }),
  {}
);

module.exports = {
  ...Tag,
  ...TagSpecial,
};
