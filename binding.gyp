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
            "C:\\msys64\\usr\\include",
            "C:\\msys64\\usr\\include\\libxml2",
            "C:\\msys64\\mingw64\\include",
            "C:\\msys64\\mingw64\\include\\libxml2"
          ],
          "library_dirs": [
            "C:\\msys64\\usr\\lib",
            "C:\\msys64\\mingw64\\lib"
          ],
          "libraries": [
            "libxml2.dll.a"
          ],
          "defines": [
            "WIN32"
          ],
          "copies": [
            {
              "destination": "<(PRODUCT_DIR)/libxml2-16.dll",
              "source": "C:\\msys64\\mingw64\\bin\\libxml2-16.dll"
            },
            {
              "destination": "<(PRODUCT_DIR)/libiconv-2.dll",
              "source": "C:\\msys64\\ucrt64\\bin\\libiconv-2.dll"
            },
            {
              "destination": "<(PRODUCT_DIR)/zlib1.dll",
              "source": "C:\\msys64\\ucrt64\\bin\\zlib1.dll"
            }
          ]
        }],
        ["OS=='mac'", {
          "include_dirs": [
            "<!(pkg-config --cflags-only-I libxml-2.0 2>/dev/null | sed 's/-I//g' || echo '/usr/include/libxml2')"
          ],
          "libraries": [
            "<!(LIBDIR=$(pkg-config --variable=libdir libxml-2.0 2>/dev/null || echo ''); if [ -n \"$LIBDIR\" ] && [ -f \"$LIBDIR/libxml2.a\" ]; then echo \"$LIBDIR/libxml2.a\"; elif [ -f \"/opt/homebrew/lib/libxml2.a\" ]; then echo \"/opt/homebrew/lib/libxml2.a\"; elif [ -f \"/usr/local/lib/libxml2.a\" ]; then echo \"/usr/local/lib/libxml2.a\"; else pkg-config --libs libxml-2.0 2>/dev/null || echo '-lxml2'; fi)"
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
          ]
        }]
      ]
    }
  ]
}
