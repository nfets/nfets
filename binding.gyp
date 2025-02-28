{
  "targets": [
    {
      "target_name": "xml_validator",
      "sources": [
        "addons/xml_validator.cpp"
      ],
      "include_dirs": [
        "<!(pwd)/vendor/libxml2",
        "<!(pwd)/vendor/libxml2/include",
        "<!(pwd)/vendor/libxml2/include/libxml",
        "<!(pwd)/vendor/libxml2.config"
      ]
    }
  ]
}
