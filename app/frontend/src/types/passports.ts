/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/passports.json`.
 */
export type Passports = {
  "address": "J2YJKi9j2uHExj69bmKmqiA4igoP7zLrv985zfsPE4mt",
  "metadata": {
    "name": "passports",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "claimStamp",
      "discriminator": [
        254,
        189,
        74,
        38,
        186,
        177,
        71,
        117
      ],
      "accounts": [
        {
          "name": "travelerAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  118,
                  101,
                  108,
                  101,
                  114,
                  45,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "location",
          "writable": true
        },
        {
          "name": "stamp",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  109,
                  112
                ]
              },
              {
                "kind": "account",
                "path": "travelerAccount"
              },
              {
                "kind": "account",
                "path": "location"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializelocation",
      "discriminator": [
        163,
        21,
        107,
        110,
        244,
        101,
        142,
        139
      ],
      "accounts": [
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "slug"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "slug",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "district",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializetraveler",
      "discriminator": [
        230,
        208,
        30,
        215,
        193,
        38,
        198,
        136
      ],
      "accounts": [
        {
          "name": "travelerAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  97,
                  118,
                  101,
                  108,
                  101,
                  114,
                  45,
                  112,
                  114,
                  111,
                  102,
                  105,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "age",
          "type": "u8"
        },
        {
          "name": "country",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "location",
      "discriminator": [
        73,
        140,
        105,
        78,
        215,
        159,
        92,
        234
      ]
    },
    {
      "name": "stamp",
      "discriminator": [
        198,
        74,
        185,
        102,
        132,
        150,
        44,
        206
      ]
    },
    {
      "name": "travelerData",
      "discriminator": [
        12,
        152,
        69,
        67,
        196,
        48,
        109,
        202
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "nameLengthError",
      "msg": "Name should be at most 50 bytes."
    },
    {
      "code": 6001,
      "name": "countryNameLengthError",
      "msg": "Country name should be at most 50 bytes."
    },
    {
      "code": 6002,
      "name": "districtLengthError",
      "msg": "District name should be at most 50 bytes."
    },
    {
      "code": 6003,
      "name": "slugLengthError",
      "msg": "Slug should be at most 50 bytes."
    },
    {
      "code": 6004,
      "name": "maxAgeError",
      "msg": "Maximum allowed age is 149."
    },
    {
      "code": 6005,
      "name": "unauthorized",
      "msg": "Unauthorized."
    }
  ],
  "types": [
    {
      "name": "location",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slug",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "district",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "stamp",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "traveler",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "visitedAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "travelerData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "age",
            "type": "u8"
          },
          {
            "name": "country",
            "type": "string"
          },
          {
            "name": "numberOfPlacesVisited",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "createdAt",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
