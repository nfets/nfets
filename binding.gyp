{
  "targets": [
    {
      "target_name": "xml_validator",
      "sources": [
        "addons/xml_validator.cpp"
      ],
      "conditions": [
        ["OS=='win'", {
          "include_dirs": [
            "<!@(node -e \"console.log(process.env.LIBXML2_DIR || 'C:/vcpkg/installed/x64-windows/include')\")"
          ],
          "libraries": [
            "<!@(node -e \"console.log(process.env.LIBXML2_LIB || 'C:/vcpkg/installed/x64-windows/lib/xml2.lib')\")"
          ],
          "defines": [
            "WIN32"
          ],
          "conditions": [
            ["target_arch=='ia32'", {
              "product_name": "xml_validator-win32-ia32"
            }],
            ["target_arch=='x64'", {
              "product_name": "xml_validator-win32-x64"
            }],
            ["target_arch=='arm64'", {
              "product_name": "xml_validator-win32-arm64"
            }]
          ]
        }],
        ["OS=='mac'", {
          "include_dirs": [
            "<!(pkg-config --cflags-only-I libxml-2.0 2>/dev/null | sed 's/-I//g' || echo '/usr/include/libxml2')"
          ],
          "libraries": [
            "<!@(pkg-config --libs libxml-2.0 2>/dev/null || echo '-lxml2')"
          ],
          "conditions": [
            ["target_arch=='arm64'", {
              "product_name": "xml_validator-macos-arm64"
            }],
            ["target_arch=='x64'", {
              "product_name": "xml_validator-macos-x64"
            }]
          ]
        }],
        ["OS=='linux'", {
          "include_dirs": [
            "<!(pkg-config --cflags-only-I libxml-2.0 2>/dev/null | sed 's/-I//g' || echo '/usr/include/libxml2')"
          ],
          "libraries": [
            "<!@(pkg-config --libs libxml-2.0 2>/dev/null || echo '-lxml2')"
          ],
          "conditions": [
            ["target_arch=='x64'", {
              "product_name": "xml_validator-linux-x64"
            }],
            ["target_arch=='arm64'", {
              "product_name": "xml_validator-linux-arm64"
            }]
          ]
        }]
      ]
    }
  ]
}
