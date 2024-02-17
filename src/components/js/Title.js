import React from 'react';
function Title({
  children,
  id
}) {
  return React.createElement("h1", {
    id: id && id,
    className: "text-2xl font-bold underline underline-offset-8 decoration-4 mb-5 text-stone-900 dark:text-white"
  }, children);
}
export default Title;