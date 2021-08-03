[
   {
      "type": "VariableDeclaration",
      "kind": "var",
      "declarations": []
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "win32"
            },
            "init": {
               "type": "BinaryExpression",
               "operator": "===",
               "left": {
                  "type": "CallExpression",
                  "callee": {
                     "type": "MemberExpression",
                     "computed": false,
                     "object": {
                        "type": "Identifier",
                        "name": "os"
                     },
                     "property": {
                        "type": "Identifier",
                        "name": "platform"
                     }
                  },
                  "arguments": []
               },
               "right": {
                  "type": "Literal",
                  "value": "win32",
                  "raw": "'win32'"
               }
            }
         }
      ],
      "kind": "var"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "noop"
            },
            "init": {
               "type": "FunctionExpression",
               "id": null,
               "params": [],
               "body": {
                  "type": "BlockStatement",
                  "body": []
               },
               "generator": false,
               "expression": false,
               "async": false,
               "$Scope$": "1",
               "$ID$": "56"
            }
         }
      ],
      "kind": "var"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "echo"
            },
            "init": {
               "type": "FunctionExpression",
               "id": null,
               "params": [
                  {
                     "type": "Identifier",
                     "name": "name"
                  }
               ],
               "body": {
                  "type": "BlockStatement",
                  "body": [
                     {
                        "type": "ReturnStatement",
                        "argument": {
                           "type": "Identifier",
                           "name": "name"
                        }
                     }
                  ]
               },
               "generator": false,
               "expression": false,
               "async": false,
               "$Scope$": "2",
               "$ID$": "57"
            }
         }
      ],
      "kind": "var"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "normalize"
            },
            "init": {
               "type": "ConditionalExpression",
               "test": {
                  "type": "UnaryExpression",
                  "operator": "!",
                  "argument": {
                     "type": "Identifier",
                     "name": "win32"
                  },
                  "prefix": true
               },
               "consequent": {
                  "type": "Identifier",
                  "name": "echo"
               },
               "alternate": {
                  "type": "FunctionExpression",
                  "id": null,
                  "params": [
                     {
                        "type": "Identifier",
                        "name": "name"
                     }
                  ],
                  "body": {
                     "type": "BlockStatement",
                     "body": [
                        {
                           "type": "ReturnStatement",
                           "argument": {
                              "type": "CallExpression",
                              "callee": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "name"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "replace"
                                       }
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": {},
                                          "raw": "/\\\\/g",
                                          "regex": {
                                             "pattern": "\\\\",
                                             "flags": "g"
                                          }
                                       },
                                       {
                                          "type": "Literal",
                                          "value": "/",
                                          "raw": "'/'"
                                       }
                                    ]
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "replace"
                                 }
                              },
                              "arguments": [
                                 {
                                    "type": "Literal",
                                    "value": {},
                                    "raw": "/[:?<>|]/g",
                                    "regex": {
                                       "pattern": "[:?<>|]",
                                       "flags": "g"
                                    }
                                 },
                                 {
                                    "type": "Literal",
                                    "value": "_",
                                    "raw": "'_'"
                                 }
                              ]
                           }
                        }
                     ]
                  },
                  "generator": false,
                  "expression": false,
                  "async": false,
                  "$Scope$": "3",
                  "$ID$": "58"
               }
            }
         }
      ],
      "kind": "var"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "statAll"
            },
            "init": {
               "type": "FunctionExpression",
               "id": null,
               "params": [
                  {
                     "type": "Identifier",
                     "name": "fs"
                  },
                  {
                     "type": "Identifier",
                     "name": "stat"
                  },
                  {
                     "type": "Identifier",
                     "name": "cwd"
                  },
                  {
                     "type": "Identifier",
                     "name": "ignore"
                  },
                  {
                     "type": "Identifier",
                     "name": "entries"
                  },
                  {
                     "type": "Identifier",
                     "name": "sort"
                  }
               ],
               "body": {
                  "type": "BlockStatement",
                  "body": [
                     {
                        "type": "VariableDeclaration",
                        "declarations": [
                           {
                              "type": "VariableDeclarator",
                              "id": {
                                 "type": "Identifier",
                                 "name": "queue"
                              },
                              "init": {
                                 "type": "LogicalExpression",
                                 "operator": "||",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "entries"
                                 },
                                 "right": {
                                    "type": "ArrayExpression",
                                    "elements": [
                                       {
                                          "type": "Literal",
                                          "value": ".",
                                          "raw": "'.'"
                                       }
                                    ]
                                 }
                              }
                           }
                        ],
                        "kind": "var"
                     },
                     {
                        "type": "ReturnStatement",
                        "argument": {
                           "type": "FunctionExpression",
                           "id": {
                              "type": "Identifier",
                              "name": "loop"
                           },
                           "params": [
                              {
                                 "type": "Identifier",
                                 "name": "callback"
                              }
                           ],
                           "body": {
                              "type": "BlockStatement",
                              "body": [
                                 {
                                    "type": "IfStatement",
                                    "test": {
                                       "type": "UnaryExpression",
                                       "operator": "!",
                                       "argument": {
                                          "type": "MemberExpression",
                                          "computed": false,
                                          "object": {
                                             "type": "Identifier",
                                             "name": "queue"
                                          },
                                          "property": {
                                             "type": "Identifier",
                                             "name": "length"
                                          }
                                       },
                                       "prefix": true
                                    },
                                    "consequent": {
                                       "type": "ReturnStatement",
                                       "argument": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "Identifier",
                                             "name": "callback"
                                          },
                                          "arguments": []
                                       }
                                    },
                                    "alternate": null
                                 },
                                 {
                                    "type": "VariableDeclaration",
                                    "declarations": [
                                       {
                                          "type": "VariableDeclarator",
                                          "id": {
                                             "type": "Identifier",
                                             "name": "next"
                                          },
                                          "init": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "queue"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "shift"
                                                }
                                             },
                                             "arguments": []
                                          }
                                       }
                                    ],
                                    "kind": "var"
                                 },
                                 {
                                    "type": "VariableDeclaration",
                                    "declarations": [
                                       {
                                          "type": "VariableDeclarator",
                                          "id": {
                                             "type": "Identifier",
                                             "name": "nextAbs"
                                          },
                                          "init": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "path"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "join"
                                                }
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "cwd"
                                                },
                                                {
                                                   "type": "Identifier",
                                                   "name": "next"
                                                }
                                             ]
                                          }
                                       }
                                    ],
                                    "kind": "var"
                                 },
                                 {
                                    "type": "ExpressionStatement",
                                    "expression": {
                                       "type": "CallExpression",
                                       "callee": {
                                          "type": "Identifier",
                                          "name": "stat"
                                       },
                                       "arguments": [
                                          {
                                             "type": "Identifier",
                                             "name": "nextAbs"
                                          },
                                          {
                                             "type": "FunctionExpression",
                                             "id": null,
                                             "params": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "err"
                                                },
                                                {
                                                   "type": "Identifier",
                                                   "name": "stat"
                                                }
                                             ],
                                             "body": {
                                                "type": "BlockStatement",
                                                "body": [
                                                   {
                                                      "type": "IfStatement",
                                                      "test": {
                                                         "type": "Identifier",
                                                         "name": "err"
                                                      },
                                                      "consequent": {
                                                         "type": "ReturnStatement",
                                                         "argument": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "callback"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "err"
                                                               }
                                                            ]
                                                         }
                                                      },
                                                      "alternate": null
                                                   },
                                                   {
                                                      "type": "IfStatement",
                                                      "test": {
                                                         "type": "UnaryExpression",
                                                         "operator": "!",
                                                         "argument": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "stat"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "isDirectory"
                                                               }
                                                            },
                                                            "arguments": []
                                                         },
                                                         "prefix": true
                                                      },
                                                      "consequent": {
                                                         "type": "ReturnStatement",
                                                         "argument": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "callback"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Literal",
                                                                  "value": null,
                                                                  "raw": "null"
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "next"
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "stat"
                                                               }
                                                            ]
                                                         }
                                                      },
                                                      "alternate": null
                                                   },
                                                   {
                                                      "type": "ExpressionStatement",
                                                      "expression": {
                                                         "type": "CallExpression",
                                                         "callee": {
                                                            "type": "MemberExpression",
                                                            "computed": false,
                                                            "object": {
                                                               "type": "Identifier",
                                                               "name": "fs"
                                                            },
                                                            "property": {
                                                               "type": "Identifier",
                                                               "name": "readdir"
                                                            }
                                                         },
                                                         "arguments": [
                                                            {
                                                               "type": "Identifier",
                                                               "name": "nextAbs"
                                                            },
                                                            {
                                                               "type": "FunctionExpression",
                                                               "id": null,
                                                               "params": [
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "err"
                                                                  },
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "files"
                                                                  }
                                                               ],
                                                               "body": {
                                                                  "type": "BlockStatement",
                                                                  "body": [
                                                                     {
                                                                        "type": "IfStatement",
                                                                        "test": {
                                                                           "type": "Identifier",
                                                                           "name": "err"
                                                                        },
                                                                        "consequent": {
                                                                           "type": "ReturnStatement",
                                                                           "argument": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "Identifier",
                                                                                 "name": "callback"
                                                                              },
                                                                              "arguments": [
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "err"
                                                                                 }
                                                                              ]
                                                                           }
                                                                        },
                                                                        "alternate": null
                                                                     },
                                                                     {
                                                                        "type": "IfStatement",
                                                                        "test": {
                                                                           "type": "Identifier",
                                                                           "name": "sort"
                                                                        },
                                                                        "consequent": {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "MemberExpression",
                                                                                 "computed": false,
                                                                                 "object": {
                                                                                    "type": "Identifier",
                                                                                    "name": "files"
                                                                                 },
                                                                                 "property": {
                                                                                    "type": "Identifier",
                                                                                    "name": "sort"
                                                                                 }
                                                                              },
                                                                              "arguments": []
                                                                           }
                                                                        },
                                                                        "alternate": null
                                                                     },
                                                                     {
                                                                        "type": "ForStatement",
                                                                        "init": {
                                                                           "type": "VariableDeclaration",
                                                                           "declarations": [
                                                                              {
                                                                                 "type": "VariableDeclarator",
                                                                                 "id": {
                                                                                    "type": "Identifier",
                                                                                    "name": "i"
                                                                                 },
                                                                                 "init": {
                                                                                    "type": "Literal",
                                                                                    "value": 0,
                                                                                    "raw": "0"
                                                                                 }
                                                                              }
                                                                           ],
                                                                           "kind": "var"
                                                                        },
                                                                        "test": {
                                                                           "type": "BinaryExpression",
                                                                           "operator": "<",
                                                                           "left": {
                                                                              "type": "Identifier",
                                                                              "name": "i"
                                                                           },
                                                                           "right": {
                                                                              "type": "MemberExpression",
                                                                              "computed": false,
                                                                              "object": {
                                                                                 "type": "Identifier",
                                                                                 "name": "files"
                                                                              },
                                                                              "property": {
                                                                                 "type": "Identifier",
                                                                                 "name": "length"
                                                                              }
                                                                           }
                                                                        },
                                                                        "update": {
                                                                           "type": "UpdateExpression",
                                                                           "operator": "++",
                                                                           "argument": {
                                                                              "type": "Identifier",
                                                                              "name": "i"
                                                                           },
                                                                           "prefix": false
                                                                        },
                                                                        "body": {
                                                                           "type": "BlockStatement",
                                                                           "body": [
                                                                              {
                                                                                 "type": "IfStatement",
                                                                                 "test": {
                                                                                    "type": "UnaryExpression",
                                                                                    "operator": "!",
                                                                                    "argument": {
                                                                                       "type": "CallExpression",
                                                                                       "callee": {
                                                                                          "type": "Identifier",
                                                                                          "name": "ignore"
                                                                                       },
                                                                                       "arguments": [
                                                                                          {
                                                                                             "type": "CallExpression",
                                                                                             "callee": {
                                                                                                "type": "MemberExpression",
                                                                                                "computed": false,
                                                                                                "object": {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "path"
                                                                                                },
                                                                                                "property": {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "join"
                                                                                                }
                                                                                             },
                                                                                             "arguments": [
                                                                                                {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "cwd"
                                                                                                },
                                                                                                {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "next"
                                                                                                },
                                                                                                {
                                                                                                   "type": "MemberExpression",
                                                                                                   "computed": true,
                                                                                                   "object": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "files"
                                                                                                   },
                                                                                                   "property": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "i"
                                                                                                   }
                                                                                                }
                                                                                             ]
                                                                                          }
                                                                                       ]
                                                                                    },
                                                                                    "prefix": true
                                                                                 },
                                                                                 "consequent": {
                                                                                    "type": "ExpressionStatement",
                                                                                    "expression": {
                                                                                       "type": "CallExpression",
                                                                                       "callee": {
                                                                                          "type": "MemberExpression",
                                                                                          "computed": false,
                                                                                          "object": {
                                                                                             "type": "Identifier",
                                                                                             "name": "queue"
                                                                                          },
                                                                                          "property": {
                                                                                             "type": "Identifier",
                                                                                             "name": "push"
                                                                                          }
                                                                                       },
                                                                                       "arguments": [
                                                                                          {
                                                                                             "type": "CallExpression",
                                                                                             "callee": {
                                                                                                "type": "MemberExpression",
                                                                                                "computed": false,
                                                                                                "object": {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "path"
                                                                                                },
                                                                                                "property": {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "join"
                                                                                                }
                                                                                             },
                                                                                             "arguments": [
                                                                                                {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "next"
                                                                                                },
                                                                                                {
                                                                                                   "type": "MemberExpression",
                                                                                                   "computed": true,
                                                                                                   "object": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "files"
                                                                                                   },
                                                                                                   "property": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "i"
                                                                                                   }
                                                                                                }
                                                                                             ]
                                                                                          }
                                                                                       ]
                                                                                    }
                                                                                 },
                                                                                 "alternate": null
                                                                              }
                                                                           ]
                                                                        },
                                                                        "$Scope$": "8"
                                                                     },
                                                                     {
                                                                        "type": "ExpressionStatement",
                                                                        "expression": {
                                                                           "type": "CallExpression",
                                                                           "callee": {
                                                                              "type": "Identifier",
                                                                              "name": "callback"
                                                                           },
                                                                           "arguments": [
                                                                              {
                                                                                 "type": "Literal",
                                                                                 "value": null,
                                                                                 "raw": "null"
                                                                              },
                                                                              {
                                                                                 "type": "Identifier",
                                                                                 "name": "next"
                                                                              },
                                                                              {
                                                                                 "type": "Identifier",
                                                                                 "name": "stat"
                                                                              }
                                                                           ]
                                                                        }
                                                                     }
                                                                  ]
                                                               },
                                                               "generator": false,
                                                               "expression": false,
                                                               "async": false,
                                                               "$Scope$": "7",
                                                               "$ID$": "62"
                                                            }
                                                         ]
                                                      }
                                                   }
                                                ]
                                             },
                                             "generator": false,
                                             "expression": false,
                                             "async": false,
                                             "$Scope$": "6",
                                             "$ID$": "61"
                                          }
                                       ]
                                    }
                                 }
                              ]
                           },
                           "generator": false,
                           "expression": false,
                           "async": false,
                           "$Scope$": "5",
                           "$ID$": "60"
                        }
                     }
                  ]
               },
               "generator": false,
               "expression": false,
               "async": false,
               "$Scope$": "4",
               "$ID$": "59"
            }
         }
      ],
      "kind": "var"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "strip"
            },
            "init": {
               "type": "FunctionExpression",
               "id": null,
               "params": [
                  {
                     "type": "Identifier",
                     "name": "map"
                  },
                  {
                     "type": "Identifier",
                     "name": "level"
                  }
               ],
               "body": {
                  "type": "BlockStatement",
                  "body": [
                     {
                        "type": "ReturnStatement",
                        "argument": {
                           "type": "FunctionExpression",
                           "id": null,
                           "params": [
                              {
                                 "type": "Identifier",
                                 "name": "header"
                              }
                           ],
                           "body": {
                              "type": "BlockStatement",
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
                                             "name": "header"
                                          },
                                          "property": {
                                             "type": "Identifier",
                                             "name": "name"
                                          }
                                       },
                                       "right": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "CallExpression",
                                                      "callee": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "MemberExpression",
                                                            "computed": false,
                                                            "object": {
                                                               "type": "Identifier",
                                                               "name": "header"
                                                            },
                                                            "property": {
                                                               "type": "Identifier",
                                                               "name": "name"
                                                            }
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "split"
                                                         }
                                                      },
                                                      "arguments": [
                                                         {
                                                            "type": "Literal",
                                                            "value": "/",
                                                            "raw": "'/'"
                                                         }
                                                      ]
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "slice"
                                                   }
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "level"
                                                   }
                                                ]
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "join"
                                             }
                                          },
                                          "arguments": [
                                             {
                                                "type": "Literal",
                                                "value": "/",
                                                "raw": "'/'"
                                             }
                                          ]
                                       }
                                    }
                                 },
                                 {
                                    "type": "VariableDeclaration",
                                    "declarations": [
                                       {
                                          "type": "VariableDeclarator",
                                          "id": {
                                             "type": "Identifier",
                                             "name": "linkname"
                                          },
                                          "init": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "header"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "linkname"
                                             }
                                          }
                                       }
                                    ],
                                    "kind": "var"
                                 },
                                 {
                                    "type": "IfStatement",
                                    "test": {
                                       "type": "LogicalExpression",
                                       "operator": "&&",
                                       "left": {
                                          "type": "Identifier",
                                          "name": "linkname"
                                       },
                                       "right": {
                                          "type": "LogicalExpression",
                                          "operator": "||",
                                          "left": {
                                             "type": "BinaryExpression",
                                             "operator": "===",
                                             "left": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "header"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "type"
                                                }
                                             },
                                             "right": {
                                                "type": "Literal",
                                                "value": "link",
                                                "raw": "'link'"
                                             }
                                          },
                                          "right": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "path"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "isAbsolute"
                                                }
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "linkname"
                                                }
                                             ]
                                          }
                                       }
                                    },
                                    "consequent": {
                                       "type": "BlockStatement",
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
                                                      "name": "header"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "linkname"
                                                   }
                                                },
                                                "right": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "MemberExpression",
                                                      "computed": false,
                                                      "object": {
                                                         "type": "CallExpression",
                                                         "callee": {
                                                            "type": "MemberExpression",
                                                            "computed": false,
                                                            "object": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "MemberExpression",
                                                                  "computed": false,
                                                                  "object": {
                                                                     "type": "Identifier",
                                                                     "name": "linkname"
                                                                  },
                                                                  "property": {
                                                                     "type": "Identifier",
                                                                     "name": "split"
                                                                  }
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "Literal",
                                                                     "value": "/",
                                                                     "raw": "'/'"
                                                                  }
                                                               ]
                                                            },
                                                            "property": {
                                                               "type": "Identifier",
                                                               "name": "slice"
                                                            }
                                                         },
                                                         "arguments": [
                                                            {
                                                               "type": "Identifier",
                                                               "name": "level"
                                                            }
                                                         ]
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "join"
                                                      }
                                                   },
                                                   "arguments": [
                                                      {
                                                         "type": "Literal",
                                                         "value": "/",
                                                         "raw": "'/'"
                                                      }
                                                   ]
                                                }
                                             }
                                          }
                                       ]
                                    },
                                    "alternate": null,
                                    "$Scope$": "11"
                                 },
                                 {
                                    "type": "ReturnStatement",
                                    "argument": {
                                       "type": "CallExpression",
                                       "callee": {
                                          "type": "Identifier",
                                          "name": "map"
                                       },
                                       "arguments": [
                                          {
                                             "type": "Identifier",
                                             "name": "header"
                                          }
                                       ]
                                    }
                                 }
                              ]
                           },
                           "generator": false,
                           "expression": false,
                           "async": false,
                           "$Scope$": "10",
                           "$ID$": "64"
                        }
                     }
                  ]
               },
               "generator": false,
               "expression": false,
               "async": false,
               "$Scope$": "9",
               "$ID$": "63"
            }
         }
      ],
      "kind": "var"
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
               "name": "pack"
            }
         },
         "right": {
            "type": "FunctionExpression",
            "id": null,
            "params": [
               {
                  "type": "Identifier",
                  "name": "cwd"
               },
               {
                  "type": "Identifier",
                  "name": "opts"
               }
            ],
            "body": {
               "type": "BlockStatement",
               "body": [
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "UnaryExpression",
                        "operator": "!",
                        "argument": {
                           "type": "Identifier",
                           "name": "cwd"
                        },
                        "prefix": true
                     },
                     "consequent": {
                        "type": "ExpressionStatement",
                        "expression": {
                           "type": "AssignmentExpression",
                           "operator": "=",
                           "left": {
                              "type": "Identifier",
                              "name": "cwd"
                           },
                           "right": {
                              "type": "Literal",
                              "value": ".",
                              "raw": "'.'"
                           }
                        }
                     },
                     "alternate": null
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "UnaryExpression",
                        "operator": "!",
                        "argument": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "prefix": true
                     },
                     "consequent": {
                        "type": "ExpressionStatement",
                        "expression": {
                           "type": "AssignmentExpression",
                           "operator": "=",
                           "left": {
                              "type": "Identifier",
                              "name": "opts"
                           },
                           "right": {
                              "type": "ObjectExpression",
                              "properties": []
                           }
                        }
                     },
                     "alternate": null
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "xfs"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "fs"
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "fs"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "ignore"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "LogicalExpression",
                                 "operator": "||",
                                 "left": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "ignore"
                                    }
                                 },
                                 "right": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "filter"
                                    }
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "noop"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "map"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "map"
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "noop"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "mapStream"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "mapStream"
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "echo"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "statNext"
                           },
                           "init": {
                              "type": "CallExpression",
                              "callee": {
                                 "type": "Identifier",
                                 "name": "statAll"
                              },
                              "arguments": [
                                 {
                                    "type": "Identifier",
                                    "name": "xfs"
                                 },
                                 {
                                    "type": "ConditionalExpression",
                                    "test": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "dereference"
                                       }
                                    },
                                    "consequent": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "xfs"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "stat"
                                       }
                                    },
                                    "alternate": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "xfs"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "lstat"
                                       }
                                    }
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "cwd"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "ignore"
                                 },
                                 {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "entries"
                                    }
                                 },
                                 {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "sort"
                                    }
                                 }
                              ]
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "strict"
                           },
                           "init": {
                              "type": "BinaryExpression",
                              "operator": "!==",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "strict"
                                 }
                              },
                              "right": {
                                 "type": "Literal",
                                 "value": false,
                                 "raw": "false"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "umask"
                           },
                           "init": {
                              "type": "ConditionalExpression",
                              "test": {
                                 "type": "BinaryExpression",
                                 "operator": "===",
                                 "left": {
                                    "type": "UnaryExpression",
                                    "operator": "typeof",
                                    "argument": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "umask"
                                       }
                                    },
                                    "prefix": true
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": "number",
                                    "raw": "'number'"
                                 }
                              },
                              "consequent": {
                                 "type": "UnaryExpression",
                                 "operator": "~",
                                 "argument": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "umask"
                                    }
                                 },
                                 "prefix": true
                              },
                              "alternate": {
                                 "type": "UnaryExpression",
                                 "operator": "~",
                                 "argument": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "processUmask"
                                    },
                                    "arguments": []
                                 },
                                 "prefix": true
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "dmode"
                           },
                           "init": {
                              "type": "ConditionalExpression",
                              "test": {
                                 "type": "BinaryExpression",
                                 "operator": "===",
                                 "left": {
                                    "type": "UnaryExpression",
                                    "operator": "typeof",
                                    "argument": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "dmode"
                                       }
                                    },
                                    "prefix": true
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": "number",
                                    "raw": "'number'"
                                 }
                              },
                              "consequent": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "dmode"
                                 }
                              },
                              "alternate": {
                                 "type": "Literal",
                                 "value": 0,
                                 "raw": "0"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "fmode"
                           },
                           "init": {
                              "type": "ConditionalExpression",
                              "test": {
                                 "type": "BinaryExpression",
                                 "operator": "===",
                                 "left": {
                                    "type": "UnaryExpression",
                                    "operator": "typeof",
                                    "argument": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "fmode"
                                       }
                                    },
                                    "prefix": true
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": "number",
                                    "raw": "'number'"
                                 }
                              },
                              "consequent": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "fmode"
                                 }
                              },
                              "alternate": {
                                 "type": "Literal",
                                 "value": 0,
                                 "raw": "0"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "pack"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "pack"
                                 }
                              },
                              "right": {
                                 "type": "CallExpression",
                                 "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "tar"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "pack"
                                    }
                                 },
                                 "arguments": []
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "finish"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "finish"
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "noop"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "property": {
                           "type": "Identifier",
                           "name": "strip"
                        }
                     },
                     "consequent": {
                        "type": "ExpressionStatement",
                        "expression": {
                           "type": "AssignmentExpression",
                           "operator": "=",
                           "left": {
                              "type": "Identifier",
                              "name": "map"
                           },
                           "right": {
                              "type": "CallExpression",
                              "callee": {
                                 "type": "Identifier",
                                 "name": "strip"
                              },
                              "arguments": [
                                 {
                                    "type": "Identifier",
                                    "name": "map"
                                 },
                                 {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "strip"
                                    }
                                 }
                              ]
                           }
                        }
                     },
                     "alternate": null
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "property": {
                           "type": "Identifier",
                           "name": "readable"
                        }
                     },
                     "consequent": {
                        "type": "BlockStatement",
                        "body": [
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "dmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 555,
                                          "raw": "555"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           },
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "fmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 444,
                                          "raw": "444"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           }
                        ]
                     },
                     "alternate": null,
                     "$Scope$": "13"
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "property": {
                           "type": "Identifier",
                           "name": "writable"
                        }
                     },
                     "consequent": {
                        "type": "BlockStatement",
                        "body": [
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "dmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 333,
                                          "raw": "333"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           },
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "fmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 222,
                                          "raw": "222"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           }
                        ]
                     },
                     "alternate": null,
                     "$Scope$": "14"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "onsymlink"
                           },
                           "init": {
                              "type": "FunctionExpression",
                              "id": null,
                              "params": [
                                 {
                                    "type": "Identifier",
                                    "name": "filename"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "header"
                                 }
                              ],
                              "body": {
                                 "type": "BlockStatement",
                                 "body": [
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "xfs"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "readlink"
                                             }
                                          },
                                          "arguments": [
                                             {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "path"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "join"
                                                   }
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "cwd"
                                                   },
                                                   {
                                                      "type": "Identifier",
                                                      "name": "filename"
                                                   }
                                                ]
                                             },
                                             {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "err"
                                                   },
                                                   {
                                                      "type": "Identifier",
                                                      "name": "linkname"
                                                   }
                                                ],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "Identifier",
                                                            "name": "err"
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "MemberExpression",
                                                                  "computed": false,
                                                                  "object": {
                                                                     "type": "Identifier",
                                                                     "name": "pack"
                                                                  },
                                                                  "property": {
                                                                     "type": "Identifier",
                                                                     "name": "destroy"
                                                                  }
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "err"
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                         "alternate": null
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
                                                                  "name": "header"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "linkname"
                                                               }
                                                            },
                                                            "right": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "normalize"
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "linkname"
                                                                  }
                                                               ]
                                                            }
                                                         }
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "pack"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "entry"
                                                               }
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "header"
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "onnextentry"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "16",
                                                "$ID$": "67"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              "generator": false,
                              "expression": false,
                              "async": false,
                              "$Scope$": "15",
                              "$ID$": "66"
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "onstat"
                           },
                           "init": {
                              "type": "FunctionExpression",
                              "id": null,
                              "params": [
                                 {
                                    "type": "Identifier",
                                    "name": "err"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "filename"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "stat"
                                 }
                              ],
                              "body": {
                                 "type": "BlockStatement",
                                 "body": [
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "Identifier",
                                          "name": "err"
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "pack"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "destroy"
                                                }
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "err"
                                                }
                                             ]
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "UnaryExpression",
                                          "operator": "!",
                                          "argument": {
                                             "type": "Identifier",
                                             "name": "filename"
                                          },
                                          "prefix": true
                                       },
                                       "consequent": {
                                          "type": "BlockStatement",
                                          "body": [
                                             {
                                                "type": "IfStatement",
                                                "test": {
                                                   "type": "BinaryExpression",
                                                   "operator": "!==",
                                                   "left": {
                                                      "type": "MemberExpression",
                                                      "computed": false,
                                                      "object": {
                                                         "type": "Identifier",
                                                         "name": "opts"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "finalize"
                                                      }
                                                   },
                                                   "right": {
                                                      "type": "Literal",
                                                      "value": false,
                                                      "raw": "false"
                                                   }
                                                },
                                                "consequent": {
                                                   "type": "ExpressionStatement",
                                                   "expression": {
                                                      "type": "CallExpression",
                                                      "callee": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "pack"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "finalize"
                                                         }
                                                      },
                                                      "arguments": []
                                                   }
                                                },
                                                "alternate": null
                                             },
                                             {
                                                "type": "ReturnStatement",
                                                "argument": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "Identifier",
                                                      "name": "finish"
                                                   },
                                                   "arguments": [
                                                      {
                                                         "type": "Identifier",
                                                         "name": "pack"
                                                      }
                                                   ]
                                                }
                                             }
                                          ]
                                       },
                                       "alternate": null,
                                       "$Scope$": "18"
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "stat"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "isSocket"
                                             }
                                          },
                                          "arguments": []
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "onnextentry"
                                             },
                                             "arguments": []
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "header"
                                             },
                                             "init": {
                                                "type": "ObjectExpression",
                                                "properties": [
                                                   {
                                                      "type": "Property",
                                                      "key": {
                                                         "type": "Identifier",
                                                         "name": "name"
                                                      },
                                                      "computed": false,
                                                      "value": {
                                                         "type": "CallExpression",
                                                         "callee": {
                                                            "type": "Identifier",
                                                            "name": "normalize"
                                                         },
                                                         "arguments": [
                                                            {
                                                               "type": "Identifier",
                                                               "name": "filename"
                                                            }
                                                         ]
                                                      },
                                                      "kind": "init",
                                                      "method": false,
                                                      "shorthand": false
                                                   },
                                                   {
                                                      "type": "Property",
                                                      "key": {
                                                         "type": "Identifier",
                                                         "name": "mode"
                                                      },
                                                      "computed": false,
                                                      "value": {
                                                         "type": "BinaryExpression",
                                                         "operator": "&",
                                                         "left": {
                                                            "type": "BinaryExpression",
                                                            "operator": "|",
                                                            "left": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "stat"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "mode"
                                                               }
                                                            },
                                                            "right": {
                                                               "type": "ConditionalExpression",
                                                               "test": {
                                                                  "type": "CallExpression",
                                                                  "callee": {
                                                                     "type": "MemberExpression",
                                                                     "computed": false,
                                                                     "object": {
                                                                        "type": "Identifier",
                                                                        "name": "stat"
                                                                     },
                                                                     "property": {
                                                                        "type": "Identifier",
                                                                        "name": "isDirectory"
                                                                     }
                                                                  },
                                                                  "arguments": []
                                                               },
                                                               "consequent": {
                                                                  "type": "Identifier",
                                                                  "name": "dmode"
                                                               },
                                                               "alternate": {
                                                                  "type": "Identifier",
                                                                  "name": "fmode"
                                                               }
                                                            }
                                                         },
                                                         "right": {
                                                            "type": "Identifier",
                                                            "name": "umask"
                                                         }
                                                      },
                                                      "kind": "init",
                                                      "method": false,
                                                      "shorthand": false
                                                   },
                                                   {
                                                      "type": "Property",
                                                      "key": {
                                                         "type": "Identifier",
                                                         "name": "mtime"
                                                      },
                                                      "computed": false,
                                                      "value": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "stat"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "mtime"
                                                         }
                                                      },
                                                      "kind": "init",
                                                      "method": false,
                                                      "shorthand": false
                                                   },
                                                   {
                                                      "type": "Property",
                                                      "key": {
                                                         "type": "Identifier",
                                                         "name": "size"
                                                      },
                                                      "computed": false,
                                                      "value": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "stat"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "size"
                                                         }
                                                      },
                                                      "kind": "init",
                                                      "method": false,
                                                      "shorthand": false
                                                   },
                                                   {
                                                      "type": "Property",
                                                      "key": {
                                                         "type": "Identifier",
                                                         "name": "type"
                                                      },
                                                      "computed": false,
                                                      "value": {
                                                         "type": "Literal",
                                                         "value": "file",
                                                         "raw": "'file'"
                                                      },
                                                      "kind": "init",
                                                      "method": false,
                                                      "shorthand": false
                                                   },
                                                   {
                                                      "type": "Property",
                                                      "key": {
                                                         "type": "Identifier",
                                                         "name": "uid"
                                                      },
                                                      "computed": false,
                                                      "value": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "stat"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "uid"
                                                         }
                                                      },
                                                      "kind": "init",
                                                      "method": false,
                                                      "shorthand": false
                                                   },
                                                   {
                                                      "type": "Property",
                                                      "key": {
                                                         "type": "Identifier",
                                                         "name": "gid"
                                                      },
                                                      "computed": false,
                                                      "value": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "stat"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "gid"
                                                         }
                                                      },
                                                      "kind": "init",
                                                      "method": false,
                                                      "shorthand": false
                                                   }
                                                ]
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "stat"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "isDirectory"
                                             }
                                          },
                                          "arguments": []
                                       },
                                       "consequent": {
                                          "type": "BlockStatement",
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
                                                         "name": "header"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "size"
                                                      }
                                                   },
                                                   "right": {
                                                      "type": "Literal",
                                                      "value": 0,
                                                      "raw": "0"
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
                                                         "name": "header"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "type"
                                                      }
                                                   },
                                                   "right": {
                                                      "type": "Literal",
                                                      "value": "directory",
                                                      "raw": "'directory'"
                                                   }
                                                }
                                             },
                                             {
                                                "type": "ExpressionStatement",
                                                "expression": {
                                                   "type": "AssignmentExpression",
                                                   "operator": "=",
                                                   "left": {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   },
                                                   "right": {
                                                      "type": "LogicalExpression",
                                                      "operator": "||",
                                                      "left": {
                                                         "type": "CallExpression",
                                                         "callee": {
                                                            "type": "Identifier",
                                                            "name": "map"
                                                         },
                                                         "arguments": [
                                                            {
                                                               "type": "Identifier",
                                                               "name": "header"
                                                            }
                                                         ]
                                                      },
                                                      "right": {
                                                         "type": "Identifier",
                                                         "name": "header"
                                                      }
                                                   }
                                                }
                                             },
                                             {
                                                "type": "ReturnStatement",
                                                "argument": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "MemberExpression",
                                                      "computed": false,
                                                      "object": {
                                                         "type": "Identifier",
                                                         "name": "pack"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "entry"
                                                      }
                                                   },
                                                   "arguments": [
                                                      {
                                                         "type": "Identifier",
                                                         "name": "header"
                                                      },
                                                      {
                                                         "type": "Identifier",
                                                         "name": "onnextentry"
                                                      }
                                                   ]
                                                }
                                             }
                                          ]
                                       },
                                       "alternate": null,
                                       "$Scope$": "19"
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "stat"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "isSymbolicLink"
                                             }
                                          },
                                          "arguments": []
                                       },
                                       "consequent": {
                                          "type": "BlockStatement",
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
                                                         "name": "header"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "size"
                                                      }
                                                   },
                                                   "right": {
                                                      "type": "Literal",
                                                      "value": 0,
                                                      "raw": "0"
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
                                                         "name": "header"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "type"
                                                      }
                                                   },
                                                   "right": {
                                                      "type": "Literal",
                                                      "value": "symlink",
                                                      "raw": "'symlink'"
                                                   }
                                                }
                                             },
                                             {
                                                "type": "ExpressionStatement",
                                                "expression": {
                                                   "type": "AssignmentExpression",
                                                   "operator": "=",
                                                   "left": {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   },
                                                   "right": {
                                                      "type": "LogicalExpression",
                                                      "operator": "||",
                                                      "left": {
                                                         "type": "CallExpression",
                                                         "callee": {
                                                            "type": "Identifier",
                                                            "name": "map"
                                                         },
                                                         "arguments": [
                                                            {
                                                               "type": "Identifier",
                                                               "name": "header"
                                                            }
                                                         ]
                                                      },
                                                      "right": {
                                                         "type": "Identifier",
                                                         "name": "header"
                                                      }
                                                   }
                                                }
                                             },
                                             {
                                                "type": "ReturnStatement",
                                                "argument": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "Identifier",
                                                      "name": "onsymlink"
                                                   },
                                                   "arguments": [
                                                      {
                                                         "type": "Identifier",
                                                         "name": "filename"
                                                      },
                                                      {
                                                         "type": "Identifier",
                                                         "name": "header"
                                                      }
                                                   ]
                                                }
                                             }
                                          ]
                                       },
                                       "alternate": null,
                                       "$Scope$": "20"
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "AssignmentExpression",
                                          "operator": "=",
                                          "left": {
                                             "type": "Identifier",
                                             "name": "header"
                                          },
                                          "right": {
                                             "type": "LogicalExpression",
                                             "operator": "||",
                                             "left": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "Identifier",
                                                   "name": "map"
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   }
                                                ]
                                             },
                                             "right": {
                                                "type": "Identifier",
                                                "name": "header"
                                             }
                                          }
                                       }
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "UnaryExpression",
                                          "operator": "!",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "stat"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "isFile"
                                                }
                                             },
                                             "arguments": []
                                          },
                                          "prefix": true
                                       },
                                       "consequent": {
                                          "type": "BlockStatement",
                                          "body": [
                                             {
                                                "type": "IfStatement",
                                                "test": {
                                                   "type": "Identifier",
                                                   "name": "strict"
                                                },
                                                "consequent": {
                                                   "type": "ReturnStatement",
                                                   "argument": {
                                                      "type": "CallExpression",
                                                      "callee": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "pack"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "destroy"
                                                         }
                                                      },
                                                      "arguments": [
                                                         {
                                                            "type": "NewExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "Error"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "BinaryExpression",
                                                                  "operator": "+",
                                                                  "left": {
                                                                     "type": "Literal",
                                                                     "value": "unsupported type for ",
                                                                     "raw": "'unsupported type for '"
                                                                  },
                                                                  "right": {
                                                                     "type": "Identifier",
                                                                     "name": "filename"
                                                                  }
                                                               }
                                                            ]
                                                         }
                                                      ]
                                                   }
                                                },
                                                "alternate": null
                                             },
                                             {
                                                "type": "ReturnStatement",
                                                "argument": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "Identifier",
                                                      "name": "onnextentry"
                                                   },
                                                   "arguments": []
                                                }
                                             }
                                          ]
                                       },
                                       "alternate": null,
                                       "$Scope$": "21"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "entry"
                                             },
                                             "init": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "pack"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "entry"
                                                   }
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   },
                                                   {
                                                      "type": "Identifier",
                                                      "name": "onnextentry"
                                                   }
                                                ]
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "UnaryExpression",
                                          "operator": "!",
                                          "argument": {
                                             "type": "Identifier",
                                             "name": "entry"
                                          },
                                          "prefix": true
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": null
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "rs"
                                             },
                                             "init": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "Identifier",
                                                   "name": "mapStream"
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "CallExpression",
                                                      "callee": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "xfs"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "createReadStream"
                                                         }
                                                      },
                                                      "arguments": [
                                                         {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "path"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "join"
                                                               }
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "cwd"
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "filename"
                                                               }
                                                            ]
                                                         },
                                                         {
                                                            "type": "ObjectExpression",
                                                            "properties": [
                                                               {
                                                                  "type": "Property",
                                                                  "key": {
                                                                     "type": "Identifier",
                                                                     "name": "start"
                                                                  },
                                                                  "computed": false,
                                                                  "value": {
                                                                     "type": "Literal",
                                                                     "value": 0,
                                                                     "raw": "0"
                                                                  },
                                                                  "kind": "init",
                                                                  "method": false,
                                                                  "shorthand": false
                                                               },
                                                               {
                                                                  "type": "Property",
                                                                  "key": {
                                                                     "type": "Identifier",
                                                                     "name": "end"
                                                                  },
                                                                  "computed": false,
                                                                  "value": {
                                                                     "type": "ConditionalExpression",
                                                                     "test": {
                                                                        "type": "BinaryExpression",
                                                                        "operator": ">",
                                                                        "left": {
                                                                           "type": "MemberExpression",
                                                                           "computed": false,
                                                                           "object": {
                                                                              "type": "Identifier",
                                                                              "name": "header"
                                                                           },
                                                                           "property": {
                                                                              "type": "Identifier",
                                                                              "name": "size"
                                                                           }
                                                                        },
                                                                        "right": {
                                                                           "type": "Literal",
                                                                           "value": 0,
                                                                           "raw": "0"
                                                                        }
                                                                     },
                                                                     "consequent": {
                                                                        "type": "BinaryExpression",
                                                                        "operator": "-",
                                                                        "left": {
                                                                           "type": "MemberExpression",
                                                                           "computed": false,
                                                                           "object": {
                                                                              "type": "Identifier",
                                                                              "name": "header"
                                                                           },
                                                                           "property": {
                                                                              "type": "Identifier",
                                                                              "name": "size"
                                                                           }
                                                                        },
                                                                        "right": {
                                                                           "type": "Literal",
                                                                           "value": 1,
                                                                           "raw": "1"
                                                                        }
                                                                     },
                                                                     "alternate": {
                                                                        "type": "MemberExpression",
                                                                        "computed": false,
                                                                        "object": {
                                                                           "type": "Identifier",
                                                                           "name": "header"
                                                                        },
                                                                        "property": {
                                                                           "type": "Identifier",
                                                                           "name": "size"
                                                                        }
                                                                     }
                                                                  },
                                                                  "kind": "init",
                                                                  "method": false,
                                                                  "shorthand": false
                                                               }
                                                            ]
                                                         }
                                                      ]
                                                   },
                                                   {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   }
                                                ]
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "rs"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "on"
                                             }
                                          },
                                          "arguments": [
                                             {
                                                "type": "Literal",
                                                "value": "error",
                                                "raw": "'error'"
                                             },
                                             {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "err"
                                                   }
                                                ],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "entry"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "destroy"
                                                               }
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "err"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "22",
                                                "$ID$": "69"
                                             }
                                          ]
                                       }
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "Identifier",
                                             "name": "pump"
                                          },
                                          "arguments": [
                                             {
                                                "type": "Identifier",
                                                "name": "rs"
                                             },
                                             {
                                                "type": "Identifier",
                                                "name": "entry"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              "generator": false,
                              "expression": false,
                              "async": false,
                              "$Scope$": "17",
                              "$ID$": "68"
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "onnextentry"
                           },
                           "init": {
                              "type": "FunctionExpression",
                              "id": null,
                              "params": [
                                 {
                                    "type": "Identifier",
                                    "name": "err"
                                 }
                              ],
                              "body": {
                                 "type": "BlockStatement",
                                 "body": [
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "Identifier",
                                          "name": "err"
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "pack"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "destroy"
                                                }
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "err"
                                                }
                                             ]
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "Identifier",
                                             "name": "statNext"
                                          },
                                          "arguments": [
                                             {
                                                "type": "Identifier",
                                                "name": "onstat"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              "generator": false,
                              "expression": false,
                              "async": false,
                              "$Scope$": "23",
                              "$ID$": "70"
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "ExpressionStatement",
                     "expression": {
                        "type": "CallExpression",
                        "callee": {
                           "type": "Identifier",
                           "name": "onnextentry"
                        },
                        "arguments": []
                     }
                  },
                  {
                     "type": "ReturnStatement",
                     "argument": {
                        "type": "Identifier",
                        "name": "pack"
                     }
                  }
               ]
            },
            "generator": false,
            "expression": false,
            "async": false,
            "$Scope$": "12",
            "$ID$": "65"
         }
      }
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "head"
            },
            "init": {
               "type": "FunctionExpression",
               "id": null,
               "params": [
                  {
                     "type": "Identifier",
                     "name": "list"
                  }
               ],
               "body": {
                  "type": "BlockStatement",
                  "body": [
                     {
                        "type": "ReturnStatement",
                        "argument": {
                           "type": "ConditionalExpression",
                           "test": {
                              "type": "MemberExpression",
                              "computed": false,
                              "object": {
                                 "type": "Identifier",
                                 "name": "list"
                              },
                              "property": {
                                 "type": "Identifier",
                                 "name": "length"
                              }
                           },
                           "consequent": {
                              "type": "MemberExpression",
                              "computed": true,
                              "object": {
                                 "type": "Identifier",
                                 "name": "list"
                              },
                              "property": {
                                 "type": "BinaryExpression",
                                 "operator": "-",
                                 "left": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "list"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "length"
                                    }
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                 }
                              }
                           },
                           "alternate": {
                              "type": "Literal",
                              "value": null,
                              "raw": "null"
                           }
                        }
                     }
                  ]
               },
               "generator": false,
               "expression": false,
               "async": false,
               "$Scope$": "24",
               "$ID$": "71"
            }
         }
      ],
      "kind": "var"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "processGetuid"
            },
            "init": {
               "type": "FunctionExpression",
               "id": null,
               "params": [],
               "body": {
                  "type": "BlockStatement",
                  "body": [
                     {
                        "type": "ReturnStatement",
                        "argument": {
                           "type": "ConditionalExpression",
                           "test": {
                              "type": "MemberExpression",
                              "computed": false,
                              "object": {
                                 "type": "Identifier",
                                 "name": "process"
                              },
                              "property": {
                                 "type": "Identifier",
                                 "name": "getuid"
                              }
                           },
                           "consequent": {
                              "type": "CallExpression",
                              "callee": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "process"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "getuid"
                                 }
                              },
                              "arguments": []
                           },
                           "alternate": {
                              "type": "UnaryExpression",
                              "operator": "-",
                              "argument": {
                                 "type": "Literal",
                                 "value": 1,
                                 "raw": "1"
                              },
                              "prefix": true
                           }
                        }
                     }
                  ]
               },
               "generator": false,
               "expression": false,
               "async": false,
               "$Scope$": "25",
               "$ID$": "72"
            }
         }
      ],
      "kind": "var"
   },
   {
      "type": "VariableDeclaration",
      "declarations": [
         {
            "type": "VariableDeclarator",
            "id": {
               "type": "Identifier",
               "name": "processUmask"
            },
            "init": {
               "type": "FunctionExpression",
               "id": null,
               "params": [],
               "body": {
                  "type": "BlockStatement",
                  "body": [
                     {
                        "type": "ReturnStatement",
                        "argument": {
                           "type": "ConditionalExpression",
                           "test": {
                              "type": "MemberExpression",
                              "computed": false,
                              "object": {
                                 "type": "Identifier",
                                 "name": "process"
                              },
                              "property": {
                                 "type": "Identifier",
                                 "name": "umask"
                              }
                           },
                           "consequent": {
                              "type": "CallExpression",
                              "callee": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "process"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "umask"
                                 }
                              },
                              "arguments": []
                           },
                           "alternate": {
                              "type": "Literal",
                              "value": 0,
                              "raw": "0"
                           }
                        }
                     }
                  ]
               },
               "generator": false,
               "expression": false,
               "async": false,
               "$Scope$": "26",
               "$ID$": "73"
            }
         }
      ],
      "kind": "var"
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
               "name": "extract"
            }
         },
         "right": {
            "type": "FunctionExpression",
            "id": null,
            "params": [
               {
                  "type": "Identifier",
                  "name": "cwd"
               },
               {
                  "type": "Identifier",
                  "name": "opts"
               }
            ],
            "body": {
               "type": "BlockStatement",
               "body": [
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "UnaryExpression",
                        "operator": "!",
                        "argument": {
                           "type": "Identifier",
                           "name": "cwd"
                        },
                        "prefix": true
                     },
                     "consequent": {
                        "type": "ExpressionStatement",
                        "expression": {
                           "type": "AssignmentExpression",
                           "operator": "=",
                           "left": {
                              "type": "Identifier",
                              "name": "cwd"
                           },
                           "right": {
                              "type": "Literal",
                              "value": ".",
                              "raw": "'.'"
                           }
                        }
                     },
                     "alternate": null
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "UnaryExpression",
                        "operator": "!",
                        "argument": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "prefix": true
                     },
                     "consequent": {
                        "type": "ExpressionStatement",
                        "expression": {
                           "type": "AssignmentExpression",
                           "operator": "=",
                           "left": {
                              "type": "Identifier",
                              "name": "opts"
                           },
                           "right": {
                              "type": "ObjectExpression",
                              "properties": []
                           }
                        }
                     },
                     "alternate": null
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "xfs"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "fs"
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "fs"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "ignore"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "LogicalExpression",
                                 "operator": "||",
                                 "left": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "ignore"
                                    }
                                 },
                                 "right": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "filter"
                                    }
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "noop"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "map"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "map"
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "noop"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "mapStream"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "mapStream"
                                 }
                              },
                              "right": {
                                 "type": "Identifier",
                                 "name": "echo"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "own"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "&&",
                              "left": {
                                 "type": "LogicalExpression",
                                 "operator": "&&",
                                 "left": {
                                    "type": "BinaryExpression",
                                    "operator": "!==",
                                    "left": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "chown"
                                       }
                                    },
                                    "right": {
                                       "type": "Literal",
                                       "value": false,
                                       "raw": "false"
                                    }
                                 },
                                 "right": {
                                    "type": "UnaryExpression",
                                    "operator": "!",
                                    "argument": {
                                       "type": "Identifier",
                                       "name": "win32"
                                    },
                                    "prefix": true
                                 }
                              },
                              "right": {
                                 "type": "BinaryExpression",
                                 "operator": "===",
                                 "left": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "processGetuid"
                                    },
                                    "arguments": []
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": 0,
                                    "raw": "0"
                                 }
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "extract"
                           },
                           "init": {
                              "type": "LogicalExpression",
                              "operator": "||",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "extract"
                                 }
                              },
                              "right": {
                                 "type": "CallExpression",
                                 "callee": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "tar"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "extract"
                                    }
                                 },
                                 "arguments": []
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "stack"
                           },
                           "init": {
                              "type": "ArrayExpression",
                              "elements": []
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "now"
                           },
                           "init": {
                              "type": "NewExpression",
                              "callee": {
                                 "type": "Identifier",
                                 "name": "Date"
                              },
                              "arguments": []
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "umask"
                           },
                           "init": {
                              "type": "ConditionalExpression",
                              "test": {
                                 "type": "BinaryExpression",
                                 "operator": "===",
                                 "left": {
                                    "type": "UnaryExpression",
                                    "operator": "typeof",
                                    "argument": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "umask"
                                       }
                                    },
                                    "prefix": true
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": "number",
                                    "raw": "'number'"
                                 }
                              },
                              "consequent": {
                                 "type": "UnaryExpression",
                                 "operator": "~",
                                 "argument": {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "umask"
                                    }
                                 },
                                 "prefix": true
                              },
                              "alternate": {
                                 "type": "UnaryExpression",
                                 "operator": "~",
                                 "argument": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "processUmask"
                                    },
                                    "arguments": []
                                 },
                                 "prefix": true
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "dmode"
                           },
                           "init": {
                              "type": "ConditionalExpression",
                              "test": {
                                 "type": "BinaryExpression",
                                 "operator": "===",
                                 "left": {
                                    "type": "UnaryExpression",
                                    "operator": "typeof",
                                    "argument": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "dmode"
                                       }
                                    },
                                    "prefix": true
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": "number",
                                    "raw": "'number'"
                                 }
                              },
                              "consequent": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "dmode"
                                 }
                              },
                              "alternate": {
                                 "type": "Literal",
                                 "value": 0,
                                 "raw": "0"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "fmode"
                           },
                           "init": {
                              "type": "ConditionalExpression",
                              "test": {
                                 "type": "BinaryExpression",
                                 "operator": "===",
                                 "left": {
                                    "type": "UnaryExpression",
                                    "operator": "typeof",
                                    "argument": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "fmode"
                                       }
                                    },
                                    "prefix": true
                                 },
                                 "right": {
                                    "type": "Literal",
                                    "value": "number",
                                    "raw": "'number'"
                                 }
                              },
                              "consequent": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "fmode"
                                 }
                              },
                              "alternate": {
                                 "type": "Literal",
                                 "value": 0,
                                 "raw": "0"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "strict"
                           },
                           "init": {
                              "type": "BinaryExpression",
                              "operator": "!==",
                              "left": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "strict"
                                 }
                              },
                              "right": {
                                 "type": "Literal",
                                 "value": false,
                                 "raw": "false"
                              }
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "property": {
                           "type": "Identifier",
                           "name": "strip"
                        }
                     },
                     "consequent": {
                        "type": "ExpressionStatement",
                        "expression": {
                           "type": "AssignmentExpression",
                           "operator": "=",
                           "left": {
                              "type": "Identifier",
                              "name": "map"
                           },
                           "right": {
                              "type": "CallExpression",
                              "callee": {
                                 "type": "Identifier",
                                 "name": "strip"
                              },
                              "arguments": [
                                 {
                                    "type": "Identifier",
                                    "name": "map"
                                 },
                                 {
                                    "type": "MemberExpression",
                                    "computed": false,
                                    "object": {
                                       "type": "Identifier",
                                       "name": "opts"
                                    },
                                    "property": {
                                       "type": "Identifier",
                                       "name": "strip"
                                    }
                                 }
                              ]
                           }
                        }
                     },
                     "alternate": null
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "property": {
                           "type": "Identifier",
                           "name": "readable"
                        }
                     },
                     "consequent": {
                        "type": "BlockStatement",
                        "body": [
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "dmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 555,
                                          "raw": "555"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           },
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "fmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 444,
                                          "raw": "444"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           }
                        ]
                     },
                     "alternate": null,
                     "$Scope$": "28"
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "property": {
                           "type": "Identifier",
                           "name": "writable"
                        }
                     },
                     "consequent": {
                        "type": "BlockStatement",
                        "body": [
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "dmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 333,
                                          "raw": "333"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           },
                           {
                              "type": "ExpressionStatement",
                              "expression": {
                                 "type": "AssignmentExpression",
                                 "operator": "|=",
                                 "left": {
                                    "type": "Identifier",
                                    "name": "fmode"
                                 },
                                 "right": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "parseInt"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": 222,
                                          "raw": "222"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": 8,
                                          "raw": "8"
                                       }
                                    ]
                                 }
                              }
                           }
                        ]
                     },
                     "alternate": null,
                     "$Scope$": "29"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "utimesParent"
                           },
                           "init": {
                              "type": "FunctionExpression",
                              "id": null,
                              "params": [
                                 {
                                    "type": "Identifier",
                                    "name": "name"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "cb"
                                 }
                              ],
                              "body": {
                                 "type": "BlockStatement",
                                 "body": [
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "top"
                                             },
                                             "init": null
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "WhileStatement",
                                       "test": {
                                          "type": "LogicalExpression",
                                          "operator": "&&",
                                          "left": {
                                             "type": "AssignmentExpression",
                                             "operator": "=",
                                             "left": {
                                                "type": "Identifier",
                                                "name": "top"
                                             },
                                             "right": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "Identifier",
                                                   "name": "head"
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "stack"
                                                   }
                                                ]
                                             }
                                          },
                                          "right": {
                                             "type": "BinaryExpression",
                                             "operator": "!==",
                                             "left": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "name"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "slice"
                                                   }
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Literal",
                                                      "value": 0,
                                                      "raw": "0"
                                                   },
                                                   {
                                                      "type": "MemberExpression",
                                                      "computed": false,
                                                      "object": {
                                                         "type": "MemberExpression",
                                                         "computed": true,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "top"
                                                         },
                                                         "property": {
                                                            "type": "Literal",
                                                            "value": 0,
                                                            "raw": "0"
                                                         }
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "length"
                                                      }
                                                   }
                                                ]
                                             },
                                             "right": {
                                                "type": "MemberExpression",
                                                "computed": true,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "top"
                                                },
                                                "property": {
                                                   "type": "Literal",
                                                   "value": 0,
                                                   "raw": "0"
                                                }
                                             }
                                          }
                                       },
                                       "body": {
                                          "type": "ExpressionStatement",
                                          "expression": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "stack"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "pop"
                                                }
                                             },
                                             "arguments": []
                                          }
                                       }
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "UnaryExpression",
                                          "operator": "!",
                                          "argument": {
                                             "type": "Identifier",
                                             "name": "top"
                                          },
                                          "prefix": true
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "cb"
                                             },
                                             "arguments": []
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "xfs"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "utimes"
                                             }
                                          },
                                          "arguments": [
                                             {
                                                "type": "MemberExpression",
                                                "computed": true,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "top"
                                                },
                                                "property": {
                                                   "type": "Literal",
                                                   "value": 0,
                                                   "raw": "0"
                                                }
                                             },
                                             {
                                                "type": "Identifier",
                                                "name": "now"
                                             },
                                             {
                                                "type": "MemberExpression",
                                                "computed": true,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "top"
                                                },
                                                "property": {
                                                   "type": "Literal",
                                                   "value": 1,
                                                   "raw": "1"
                                                }
                                             },
                                             {
                                                "type": "Identifier",
                                                "name": "cb"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              "generator": false,
                              "expression": false,
                              "async": false,
                              "$Scope$": "30",
                              "$ID$": "75"
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "utimes"
                           },
                           "init": {
                              "type": "FunctionExpression",
                              "id": null,
                              "params": [
                                 {
                                    "type": "Identifier",
                                    "name": "name"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "header"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "cb"
                                 }
                              ],
                              "body": {
                                 "type": "BlockStatement",
                                 "body": [
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "BinaryExpression",
                                          "operator": "===",
                                          "left": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "opts"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "utimes"
                                             }
                                          },
                                          "right": {
                                             "type": "Literal",
                                             "value": false,
                                             "raw": "false"
                                          }
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "cb"
                                             },
                                             "arguments": []
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "BinaryExpression",
                                          "operator": "===",
                                          "left": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "header"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "type"
                                             }
                                          },
                                          "right": {
                                             "type": "Literal",
                                             "value": "directory",
                                             "raw": "'directory'"
                                          }
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "xfs"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "utimes"
                                                }
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "name"
                                                },
                                                {
                                                   "type": "Identifier",
                                                   "name": "now"
                                                },
                                                {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "mtime"
                                                   }
                                                },
                                                {
                                                   "type": "Identifier",
                                                   "name": "cb"
                                                }
                                             ]
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "BinaryExpression",
                                          "operator": "===",
                                          "left": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "header"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "type"
                                             }
                                          },
                                          "right": {
                                             "type": "Literal",
                                             "value": "symlink",
                                             "raw": "'symlink'"
                                          }
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "utimesParent"
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "name"
                                                },
                                                {
                                                   "type": "Identifier",
                                                   "name": "cb"
                                                }
                                             ]
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "xfs"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "utimes"
                                             }
                                          },
                                          "arguments": [
                                             {
                                                "type": "Identifier",
                                                "name": "name"
                                             },
                                             {
                                                "type": "Identifier",
                                                "name": "now"
                                             },
                                             {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "header"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "mtime"
                                                }
                                             },
                                             {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "err"
                                                   }
                                                ],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "Identifier",
                                                            "name": "err"
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "cb"
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "err"
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "utimesParent"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "name"
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "cb"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "32",
                                                "$ID$": "77"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              "generator": false,
                              "expression": false,
                              "async": false,
                              "$Scope$": "31",
                              "$ID$": "76"
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "VariableDeclaration",
                     "declarations": [
                        {
                           "type": "VariableDeclarator",
                           "id": {
                              "type": "Identifier",
                              "name": "chperm"
                           },
                           "init": {
                              "type": "FunctionExpression",
                              "id": null,
                              "params": [
                                 {
                                    "type": "Identifier",
                                    "name": "name"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "header"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "cb"
                                 }
                              ],
                              "body": {
                                 "type": "BlockStatement",
                                 "body": [
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "link"
                                             },
                                             "init": {
                                                "type": "BinaryExpression",
                                                "operator": "===",
                                                "left": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "type"
                                                   }
                                                },
                                                "right": {
                                                   "type": "Literal",
                                                   "value": "symlink",
                                                   "raw": "'symlink'"
                                                }
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "chmod"
                                             },
                                             "init": {
                                                "type": "ConditionalExpression",
                                                "test": {
                                                   "type": "Identifier",
                                                   "name": "link"
                                                },
                                                "consequent": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "xfs"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "lchmod"
                                                   }
                                                },
                                                "alternate": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "xfs"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "chmod"
                                                   }
                                                }
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "chown"
                                             },
                                             "init": {
                                                "type": "ConditionalExpression",
                                                "test": {
                                                   "type": "Identifier",
                                                   "name": "link"
                                                },
                                                "consequent": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "xfs"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "lchown"
                                                   }
                                                },
                                                "alternate": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "xfs"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "chown"
                                                   }
                                                }
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "UnaryExpression",
                                          "operator": "!",
                                          "argument": {
                                             "type": "Identifier",
                                             "name": "chmod"
                                          },
                                          "prefix": true
                                       },
                                       "consequent": {
                                          "type": "ReturnStatement",
                                          "argument": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "cb"
                                             },
                                             "arguments": []
                                          }
                                       },
                                       "alternate": null
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "mode"
                                             },
                                             "init": {
                                                "type": "BinaryExpression",
                                                "operator": "&",
                                                "left": {
                                                   "type": "BinaryExpression",
                                                   "operator": "|",
                                                   "left": {
                                                      "type": "MemberExpression",
                                                      "computed": false,
                                                      "object": {
                                                         "type": "Identifier",
                                                         "name": "header"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "mode"
                                                      }
                                                   },
                                                   "right": {
                                                      "type": "ConditionalExpression",
                                                      "test": {
                                                         "type": "BinaryExpression",
                                                         "operator": "===",
                                                         "left": {
                                                            "type": "MemberExpression",
                                                            "computed": false,
                                                            "object": {
                                                               "type": "Identifier",
                                                               "name": "header"
                                                            },
                                                            "property": {
                                                               "type": "Identifier",
                                                               "name": "type"
                                                            }
                                                         },
                                                         "right": {
                                                            "type": "Literal",
                                                            "value": "directory",
                                                            "raw": "'directory'"
                                                         }
                                                      },
                                                      "consequent": {
                                                         "type": "Identifier",
                                                         "name": "dmode"
                                                      },
                                                      "alternate": {
                                                         "type": "Identifier",
                                                         "name": "fmode"
                                                      }
                                                   }
                                                },
                                                "right": {
                                                   "type": "Identifier",
                                                   "name": "umask"
                                                }
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "Identifier",
                                             "name": "chmod"
                                          },
                                          "arguments": [
                                             {
                                                "type": "Identifier",
                                                "name": "name"
                                             },
                                             {
                                                "type": "Identifier",
                                                "name": "mode"
                                             },
                                             {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "err"
                                                   }
                                                ],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "Identifier",
                                                            "name": "err"
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "cb"
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "err"
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "UnaryExpression",
                                                            "operator": "!",
                                                            "argument": {
                                                               "type": "Identifier",
                                                               "name": "own"
                                                            },
                                                            "prefix": true
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "cb"
                                                               },
                                                               "arguments": []
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "UnaryExpression",
                                                            "operator": "!",
                                                            "argument": {
                                                               "type": "Identifier",
                                                               "name": "chown"
                                                            },
                                                            "prefix": true
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "cb"
                                                               },
                                                               "arguments": []
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "chown"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "name"
                                                               },
                                                               {
                                                                  "type": "MemberExpression",
                                                                  "computed": false,
                                                                  "object": {
                                                                     "type": "Identifier",
                                                                     "name": "header"
                                                                  },
                                                                  "property": {
                                                                     "type": "Identifier",
                                                                     "name": "uid"
                                                                  }
                                                               },
                                                               {
                                                                  "type": "MemberExpression",
                                                                  "computed": false,
                                                                  "object": {
                                                                     "type": "Identifier",
                                                                     "name": "header"
                                                                  },
                                                                  "property": {
                                                                     "type": "Identifier",
                                                                     "name": "gid"
                                                                  }
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "cb"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "34",
                                                "$ID$": "79"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              "generator": false,
                              "expression": false,
                              "async": false,
                              "$Scope$": "33",
                              "$ID$": "78"
                           }
                        }
                     ],
                     "kind": "var"
                  },
                  {
                     "type": "ExpressionStatement",
                     "expression": {
                        "type": "CallExpression",
                        "callee": {
                           "type": "MemberExpression",
                           "computed": false,
                           "object": {
                              "type": "Identifier",
                              "name": "extract"
                           },
                           "property": {
                              "type": "Identifier",
                              "name": "on"
                           }
                        },
                        "arguments": [
                           {
                              "type": "Literal",
                              "value": "entry",
                              "raw": "'entry'"
                           },
                           {
                              "type": "FunctionExpression",
                              "id": null,
                              "params": [
                                 {
                                    "type": "Identifier",
                                    "name": "header"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "stream"
                                 },
                                 {
                                    "type": "Identifier",
                                    "name": "next"
                                 }
                              ],
                              "body": {
                                 "type": "BlockStatement",
                                 "body": [
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "AssignmentExpression",
                                          "operator": "=",
                                          "left": {
                                             "type": "Identifier",
                                             "name": "header"
                                          },
                                          "right": {
                                             "type": "LogicalExpression",
                                             "operator": "||",
                                             "left": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "Identifier",
                                                   "name": "map"
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   }
                                                ]
                                             },
                                             "right": {
                                                "type": "Identifier",
                                                "name": "header"
                                             }
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
                                                "name": "header"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "name"
                                             }
                                          },
                                          "right": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "normalize"
                                             },
                                             "arguments": [
                                                {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "header"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "name"
                                                   }
                                                }
                                             ]
                                          }
                                       }
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "name"
                                             },
                                             "init": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "path"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "join"
                                                   }
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "cwd"
                                                   },
                                                   {
                                                      "type": "CallExpression",
                                                      "callee": {
                                                         "type": "MemberExpression",
                                                         "computed": false,
                                                         "object": {
                                                            "type": "Identifier",
                                                            "name": "path"
                                                         },
                                                         "property": {
                                                            "type": "Identifier",
                                                            "name": "join"
                                                         }
                                                      },
                                                      "arguments": [
                                                         {
                                                            "type": "Literal",
                                                            "value": "/",
                                                            "raw": "'/'"
                                                         },
                                                         {
                                                            "type": "MemberExpression",
                                                            "computed": false,
                                                            "object": {
                                                               "type": "Identifier",
                                                               "name": "header"
                                                            },
                                                            "property": {
                                                               "type": "Identifier",
                                                               "name": "name"
                                                            }
                                                         }
                                                      ]
                                                   }
                                                ]
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "Identifier",
                                             "name": "ignore"
                                          },
                                          "arguments": [
                                             {
                                                "type": "Identifier",
                                                "name": "name"
                                             },
                                             {
                                                "type": "Identifier",
                                                "name": "header"
                                             }
                                          ]
                                       },
                                       "consequent": {
                                          "type": "BlockStatement",
                                          "body": [
                                             {
                                                "type": "ExpressionStatement",
                                                "expression": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "MemberExpression",
                                                      "computed": false,
                                                      "object": {
                                                         "type": "Identifier",
                                                         "name": "stream"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "resume"
                                                      }
                                                   },
                                                   "arguments": []
                                                }
                                             },
                                             {
                                                "type": "ReturnStatement",
                                                "argument": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "Identifier",
                                                      "name": "next"
                                                   },
                                                   "arguments": []
                                                }
                                             }
                                          ]
                                       },
                                       "alternate": null,
                                       "$Scope$": "36"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "stat"
                                             },
                                             "init": {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "err"
                                                   }
                                                ],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "Identifier",
                                                            "name": "err"
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "next"
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "err"
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "utimes"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "name"
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "header"
                                                               },
                                                               {
                                                                  "type": "FunctionExpression",
                                                                  "id": null,
                                                                  "params": [
                                                                     {
                                                                        "type": "Identifier",
                                                                        "name": "err"
                                                                     }
                                                                  ],
                                                                  "body": {
                                                                     "type": "BlockStatement",
                                                                     "body": [
                                                                        {
                                                                           "type": "IfStatement",
                                                                           "test": {
                                                                              "type": "Identifier",
                                                                              "name": "err"
                                                                           },
                                                                           "consequent": {
                                                                              "type": "ReturnStatement",
                                                                              "argument": {
                                                                                 "type": "CallExpression",
                                                                                 "callee": {
                                                                                    "type": "Identifier",
                                                                                    "name": "next"
                                                                                 },
                                                                                 "arguments": [
                                                                                    {
                                                                                       "type": "Identifier",
                                                                                       "name": "err"
                                                                                    }
                                                                                 ]
                                                                              }
                                                                           },
                                                                           "alternate": null
                                                                        },
                                                                        {
                                                                           "type": "IfStatement",
                                                                           "test": {
                                                                              "type": "Identifier",
                                                                              "name": "win32"
                                                                           },
                                                                           "consequent": {
                                                                              "type": "ReturnStatement",
                                                                              "argument": {
                                                                                 "type": "CallExpression",
                                                                                 "callee": {
                                                                                    "type": "Identifier",
                                                                                    "name": "next"
                                                                                 },
                                                                                 "arguments": []
                                                                              }
                                                                           },
                                                                           "alternate": null
                                                                        },
                                                                        {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "Identifier",
                                                                                 "name": "chperm"
                                                                              },
                                                                              "arguments": [
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "name"
                                                                                 },
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "header"
                                                                                 },
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "next"
                                                                                 }
                                                                              ]
                                                                           }
                                                                        }
                                                                     ]
                                                                  },
                                                                  "generator": false,
                                                                  "expression": false,
                                                                  "async": false,
                                                                  "$Scope$": "38",
                                                                  "$ID$": "82"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "37",
                                                "$ID$": "81"
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "onsymlink"
                                             },
                                             "init": {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "Identifier",
                                                            "name": "win32"
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "next"
                                                               },
                                                               "arguments": []
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "xfs"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "unlink"
                                                               }
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "name"
                                                               },
                                                               {
                                                                  "type": "FunctionExpression",
                                                                  "id": null,
                                                                  "params": [],
                                                                  "body": {
                                                                     "type": "BlockStatement",
                                                                     "body": [
                                                                        {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "MemberExpression",
                                                                                 "computed": false,
                                                                                 "object": {
                                                                                    "type": "Identifier",
                                                                                    "name": "xfs"
                                                                                 },
                                                                                 "property": {
                                                                                    "type": "Identifier",
                                                                                    "name": "symlink"
                                                                                 }
                                                                              },
                                                                              "arguments": [
                                                                                 {
                                                                                    "type": "MemberExpression",
                                                                                    "computed": false,
                                                                                    "object": {
                                                                                       "type": "Identifier",
                                                                                       "name": "header"
                                                                                    },
                                                                                    "property": {
                                                                                       "type": "Identifier",
                                                                                       "name": "linkname"
                                                                                    }
                                                                                 },
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "name"
                                                                                 },
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "stat"
                                                                                 }
                                                                              ]
                                                                           }
                                                                        }
                                                                     ]
                                                                  },
                                                                  "generator": false,
                                                                  "expression": false,
                                                                  "async": false,
                                                                  "$Scope$": "40",
                                                                  "$ID$": "84"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "39",
                                                "$ID$": "83"
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "onlink"
                                             },
                                             "init": {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "Identifier",
                                                            "name": "win32"
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "next"
                                                               },
                                                               "arguments": []
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "xfs"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "unlink"
                                                               }
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "name"
                                                               },
                                                               {
                                                                  "type": "FunctionExpression",
                                                                  "id": null,
                                                                  "params": [],
                                                                  "body": {
                                                                     "type": "BlockStatement",
                                                                     "body": [
                                                                        {
                                                                           "type": "VariableDeclaration",
                                                                           "declarations": [
                                                                              {
                                                                                 "type": "VariableDeclarator",
                                                                                 "id": {
                                                                                    "type": "Identifier",
                                                                                    "name": "srcpath"
                                                                                 },
                                                                                 "init": {
                                                                                    "type": "CallExpression",
                                                                                    "callee": {
                                                                                       "type": "MemberExpression",
                                                                                       "computed": false,
                                                                                       "object": {
                                                                                          "type": "Identifier",
                                                                                          "name": "path"
                                                                                       },
                                                                                       "property": {
                                                                                          "type": "Identifier",
                                                                                          "name": "join"
                                                                                       }
                                                                                    },
                                                                                    "arguments": [
                                                                                       {
                                                                                          "type": "Identifier",
                                                                                          "name": "cwd"
                                                                                       },
                                                                                       {
                                                                                          "type": "CallExpression",
                                                                                          "callee": {
                                                                                             "type": "MemberExpression",
                                                                                             "computed": false,
                                                                                             "object": {
                                                                                                "type": "Identifier",
                                                                                                "name": "path"
                                                                                             },
                                                                                             "property": {
                                                                                                "type": "Identifier",
                                                                                                "name": "join"
                                                                                             }
                                                                                          },
                                                                                          "arguments": [
                                                                                             {
                                                                                                "type": "Literal",
                                                                                                "value": "/",
                                                                                                "raw": "'/'"
                                                                                             },
                                                                                             {
                                                                                                "type": "MemberExpression",
                                                                                                "computed": false,
                                                                                                "object": {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "header"
                                                                                                },
                                                                                                "property": {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "linkname"
                                                                                                }
                                                                                             }
                                                                                          ]
                                                                                       }
                                                                                    ]
                                                                                 }
                                                                              }
                                                                           ],
                                                                           "kind": "var"
                                                                        },
                                                                        {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "MemberExpression",
                                                                                 "computed": false,
                                                                                 "object": {
                                                                                    "type": "Identifier",
                                                                                    "name": "xfs"
                                                                                 },
                                                                                 "property": {
                                                                                    "type": "Identifier",
                                                                                    "name": "link"
                                                                                 }
                                                                              },
                                                                              "arguments": [
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "srcpath"
                                                                                 },
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "name"
                                                                                 },
                                                                                 {
                                                                                    "type": "FunctionExpression",
                                                                                    "id": null,
                                                                                    "params": [
                                                                                       {
                                                                                          "type": "Identifier",
                                                                                          "name": "err"
                                                                                       }
                                                                                    ],
                                                                                    "body": {
                                                                                       "type": "BlockStatement",
                                                                                       "body": [
                                                                                          {
                                                                                             "type": "IfStatement",
                                                                                             "test": {
                                                                                                "type": "LogicalExpression",
                                                                                                "operator": "&&",
                                                                                                "left": {
                                                                                                   "type": "LogicalExpression",
                                                                                                   "operator": "&&",
                                                                                                   "left": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "err"
                                                                                                   },
                                                                                                   "right": {
                                                                                                      "type": "BinaryExpression",
                                                                                                      "operator": "===",
                                                                                                      "left": {
                                                                                                         "type": "MemberExpression",
                                                                                                         "computed": false,
                                                                                                         "object": {
                                                                                                            "type": "Identifier",
                                                                                                            "name": "err"
                                                                                                         },
                                                                                                         "property": {
                                                                                                            "type": "Identifier",
                                                                                                            "name": "code"
                                                                                                         }
                                                                                                      },
                                                                                                      "right": {
                                                                                                         "type": "Literal",
                                                                                                         "value": "EPERM",
                                                                                                         "raw": "'EPERM'"
                                                                                                      }
                                                                                                   }
                                                                                                },
                                                                                                "right": {
                                                                                                   "type": "MemberExpression",
                                                                                                   "computed": false,
                                                                                                   "object": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "opts"
                                                                                                   },
                                                                                                   "property": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "hardlinkAsFilesFallback"
                                                                                                   }
                                                                                                }
                                                                                             },
                                                                                             "consequent": {
                                                                                                "type": "BlockStatement",
                                                                                                "body": [
                                                                                                   {
                                                                                                      "type": "ExpressionStatement",
                                                                                                      "expression": {
                                                                                                         "type": "AssignmentExpression",
                                                                                                         "operator": "=",
                                                                                                         "left": {
                                                                                                            "type": "Identifier",
                                                                                                            "name": "stream"
                                                                                                         },
                                                                                                         "right": {
                                                                                                            "type": "CallExpression",
                                                                                                            "callee": {
                                                                                                               "type": "MemberExpression",
                                                                                                               "computed": false,
                                                                                                               "object": {
                                                                                                                  "type": "Identifier",
                                                                                                                  "name": "xfs"
                                                                                                               },
                                                                                                               "property": {
                                                                                                                  "type": "Identifier",
                                                                                                                  "name": "createReadStream"
                                                                                                               }
                                                                                                            },
                                                                                                            "arguments": [
                                                                                                               {
                                                                                                                  "type": "Identifier",
                                                                                                                  "name": "srcpath"
                                                                                                               }
                                                                                                            ]
                                                                                                         }
                                                                                                      }
                                                                                                   },
                                                                                                   {
                                                                                                      "type": "ReturnStatement",
                                                                                                      "argument": {
                                                                                                         "type": "CallExpression",
                                                                                                         "callee": {
                                                                                                            "type": "Identifier",
                                                                                                            "name": "onfile"
                                                                                                         },
                                                                                                         "arguments": []
                                                                                                      }
                                                                                                   }
                                                                                                ]
                                                                                             },
                                                                                             "alternate": null,
                                                                                             "$Scope$": "44"
                                                                                          },
                                                                                          {
                                                                                             "type": "ExpressionStatement",
                                                                                             "expression": {
                                                                                                "type": "CallExpression",
                                                                                                "callee": {
                                                                                                   "type": "Identifier",
                                                                                                   "name": "stat"
                                                                                                },
                                                                                                "arguments": [
                                                                                                   {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "err"
                                                                                                   }
                                                                                                ]
                                                                                             }
                                                                                          }
                                                                                       ]
                                                                                    },
                                                                                    "generator": false,
                                                                                    "expression": false,
                                                                                    "async": false,
                                                                                    "$Scope$": "43",
                                                                                    "$ID$": "87"
                                                                                 }
                                                                              ]
                                                                           }
                                                                        }
                                                                     ]
                                                                  },
                                                                  "generator": false,
                                                                  "expression": false,
                                                                  "async": false,
                                                                  "$Scope$": "42",
                                                                  "$ID$": "86"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "41",
                                                "$ID$": "85"
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "onfile"
                                             },
                                             "init": {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "VariableDeclaration",
                                                         "declarations": [
                                                            {
                                                               "type": "VariableDeclarator",
                                                               "id": {
                                                                  "type": "Identifier",
                                                                  "name": "ws"
                                                               },
                                                               "init": {
                                                                  "type": "CallExpression",
                                                                  "callee": {
                                                                     "type": "MemberExpression",
                                                                     "computed": false,
                                                                     "object": {
                                                                        "type": "Identifier",
                                                                        "name": "xfs"
                                                                     },
                                                                     "property": {
                                                                        "type": "Identifier",
                                                                        "name": "createWriteStream"
                                                                     }
                                                                  },
                                                                  "arguments": [
                                                                     {
                                                                        "type": "Identifier",
                                                                        "name": "name"
                                                                     }
                                                                  ]
                                                               }
                                                            }
                                                         ],
                                                         "kind": "var"
                                                      },
                                                      {
                                                         "type": "VariableDeclaration",
                                                         "declarations": [
                                                            {
                                                               "type": "VariableDeclarator",
                                                               "id": {
                                                                  "type": "Identifier",
                                                                  "name": "rs"
                                                               },
                                                               "init": {
                                                                  "type": "CallExpression",
                                                                  "callee": {
                                                                     "type": "Identifier",
                                                                     "name": "mapStream"
                                                                  },
                                                                  "arguments": [
                                                                     {
                                                                        "type": "Identifier",
                                                                        "name": "stream"
                                                                     },
                                                                     {
                                                                        "type": "Identifier",
                                                                        "name": "header"
                                                                     }
                                                                  ]
                                                               }
                                                            }
                                                         ],
                                                         "kind": "var"
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "ws"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "on"
                                                               }
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Literal",
                                                                  "value": "error",
                                                                  "raw": "'error'"
                                                               },
                                                               {
                                                                  "type": "FunctionExpression",
                                                                  "id": null,
                                                                  "params": [
                                                                     {
                                                                        "type": "Identifier",
                                                                        "name": "err"
                                                                     }
                                                                  ],
                                                                  "body": {
                                                                     "type": "BlockStatement",
                                                                     "body": [
                                                                        {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "MemberExpression",
                                                                                 "computed": false,
                                                                                 "object": {
                                                                                    "type": "Identifier",
                                                                                    "name": "rs"
                                                                                 },
                                                                                 "property": {
                                                                                    "type": "Identifier",
                                                                                    "name": "destroy"
                                                                                 }
                                                                              },
                                                                              "arguments": [
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "err"
                                                                                 }
                                                                              ]
                                                                           }
                                                                        }
                                                                     ]
                                                                  },
                                                                  "generator": false,
                                                                  "expression": false,
                                                                  "async": false,
                                                                  "$Scope$": "46",
                                                                  "$ID$": "89"
                                                               }
                                                            ]
                                                         }
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "pump"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "rs"
                                                               },
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "ws"
                                                               },
                                                               {
                                                                  "type": "FunctionExpression",
                                                                  "id": null,
                                                                  "params": [
                                                                     {
                                                                        "type": "Identifier",
                                                                        "name": "err"
                                                                     }
                                                                  ],
                                                                  "body": {
                                                                     "type": "BlockStatement",
                                                                     "body": [
                                                                        {
                                                                           "type": "IfStatement",
                                                                           "test": {
                                                                              "type": "Identifier",
                                                                              "name": "err"
                                                                           },
                                                                           "consequent": {
                                                                              "type": "ReturnStatement",
                                                                              "argument": {
                                                                                 "type": "CallExpression",
                                                                                 "callee": {
                                                                                    "type": "Identifier",
                                                                                    "name": "next"
                                                                                 },
                                                                                 "arguments": [
                                                                                    {
                                                                                       "type": "Identifier",
                                                                                       "name": "err"
                                                                                    }
                                                                                 ]
                                                                              }
                                                                           },
                                                                           "alternate": null
                                                                        },
                                                                        {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "MemberExpression",
                                                                                 "computed": false,
                                                                                 "object": {
                                                                                    "type": "Identifier",
                                                                                    "name": "ws"
                                                                                 },
                                                                                 "property": {
                                                                                    "type": "Identifier",
                                                                                    "name": "on"
                                                                                 }
                                                                              },
                                                                              "arguments": [
                                                                                 {
                                                                                    "type": "Literal",
                                                                                    "value": "close",
                                                                                    "raw": "'close'"
                                                                                 },
                                                                                 {
                                                                                    "type": "Identifier",
                                                                                    "name": "stat"
                                                                                 }
                                                                              ]
                                                                           }
                                                                        }
                                                                     ]
                                                                  },
                                                                  "generator": false,
                                                                  "expression": false,
                                                                  "async": false,
                                                                  "$Scope$": "47",
                                                                  "$ID$": "90"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "45",
                                                "$ID$": "88"
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "IfStatement",
                                       "test": {
                                          "type": "BinaryExpression",
                                          "operator": "===",
                                          "left": {
                                             "type": "MemberExpression",
                                             "computed": false,
                                             "object": {
                                                "type": "Identifier",
                                                "name": "header"
                                             },
                                             "property": {
                                                "type": "Identifier",
                                                "name": "type"
                                             }
                                          },
                                          "right": {
                                             "type": "Literal",
                                             "value": "directory",
                                             "raw": "'directory'"
                                          }
                                       },
                                       "consequent": {
                                          "type": "BlockStatement",
                                          "body": [
                                             {
                                                "type": "ExpressionStatement",
                                                "expression": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "MemberExpression",
                                                      "computed": false,
                                                      "object": {
                                                         "type": "Identifier",
                                                         "name": "stack"
                                                      },
                                                      "property": {
                                                         "type": "Identifier",
                                                         "name": "push"
                                                      }
                                                   },
                                                   "arguments": [
                                                      {
                                                         "type": "ArrayExpression",
                                                         "elements": [
                                                            {
                                                               "type": "Identifier",
                                                               "name": "name"
                                                            },
                                                            {
                                                               "type": "MemberExpression",
                                                               "computed": false,
                                                               "object": {
                                                                  "type": "Identifier",
                                                                  "name": "header"
                                                               },
                                                               "property": {
                                                                  "type": "Identifier",
                                                                  "name": "mtime"
                                                               }
                                                            }
                                                         ]
                                                      }
                                                   ]
                                                }
                                             },
                                             {
                                                "type": "ReturnStatement",
                                                "argument": {
                                                   "type": "CallExpression",
                                                   "callee": {
                                                      "type": "Identifier",
                                                      "name": "mkdirfix"
                                                   },
                                                   "arguments": [
                                                      {
                                                         "type": "Identifier",
                                                         "name": "name"
                                                      },
                                                      {
                                                         "type": "ObjectExpression",
                                                         "properties": [
                                                            {
                                                               "type": "Property",
                                                               "key": {
                                                                  "type": "Identifier",
                                                                  "name": "fs"
                                                               },
                                                               "computed": false,
                                                               "value": {
                                                                  "type": "Identifier",
                                                                  "name": "xfs"
                                                               },
                                                               "kind": "init",
                                                               "method": false,
                                                               "shorthand": false
                                                            },
                                                            {
                                                               "type": "Property",
                                                               "key": {
                                                                  "type": "Identifier",
                                                                  "name": "own"
                                                               },
                                                               "computed": false,
                                                               "value": {
                                                                  "type": "Identifier",
                                                                  "name": "own"
                                                               },
                                                               "kind": "init",
                                                               "method": false,
                                                               "shorthand": false
                                                            },
                                                            {
                                                               "type": "Property",
                                                               "key": {
                                                                  "type": "Identifier",
                                                                  "name": "uid"
                                                               },
                                                               "computed": false,
                                                               "value": {
                                                                  "type": "MemberExpression",
                                                                  "computed": false,
                                                                  "object": {
                                                                     "type": "Identifier",
                                                                     "name": "header"
                                                                  },
                                                                  "property": {
                                                                     "type": "Identifier",
                                                                     "name": "uid"
                                                                  }
                                                               },
                                                               "kind": "init",
                                                               "method": false,
                                                               "shorthand": false
                                                            },
                                                            {
                                                               "type": "Property",
                                                               "key": {
                                                                  "type": "Identifier",
                                                                  "name": "gid"
                                                               },
                                                               "computed": false,
                                                               "value": {
                                                                  "type": "MemberExpression",
                                                                  "computed": false,
                                                                  "object": {
                                                                     "type": "Identifier",
                                                                     "name": "header"
                                                                  },
                                                                  "property": {
                                                                     "type": "Identifier",
                                                                     "name": "gid"
                                                                  }
                                                               },
                                                               "kind": "init",
                                                               "method": false,
                                                               "shorthand": false
                                                            }
                                                         ]
                                                      },
                                                      {
                                                         "type": "Identifier",
                                                         "name": "stat"
                                                      }
                                                   ]
                                                }
                                             }
                                          ]
                                       },
                                       "alternate": null,
                                       "$Scope$": "48"
                                    },
                                    {
                                       "type": "VariableDeclaration",
                                       "declarations": [
                                          {
                                             "type": "VariableDeclarator",
                                             "id": {
                                                "type": "Identifier",
                                                "name": "dir"
                                             },
                                             "init": {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "path"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "dirname"
                                                   }
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "name"
                                                   }
                                                ]
                                             }
                                          }
                                       ],
                                       "kind": "var"
                                    },
                                    {
                                       "type": "ExpressionStatement",
                                       "expression": {
                                          "type": "CallExpression",
                                          "callee": {
                                             "type": "Identifier",
                                             "name": "validate"
                                          },
                                          "arguments": [
                                             {
                                                "type": "Identifier",
                                                "name": "xfs"
                                             },
                                             {
                                                "type": "Identifier",
                                                "name": "dir"
                                             },
                                             {
                                                "type": "CallExpression",
                                                "callee": {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "path"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "join"
                                                   }
                                                },
                                                "arguments": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "cwd"
                                                   },
                                                   {
                                                      "type": "Literal",
                                                      "value": ".",
                                                      "raw": "'.'"
                                                   }
                                                ]
                                             },
                                             {
                                                "type": "FunctionExpression",
                                                "id": null,
                                                "params": [
                                                   {
                                                      "type": "Identifier",
                                                      "name": "err"
                                                   },
                                                   {
                                                      "type": "Identifier",
                                                      "name": "valid"
                                                   }
                                                ],
                                                "body": {
                                                   "type": "BlockStatement",
                                                   "body": [
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "Identifier",
                                                            "name": "err"
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "next"
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "Identifier",
                                                                     "name": "err"
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "IfStatement",
                                                         "test": {
                                                            "type": "UnaryExpression",
                                                            "operator": "!",
                                                            "argument": {
                                                               "type": "Identifier",
                                                               "name": "valid"
                                                            },
                                                            "prefix": true
                                                         },
                                                         "consequent": {
                                                            "type": "ReturnStatement",
                                                            "argument": {
                                                               "type": "CallExpression",
                                                               "callee": {
                                                                  "type": "Identifier",
                                                                  "name": "next"
                                                               },
                                                               "arguments": [
                                                                  {
                                                                     "type": "NewExpression",
                                                                     "callee": {
                                                                        "type": "Identifier",
                                                                        "name": "Error"
                                                                     },
                                                                     "arguments": [
                                                                        {
                                                                           "type": "BinaryExpression",
                                                                           "operator": "+",
                                                                           "left": {
                                                                              "type": "Identifier",
                                                                              "name": "dir"
                                                                           },
                                                                           "right": {
                                                                              "type": "Literal",
                                                                              "value": " is not a valid path",
                                                                              "raw": "' is not a valid path'"
                                                                           }
                                                                        }
                                                                     ]
                                                                  }
                                                               ]
                                                            }
                                                         },
                                                         "alternate": null
                                                      },
                                                      {
                                                         "type": "ExpressionStatement",
                                                         "expression": {
                                                            "type": "CallExpression",
                                                            "callee": {
                                                               "type": "Identifier",
                                                               "name": "mkdirfix"
                                                            },
                                                            "arguments": [
                                                               {
                                                                  "type": "Identifier",
                                                                  "name": "dir"
                                                               },
                                                               {
                                                                  "type": "ObjectExpression",
                                                                  "properties": [
                                                                     {
                                                                        "type": "Property",
                                                                        "key": {
                                                                           "type": "Identifier",
                                                                           "name": "fs"
                                                                        },
                                                                        "computed": false,
                                                                        "value": {
                                                                           "type": "Identifier",
                                                                           "name": "xfs"
                                                                        },
                                                                        "kind": "init",
                                                                        "method": false,
                                                                        "shorthand": false
                                                                     },
                                                                     {
                                                                        "type": "Property",
                                                                        "key": {
                                                                           "type": "Identifier",
                                                                           "name": "own"
                                                                        },
                                                                        "computed": false,
                                                                        "value": {
                                                                           "type": "Identifier",
                                                                           "name": "own"
                                                                        },
                                                                        "kind": "init",
                                                                        "method": false,
                                                                        "shorthand": false
                                                                     },
                                                                     {
                                                                        "type": "Property",
                                                                        "key": {
                                                                           "type": "Identifier",
                                                                           "name": "uid"
                                                                        },
                                                                        "computed": false,
                                                                        "value": {
                                                                           "type": "MemberExpression",
                                                                           "computed": false,
                                                                           "object": {
                                                                              "type": "Identifier",
                                                                              "name": "header"
                                                                           },
                                                                           "property": {
                                                                              "type": "Identifier",
                                                                              "name": "uid"
                                                                           }
                                                                        },
                                                                        "kind": "init",
                                                                        "method": false,
                                                                        "shorthand": false
                                                                     },
                                                                     {
                                                                        "type": "Property",
                                                                        "key": {
                                                                           "type": "Identifier",
                                                                           "name": "gid"
                                                                        },
                                                                        "computed": false,
                                                                        "value": {
                                                                           "type": "MemberExpression",
                                                                           "computed": false,
                                                                           "object": {
                                                                              "type": "Identifier",
                                                                              "name": "header"
                                                                           },
                                                                           "property": {
                                                                              "type": "Identifier",
                                                                              "name": "gid"
                                                                           }
                                                                        },
                                                                        "kind": "init",
                                                                        "method": false,
                                                                        "shorthand": false
                                                                     }
                                                                  ]
                                                               },
                                                               {
                                                                  "type": "FunctionExpression",
                                                                  "id": null,
                                                                  "params": [
                                                                     {
                                                                        "type": "Identifier",
                                                                        "name": "err"
                                                                     }
                                                                  ],
                                                                  "body": {
                                                                     "type": "BlockStatement",
                                                                     "body": [
                                                                        {
                                                                           "type": "IfStatement",
                                                                           "test": {
                                                                              "type": "Identifier",
                                                                              "name": "err"
                                                                           },
                                                                           "consequent": {
                                                                              "type": "ReturnStatement",
                                                                              "argument": {
                                                                                 "type": "CallExpression",
                                                                                 "callee": {
                                                                                    "type": "Identifier",
                                                                                    "name": "next"
                                                                                 },
                                                                                 "arguments": [
                                                                                    {
                                                                                       "type": "Identifier",
                                                                                       "name": "err"
                                                                                    }
                                                                                 ]
                                                                              }
                                                                           },
                                                                           "alternate": null
                                                                        },
                                                                        {
                                                                           "type": "SwitchStatement",
                                                                           "discriminant": {
                                                                              "type": "MemberExpression",
                                                                              "computed": false,
                                                                              "object": {
                                                                                 "type": "Identifier",
                                                                                 "name": "header"
                                                                              },
                                                                              "property": {
                                                                                 "type": "Identifier",
                                                                                 "name": "type"
                                                                              }
                                                                           },
                                                                           "cases": [
                                                                              {
                                                                                 "type": "SwitchCase",
                                                                                 "test": {
                                                                                    "type": "Literal",
                                                                                    "value": "file",
                                                                                    "raw": "'file'"
                                                                                 },
                                                                                 "consequent": [
                                                                                    {
                                                                                       "type": "ReturnStatement",
                                                                                       "argument": {
                                                                                          "type": "CallExpression",
                                                                                          "callee": {
                                                                                             "type": "Identifier",
                                                                                             "name": "onfile"
                                                                                          },
                                                                                          "arguments": []
                                                                                       }
                                                                                    }
                                                                                 ]
                                                                              },
                                                                              {
                                                                                 "type": "SwitchCase",
                                                                                 "test": {
                                                                                    "type": "Literal",
                                                                                    "value": "link",
                                                                                    "raw": "'link'"
                                                                                 },
                                                                                 "consequent": [
                                                                                    {
                                                                                       "type": "ReturnStatement",
                                                                                       "argument": {
                                                                                          "type": "CallExpression",
                                                                                          "callee": {
                                                                                             "type": "Identifier",
                                                                                             "name": "onlink"
                                                                                          },
                                                                                          "arguments": []
                                                                                       }
                                                                                    }
                                                                                 ]
                                                                              },
                                                                              {
                                                                                 "type": "SwitchCase",
                                                                                 "test": {
                                                                                    "type": "Literal",
                                                                                    "value": "symlink",
                                                                                    "raw": "'symlink'"
                                                                                 },
                                                                                 "consequent": [
                                                                                    {
                                                                                       "type": "ReturnStatement",
                                                                                       "argument": {
                                                                                          "type": "CallExpression",
                                                                                          "callee": {
                                                                                             "type": "Identifier",
                                                                                             "name": "onsymlink"
                                                                                          },
                                                                                          "arguments": []
                                                                                       }
                                                                                    }
                                                                                 ]
                                                                              }
                                                                           ]
                                                                        },
                                                                        {
                                                                           "type": "IfStatement",
                                                                           "test": {
                                                                              "type": "Identifier",
                                                                              "name": "strict"
                                                                           },
                                                                           "consequent": {
                                                                              "type": "ReturnStatement",
                                                                              "argument": {
                                                                                 "type": "CallExpression",
                                                                                 "callee": {
                                                                                    "type": "Identifier",
                                                                                    "name": "next"
                                                                                 },
                                                                                 "arguments": [
                                                                                    {
                                                                                       "type": "NewExpression",
                                                                                       "callee": {
                                                                                          "type": "Identifier",
                                                                                          "name": "Error"
                                                                                       },
                                                                                       "arguments": [
                                                                                          {
                                                                                             "type": "BinaryExpression",
                                                                                             "operator": "+",
                                                                                             "left": {
                                                                                                "type": "BinaryExpression",
                                                                                                "operator": "+",
                                                                                                "left": {
                                                                                                   "type": "BinaryExpression",
                                                                                                   "operator": "+",
                                                                                                   "left": {
                                                                                                      "type": "BinaryExpression",
                                                                                                      "operator": "+",
                                                                                                      "left": {
                                                                                                         "type": "Literal",
                                                                                                         "value": "unsupported type for ",
                                                                                                         "raw": "'unsupported type for '"
                                                                                                      },
                                                                                                      "right": {
                                                                                                         "type": "Identifier",
                                                                                                         "name": "name"
                                                                                                      }
                                                                                                   },
                                                                                                   "right": {
                                                                                                      "type": "Literal",
                                                                                                      "value": " (",
                                                                                                      "raw": "' ('"
                                                                                                   }
                                                                                                },
                                                                                                "right": {
                                                                                                   "type": "MemberExpression",
                                                                                                   "computed": false,
                                                                                                   "object": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "header"
                                                                                                   },
                                                                                                   "property": {
                                                                                                      "type": "Identifier",
                                                                                                      "name": "type"
                                                                                                   }
                                                                                                }
                                                                                             },
                                                                                             "right": {
                                                                                                "type": "Literal",
                                                                                                "value": ")",
                                                                                                "raw": "')'"
                                                                                             }
                                                                                          }
                                                                                       ]
                                                                                    }
                                                                                 ]
                                                                              }
                                                                           },
                                                                           "alternate": null
                                                                        },
                                                                        {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "MemberExpression",
                                                                                 "computed": false,
                                                                                 "object": {
                                                                                    "type": "Identifier",
                                                                                    "name": "stream"
                                                                                 },
                                                                                 "property": {
                                                                                    "type": "Identifier",
                                                                                    "name": "resume"
                                                                                 }
                                                                              },
                                                                              "arguments": []
                                                                           }
                                                                        },
                                                                        {
                                                                           "type": "ExpressionStatement",
                                                                           "expression": {
                                                                              "type": "CallExpression",
                                                                              "callee": {
                                                                                 "type": "Identifier",
                                                                                 "name": "next"
                                                                              },
                                                                              "arguments": []
                                                                           }
                                                                        }
                                                                     ]
                                                                  },
                                                                  "generator": false,
                                                                  "expression": false,
                                                                  "async": false,
                                                                  "$Scope$": "50",
                                                                  "$ID$": "92"
                                                               }
                                                            ]
                                                         }
                                                      }
                                                   ]
                                                },
                                                "generator": false,
                                                "expression": false,
                                                "async": false,
                                                "$Scope$": "49",
                                                "$ID$": "91"
                                             }
                                          ]
                                       }
                                    }
                                 ]
                              },
                              "generator": false,
                              "expression": false,
                              "async": false,
                              "$Scope$": "35",
                              "$ID$": "80"
                           }
                        ]
                     }
                  },
                  {
                     "type": "IfStatement",
                     "test": {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                           "type": "Identifier",
                           "name": "opts"
                        },
                        "property": {
                           "type": "Identifier",
                           "name": "finish"
                        }
                     },
                     "consequent": {
                        "type": "ExpressionStatement",
                        "expression": {
                           "type": "CallExpression",
                           "callee": {
                              "type": "MemberExpression",
                              "computed": false,
                              "object": {
                                 "type": "Identifier",
                                 "name": "extract"
                              },
                              "property": {
                                 "type": "Identifier",
                                 "name": "on"
                              }
                           },
                           "arguments": [
                              {
                                 "type": "Literal",
                                 "value": "finish",
                                 "raw": "'finish'"
                              },
                              {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "finish"
                                 }
                              }
                           ]
                        }
                     },
                     "alternate": null
                  },
                  {
                     "type": "ReturnStatement",
                     "argument": {
                        "type": "Identifier",
                        "name": "extract"
                     }
                  }
               ]
            },
            "generator": false,
            "expression": false,
            "async": false,
            "$Scope$": "27",
            "$ID$": "74"
         }
      }
   },
   {
      "type": "FunctionDeclaration",
      "id": {
         "type": "Identifier",
         "name": "validate",
         "markings": [
            "maybe_shadow"
         ]
      },
      "params": [
         {
            "type": "Identifier",
            "name": "fs"
         },
         {
            "type": "Identifier",
            "name": "name"
         },
         {
            "type": "Identifier",
            "name": "root"
         },
         {
            "type": "Identifier",
            "name": "cb"
         }
      ],
      "body": {
         "type": "BlockStatement",
         "body": [
            {
               "type": "IfStatement",
               "test": {
                  "type": "BinaryExpression",
                  "operator": "===",
                  "left": {
                     "type": "Identifier",
                     "name": "name"
                  },
                  "right": {
                     "type": "Identifier",
                     "name": "root"
                  }
               },
               "consequent": {
                  "type": "ReturnStatement",
                  "argument": {
                     "type": "CallExpression",
                     "callee": {
                        "type": "Identifier",
                        "name": "cb"
                     },
                     "arguments": [
                        {
                           "type": "Literal",
                           "value": null,
                           "raw": "null"
                        },
                        {
                           "type": "Literal",
                           "value": true,
                           "raw": "true"
                        }
                     ]
                  }
               },
               "alternate": null
            },
            {
               "type": "ExpressionStatement",
               "expression": {
                  "type": "CallExpression",
                  "callee": {
                     "type": "MemberExpression",
                     "computed": false,
                     "object": {
                        "type": "Identifier",
                        "name": "fs"
                     },
                     "property": {
                        "type": "Identifier",
                        "name": "lstat"
                     }
                  },
                  "arguments": [
                     {
                        "type": "Identifier",
                        "name": "name"
                     },
                     {
                        "type": "FunctionExpression",
                        "id": null,
                        "params": [
                           {
                              "type": "Identifier",
                              "name": "err"
                           },
                           {
                              "type": "Identifier",
                              "name": "st"
                           }
                        ],
                        "body": {
                           "type": "BlockStatement",
                           "body": [
                              {
                                 "type": "IfStatement",
                                 "test": {
                                    "type": "LogicalExpression",
                                    "operator": "&&",
                                    "left": {
                                       "type": "Identifier",
                                       "name": "err"
                                    },
                                    "right": {
                                       "type": "BinaryExpression",
                                       "operator": "!==",
                                       "left": {
                                          "type": "MemberExpression",
                                          "computed": false,
                                          "object": {
                                             "type": "Identifier",
                                             "name": "err"
                                          },
                                          "property": {
                                             "type": "Identifier",
                                             "name": "code"
                                          }
                                       },
                                       "right": {
                                          "type": "Literal",
                                          "value": "ENOENT",
                                          "raw": "'ENOENT'"
                                       }
                                    }
                                 },
                                 "consequent": {
                                    "type": "ReturnStatement",
                                    "argument": {
                                       "type": "CallExpression",
                                       "callee": {
                                          "type": "Identifier",
                                          "name": "cb"
                                       },
                                       "arguments": [
                                          {
                                             "type": "Identifier",
                                             "name": "err"
                                          }
                                       ]
                                    }
                                 },
                                 "alternate": null
                              },
                              {
                                 "type": "IfStatement",
                                 "test": {
                                    "type": "LogicalExpression",
                                    "operator": "||",
                                    "left": {
                                       "type": "Identifier",
                                       "name": "err"
                                    },
                                    "right": {
                                       "type": "CallExpression",
                                       "callee": {
                                          "type": "MemberExpression",
                                          "computed": false,
                                          "object": {
                                             "type": "Identifier",
                                             "name": "st"
                                          },
                                          "property": {
                                             "type": "Identifier",
                                             "name": "isDirectory"
                                          }
                                       },
                                       "arguments": []
                                    }
                                 },
                                 "consequent": {
                                    "type": "ReturnStatement",
                                    "argument": {
                                       "type": "CallExpression",
                                       "callee": {
                                          "type": "Identifier",
                                          "name": "validate"
                                       },
                                       "arguments": [
                                          {
                                             "type": "Identifier",
                                             "name": "fs"
                                          },
                                          {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "MemberExpression",
                                                "computed": false,
                                                "object": {
                                                   "type": "Identifier",
                                                   "name": "path"
                                                },
                                                "property": {
                                                   "type": "Identifier",
                                                   "name": "join"
                                                }
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "name"
                                                },
                                                {
                                                   "type": "Literal",
                                                   "value": "..",
                                                   "raw": "'..'"
                                                }
                                             ]
                                          },
                                          {
                                             "type": "Identifier",
                                             "name": "root"
                                          },
                                          {
                                             "type": "Identifier",
                                             "name": "cb"
                                          }
                                       ]
                                    }
                                 },
                                 "alternate": null
                              },
                              {
                                 "type": "ExpressionStatement",
                                 "expression": {
                                    "type": "CallExpression",
                                    "callee": {
                                       "type": "Identifier",
                                       "name": "cb"
                                    },
                                    "arguments": [
                                       {
                                          "type": "Literal",
                                          "value": null,
                                          "raw": "null"
                                       },
                                       {
                                          "type": "Literal",
                                          "value": false,
                                          "raw": "false"
                                       }
                                    ]
                                 }
                              }
                           ]
                        },
                        "generator": false,
                        "expression": false,
                        "async": false,
                        "$Scope$": "52",
                        "$ID$": "94"
                     }
                  ]
               }
            }
         ]
      },
      "generator": false,
      "expression": false,
      "async": false,
      "$Scope$": "51",
      "$ID$": "93"
   },
   {
      "type": "FunctionDeclaration",
      "id": {
         "type": "Identifier",
         "name": "mkdirfix",
         "markings": [
            "maybe_shadow"
         ]
      },
      "params": [
         {
            "type": "Identifier",
            "name": "name"
         },
         {
            "type": "Identifier",
            "name": "opts"
         },
         {
            "type": "Identifier",
            "name": "cb"
         }
      ],
      "body": {
         "type": "BlockStatement",
         "body": [
            {
               "type": "ExpressionStatement",
               "expression": {
                  "type": "CallExpression",
                  "callee": {
                     "type": "Identifier",
                     "name": "mkdirp"
                  },
                  "arguments": [
                     {
                        "type": "Identifier",
                        "name": "name"
                     },
                     {
                        "type": "ObjectExpression",
                        "properties": [
                           {
                              "type": "Property",
                              "key": {
                                 "type": "Identifier",
                                 "name": "fs"
                              },
                              "computed": false,
                              "value": {
                                 "type": "MemberExpression",
                                 "computed": false,
                                 "object": {
                                    "type": "Identifier",
                                    "name": "opts"
                                 },
                                 "property": {
                                    "type": "Identifier",
                                    "name": "fs"
                                 }
                              },
                              "kind": "init",
                              "method": false,
                              "shorthand": false
                           }
                        ]
                     },
                     {
                        "type": "FunctionExpression",
                        "id": null,
                        "params": [
                           {
                              "type": "Identifier",
                              "name": "err"
                           },
                           {
                              "type": "Identifier",
                              "name": "made"
                           }
                        ],
                        "body": {
                           "type": "BlockStatement",
                           "body": [
                              {
                                 "type": "IfStatement",
                                 "test": {
                                    "type": "LogicalExpression",
                                    "operator": "&&",
                                    "left": {
                                       "type": "LogicalExpression",
                                       "operator": "&&",
                                       "left": {
                                          "type": "UnaryExpression",
                                          "operator": "!",
                                          "argument": {
                                             "type": "Identifier",
                                             "name": "err"
                                          },
                                          "prefix": true
                                       },
                                       "right": {
                                          "type": "Identifier",
                                          "name": "made"
                                       }
                                    },
                                    "right": {
                                       "type": "MemberExpression",
                                       "computed": false,
                                       "object": {
                                          "type": "Identifier",
                                          "name": "opts"
                                       },
                                       "property": {
                                          "type": "Identifier",
                                          "name": "own"
                                       }
                                    }
                                 },
                                 "consequent": {
                                    "type": "BlockStatement",
                                    "body": [
                                       {
                                          "type": "ExpressionStatement",
                                          "expression": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "chownr"
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "made"
                                                },
                                                {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "opts"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "uid"
                                                   }
                                                },
                                                {
                                                   "type": "MemberExpression",
                                                   "computed": false,
                                                   "object": {
                                                      "type": "Identifier",
                                                      "name": "opts"
                                                   },
                                                   "property": {
                                                      "type": "Identifier",
                                                      "name": "gid"
                                                   }
                                                },
                                                {
                                                   "type": "Identifier",
                                                   "name": "cb"
                                                }
                                             ]
                                          }
                                       }
                                    ]
                                 },
                                 "alternate": {
                                    "type": "BlockStatement",
                                    "body": [
                                       {
                                          "type": "ExpressionStatement",
                                          "expression": {
                                             "type": "CallExpression",
                                             "callee": {
                                                "type": "Identifier",
                                                "name": "cb"
                                             },
                                             "arguments": [
                                                {
                                                   "type": "Identifier",
                                                   "name": "err"
                                                }
                                             ]
                                          }
                                       }
                                    ]
                                 },
                                 "$Scope$": "55"
                              }
                           ]
                        },
                        "generator": false,
                        "expression": false,
                        "async": false,
                        "$Scope$": "54",
                        "$ID$": "96"
                     }
                  ]
               }
            }
         ]
      },
      "generator": false,
      "expression": false,
      "async": false,
      "$Scope$": "53",
      "$ID$": "95"
   }
]