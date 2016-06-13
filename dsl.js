export const BODY = Symbol('body marker');

// This is a tagged template string function that accepts input of the form:
//
//     roulade.QL`query {${BODY}}`
//
// And produces an object like:
//
//     {
//       pre: 'query {',
//       post: '}',
//     }
//
// Everything up to the first encountered BODY is placed in `pre`, all
// subsequent content is in `post`.
export function QL(strings, ...values) {
  let pre = '';
  let post = null;

  for (let i = 0; i < strings.length; i++) {
    if (post === null) {
      pre += strings[i];
    } else {
      post += strings[i];
    }

    if (i < values.length) {
      if (values[i] === BODY) {
        post = '';
      } else {
        pre += values[i];
      }
    }
  }
  return {pre, post};
}
