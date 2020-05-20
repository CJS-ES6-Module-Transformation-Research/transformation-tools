{
    "type": "Program",
    "body": [
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "module"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "exports"
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": 32,
                    "raw": "32"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "Identifier",
                            "name": "module"
                        },
                        "property": {
                            "type": "Identifier",
                            "name": "exports"
                        }
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "alpha"
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": "gamma",
                    "raw": "'gamma'"
                }
            }
        },
        {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": {
                    "type": "MemberExpression",
                    "computed": false,
                    "object": {
                        "type": "Identifier",
                        "name": "exports"
                    },
                    "property": {
                        "type": "Identifier",
                        "name": "hello"
                    }
                },
                "right": {
                    "type": "Literal",
                    "value": " world",
                    "raw": "\" world\""
                }
            }
        }
    ],
    "sourceType": "script"
}
