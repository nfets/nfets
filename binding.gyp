{
  "targets": [
    {
      "target_name": "xml_validator",
      "sources": ["addons/xml_validator.cpp"],
      "include_dirs": ["<!@(pkg-config --variable=includedir libxml-2.0)"],
      "libraries": ["<!@(pkg-config --libs libxml-2.0)"]
    }
  ]
}
