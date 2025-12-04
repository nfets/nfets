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
            "C:\\msys64\\msys64\\usr\\include",
            "C:\\msys64\\msys64\\usr\\include\\libxml2"
          ],
          "library_dirs": [
            "C:\\msys64\\msys64\\usr\\lib"
          ],
          "libraries": [
            "libxml2.dll.a"
          ],
          "defines": [
            "WIN32"
          ],
          "conditions": [
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
            "<!(LIBDIR=$(pkg-config --variable=libdir libxml-2.0 2>/dev/null || echo ''); if [ -n \"$LIBDIR\" ] && [ -f \"$LIBDIR/libxml2.a\" ]; then echo \"$LIBDIR/libxml2.a\"; elif [ -f \"/opt/homebrew/lib/libxml2.a\" ]; then echo \"/opt/homebrew/lib/libxml2.a\"; elif [ -f \"/usr/local/lib/libxml2.a\" ]; then echo \"/usr/local/lib/libxml2.a\"; else pkg-config --libs libxml-2.0 2>/dev/null || echo '-lxml2'; fi)"
          ],
          "conditions": [
            ["target_arch=='arm64'", {
              "product_name": "xml_validator-darwin-arm64"
            }],
            ["target_arch=='x64'", {
              "product_name": "xml_validator-darwin-x64"
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
          "ldflags": [
            "-Wl,-Bstatic",
            "-lxml2",
            "-Wl,-Bdynamic"
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
