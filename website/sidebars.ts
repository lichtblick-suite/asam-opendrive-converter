import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "index",
    {
      type: "category",
      label: "User Guide",
      items: ["user-guide/getting-started", "user-guide/panel-settings"],
    },
    {
      type: "category",
      label: "Architecture",
      items: [
        "architecture/overview",
        "architecture/converter-pipeline",
        "architecture/features",
      ],
    },
    {
      type: "category",
      label: "Reference",
      items: [
        "references/README",
        "references/FEATURE_MAPPING_TABLE",
      ],
    },
    "contributing",
  ],
};

export default sidebars;
