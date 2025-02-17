# @swaggerexpert/openapi-runtime-expression

[![npmversion](https://img.shields.io/npm/v/%40swaggerexpert%2Fopenapi-runtime-expression?style=flat-square&label=npm%20package&color=%234DC81F&link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40swaggerexpert%2Fopenapi-runtime-expression)](https://www.npmjs.com/package/@swaggerexpert/openapi-runtime-expression)
[![npm](https://img.shields.io/npm/dm/@swaggerexpert/openapi-runtime-expression)](https://www.npmjs.com/package/@swaggerexpert/openapi-runtime-expression)
[![Test workflow](https://github.com/swaggerexpert/openapi-runtime-expression/actions/workflows/test.yml/badge.svg)](https://github.com/swaggerexpert/openapi-runtime-expression/actions)
[![Dependabot enabled](https://img.shields.io/badge/Dependabot-enabled-blue.svg)](https://dependabot.com/)
[![try on RunKit](https://img.shields.io/badge/try%20on-RunKit-brightgreen.svg?style=flat)](https://npm.runkit.com/@swaggerexpert/openapi-runtime-expression)
[![Tidelift](https://tidelift.com/badges/package/npm/@swaggerexpert%2Fopenapi-runtime-expression)](https://tidelift.com/subscription/pkg/npm-.swaggerexpert-openapi-runtime-expression?utm_source=npm-swaggerexpert-openapi-runtime-expression&utm_medium=referral&utm_campaign=readme)

[OpenAPI Runtime Expressions](https://spec.openapis.org/oas/v3.1.1.html#runtime-expressions) allow defining values based on information that will only be available within the HTTP message in an actual API call.
This mechanism is used by [Link Objects](https://spec.openapis.org/oas/v3.1.1.html#link-object) and [Callback Objects](https://spec.openapis.org/oas/v3.1.1.html#callback-object)
of [OpenAPI specification](https://spec.openapis.org/#openapi-specification).

`@swaggerexpert/openapi-runtime-expression` is a **parser**, **validator** and **extractor** for OpenAPI Runtime Expressions.

It supports Runtime Expressions defined in following OpenAPI specification versions:

- [OpenAPI 3.0.0](https://spec.openapis.org/oas/v3.0.0.html#runtime-expressions)
- [OpenAPI 3.0.1](https://spec.openapis.org/oas/v3.0.1.html#runtime-expressions)
- [OpenAPI 3.0.2](https://spec.openapis.org/oas/v3.0.2.html#runtime-expressions)
- [OpenAPI 3.0.3](https://spec.openapis.org/oas/v3.0.3.html#runtime-expressions)
- [OpenAPI 3.0.4](https://spec.openapis.org/oas/v3.0.4.html#runtime-expressions)
- [OpenAPI 3.1.0](https://spec.openapis.org/oas/v3.1.0.html#runtime-expressions)
- [OpenAPI 3.1.1](https://spec.openapis.org/oas/v3.1.1.html#runtime-expressions)

<table>
  <tr>
    <td align="right" valign="middle">
        <img src="https://cdn2.hubspot.net/hubfs/4008838/website/logos/logos_for_download/Tidelift_primary-shorthand-logo.png" alt="Tidelift" width="60" />
      </td>
      <td valign="middle">
        <a href="https://tidelift.com/subscription/pkg/npm-.swaggerexpert-openapi-runtime-expression?utm_source=npm-swaggerexpert-openapi-runtime-expression&utm_medium=referral&utm_campaign=readme">
            Get professionally supported @swaggerexpert/openapi-runtime-expression with Tidelift Subscription.
        </a>
      </td>
  </tr>
</table>

## Table of Contents

- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Extraction](#extraction)
    - [Parsing](#parsing)
    - [Validation](#validation)
    - [Grammar](#grammar)
- [More about OpenAPI runtime expressions](#more-about-openapi-runtime-expressions)
- [License](#license)


## Getting started

### Installation

You can install `@swaggerexpert/openapi-runtime-expression` using `npm`:

```sh
 $ npm install @swaggerexpert/openapi-runtime-expression
```

### Usage

`@swaggerexpert/openapi-runtime-expression` currently supports **extraction**, **parsing** and **validation**.
Both parser and validator are based on a superset of [ABNF](https://www.rfc-editor.org/rfc/rfc5234) ([SABNF](https://cs.github.com/ldthomas/apg-js2/blob/master/SABNF.md))
and use [apg-lite](https://github.com/ldthomas/apg-lite) parser generator.

#### Extraction

OpenAPI embeds Runtime Expressions into string values surrounded with `{}` curly braces.
To extract Runtime Expressions from this embedded form, use the **extract** function.
Extracted Runtime Expression can be used for further parsing of validation.

```js
import { extract, test, parse } from '@swaggerexpert/openapi-runtime-expression';

const expression = extract('{$request.header.accept}'); // => '$request.header.accept'

test(expression); // => true
parse(expression); // => { result, ast }
```

#### Parsing

Parsing a Runtime Expression is as simple as importing the **parse** function and calling it.

```js
import { parse } from '@swaggerexpert/openapi-runtime-expression';

const parseResult = parse('$request.header.accept');
```

`token` non-terminal is by default being normalized to lower case.

```js
import { parse } from '@swaggerexpert/openapi-runtime-expression';

const parseResult = parse('$request.header.Accept');
const parts = [];

parseResult.ast.translate(parts);
// [
//   [ 'expression', '$request.header.Accept' ],
//   [ 'source', 'header.Accept' ],
//   [ 'header-reference', 'header.Accept' ],
//   [ 'token', 'accept' ],
// ]
```

`token` normalization can be overridden by passing token normalizer to the `parse` function.

**Upper case**

```js
import { parse, tokenUpperCaseNormalizer } from '@swaggerexpert/openapi-runtime-expression';

const parseResult = parse('$request.header.Accept', { tokenNormalizer: tokenUpperCaseNormalizer });
const parts = [];
parseResult.ast.translate(parts);
// [
//   [ 'expression', '$request.header.Accept' ],
//   [ 'source', 'header.Accept' ],
//   [ 'header-reference', 'header.Accept' ],
//   [ 'token', 'ACCEPT' ],
// ]`
```

**Lower case**

```js
import { parse, tokenLowerCaseNormalizer } from '@swaggerexpert/openapi-runtime-expression';

const parseResult = parse('$request.header.Accept', { tokenNormalizer: tokenLowerCaseNormalizer });
const parts = [];
parseResult.ast.translate(parts);
// [
//   [ 'expression', '$request.header.Accept' ],
//   [ 'source', 'header.Accept' ],
//   [ 'header-reference', 'header.Accept' ],
//   [ 'token', 'accept' ],
// ]`
```

**parseResult** variable has the following shape:

```
{
  result: {
    success: true,
    state: 101,
    stateName: 'MATCH',
    length: 22,
    matched: 22,
    maxMatched: 22,
    maxTreeDepth: 13,
    nodeHits: 152
  },
  ast: fnast {
    callbacks: [
      expression: [Function: expression],
      source: [Function: source],
      'header-reference': [Function: headerReference],
      'query-reference': [Function: queryReference],
      'path-reference': [Function: pathReference],
      'body-reference': [Function: bodyReference],
      'json-pointer': [Function: jsonPointer],
      'reference-token': [Function: referenceToken],
      name: [Function: name],
      token: [Function: token]
    ],
    init: [Function (anonymous)],
    ruleDefined: [Function (anonymous)],
    udtDefined: [Function (anonymous)],
    down: [Function (anonymous)],
    up: [Function (anonymous)],
    translate: [Function (anonymous)],
    setLength: [Function (anonymous)],
    getLength: [Function (anonymous)],
    toXml: [Function (anonymous)]
  }
}
```

###### Interpreting AST as list of entries

```js
import { parse } from '@swaggerexpert/openapi-runtime-expression';

const parseResult = parse('$request.header.accept');
const parts = [];

parseResult.ast.translate(parts);
```

After running the above code, **parts** variable has the following shape:

```js
[
  [ 'expression', '$request.header.accept' ],
  [ 'source', 'header.accept' ],
  [ 'header-reference', 'header.accept' ],
  [ 'token', 'accept' ],
]
```

###### Interpreting AST as XML

```js
import { parse } from 'openapi-runtime-expression';

const parseResult = parse('$request.header.accept');
const xml = parseResult.ast.toXml();
```

After running the above code, **xml** variable has the following content:

```xml
<?xml version="1.0" encoding="utf-8"?>
<root nodes="4" characters="22">
  <!-- input string -->
  $request.header.accept
  <node name="expression" index="0" length="22">
    $request.header.accept
    <node name="source" index="9" length="13">
      header.accept
      <node name="header-reference" index="9" length="13">
        header.accept
        <node name="token" index="16" length="6">
          accept
        </node><!-- name="token" -->
      </node><!-- name="header-reference" -->
    </node><!-- name="source" -->
  </node><!-- name="expression" -->
</root>
```

> NOTE: AST can also be traversed in classical way using [depth first traversal](https://www.tutorialspoint.com/data_structures_algorithms/depth_first_traversal.htm). For more information about this option please refer to [apg-js](https://github.com/ldthomas/apg-js) and [apg-js-examples](https://github.com/ldthomas/apg-js-examples).

#### Validation

Validating a Runtime Expression is as simple as importing the **test** function and calling it.

```js
import { test } from '@swaggerexpert/openapi-runtime-expression';

test('$request.header.accept'); // => true
test('nonsensical string'); // => false
```

#### Grammar

New grammar instance can be created in following way:

```js
import { Grammar } from '@swaggerexpert/openapi-runtime-expression';

const grammar = new Grammar();
```

To obtain original ABNF (SABNF) grammar as a string:

```js
import { Grammar } from '@swaggerexpert/openapi-runtime-expression';

const grammar = new Grammar();

grammar.toString();
// or
String(grammar);
```

## More about OpenAPI runtime expressions

The runtime expression is defined by the following [ABNF](https://tools.ietf.org/html/rfc5234) syntax

```abnf
; OpenAPI runtime expression ABNF syntax
expression       = "$url" / "$method" / "$statusCode" / "$request." source / "$response." source
source           = header-reference / query-reference / path-reference / body-reference
header-reference = "header." token
query-reference  = "query." name
path-reference   = "path." name
body-reference   = "body" ["#" json-pointer ]

; https://datatracker.ietf.org/doc/html/rfc6901#section-3
json-pointer     = *( "/" reference-token )
reference-token  = *( unescaped / escaped )
unescaped        = %x00-2E / %x30-7D / %x7F-10FFFF
                 ; %x2F ('/') and %x7E ('~') are excluded from 'unescaped'
escaped          = "~" ( "0" / "1" )
                 ; representing '~' and '/', respectively
name             = *( CHAR )
token            = 1*tchar
tchar            = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "."
                 / "^" /"_" / "`" / "|" / "~" / DIGIT / ALPHA

; https://www.rfc-editor.org/rfc/rfc7159#section-7
CHAR = unescape /
    escape (
        %x22 /          ; "    quotation mark  U+0022
        %x5C /          ; \    reverse solidus U+005C
        %x2F /          ; /    solidus         U+002F
        %x62 /          ; b    backspace       U+0008
        %x66 /          ; f    form feed       U+000C
        %x6E /          ; n    line feed       U+000A
        %x72 /          ; r    carriage return U+000D
        %x74 /          ; t    tab             U+0009
        %x75 4HEXDIG )  ; uXXXX                U+XXXX
escape         = %x5C   ; \
unescape       = %x20-21 / %x23-5B / %x5D-10FFFF

; https://datatracker.ietf.org/doc/html/rfc5234#appendix-B.1
HEXDIG         =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
DIGIT          =  %x30-39   ; 0-9
ALPHA          =  %x41-5A / %x61-7A   ; A-Z / a-z
```

The `name` identifier is case-sensitive, whereas `token` is not.

The table below provides examples of runtime expressions and examples of their use in a value:

##### Examples

| Source Location | example expression | notes |
| ---- | :---- | :---- |
| HTTP Method | `$method` | The allowable values for the `$method` will be those for the HTTP operation. |
| Requested media type | `$request.header.accept` | |
| Request parameter | `$request.path.id` | Request parameters MUST be declared in the `parameters` section of the parent operation or they cannot be evaluated. This includes request headers. |
| Request body property | `$request.body#/user/uuid` | In operations which accept payloads, references may be made to portions of the `requestBody` or the entire body. |
| Request URL | `$url` | |
| Response value | `$response.body#/status` | In operations which return payloads, references may be made to portions of the response body or the entire body. |
| Response header | `$response.header.Server` | Single header values only are available |

Runtime expressions preserve the type of the referenced value.
Expressions can be embedded into string values by surrounding the expression with `{}` curly braces.

## License

`@swaggerexpert/openapi-runtime-expression` is licensed under [Apache 2.0 license](https://github.com/swaggerexpert/openapi-runtime-expression/blob/main/LICENSE).
`@swaggerexpert/openapi-runtime-expression` comes with an explicit [NOTICE](https://github.com/swaggerexpert/openapi-runtime-expression/blob/main/NOTICE) file
containing additional legal notices and information.
