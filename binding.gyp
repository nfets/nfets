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
            "<!(cmd /c \"if defined MSYS2_LOCATION (echo %MSYS2_LOCATION%\\mingw64\\include) else (echo C:\\msys64\\mingw64\\include)\")",
            "<!(cmd /c \"if defined MSYS2_LOCATION (echo %MSYS2_LOCATION%\\mingw64\\include\\libxml2) else (echo C:\\msys64\\mingw64\\include\\libxml2)\")"
          ],
          "library_dirs": [
            "<!(cmd /c \"if defined MSYS2_LOCATION (echo %MSYS2_LOCATION%\\mingw64\\lib) else (echo C:\\msys64\\mingw64\\lib)\")"
          ],
          "libraries": [
            "libxml2.dll.a"
          ],
          "defines": [
            "WIN32"
          ],
          "copies": [
            {
              "destination": "<(PRODUCT_DIR)",
              "files": [
                "<!(cmd /c \"if defined MSYS2_LOCATION (echo %MSYS2_LOCATION%\\mingw64\\bin\\libiconv-2.dll) else (echo C:\\msys64\\mingw64\\bin\\libiconv-2.dll)\")",
                "<!(cmd /c \"if defined MSYS2_LOCATION (echo %MSYS2_LOCATION%\\mingw64\\bin\\zlib1.dll) else (echo C:\\msys64\\mingw64\\bin\\zlib1.dll)\")",
                "<!(cmd /c \"if defined MSYS2_LOCATION (if exist %MSYS2_LOCATION%\\mingw64\\bin\\libxml2-16.dll (echo %MSYS2_LOCATION%\\mingw64\\bin\\libxml2-16.dll) else (echo %MSYS2_LOCATION%\\mingw64\\bin\\libxml2-2.dll)) else (if exist C:\\msys64\\mingw64\\bin\\libxml2-16.dll (echo C:\\msys64\\mingw64\\bin\\libxml2-16.dll) else (echo C:\\msys64\\mingw64\\bin\\libxml2-2.dll))\")"
              ]
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
            "-lxml2",
            "-Wl,-Bdynamic"
          ]
        }]
      ]
    }
  ]
}
