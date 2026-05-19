> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 06 General architecture

## 06.1 Introduction

ASAM OpenDRIVE data is stored in XML files with the extension `xodr`. Compressed ASAM OpenDRIVE files have the extension `xodrz` (compression format: `gzip`).

The ASAM OpenDRIVE file structure conforms to XML rules; the associated schema file is referenced in the XML. The schema files for the ASAM OpenDRIVE format can be retrieved from [Section "Deliverables"](../00_preface/00_introduction.html#sec-bbc4fe63-ed72-4092-8ae4-f1733fcff502).

Elements are organized into levels. Elements with a level greater than zero (0) are children of the preceding level. Elements with a level of one (1) are called primary elements.

Each element can be extended with user-defined data. This data is stored in user data elements.

All floating-point numbers used in ASAM OpenDRIVE are IEEE 754 [[12](../bibliography.html#bib-8766229)] double precision floating-point numbers. To ensure accurate representation of floating-point numbers in the XML representation, implementations should use a known correct accuracy preserving minimal floating-point printing algorithm (for example [[13](../bibliography.html#bib-Burger_Dybvig_1996)], [[14](../bibliography.html#bib-Adams_2018)]) or ensure that 17 significant decimal digits are always produced, for example using the "%.17g" ISO C printf modifier. Importing implementations should use a known correct accuracy preserving floating-point reading algorithm (for example [[15](../bibliography.html#bib-Clinger_1990)]).

## 06.2 Attributes

All attributes that can be used in an ASAM OpenDRIVE file are fully annotated in the UML model:

*   If **units** are applicable to an attribute, these are stated according to [Section "Units"](../00_preface/00_introduction.html#sec-10d6006a-cfbf-4d65-b9e0-ffb8a0701356).
    
*   **Type**: Describes the data type of an attribute. It can be either a primitive data type, for example, string, double, float, or a complex data type that refers to an object described within this specification.
    
*   **Value**: Value determines the value range of the given attribute relative to the specified type.

## 06.3 Root element

The overall enclosing element of the file is:

Table 7. Attributes of the ASAM OpenDRIVE element  

**Delimiters**

`<OpenDRIVE>…​</OpenDRIVE>`

**Parent**

none

**Instances**

1

**Attributes**

`xmlns`="https://code.asam.net/simulation/standard/opendrive_schema/"

![img](../_images/uml_class_diagrams/EAID_1CD0AF4A_F90A_4a0e_A14A_05ABEC0D1ACB.png)

Figure 4. UML class diagram of the Core class

[Figure 4](#fig-03ea7852-377b-428a-b01e-3ee78ffa2740) shows the UML class diagram of the ASAM OpenDRIVE Core class.

## 06.4 Header

UML class:  t_header_defaultRegulations
XML tag:    <defaultRegulations> (Multiplicity: 0..1)
Introduced: 1.8.0

Defines the default regulations. In each country there are different speed limits to a rural road. For example a rural road has a speed limit of 100km/h in Germany and 80km/h in the Netherlands.

In some countries, one is allowed to turn right at a red traffic light; in others, one is not. Instead of writing this for each road or each signal, the default regulations can be specified once in the header for the entire ASAM OpenDRIVE file. The default driving regulations can be overwritten with road, lane, or signal definitions.

**`<roadRegulations>` element**

UML class:  t_header_roadRegulation
XML tag:    <roadRegulations> (Multiplicity: 0..*)
Introduced: 1.8.0

Defines the default regulations for different road types.

Table 10. Attributes of the <roadRegulations> element    

Name

Type

Use

Introduced

`type`

[e_roadType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_3A3FB3DD_D0CF_43a7_95D6_30D9D024D0D9)

required

1.8.0

**`<signalRegulations>` element**

UML class:  t_header_signalRegulation
XML tag:    <signalRegulations> (Multiplicity: 0..*)
Introduced: 1.8.0

Defines the default regulations for signs in different countries, for example, if it is allowed to turn right when a red traffic light appears.

Table 11. Attributes of the <signalRegulations> element    

Name

Type

Use

Introduced

`subtype`

string

required

1.8.0

`type`

string

required

1.8.0

**XML example**

```
<OpenDRIVE>
    <header revMajor="1"
            revMinor="5"
            name=""
            version="1.00"
            date="Mon Nov 29 12:59:50 2021"
            north="0.0000000000000000e+00"
            south="0.0000000000000000e+00"
            east="0.0000000000000000e+00"
            west="0.0000000000000000e+00">
        <defaultRegulations>
            <roadRegulations type="motorway">
                <semantics>
                    <speed type="maximum" value="120" unit="km/h"/>
                </semantics>
            </roadRegulations>
            <roadRegulations type="rural">
                <semantics>
                    <speed type="maximum" value="50" unit="km/h"/>
                </semantics>
            </roadRegulations>
            <roadRegulations type="town">
                <semantics>
                    <speed type="maximum" value="30" unit="km/h"/>
                </semantics>
            </roadRegulations>
            <roadRegulations type="livingStreet">
                <semantics>
                    <speed type="maximum" value="5" unit="km/h"/>
                </semantics>
            </roadRegulations>
            <signalRegulations type="1000001" subType="-1">
                <semantics>
                    <priority type="turnOnRedAllowed" />
                </semantics>
            </signalRegulations>
        </defaultRegulations>
    </header>
</OpenDRIVE>
```

*   [asam.net:xodr:1.8.0:defaultRegulations.only_speed_prioity](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-defaultRegulations-only_speed_prioity): Only `<speed>` and `<priority>` elements shall be used within the `<defaultRegulations>` element.
    

*   The `<signalRegulations>` element shall be used for signs that result in different driving rules.
    
*   `<signalRegulations>` elements shall not be used as a signal catalogue.

## 06.5 Overview of elements

`<OpenDRIVE>`

┃━ `<header>`

[Section 6.4.1, "`<header>` element"](06_04_header.html#sec-afd3df4f-69fb-4bfa-95a1-75b9db5481af)

┃      ┃━ `<geoReference>`

[Section 8.5, "Georeferencing"](../08_coordinate_systems/08_05_geo_referencing.html#top-3535a746-e0af-4020-b71c-3a94e7a855a1)

┃      ┃━ `<offset>`

[Section 8.5, "Georeferencing"](../08_coordinate_systems/08_05_geo_referencing.html#top-3535a746-e0af-4020-b71c-3a94e7a855a1)

┃      ┃━ `<license>`

[Section 6.4.2, "`<license>` element"](06_04_header.html#sec-4ec00f03-e361-4558-9654-06706343195a)

┃      ┃━ `<defaultRegulations>`

[Section 6.4.3, "`<defaultRegulations>` element"](06_04_header.html#sec-27ad621f-1b2a-40d6-8723-b9f8aa00cb3f)

┃      ┃      ┃━ `<roadRegulations>`

[Section 6.4.3, "`<defaultRegulations>` element"](06_04_header.html#sec-27ad621f-1b2a-40d6-8723-b9f8aa00cb3f)

┃      ┃      ┃━ `<signalRegulations>`

[Section 6.4.3, "`<defaultRegulations>` element"](06_04_header.html#sec-27ad621f-1b2a-40d6-8723-b9f8aa00cb3f)

┃━ `<road>`

[Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)

┃      ┃━ `<link>`

[Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)

┃      ┃      ┃━ `<predecessor>`

[Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)

┃      ┃      ┃━ `<successor>`

[Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)

┃      ┃━ `<type>`

[Section 10.4, "Road type"](../10_roads/10_04_road_type.html#top-ca0f8ace-54c0-4f4b-8977-0098d74b3e19)

┃      ┃      ┃━ `<speed>`

[Section 10.4.1, "Speed limits for road types"](../10_roads/10_04_road_type.html#sec-33dc6899-854e-4533-a3d9-76e9e1518ee7)

┃      ┃━ `<planView>`

[Section 12.2, "only_one_line_element"](../12_junctions/12_02_common_junctions.html#sec-9b5c73fd-4ed5-4373-b20c-7154de1c1fc3)

┃      ┃      ┃━ `<geometry>`

[Section 12.9, "only_one_line_element"](../12_junctions/12_09_junction_reference_line.html#sec-274bf81a-3aec-4c26-9997-33e018f7cb14)

┃      ┃      ┃      ┃━ `<line>`

[Section 9.3, "Straight line"](../09_geometries/09_03_straight_line.html#top-74c133a9-fc15-4a00-ae49-9a4cdc20b742)

┃      ┃      ┃      ┃━ `<spiral>`

[Section 9.4, "Spiral"](../09_geometries/09_04_spiral.html#top-9807cfa9-04f5-4eca-b468-d68b71486666)

┃      ┃      ┃      ┃━ `<arc>`

[Section 9.5, "Arc"](../09_geometries/09_05_arc.html#top-0d75cff2-4103-401f-a802-b5868d15a4fe)

┃      ┃      ┃      ┃━ `<poly3>`

[Section 9.7, "Cubic polynom (deprecated)"](../09_geometries/09_07_poly3.html#top-2f3fb62e-d0be-4eb8-a0f6-8bc0d6f6d953)

┃      ┃      ┃      ┃━ `<paramPoly3>`

[Section 9.6, "Parametric cubic curve"](../09_geometries/09_06_param_poly3.html#top-f99539a9-f2db-47cf-b728-4277cb50e3f2)

┃      ┃━ `<elevationProfile>`

[Section 10.5.1, "Road elevation"](../10_roads/10_05_elevation.html#sec-1d876c00-d69e-46d9-bbcd-709ab48f14b1)

┃      ┃      ┃━ `<elevation>`

[Section 10.5.1, "Road elevation"](../10_roads/10_05_elevation.html#sec-1d876c00-d69e-46d9-bbcd-709ab48f14b1)

┃      ┃━ `<lateralProfile>`

[Section 10.5.1, "Superelevation"](../10_roads/10_05_elevation.html#sec-4abf7baf-fb2f-4263-8133-ad0f64f0feac)

┃      ┃      ┃━ `<superelevation>`

[Section 10.5.1, "Superelevation"](../10_roads/10_05_elevation.html#sec-4abf7baf-fb2f-4263-8133-ad0f64f0feac)

┃      ┃      ┃━ `<shape>`

[Section 10.5.1, "Shape definition"](../10_roads/10_05_elevation.html#sec-66ac2b58-dc5e-4538-884d-204406ea53f2)

┃      ┃      ┃━ `<crossSectionSurface>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃━ `<tOffset>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃━ `<coefficients>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃━ `<surfaceStrips>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃━ `<strip>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃━ `<width>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<coefficients>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃━ `<constant>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<coefficients>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃━ `<linear>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃━ `<quadratic>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<coefficients>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃━ `<cubic>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<coefficients>`

[Section 10.5.1, "Cross section surface"](../10_roads/10_05_elevation.html#sec-7e6f61b7-2a63-4664-b17b-02cb1dee5501)

┃      ┃━ `<lanes>`

[Section 11.1, "Introduction to lanes"](../11_lanes/11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)

┃      ┃      ┃━ `<laneOffset>`

[Section 11.4, "Lane offset"](../11_lanes/11_04_lane_offset.html#top-05e95dfd-ce05-40c8-af93-d065229e6968)

┃      ┃      ┃━ `<laneSection>`

[Section 11.3, "Lane sections"](../11_lanes/11_03_lane_sections.html#top-e2c7cf98-db06-4a27-972a-0d165f87a867)

┃      ┃      ┃      ┃━ `<left>`

[Section 11.2, "Lane groups"](../11_lanes/11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

┃      ┃      ┃      ┃      ┃━ `<lane>`

[Section 11.2, "Lane groups"](../11_lanes/11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

┃      ┃      ┃      ┃      ┃      ┃━ `<width>`

[Section 11.6.1, "Lane width"](../11_lanes/11_06_lane_geometry.html#sec-8d8ac2e0-b3d6-4048-a9ed-d5191af5c74b)

┃      ┃      ┃      ┃      ┃      ┃━ `<border>`

[Section 11.6.1, "Lane borders"](../11_lanes/11_06_lane_geometry.html#sec-1d7eba61-d3d2-440d-b822-55f0af8a1183)

┃      ┃      ┃      ┃      ┃      ┃━ `<link>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<predecessor>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<successor>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃━ `<roadMark>`

[Section 11.8, "Road markings"](../11_lanes/11_08_road_markings.html#top-fc59db56-70c8-4320-a8c7-213379f8c037)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<sway>`

[Section 11.8.3, "Offset in road markings"](../11_lanes/11_08_road_markings.html#sec-52e18ce8-c575-4918-ba4b-40da1afd60d8)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<type>`

[Section 11.8.1, "Road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)

┃      ┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<line>`

[Section 11.8.1, "Road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<explicit>`

[Section 11.8.2, "Explicit road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)

┃      ┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<line>`

[Section 11.8.2, "Explicit road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)

┃      ┃      ┃      ┃      ┃      ┃━ `<material>`

[Section 11.7.2, "Lane material"](../11_lanes/11_07_lane_properties.html#sec-8345bf25-d584-4a5b-8fa7-e15c920ab219)

┃      ┃      ┃      ┃      ┃      ┃━ `<speed>`

[Section 11.7.1, "Lane speed limit"](../11_lanes/11_07_lane_properties.html#sec-866ad6d9-a026-4051-9a3a-5f94405a15f7)

┃      ┃      ┃      ┃      ┃      ┃━ `<access>`

[Section 11.7.1, "Lane access"](../11_lanes/11_07_lane_properties.html#sec-38bbc30a-8f0f-4387-8a87-0ddd34563404)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<restriction>`

[Section 11.7.1, "Lane access"](../11_lanes/11_07_lane_properties.html#sec-38bbc30a-8f0f-4387-8a87-0ddd34563404)

┃      ┃      ┃      ┃      ┃      ┃━ `<height>`

[Section 11.6.1, "Lane height"](../11_lanes/11_06_lane_geometry.html#sec-d30c9ef9-cb82-4683-9fb6-6487e9dffd2f)

┃      ┃      ┃      ┃      ┃      ┃━ `<rule>`

[Section 11.9, "Specific lane rules"](../11_lanes/11_09_specific_lane_rules.html#top-cb10fd30-6839-4e1e-a5f8-c482be2c6020)

┃      ┃      ┃      ┃━ `<center>`

[Section 11.2, "Lane groups"](../11_lanes/11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

┃      ┃      ┃      ┃      ┃━ `<lane>`

[Section 11.2, "Lane groups"](../11_lanes/11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

┃      ┃      ┃      ┃      ┃      ┃━ `<link>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<predecessor>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<successor>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃━ `<roadMark>`

[Section 11.8, "Road markings"](../11_lanes/11_08_road_markings.html#top-fc59db56-70c8-4320-a8c7-213379f8c037)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<sway>`

[Section 11.8.3, "Offset in road markings"](../11_lanes/11_08_road_markings.html#sec-52e18ce8-c575-4918-ba4b-40da1afd60d8)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<type>`

[Section 11.8.1, "Road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)

┃      ┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<line>`

[Section 11.8.1, "Road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<explicit>`

[Section 11.8.2, "Explicit road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)

┃      ┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<line>`

[Section 11.8.2, "Explicit road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)

┃      ┃      ┃      ┃━ `<right>`

[Section 11.2, "Lane groups"](../11_lanes/11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

┃      ┃      ┃      ┃      ┃━ `<lane>`

[Section 11.2, "Lane groups"](../11_lanes/11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

┃      ┃      ┃      ┃      ┃      ┃━ `<width>`

[Section 11.6.1, "Lane width"](../11_lanes/11_06_lane_geometry.html#sec-8d8ac2e0-b3d6-4048-a9ed-d5191af5c74b)

┃      ┃      ┃      ┃      ┃      ┃━ `<border>`

[Section 11.6.1, "Lane borders"](../11_lanes/11_06_lane_geometry.html#sec-1d7eba61-d3d2-440d-b822-55f0af8a1183)

┃      ┃      ┃      ┃      ┃      ┃━ `<link>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<predecessor>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<successor>`

[Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)

┃      ┃      ┃      ┃      ┃      ┃━ `<roadMark>`

[Section 11.8, "Road markings"](../11_lanes/11_08_road_markings.html#top-fc59db56-70c8-4320-a8c7-213379f8c037)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<sway>`

[Section 11.8.3, "Offset in road markings"](../11_lanes/11_08_road_markings.html#sec-52e18ce8-c575-4918-ba4b-40da1afd60d8)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<type>`

[Section 11.8.1, "Road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)

┃      ┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<line>`

[Section 11.8.1, "Road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<explicit>`

[Section 11.8.2, "Explicit road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)

┃      ┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<line>`

[Section 11.8.2, "Explicit road marking types and lines"](../11_lanes/11_08_road_markings.html#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)

┃      ┃      ┃      ┃      ┃      ┃━ `<material>`

[Section 11.7.2, "Lane material"](../11_lanes/11_07_lane_properties.html#sec-8345bf25-d584-4a5b-8fa7-e15c920ab219)

┃      ┃      ┃      ┃      ┃      ┃━ `<speed>`

[Section 11.7.1, "Lane speed limit"](../11_lanes/11_07_lane_properties.html#sec-866ad6d9-a026-4051-9a3a-5f94405a15f7)

┃      ┃      ┃      ┃      ┃      ┃━ `<access>`

[Section 11.7.1, "Lane access"](../11_lanes/11_07_lane_properties.html#sec-38bbc30a-8f0f-4387-8a87-0ddd34563404)

┃      ┃      ┃      ┃      ┃      ┃      ┃━ `<restriction>`

[Section 11.7.1, "Lane access"](../11_lanes/11_07_lane_properties.html#sec-38bbc30a-8f0f-4387-8a87-0ddd34563404)

┃      ┃      ┃      ┃      ┃      ┃━ `<height>`

[Section 11.6.1, "Lane height"](../11_lanes/11_06_lane_geometry.html#sec-d30c9ef9-cb82-4683-9fb6-6487e9dffd2f)

┃      ┃      ┃      ┃      ┃      ┃━ `<rule>`

[Section 11.9, "Specific lane rules"](../11_lanes/11_09_specific_lane_rules.html#top-cb10fd30-6839-4e1e-a5f8-c482be2c6020)

┃━ `<objects>`

[Section 13.1, "Introduction to objects"](../13_objects/13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)

┃      ┃      ┃━ `<object>`

[Section 13.1, "Introduction to objects"](../13_objects/13_01_introduction.html#top-e2ec908d-ae0b-4f5c-99f5-2b12761a368a)

┃      ┃      ┃      ┃━ `<repeat>`

[Section 13.2, "Repeating objects"](../13_objects/13_02_repeating_objects.html#top-fc693ed2-a38b-4cfc-a346-90c8a478bfd0)

┃      ┃      ┃      ┃━ `<outline>`

[Section 13.3, "Object outline"](../13_objects/13_03_object_outline.html#top-67295042-9707-4ad5-9671-b80cde49bb3a)

┃      ┃      ┃      ┃      ┃━ `<cornerRoad>`

[Section 13.3.1, "`<cornerRoad>` element"](../13_objects/13_03_object_outline.html#sec-4bfef803-e146-4f6d-86b3-533540f56b51)

┃      ┃      ┃      ┃      ┃━ `<cornerLocal>`

[Section 13.3.1, "`<cornerLocal>` element"](../13_objects/13_03_object_outline.html#sec-cc00c8a6-eea6-49e6-b90c-37b21524c748)

┃      ┃      ┃      ┃━ `<outlines>`

[Section 13.3, "Object outline"](../13_objects/13_03_object_outline.html#top-67295042-9707-4ad5-9671-b80cde49bb3a)

┃      ┃      ┃      ┃      ┃━ `<outline>`

[Section 13.3, "Object outline"](../13_objects/13_03_object_outline.html#top-67295042-9707-4ad5-9671-b80cde49bb3a)

┃      ┃      ┃      ┃      ┃      ┃━ `<cornerRoad>`

[Section 13.3.1, "`<cornerRoad>` element"](../13_objects/13_03_object_outline.html#sec-4bfef803-e146-4f6d-86b3-533540f56b51)

┃      ┃      ┃      ┃      ┃      ┃━ `<cornerLocal>`

[Section 13.3.1, "`<cornerLocal>` element"](../13_objects/13_03_object_outline.html#sec-cc00c8a6-eea6-49e6-b90c-37b21524c748)

┃      ┃      ┃      ┃━ `<material>`

[Section 13.5, "Object material"](../13_objects/13_05_object_material.html#top-4a2b41da-f530-48b0-b9aa-dbe4124f0418)

┃      ┃      ┃      ┃━ `<validity>`

[Section 14.2, "Lane validity for signals"](../14_signals/14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)

┃      ┃      ┃      ┃━ `<parkingSpace>`

[Section 13.7, "Access rules to parking spaces"](../13_objects/13_07_access_rules_parking.html#top-b0af8133-ca81-4698-9c02-7cb19874b2cd)

┃      ┃      ┃      ┃━ `<markings>`

[Section 13.8, "Object marking"](../13_objects/13_08_object_marking.html#top-c25542c0-f80d-4da9-a430-020474b58301)

┃      ┃      ┃      ┃      ┃━ `<marking>`

[Section 13.8, "Object marking"](../13_objects/13_08_object_marking.html#top-c25542c0-f80d-4da9-a430-020474b58301)

┃      ┃      ┃      ┃      ┃      ┃━ `<cornerReference>`

[Section 13.8, "Object marking"](../13_objects/13_08_object_marking.html#top-c25542c0-f80d-4da9-a430-020474b58301)

┃      ┃      ┃      ┃━ `<borders>`

[Section 13.9, "Object borders"](../13_objects/13_09_object_borders.html#top-f4d6c702-996e-4344-8e80-e580ea6ca767)

┃      ┃      ┃      ┃      ┃━ `<border>`

[Section 13.9, "Object borders"](../13_objects/13_09_object_borders.html#top-f4d6c702-996e-4344-8e80-e580ea6ca767)

┃      ┃      ┃      ┃      ┃      ┃━ `<cornerReference>`

[Section 13.8, "Object marking"](../13_objects/13_08_object_marking.html#top-c25542c0-f80d-4da9-a430-020474b58301)

┃      ┃      ┃      ┃━ `<surface>`

[Section 13.13, "Object CRG surface"](../13_objects/13_13_object_surface.html#top-b9a23d6c-0f67-4e9e-b146-8e26ce2f75f5)

┃      ┃      ┃      ┃━ `<skeleton>`

[Section 13.4, "Object skeleton"](../13_objects/13_04_object_skeleton.html#top-4c99f00a-bb80-4aff-8c87-c90313ecb3d6)

┃      ┃      ┃      ┃      ┃━ `<polyline>`

[Section 13.4, "Object skeleton"](../13_objects/13_04_object_skeleton.html#top-4c99f00a-bb80-4aff-8c87-c90313ecb3d6)

┃      ┃      ┃      ┃      ┃      ┃━ `<vertexRoad>`

[Section 13.4.1, "`<vertexRoad>` element"](../13_objects/13_04_object_skeleton.html#sec-898f3cd1-0313-4df7-921e-7f99415d2918)

┃      ┃      ┃      ┃      ┃      ┃━ `<vertexLocal>`

[Section 13.4.1, "`<vertexLocal>` element"](../13_objects/13_04_object_skeleton.html#sec-63c9f5b5-63d3-46ba-86fc-1a9a3f4317e8)

┃      ┃      ┃━ `<objectReference>`

[Section 13.10, "Object reference"](../13_objects/13_10_object_reference.html#top-d3896352-d768-418d-9ca7-12aadc2e2d32)

┃      ┃      ┃      ┃━ `<validity>`

[Section 14.2, "Lane validity for signals"](../14_signals/14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)

┃      ┃      ┃━ `<tunnel>`

[Section 13.11, "Tunnels"](../13_objects/13_11_tunnels.html#top-bfd1f7cb-ff5f-44cb-ad3b-e2e855dcdf0f)

┃      ┃      ┃      ┃━ `<validity>`

[Section 14.2, "Lane validity for signals"](../14_signals/14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)

┃      ┃      ┃━ `<bridge>`

[Section 13.12, "Bridges"](../13_objects/13_12_bridges.html#top-b65d5a80-f80f-415d-9188-349726023b4a)

┃      ┃      ┃      ┃━ `<validity>`

[Section 14.2, "Lane validity for signals"](../14_signals/14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)

┃      ┃━ `<signals>`

[Section 14.1, "Introduction to signals"](../14_signals/14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)

┃      ┃      ┃━ `<signal>`

[Section 14.1, "Introduction to signals"](../14_signals/14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)

┃      ┃      ┃      ┃━ `<positionInertial>`

[Section 14.9, "Signal positioning (deprecated)"](../14_signals/14_09_signal_positioning.html#top-f2ed3a40-e47a-4ab9-bb5d-0caa9c3b22ca)

┃      ┃      ┃      ┃━ `<positionRoad>`

[Section 14.9, "Signal positioning (deprecated)"](../14_signals/14_09_signal_positioning.html#top-f2ed3a40-e47a-4ab9-bb5d-0caa9c3b22ca)

┃      ┃      ┃      ┃━ `<validity>`

[Section 14.2, "Lane validity for signals"](../14_signals/14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)

┃      ┃      ┃      ┃━ `<dependency>`

[Section 14.3, "Signal dependency"](../14_signals/14_03_signal_dependency.html#top-f4d8bdcc-3f58-454d-b14e-801a880d9c41)

┃      ┃      ┃      ┃━ `<reference>`

[Section 14.4, "Signal reference"](../14_signals/14_04_signal_reference.html#top-1030e9ff-6b75-4353-b2b4-043f08c02a2d)

┃      ┃      ┃━ `<signalReference>`

[Section 14.5, "Signals that apply to multiple roads"](../14_signals/14_05_multiple_roads.html#top-97477b6b-0818-4583-88c8-eb0b735cc884)

┃      ┃      ┃      ┃━ `<validity>`

[Section 14.2, "Lane validity for signals"](../14_signals/14_02_lane_validity_signals.html#top-2aa0b17c-1b34-444c-9e00-fb51cc91c740)

┃      ┃━ `<surface>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃      ┃━ `<CRG>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃━ `<railroad>`

[Section 15.1, "Introduction to railroads"](../15_railroads/15_01_introduction.html#top-cc907730-d1cf-4775-8d97-1898f533257b)

┃      ┃      ┃━ `<switch>`

[Section 15.3, "Switches"](../15_railroads/15_03_switches.html#top-bc2ab6c7-071a-41b5-b183-c9dd80e372f4)

┃      ┃      ┃      ┃━ `<mainTrack>`

[Section 15.3.1, "Main track"](../15_railroads/15_03_switches.html#sec-c2acd458-27c6-48bf-983b-6c91a9feb1bd)

┃      ┃      ┃      ┃━ `<sideTrack>`

[Section 15.3.1, "Side track"](../15_railroads/15_03_switches.html#sec-3c7e5de0-490c-4148-9ef1-10cbc2fd7516)

┃      ┃      ┃      ┃━ `<partner>`

[Section 15.3.2, "Partner switches"](../15_railroads/15_03_switches.html#sec-22a79a45-79b1-4f2b-aba9-4fa65211bf21)

┃━ `<controller>`

[Section 14.6, "Signal Controllers"](../14_signals/14_06_controllers.html#top-bb3b8324-47ba-4c80-aee7-a4a443cd0ef3)

┃      ┃━ `<control>`

[Section 14.6, "Signal Controllers"](../14_signals/14_06_controllers.html#top-bb3b8324-47ba-4c80-aee7-a4a443cd0ef3)

┃━ `<junction type="crossing">`

[Section 12.8, "Crossings"](../12_junctions/12_08_crossings.html#top-910643c3-508f-48a9-91a4-dd180adbdb2d)

┃      ┃━ `<roadSection>`

[Section 12.8, "Crossings"](../12_junctions/12_08_crossings.html#top-910643c3-508f-48a9-91a4-dd180adbdb2d)

┃      ┃━ `<priority>`

[Section 12.4.1, "Priorities of connecting roads within a junction"](../12_junctions/12_04_connecting_roads.html#sec-f60730d7-4192-440e-a6ba-8082288a1115)

┃      ┃━ `<controller>`

[Section 12.14, "Signal synchronization groups in junctions"](../12_junctions/12_14_signal_synchronization_groups.html#top-add49732-8747-40b6-93b0-1b3ff20afeb9)

┃      ┃━ `<surface>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃      ┃━ `<CRG>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃━ `<planView>`

[Section 12.2, "only_one_line_element"](../12_junctions/12_02_common_junctions.html#sec-9b5c73fd-4ed5-4373-b20c-7154de1c1fc3)

┃      ┃      ┃━ `<geometry>`

[Section 12.9, "only_one_line_element"](../12_junctions/12_09_junction_reference_line.html#sec-274bf81a-3aec-4c26-9997-33e018f7cb14)

┃      ┃      ┃      ┃━ `<line>`

[Section 9.3, "Straight line"](../09_geometries/09_03_straight_line.html#top-74c133a9-fc15-4a00-ae49-9a4cdc20b742)

┃      ┃      ┃      ┃━ `<spiral>`

[Section 9.4, "Spiral"](../09_geometries/09_04_spiral.html#top-9807cfa9-04f5-4eca-b468-d68b71486666)

┃      ┃      ┃      ┃━ `<arc>`

[Section 9.5, "Arc"](../09_geometries/09_05_arc.html#top-0d75cff2-4103-401f-a802-b5868d15a4fe)

┃      ┃      ┃      ┃━ `<poly3>`

[Section 9.7, "Cubic polynom (deprecated)"](../09_geometries/09_07_poly3.html#top-2f3fb62e-d0be-4eb8-a0f6-8bc0d6f6d953)

┃      ┃      ┃      ┃━ `<paramPoly3>`

[Section 9.6, "Parametric cubic curve"](../09_geometries/09_06_param_poly3.html#top-f99539a9-f2db-47cf-b728-4277cb50e3f2)

┃━ `<junction type="default">`

[Section 12.2, "when_to_use"](../12_junctions/12_02_common_junctions.html#sec-3de936de-98d8-4440-b4e3-a51c24fd125d)

┃      ┃━ `<connection>`

[Section 12.4, "Connecting roads"](../12_junctions/12_04_connecting_roads.html#top-3e9bb97e-f2ab-4751-906a-c25e9fb7ac4e)

┃      ┃      ┃━ `<laneLink>`

[Section 12.6, "Direct junctions"](../12_junctions/12_06_direct_junctions.html#top-c6c31e70-0fe9-44ac-89c8-fc1de9bf5195)

┃      ┃━ `<crossPath>`

[Section 12.5, "Cross paths"](../12_junctions/12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)

┃      ┃      ┃━ `<startLaneLink>`

[Section 12.5, "Cross paths"](../12_junctions/12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)

┃      ┃      ┃━ `<endLaneLink>`

[Section 12.5, "Cross paths"](../12_junctions/12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)

┃      ┃━ `<priority>`

[Section 12.4.1, "Priorities of connecting roads within a junction"](../12_junctions/12_04_connecting_roads.html#sec-f60730d7-4192-440e-a6ba-8082288a1115)

┃      ┃━ `<controller>`

[Section 12.14, "Signal synchronization groups in junctions"](../12_junctions/12_14_signal_synchronization_groups.html#top-add49732-8747-40b6-93b0-1b3ff20afeb9)

┃      ┃━ `<surface>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃      ┃━ `<CRG>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃━ `<planView>`

[Section 12.2, "only_one_line_element"](../12_junctions/12_02_common_junctions.html#sec-9b5c73fd-4ed5-4373-b20c-7154de1c1fc3)

┃      ┃      ┃━ `<geometry>`

[Section 12.9, "only_one_line_element"](../12_junctions/12_09_junction_reference_line.html#sec-274bf81a-3aec-4c26-9997-33e018f7cb14)

┃      ┃      ┃      ┃━ `<line>`

[Section 9.3, "Straight line"](../09_geometries/09_03_straight_line.html#top-74c133a9-fc15-4a00-ae49-9a4cdc20b742)

┃      ┃      ┃      ┃━ `<spiral>`

[Section 9.4, "Spiral"](../09_geometries/09_04_spiral.html#top-9807cfa9-04f5-4eca-b468-d68b71486666)

┃      ┃      ┃      ┃━ `<arc>`

[Section 9.5, "Arc"](../09_geometries/09_05_arc.html#top-0d75cff2-4103-401f-a802-b5868d15a4fe)

┃      ┃      ┃      ┃━ `<poly3>`

[Section 9.7, "Cubic polynom (deprecated)"](../09_geometries/09_07_poly3.html#top-2f3fb62e-d0be-4eb8-a0f6-8bc0d6f6d953)

┃      ┃      ┃      ┃━ `<paramPoly3>`

[Section 9.6, "Parametric cubic curve"](../09_geometries/09_06_param_poly3.html#top-f99539a9-f2db-47cf-b728-4277cb50e3f2)

┃      ┃━ `<boundary>`

[Section 12.10, "Junction boundary"](../12_junctions/12_10_junction_boundary.html#top-6d1f0b2f-282b-4d48-a920-be13f75706a3)

┃      ┃      ┃━ `<segment type="joint">`

[Section 12.10, "Junction boundary"](../12_junctions/12_10_junction_boundary.html#top-6d1f0b2f-282b-4d48-a920-be13f75706a3)

┃      ┃      ┃━ `<segment type="lane">`

[Section 12.10, "Junction boundary"](../12_junctions/12_10_junction_boundary.html#top-6d1f0b2f-282b-4d48-a920-be13f75706a3)

┃      ┃━ `<elevationGrid>`

[Section 12.11, "Junction elevation grid"](../12_junctions/12_11_junction_elevation_grid.html#top-26a9b5c3-a1f1-4958-b8da-4ce704ae96fc)

┃      ┃      ┃━ `<elevation>`

[Section 12.11, "Junction elevation grid"](../12_junctions/12_11_junction_elevation_grid.html#top-26a9b5c3-a1f1-4958-b8da-4ce704ae96fc)

┃━ `<junction type="direct">`

[Section 12.6, "Direct junctions"](../12_junctions/12_06_direct_junctions.html#top-c6c31e70-0fe9-44ac-89c8-fc1de9bf5195)

┃      ┃━ `<connection>`

[Section 12.6, "Direct junctions"](../12_junctions/12_06_direct_junctions.html#top-c6c31e70-0fe9-44ac-89c8-fc1de9bf5195)

┃      ┃      ┃━ `<laneLink>`

[Section 12.6, "Direct junctions"](../12_junctions/12_06_direct_junctions.html#top-c6c31e70-0fe9-44ac-89c8-fc1de9bf5195)

┃      ┃━ `<priority>`

[Section 12.4.1, "Priorities of connecting roads within a junction"](../12_junctions/12_04_connecting_roads.html#sec-f60730d7-4192-440e-a6ba-8082288a1115)

┃      ┃━ `<controller>`

[Section 12.14, "Signal synchronization groups in junctions"](../12_junctions/12_14_signal_synchronization_groups.html#top-add49732-8747-40b6-93b0-1b3ff20afeb9)

┃      ┃━ `<surface>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃      ┃━ `<CRG>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃━ `<planView>`

[Section 12.2, "only_one_line_element"](../12_junctions/12_02_common_junctions.html#sec-9b5c73fd-4ed5-4373-b20c-7154de1c1fc3)

┃      ┃      ┃━ `<geometry>`

[Section 12.9, "only_one_line_element"](../12_junctions/12_09_junction_reference_line.html#sec-274bf81a-3aec-4c26-9997-33e018f7cb14)

┃      ┃      ┃      ┃━ `<line>`

[Section 9.3, "Straight line"](../09_geometries/09_03_straight_line.html#top-74c133a9-fc15-4a00-ae49-9a4cdc20b742)

┃      ┃      ┃      ┃━ `<spiral>`

[Section 9.4, "Spiral"](../09_geometries/09_04_spiral.html#top-9807cfa9-04f5-4eca-b468-d68b71486666)

┃      ┃      ┃      ┃━ `<arc>`

[Section 9.5, "Arc"](../09_geometries/09_05_arc.html#top-0d75cff2-4103-401f-a802-b5868d15a4fe)

┃      ┃      ┃      ┃━ `<poly3>`

[Section 9.7, "Cubic polynom (deprecated)"](../09_geometries/09_07_poly3.html#top-2f3fb62e-d0be-4eb8-a0f6-8bc0d6f6d953)

┃      ┃      ┃      ┃━ `<paramPoly3>`

[Section 9.6, "Parametric cubic curve"](../09_geometries/09_06_param_poly3.html#top-f99539a9-f2db-47cf-b728-4277cb50e3f2)

┃━ `<junction type="virtual">`

[Section 12.7, "Virtual junctions"](../12_junctions/12_07_virtual_junctions.html#top-9b619813-89bc-4476-b003-30b6ac302fdc)

┃      ┃━ `<connection type="default">`

[Section 12.7.1, "Cross paths with virtual junctions"](../12_junctions/12_07_virtual_junctions.html#sec-5a077e91-8ef2-4d5f-9634-dde5703fb494)

┃      ┃      ┃━ `<laneLink>`

[Section 12.6, "Direct junctions"](../12_junctions/12_06_direct_junctions.html#top-c6c31e70-0fe9-44ac-89c8-fc1de9bf5195)

┃      ┃━ `<connection type="virtual">`

[Section 12.7.1, "Virtual connections (deprecated)"](../12_junctions/12_07_virtual_junctions.html#sec-7e990ee5-5ab1-4346-886e-bb4766a78032)

┃      ┃      ┃━ `<predecessor>`

[Section 12.7.1, "Virtual connections (deprecated)"](../12_junctions/12_07_virtual_junctions.html#sec-7e990ee5-5ab1-4346-886e-bb4766a78032)

┃      ┃      ┃━ `<successor>`

[Section 12.7.1, "Virtual connections (deprecated)"](../12_junctions/12_07_virtual_junctions.html#sec-7e990ee5-5ab1-4346-886e-bb4766a78032)

┃      ┃      ┃━ `<laneLink>`

[Section 12.6, "Direct junctions"](../12_junctions/12_06_direct_junctions.html#top-c6c31e70-0fe9-44ac-89c8-fc1de9bf5195)

┃      ┃━ `<crossPath>`

[Section 12.5, "Cross paths"](../12_junctions/12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)

┃      ┃      ┃━ `<startLaneLink>`

[Section 12.5, "Cross paths"](../12_junctions/12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)

┃      ┃      ┃━ `<endLaneLink>`

[Section 12.5, "Cross paths"](../12_junctions/12_05_cross_paths.html#top-6ac8a5ea-45ca-4a28-97e3-711deec5c792)

┃      ┃━ `<priority>`

[Section 12.4.1, "Priorities of connecting roads within a junction"](../12_junctions/12_04_connecting_roads.html#sec-f60730d7-4192-440e-a6ba-8082288a1115)

┃      ┃━ `<controller>`

[Section 12.14, "Signal synchronization groups in junctions"](../12_junctions/12_14_signal_synchronization_groups.html#top-add49732-8747-40b6-93b0-1b3ff20afeb9)

┃      ┃━ `<surface>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃      ┃━ `<CRG>`

[Section 12.12, "Junction CRG surface"](../12_junctions/12_12_junction_crg_surface.html#top-9c1db57b-4325-472d-9c29-14e4872aa123)

┃      ┃━ `<planView>`

[Section 12.2, "only_one_line_element"](../12_junctions/12_02_common_junctions.html#sec-9b5c73fd-4ed5-4373-b20c-7154de1c1fc3)

┃      ┃      ┃━ `<geometry>`

[Section 12.9, "only_one_line_element"](../12_junctions/12_09_junction_reference_line.html#sec-274bf81a-3aec-4c26-9997-33e018f7cb14)

┃      ┃      ┃      ┃━ `<line>`

[Section 9.3, "Straight line"](../09_geometries/09_03_straight_line.html#top-74c133a9-fc15-4a00-ae49-9a4cdc20b742)

┃      ┃      ┃      ┃━ `<spiral>`

[Section 9.4, "Spiral"](../09_geometries/09_04_spiral.html#top-9807cfa9-04f5-4eca-b468-d68b71486666)

┃      ┃      ┃      ┃━ `<arc>`

[Section 9.5, "Arc"](../09_geometries/09_05_arc.html#top-0d75cff2-4103-401f-a802-b5868d15a4fe)

┃      ┃      ┃      ┃━ `<poly3>`

[Section 9.7, "Cubic polynom (deprecated)"](../09_geometries/09_07_poly3.html#top-2f3fb62e-d0be-4eb8-a0f6-8bc0d6f6d953)

┃      ┃      ┃      ┃━ `<paramPoly3>`

[Section 9.6, "Parametric cubic curve"](../09_geometries/09_06_param_poly3.html#top-f99539a9-f2db-47cf-b728-4277cb50e3f2)

┃━ `<junctionGroup>`

[Section 12.13, "Junction groups"](../12_junctions/12_13_junction_groups.html#top-99e6f0a6-ad6b-4c5e-bace-622208adfc2f)

┃      ┃━ `<junctionReference>`

[Section 12.13, "Junction groups"](../12_junctions/12_13_junction_groups.html#top-99e6f0a6-ad6b-4c5e-bace-622208adfc2f)

┃━ `<station>`

[Section 15.4, "Stations"](../15_railroads/15_04_stations.html#top-049863be-26b9-4c34-9991-ac8ad690c8be)

┃      ┃━ `<platform>`

[Section 15.4.1, "Platforms"](../15_railroads/15_04_stations.html#sec-9504c509-63ef-427a-a9b9-db307266e523)

┃      ┃      ┃━ `<segment>`

[Section 15.4.1, "Segments"](../15_railroads/15_04_stations.html#sec-279fe10d-a645-4073-8950-02f81f8183f6)
