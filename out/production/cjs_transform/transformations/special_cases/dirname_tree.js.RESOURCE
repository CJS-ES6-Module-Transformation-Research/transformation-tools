[
   {
      "type": "ImportDeclaration",
      "specifiers": [
         {
            "type": "ImportSpecifier",
            "local": {
               "type": "Identifier",
               "name": "fileURLToPath"
            },
            "imported": {
               "type": "Identifier",
               "name": "fileURLToPath"
            }
         }
      ],
      "source": {
         "type": "Literal",
         "value": "url",
         "raw": "'url'"
      }
   },
   {
      "type": "ImportDeclaration",
      "specifiers": [
         {
            "type": "ImportSpecifier",
            "local": {
               "type": "Identifier",
               "name": "dirname"
            },
            "imported": {
               "type": "Identifier",
               "name": "dirname"
            }
         }
      ],
      "source": {
         "type": "Literal",
         "value": "path",
         "raw": "'path'"
      }
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "__filename"
            },
            "init": {
               "type": "CallExpression",
               "callee": {
                  "type": "Identifier",
                  "name": "fileURLToPath"
               },
               "arguments": [
                  {
                     "type": "Identifier",
                     "name": "import_meta_url"
                  }
               ]
            }
         }
      ],
      "kind": "const"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "__dirname"
            },
            "init": {
               "type": "CallExpression",
               "callee": {
                  "type": "Identifier",
                  "name": "dirname"
               },
               "arguments": [
                  {
                     "type": "Identifier",
                     "name": "__filename"
                  }
               ]
            }
         }
      ],
      "kind": "const"
   }
]

