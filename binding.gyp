{
  "targets": [
    {
      "target_name": "xml_validator",
      "sources": [
        "addons/xml_validator.cpp"
      ],
      "include_dirs": [
        "<!(pkg-config --cflags-only-I libxml-2.0 | sed 's/-I//g')"
      ],
      "libraries": [
        "<!@(pkg-config --libs libxml-2.0)"
      ]
    }
  ]
}
