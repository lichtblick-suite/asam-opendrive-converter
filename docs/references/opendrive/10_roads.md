> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 10 Roads

## 10.1 Introduction

**Elements in UML model**

**`<road>` element**

In ASAM OpenDRIVE, roads are represented by `<road>` elements within the `<OpenDRIVE>` element.

UML class: t_road
XML tag:   <road> (Multiplicity: 1..*)

Roads are the core elements for any road network in ASAM OpenDRIVE. Each road runs along one road reference line.

A road shall have at least the center lane. Vehicles may drive in both directions of the road reference line. The standard driving direction is defined by the value which is assigned to the @rule attribute (RHT=right-hand traffic, LHT=left-han traffic).

ASAM OpenDRIVE roads may be roads in the real road network or artificial road network created for application use. Each road is described by one or more `<road>` elements. One `<road>` element may cover a long stretch of a road, shorter stretches between junctions, or even several roads. A new `<road>` element should only start if the properties of the road cannot be described within the previous `<road>` element or if a junction is required.d

Table 23. Attributes of the <road> element     

Name

Type

Use

Unit

Description

`id`

string

required

Unique ID within the database. If it represents an integer number, it should comply to uint32_t and stay within the given range.

`junction`

string

required

ID of the junction to which the road belongs, for example connecting roads, cross paths, and roads of a junction boundary. Use -1 for none.

`length`

[t_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13)

required

m

Total length of the reference line in the xy-plane. Change in length due to elevation is not considered

`name`

string

optional

Name of the road. May be chosen freely.

`rule`

[e_trafficRule](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_E5B4C9F4_52A5_4673_9790_6A042A3E3CB0)

optional

Basic rule for using the road; RHT=right-hand traffic, LHT=left-hand traffic. When this attribute is missing, RHT is assumed.

![img](../_images/uml_class_diagrams/EAID_E70C4B2B_6DDE_4179_A15E_75EF81E5C66F.png)

Figure 36. UML class diagram of the Road class

[Figure 36](#fig-85a83e7b-6dd1-4948-8a78-28d7a66907a0) shows the UML class diagram of the ASAM OpenDRIVE Road class.

![img](../_images/uml_class_diagrams/EAID_8A007E88_354E_463e_9D40_944248350DFB.png)

Figure 37. UML class diagram of the RoadGeometry class

[Figure 37](#fig-1a0ac60d-0a79-4724-b78f-eab7e6b4992b) shows the UML class diagram of the ASAM OpenDRIVE RoadGeometry class.

**Rules**

The following rules apply to roads:

*   [asam.net:xodr:1.4.0:road.overlap_inside_junction](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-overlap-inside-junction): Only roads with the same junction id may overlap on the same level. This does not include roads on different driving levels, for example, bridges.
    
*   [asam.net:xodr:1.4.0:road.no_overlap_outside_junction](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-no-overlap-outside-junction): Roads outside a junction shall not overlap.
    
*   [asam.net:xodr:1.4.0:road.no_overlap_self](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-no-overlap-self): A road shall not overlap with itself.
    
*   The road length should be the sum of the lengths of all `<geometry>` elements
    

**Related topics**

*   [Section 9.2, "Road reference line"](../09_geometries/09_02_road_reference_line.html#top-9cb15835-ff9e-4b51-9bc8-730a3695fde9)
    
*   [Section 10.3, "Road linkage"](10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
    
*   [Section 11.1, "Introduction to lanes"](../11_lanes/11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)

## 10.2 Properties for road sections and cross section

Some properties of roads are described based on the cross section of the road. The road cross section is the orthogonal view of the road at a given point on the road reference line. An example of a property that refers to the road cross section is superelevation. Elements that are valid for a road cross section are valid for the whole width of the road at a given point on the road reference line.

Other road properties are described based on the plan view of the road. This includes lanes and road elevation. For these properties, the term road section is used. Road sections describe parts of roads and their specific properties along the s-coordinate of the road reference line. Properties that are valid for a road section may not be valid for the whole width of the road, but for specific lanes only.

That means it is possible to create sections for different properties like road type or lane sections. Sections are created by an additional element within the `<road>` element, using new start s-coordinates. The length of a section is implicitly given by the difference between two given s-start positions. Sections shall be stored in ascending order of s-coordinates.

## 10.3 Road linkage

For applications to navigate through a road network, roads must be linked to each other. Roads may be connected to another road or a junction. Isolated roads are not connected to other roads or junctions.

![img](../_images/10_roads/allow_link_1.png)

Figure 38. Allowed, prohibited, and recommended road linkage

[Figure 38](#fig-38e28751-d2f4-48e8-b4fe-762df507b0af) shows cases of prohibited, allowed, and recommended road linkage. It is important that the lanes and road reference lines of the roads to be linked have a direct linkage to its predecessor or successor. Overlaps or leaps should be avoided but are not prohibited if the road reference lines are connected properly.

![img](../_images/10_roads/allow_link_2.png)

Figure 39. Allowed cases of road linkage

[Figure 39](#fig-c4600da4-6139-45b6-9de0-af56f6797cc0) shows the allowed cases for road linkage outside junctions, with two roads running in the same, opposite, or converging directions. Road linkage is not possible, if the two road reference lines are not connected to each other.

![img](../_images/10_roads/allow_link_3.png)

Figure 40. Allowed case of road linkage within a junction

[Figure 40](#fig-e1bb1e1d-2952-42a4-a0e5-03cdb913f366) shows the allowed case for road linkage within a junction.

A successor of a given road is an element connected to the end of its road reference line. A predecessor of a given road is an element connected to the start of its road reference line. For junctions, different attribute sets shall be used for the `<predecessor>` and `<successor>` elements.

**Elements in UML model**

**`<link>` element**

In ASAM OpenDRIVE, road linkage is represented by the `<link>` element within the `<road>` element.

UML class: t_road_link
XML tag:   <link> (Multiplicity: 0..1)

Follows the road header if the road is linked to a successor or a predecessor. Isolated roads may omit this element.

![img](../_images/uml_class_diagrams/EAID_4C4C33F7_889B_4892_ACCF_0127F3BA1B7B.png)

Figure 41. UML class diagram of the Link class

[Figure 41](#fig-805c6a13-6e8a-4e6c-bde6-170ae7b09a6c) shows the UML class diagram of the ASAM OpenDRIVE Link class.

**`<predecessor>` and `<successor>` elements**

In ASAM OpenDRIVE, predecessors and successors are represented by the `<predecessor>` and `<successor>` elements within the `<link>` element.

UML class: t_road_link_predecessorSuccessor
XML tag:   <predecessor> (Multiplicity: 0..1)
XML tag:   <successor> (Multiplicity: 0..1)

Successors and predecessors can be junctions or roads. For each, different attribute sets shall be used.

Table 24. Attributes of the <predecessor> and <successor> elements     

Name

Type

Use

Unit

Description

`contactPoint`

[e_contactPoint](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EF13C2F5_5229_46f8_983F_E8B6252DC5B7)

optional

Contact point of link on the linked element

`elementDir`

[e_elementDir](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_D1E21B53_3817_4627_8EC7_24415D264892)

optional

To be provided when elementS is used for the connection definition. Indicates the direction on the predecessor from which the road is entered.

`elementId`

string

required

ID of the linked element

`elementS`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

Alternative to contactPoint for virtual junctions. Indicates a connection within the predecessor, meaning not at the start or end of the predecessor. Shall only be used for elementType "road"

`elementType`

[e_road_link_elementType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_0DE449D1_BB4F_4bbc_A0DD_3A4722246020)

required

Type of the linked element

**Rules**

The following rules apply to road linkage:

*   [asam.net:xodr:1.4.0:road.linkage.is_junction_needed](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-linkage-is-junction-needed): Two roads shall only be linked directly if the linkage is clear. If the relationship to successor or predecessor is ambiguous, junctions shall be used.
    
*   A road may have another road or a junction as successor or predecessor. A road may also have no successor or predecessor.
    
*   A road may serve as its own predecessor or successor.
    
*   [asam.net:xodr:1.4.0:road.linkage.road_link_attribute_usage](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-linkage-road-link-attribute-usage): For a road as successor or predecessor the @elementType, @elementId and @contactPoint attributes shall be used.
    
*   [asam.net:xodr:1.7.0:road.linkage.junc_link_attribute_usage](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-linkage-junc-link-attribute-usage): For a common junction and a direct junction as successor or predecessor the @elementType and @elementId attributes shall be used.
    
*   [asam.net:xodr:1.7.0:road.linkage.virtjunc_link_attribute_usage](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-linkage-virtjunc-link-attribute-usage): For a virtual junction as successor or predecessor the @elementType, @elementId, @elementS and @elementDir attributes shall be used.
    
*   `<predecessor>` and/or `<successor>` shall be defined at both sides of the road linkage and shall be consistent.
    

**Related topics**

*   [Section 9.2, "Road reference line"](../09_geometries/09_02_road_reference_line.html#top-9cb15835-ff9e-4b51-9bc8-730a3695fde9)
    
*   [Section 11.5, "Lane linkage"](../11_lanes/11_05_lane_link.html#top-26f830a9-2eba-4948-aac9-8015c5206efd)
    
*   [Section 12.1, "Introduction to junctions"](../12_junctions/12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)

## 10.4 Road type

The road type defines the main purpose of a road and the associated traffic rules. Example road types are motorways and rural roads. The road type is valid for the entire road cross section.

The road type may be changed as often as needed within a `<road>` element. This may be done by defining different road types at given points along the road reference line. One road type remains valid until another road type is defined.

**Elements in UML model**

**`<type>` element**

In ASAM OpenDRIVE, the road type is represented by the `<type>` element within the `<road>` element.

UML class: t_road_type
XML tag:   <type> (Multiplicity: 0..*)

A road type element is valid for the entire cross section of a road. It is valid until a new road type element is provided or until the road ends.

Table 25. Attributes of the <type> element     

Name

Type

Use

Unit

Description

`country`

[e_countryCode](../16_annexes/map_uml_data_types.html#top-EAID_7A0922E5_0B9A_4a52_8063_A2499579DB20)

optional

Country code of the road, see ISO 3166-1, alpha-2 codes.

`s`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position

`type`

[e_roadType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_3A3FB3DD_D0CF_43a7_95D6_30D9D024D0D9)

required

Type of the road defined as enumeration

**Rules**

The following rules apply to road types:

*   [asam.net:xodr:1.4.0:road.type.create_new_type_in_parent](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-type-create-new-type-in-parent): When the type of road changes, a new `<type>` element shall be created within the parent `<road>` element.
    
*   Country code and state identifier may be added to the `<type>` element to specify which national traffic rules apply to this road type. The according data is stored in the application and not in ASAM OpenDRIVE.
    
*   [asam.net:xodr:1.7.0:road.type.only_alpha_2_country_codes](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-type-only-alpha-2-country-codes): There shall only be ALPHA-2 country codes in use, no ALPHA-3 country codes, because only ALPHA-2 country codes support state identifiers.
    
*   [asam.net:xodr:1.4.0:road.type.lane_type_may_differ_from_parent](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-type-lane-type-may-differ-from-parent): Single lanes may have another type than the road they belong to. Road type and lane type represent different properties and are both valid if specified.
    
*   [asam.net:xodr:1.4.0:road.type.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-type-elem-asc-order): `<type>` elements shall be defined in ascending order according to the s-coordinate.
    

**Related topics**

*   [Section 10.2, "Properties for road sections and cross section"](10_02_properties_for_road_sections.html#top-1323a74c-b102-4fdd-bc02-63265f034f45)
    
*   [Section 11.7.1, "Lane type"](../11_lanes/11_07_lane_properties.html#sec-79c983d6-db57-41ad-85f7-4643c25910dc)
    

<a id="sec-33dc6899-854e-4533-a3d9-76e9e1518ee7"></a>
### 10.4.1 Speed limits for road types

A speed limit may be defined for a road type. When the road type changes and a speed limit exists on that road section, a new `<speed>` element is required, because road types have no global valid speed limits unless provided by [`<defaultRegulations>`](../06_general_architecture/06_04_header.html#sec-27ad621f-1b2a-40d6-8723-b9f8aa00cb3f). The speed limit shall be defined for each `<type>` element of a road separately.

**Elements in UML model**

**`<speed>` element**

In ASAM OpenDRIVE, the speed limit is represented by the `<speed>` element within the `<type>` element.

UML class: t_road_type_speed
XML tag:   <speed> (Multiplicity: 0..1)

Defines the default maximum speed allowed in conjunction with the specified road type.

Table 26. Attributes of the <speed> element    

Name

Type

Use

Description

`max`

[t_maxSpeed](../16_annexes/map_uml_data_types.html#top-EAID_D2734936_A31D_4410_8CA6_F04AA0984531)

required

Maximum allowed speed. Given as string (only "no limit" / "undefined") or numerical value in the respective unit (see attribute unit). If the attribute unit is not specified, m/s is used as default.

`unit`

[e_unitSpeed](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_491DC05E_01C6_49b3_83BE_A06DD81F9C35)

required

Unit of the attribute max. For values, see chapter “units”.

**Rules**

The following rules apply to speed limits:

*   A maximum speed may be defined as default value per `<type>` element of a road.
    
*   Single lanes may have different speed limits than the road they belong to. They are defined as a lane `<speed>` element.
    
*   Speed limits derived from signals shall always have preference.
    

**Related topics**

*   [Section 10.2, "Properties for road sections and cross section"](10_02_properties_for_road_sections.html#top-1323a74c-b102-4fdd-bc02-63265f034f45)
    
*   [Section 14.1, "Introduction to signals"](../14_signals/14_01_introduction.html#top-6a25938a-15c5-4eff-bde6-d82d3caf279a)
    
*   [Section 11.7.1, "Lane speed limit"](../11_lanes/11_07_lane_properties.html#sec-866ad6d9-a026-4051-9a3a-5f94405a15f7)

## 10.5 Elevation

Cross section surfaces describe the road surface along the road reference line with strips. A strip defines a start position in s-direction and parameters for polynomials in t-direction. On each side of the road reference line there are up to two strips. The inner strip to the right has @id="-1" and the inner strip to the left @id="1". The outer strip to the right has @id="-2" and the outer strip to the left @id="2".

![img](../_images/10_roads/cross_section_surface_strips.png)

Figure 47. Cross section surface strips on a road

[Figure 47](#fig-b868a64e-b460-4408-925c-eb0a6826a120) shows a road with strips of a cross section surface.

The inner strips have a width and an offset in t-direction to define where the outer strips start in t-direction. The outer strips are valid to the outer edge of the last defined lane on the given side. If only one strip exists, it has no given width and is valid to the end of the lane definition.

The road surface of the outer strip can be calculated relative to or independent of the inner strip.

![img](../_images/10_roads/cross_section_surface.png)

Figure 48. Cross section surface

[Figure 48](#fig-e4eee75b-f906-45b7-8daa-02e94307779c) shows cross section surfaces on both sides of a road.

In general strip ids and strip widths are independent of lane ids and lane widths.

**Elements in UML model**

**`<lateralProfile>` element**

In ASAM OpenDRIVE, the lateral profile is represented by the `<lateralProfile>` element within the `<road>` element.

UML class: t_road_lateralProfile
XML tag:   <lateralProfile> (Multiplicity: 0..1)

Contains a series of lateral elevation elements that define the characteristics of the road surfaces banking along the road reference line. The lateral profile is defined relative to the elevation of the road reference line.

**`<crossSectionSurface>` element**

In ASAM OpenDRIVE, cross section surfaces are represented by the `<crossSectionSurface>` element within the `<lateralProfile>` element.

UML class:  t_road_lateralProfile_crossSectionSurface
XML tag:    <crossSectionSurface> (Multiplicity: 0..1)
Introduced: 1.8.0

A cross section surface defines the lateral profile by means of constant, linear, quadratic, and cubic polynomials in t-direction.

A cross section surface is valid for the full length of the road.

**`<tOffset>` element**

In ASAM OpenDRIVE, a t-offset is represented by the `<tOffset>` element within the `<crossSectionSurface>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_tOffset
XML tag:    <tOffset> (Multiplicity: 0..1)
Introduced: 1.8.0

A t offset shifts all strips relative to the road reference line in t-direction.

**`<surfaceStrips>` element**

In ASAM OpenDRIVE, surfaces are represented by the `<surfaceStrips>` element within the `<crossSectionSurface>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_surfaceStrip
XML tag:    <surfaceStrips> (Multiplicity: 1)
Introduced: 1.8.0

Surface strips contains the strips.

**`<strip>` element**

In ASAM OpenDRIVE, surface definitions are represented by the `<strip>` element within the `<surfaceStrips>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_strip
XML tag:    <strip> (Multiplicity: 1..4)
Introduced: 1.8.0

A strip defines the lateral profile in t- and s-direction.

Table 30. Attributes of the <strip> element    

Name

Type

Use

Description

`id`

int

required

1 for the inner left strip, -1 for the inner right strip, 2 for the outer left strip, -2 for the outer right strip

`mode`

[e_strip_mode](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_54B8FC12_8EA8_4739_A7DE_1EE52DEA3389)

optional

Can only be defined for an outer strip.

**`<width>` element**

In ASAM OpenDRIVE, definitions of the width are represented by the `<width>` element within the `<strip>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_strip_width
XML tag:    <width> (Multiplicity: 0..1)
Introduced: 1.8.0

Defines the width of the inner strip.

**`<constant>` element**

In ASAM OpenDRIVE, constant parts are represented by the `<constant>` element within the `<strip>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_strip_constant
XML tag:    <constant> (Multiplicity: 0..1)
Introduced: 1.8.0

Defines in t a constant height of the surface.

**`<linear>` element**

In ASAM OpenDRIVE, linear parts are represented by the `<linear>` element within the `<strip>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_strip_linear
XML tag:    <linear> (Multiplicity: 0..1)
Introduced: 1.8.0

Defines in t a linear height of the surface.

**`<quadratic>` element**

In ASAM OpenDRIVE, quadratic parts are represented by the `<quadratic>` element within the `<strip>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_strip_quadratic
XML tag:    <quadratic> (Multiplicity: 0..1)
Introduced: 1.8.0

Defines in t a quadratic height of the surface.

**`<cubic>` element**

In ASAM OpenDRIVE, cubic parts are represented by the `<cubic>` element within the `<strip>` element.

UML class:  t_road_lateralProfile_crossSectionSurface_strip_cubic
XML tag:    <cubic> (Multiplicity: 0..1)
Introduced: 1.8.0

Defines in t a cubic height of the surface.

**`<coefficients>` element**

In ASAM OpenDRIVE, the cross section surface polynomial coefficients are represented by the <coefficients> element within the <tOffset>, <width>, <constant>, <linear>, <quadratic>, or <cubic> element.

UML class:  t_road_lateralProfile_crossSectionSurface_coefficients
XML tag:    <coefficients> (Multiplicity: 1..*)
Introduced: 1.8.0

Defines the coefficients of a cubic polynomial in s-direction.

The first `<coefficients>` element shall start at the beginning of the road reference line with @s="0".

Table 31. Attributes of the <coefficients> element      

Name

Type

Use

Unit

Introduced

Description

`a`

double

optional

m

1.8.0

Polynomial parameter a. If the attribute is not specified, the value is 0.

`b`

double

optional

m/m

1.8.0

Polynomial parameter b. If the attribute is not specified, the value is 0.

`c`

double

optional

m/m²

1.8.0

Polynomial parameter c. If the attribute is not specified, the value is 0.

`d`

double

optional

m/m³

1.8.0

Polynomial parameter d. If the attribute is not specified, the value is 0.

`s`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position

**XML example**

Code 1. Solution in ASAM OpenDRIVE 1.8

```
<lateralProfile>
    <crossSectionSurface>
        <tOffset>
            <coefficients s="0.0"
                          a="0.0"
                          b="0.0"
                          c="0.0045000000000000005"
                          d="-5e-05"/>
            <coefficients s="50.0"
                          a="5.0"
                          b="0.075"
                          c="-0.003"
                          d="3e-05"/>
        </tOffset>
        <surfaceStrips>
            <strip id="1">
                <width>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="0.0"
                                  c="0.006000000000000001"
                                  d="-6.400000000000001e-05"/>
                    <coefficients s="50.0"
                                  a="7.0"
                                  b="0.12"
                                  c="-0.0036"
                                  d="3.2e-05"/>
                </width>
                <constant>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="1.942890293094024e-18"
                                  c="0.0011385321100917428"
                                  d="-3.192660550458715e-05"/>
                    <coefficients s="20.0"
                                  a="0.2"
                                  b="0.007229357798165137"
                                  c="-0.0007770642201834863"
                                  d="9.449541284403669e-06"/>
                    <coefficients s="70.0"
                                  a="-0.2"
                                  b="0.0003944954128440377"
                                  c="0.0006403669724770642"
                                  d="-1.437648657832144e-05"/>
                </constant>
                <linear>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="0.0"
                                  c="-0.0003285714285714286"
                                  d="6.507936507936508e-06"/>
                    <coefficients s="30.0"
                                  a="-0.12"
                                  b="-0.002142857142857143"
                                  c="0.00025714285714285715"
                                  d="-2.3032069970845484e-06"/>
                </linear>
                <quadratic>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="0.0"
                                  c="-2.1649831649831646e-06"
                                  d="3.713680009976306e-08"/>
                    <coefficients s="45.0"
                                  a="-0.001"
                                  b="3.0757575757575755e-05"
                                  c="2.848484848484849e-06"
                                  d="-3.7916353618832964e-08"/>
                </quadratic>
                <cubic>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="0.0"
                                  c="1.4840830449826988e-06"
                                  d="-1.5831467535110928e-08"/>
                    <coefficients s="85.0"
                                  a="0.001"
                                  b="-9.085294117647057e-05"
                                  c="-2.5529411764705903e-06"
                                  d="2.480610021786493e-07"/>
                </cubic>
            </strip>
            <strip id="2">
                <constant>
                    <coefficients s="0.0"
                                  a="0.2"
                                  b="0.0"
                                  c="-0.00031875"
                                  d="3.2031250000000004e-06"/>
                    <coefficients s="80.0"
                                  a="-0.2"
                                  b="0.0105"
                                  c="0.00045"
                                  d="-2.375e-05"/>
                </constant>
                <linear>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="8.673617379884036e-20"
                                  c="-8.437500000000002e-06"
                                  d="6.640625000000001e-08"/>
                    <coefficients s="80.0"
                                  a="-0.02"
                                  b="-7.500000000000001e-05"
                                  c="7.500000000000001e-06"
                                  d="-1.8750000000000003e-07"/>
                </linear>
                <quadratic>
                    <coefficients s="0.0"
                                  a="0.0001"
                                  b="-2.6201552501733024e-20"
                                  c="-4.856163886874543e-06"
                                  d="2.8561638868745455e-07"/>
                    <coefficients s="10.0"
                                  a="-0.0001"
                                  b="-1.1438361131254525e-05"
                                  c="3.712327773749093e-06"
                                  d="-1.3739209840732682e-07"/>
                    <coefficients s="25.0"
                                  a="0.0001"
                                  b="7.1918056562726596e-06"
                                  c="-2.4703166545806143e-06"
                                  d="4.0075537829344936e-08"/>
                    <coefficients s="65.0"
                                  a="-0.001"
                                  b="1.9290548706792377e-06"
                                  c="2.338747884940778e-06"
                                  d="-4.5072491650757476e-08"/>
                </quadratic>
                <cubic>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="0.0"
                                  c="3.1999999999999995e-07"
                                  d="-3.555555555555555e-09"/>
                    <coefficients s="75.0"
                                  a="0.0003"
                                  b="-1.1999999999999999e-05"
                                  c="-4.8e-07"
                                  d="1.92e-08"/>
                </cubic>
            </strip>
            <strip id="-1">
                <width>
                    <coefficients s="0.0"
                                  a="8.0"
                                  b="0.0"
                                  c="0.0"
                                  d="0.0"/>
                </width>
                <constant>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="1.942890293094024e-18"
                                  c="0.0011385321100917428"
                                  d="-3.192660550458715e-05"/>
                    <coefficients s="20.0"
                                  a="0.2"
                                  b="0.007229357798165137"
                                  c="-0.0007770642201834863"
                                  d="9.449541284403669e-06"/>
                    <coefficients s="70.0"
                                  a="-0.2"
                                  b="0.0003944954128440377"
                                  c="0.0006403669724770642"
                                  d="-1.437648657832144e-05"/>
                </constant>
                <linear>
                    <coefficients s="0.0"
                                  a="0.1"
                                  b="0.0"
                                  c="6.000000000000001e-05"
                                  d="-4.0000000000000003e-07"/>
                </linear>
            </strip>
            <strip id="-2">
                <linear>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="1.3183898417423733e-17"
                                  c="-0.0005797802197802213"
                                  d="2.9763125763125804e-05"/>
                    <coefficients s="15.0"
                                  a="-0.03"
                                  b="0.0026967032967032934"
                                  c="0.0007595604395604402"
                                  d="-5.2923076923076945e-05"/>
                    <coefficients s="25.0"
                                  a="0.02"
                                  b="0.002010989010989012"
                                  c="-0.0008281318681318682"
                                  d="3.270329670329671e-05"/>
                    <coefficients s="35.0"
                                  a="-0.01"
                                  b="-0.004740659340659341"
                                  c="0.00015296703296703297"
                                  d="-1.1948761297873725e-06"/>
                </linear>
                <quadratic>
                    <coefficients s="0.0"
                                  a="0.0"
                                  b="0.0"
                                  c="1.8518518518518523e-06"
                                  d="-1.920438957475995e-08"/>
                    <coefficients s="90.0"
                                  a="0.001"
                                  b="-0.00013333333333333337"
                                  c="-3.333333333333328e-06"
                                  d="6.666666666666664e-07"/>
                </quadratic>
                <cubic>
                    <coefficients s="0.0"
                                  a="-0.0002"
                                  b="2.7105054312137612e-21"
                                  c="9.583333333333325e-08"
                                  d="-6.712962962962956e-10"/>
                    <coefficients s="60.0"
                                  a="0.0"
                                  b="4.25e-06"
                                  c="-2.499999999999998e-08"
                                  d="-4.687500000000003e-10"/>
                </cubic>
            </strip>
        </surfaceStrips>
    </crossSectionSurface>
</lateralProfile>
```

**Calculation**

**Calculation of width**

The width is calculated with the following function:

\\[\\begin{align*} w_{i}(ds) = a_{i} + b_{i}*ds + c_{i}*ds^{2} + d_{i}*ds^{3} \\end{align*}\\]

where

 

\\(w_{i}\\)

is the width at a given position

\\(a_{i}, b_{i}, c_{i}, d_{i}\\)

are the coefficients stored in the `<width>` element

\\(ds\\)

is the distance along the road reference line between the start of a `<crossSectionSurface>` element and the given position

For \\(n\\) entries with a width definition in s-direction define the following parameters:

\\[\\begin{align*} s_{0..n}, a_{0..n}, b_{0..n}, c_{0..n}, d_{0..n} \\end{align*}\\]

\\[\\begin{align*} with: ds = s - s_{0..n} \\end{align*}\\]

**Calculation of \\(t_{offset}\\)**

The offset for t is calculated with the following function:

\\[\\begin{align*} t_{offset,i}(ds) = a_{i} + b_{i}*ds + c_{i}*ds^{2} + d_{i}*ds^{3} \\end{align*}\\]

where

 

\\(t_{offset,i}\\)

is the t-offset at a given position

\\(a_{i}, b_{i}, c_{i}, d_{i}\\)

are the coefficients stored in the `<tOffset>` element

\\(ds\\)

is the distance along the road reference line between the start of a `<crossSectionSurface>` element and the given position

For \\(m\\) entries with a t-offset definition in s-direction define the following parameters:

\\[\\begin{align*} s_{0..m}, a_{0..m}, b_{0..m}, c_{0..m}, d_{0..m} \\end{align*}\\]

\\[\\begin{align*} with: ds = s - s_{0..m} \\end{align*}\\]

**Calculation of \\(dt\\)**

Since the width has always a positive value, the calculation of the distance along the t-axis, \\(dt\\), has to consider the side.

Subtract the \\(t_{offset}\\) from \\(t\\) to get the effective \\(t_{effective}\\):

\\[\\begin{align*} t_{effective} = t - t_{offset} \\end{align*}\\]

For the right side with \\(t_{effective} <= 0\\) apply the following:

If \\(-w_{right} <= t_{effective} <= 0\\) calculate

\\[\\begin{align*} &dt = t_{effective}\\\\ &dt = t - t_{offset} \\end{align*}\\]

If \\(t_{effective} < -w_{right}\\) calculate

\\[\\begin{align*} &dt = t_{effective} + w_{right}\\\\ &dt = t - t_{offset} + w_{right} & w_{right} > 0 \\end{align*}\\]

For the left side with \\(t_{effective} > 0\\) apply the following:

If \\(0 <= t_{effective} <= w_{left}\\) calculate

\\[\\begin{align*} &dt = t_{effective}\\\\ &dt = t - t_{offset} \\end{align*}\\]

If \\(t_{effective} < w_{left}\\) calculate

\\[\\begin{align*} &dt = t_{effective} - w_{left}\\\\ &dt = t - t_{offset} - w_{left} & w_{left} > 0 \\end{align*}\\]

**Calculation of the local height due to the cross section surface**

The height value is calculated with the following function:

\\[\\begin{align*} h_{CrossSectionSurface}(s, t) = co(s) + li(s)*dt + qu(s)*dt^{2} + cu(s)*dt^{3} \\end{align*}\\]

where

 

\\(s, t\\)

are the positions given in s and t

\\(co_{s}, li_{s}, qu_{s}, cu_{s}\\)

are the constant, linear, quadratic, and cubic components depending on the s-position

\\(dt\\)

is the distance along the t-axis

The constant, linear, quadratic, and cubic components are linearly independent and can be calculated separately.

The constant (\\(co\\)) component uses the following definitions:

\\[\\begin{align*} s_{co,0..n_{co}}, a_{co,0..n_{co}}, b_{co,0..n_{co}}, c_{co,0..n_{co}}, d_{co,0..n_{co}} \\end{align*}\\]

\\[\\begin{align*} with: &&i = 0..n_{co}\\\\ &&s_{co,i} <= s < s_{co,i+1}\\\\ &&ds_{co} = s - s_{co,i} \\end{align*}\\]

\\[\\begin{align*} co(s) = a_{co,i} + b_{co,i}*ds_{co} + c_{co,i}*{ds_{co}}^{2} + d_{co,i}*{ds_{co}}^{3} \\end{align*}\\]

The same definitions apply to the linear (\\(li\\)), quadratic (\\(qu\\)) and cubic (\\(cu\\)) components. The number \\(n\\) of the components, \\(n_{co}\\), \\(n_{li}\\), \\(n_{qu}\\), and \\(n_{cu}\\) can be different for each component.

**Calculation of height regarding the mode**

In the case of the inner two strips (\\(-w_{right} <= t_{effective} <= w_{left}\\)), the mode does not matter:

\\[\\begin{align*} h_{strip}(s, dt) = h_{CrossSectionSurface}(s, dt) \\end{align*}\\]

In the case of the outer two strips (\\(t_{effective} < -w_{right}\\) or \\(t_{effective} > w_{left}\\)), the mode shall be taken into account.

@mode="independent"

The calculation of the polynomials for the height values is independent and based on the road reference line.

@mode="relative"

The calculation of the polynomials for the height values is relative to the outer edge of the inner strip.

Left side:

\\[\\begin{align*} h_{CrossSectionSurface}(s, t) = h_{strip,id=1}(s, dt = w_{left,id=1}(s)) + h_{strip,id=2}(s, dt) \\end{align*}\\]

Right side:

\\[\\begin{align*} h_{CrossSectionSurface}(s, t) = h_{strip,id=-1}(s, dt = -w_{right,id=-1}(s)) + h_{strip,id=-2}(s, dt) \\end{align*}\\]

**Rules**

*   [asam.net:xodr:1.8.0:road.cross_section_surface.lane_def_valid](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-cross-section-surface-lane-def-valid): A cross section surface is only valid within the lane definition of the road.
    
*   [asam.net:xodr:1.8.0:road.cross_section_surface.start_end_match_with_refline](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-cross-section-surface-start-end-match-with-refline): A cross section surface shall start and end at the start and end of the road reference line.
    
*   [asam.net:xodr:1.8.0:road.cross_section_surface.use_strip](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-cross-section-surface-use-strip): If on a side only one strip is used, it is defined in a `<strip>` element with @id="1" or @id="-1" and a width shall not be specified.
    
*   [asam.net:xodr:1.8.0:road.cross_section_surface.use_width](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-cross-section-surface-use-width): If on a side two strips are specified, a width for the inner strip shall be specified.
    
*   [asam.net:xodr:1.8.0:road.cross_section_surface.height](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-cross-section-surface-height): The value of @height at `<lane>` elements is added to the cross section surface in z-direction.
    
*   The @level attribute may be used to exclude outer lanes from the cross section surface definition.
    
*   [asam.net:xodr:1.8.0:road.cross_section_surface.no_shape_superelevation](../16_annexes/map_rules.html#asam-net-xodr-1-8-0-road-cross-section-surface-no-shape-superelevation): A cross section surface shall not be used in combination with road shape or superelevation.
    

**Related topics**

*   [Section 10.5.1, “Road elevation”](#sec-1d876c00-d69e-46d9-bbcd-709ab48f14b1)
    
*   [Section 11.6.1, "Excluding lanes from lateral profile"](../11_lanes/11_06_lane_geometry.html#sec-2b576dd1-12a6-4fe3-9345-d04a51c332c8)

## 10.6 Road surface

The CRG data may be applied to a given ASAM OpenDRIVE road in different modes:

Table 32. Modes of connecting ASAM OpenCRG to ASAM OpenDRIVE    

Mode

ASAM OpenCRG reference line

Total height

Typical use case

attached

discarded

ASAM OpenDRIVE height plus ASAM OpenCRG height

Relative road height to road surface (including elevation, lateral profile, interpolated elevation grid, and lane height)

attached0

discarded

ASAM OpenCRG height only

Absolute height measurement

genuine

shifted and rotated so beginning of reference line matches position given in ASAM OpenDRIVE

ASAM OpenCRG height only

Combining complete ASAM OpenCRG tracks (for example, racing tracks) with ASAM OpenDRIVE data

global

taken unmodified

ASAM OpenCRG height only

On junctions

<a id="_mode_attached"></a>
#### 10.6.1.1 @mode = attached

![img](../_images/10_roads/crg_attached.png)

Figure 52. ASAM OpenCRG attachment mode, attached

[Figure 52](#fig-510aa072-bc73-4ccd-8d47-2cbbccfd43db) shows the attachment mode `attached`. The reference line of the CRG data set is replaced with the ASAM OpenDRIVE road reference line, taking into account the @tOffset and the @sOffset parameters. The local CRG elevation values, which are calculated by evaluating the CRG grid and applying @zOffset and @zScale, are added to the surface elevation data of the ASAM OpenDRIVE road, which are derived from the combination of elevation, superelevation and crossfall. With this mode, the surface information relative to the original CRG data reference line is transferred from an arbitrary CRG road to an ASAM OpenDRIVE road without having to make sure that the overall geometries of the road match. The original position, heading, curvature, elevation and superelevation of the CRG road are disregarded. The CRG grid is evaluated along the ASAM OpenDRIVE reference line instead of the CRG reference line.

![img](../_images/10_roads/crg_attached_2.png)

Figure 53. ASAM OpenCRG attached mode with elevation

[Figure 53](#fig-e5b6ab89-52bb-48fd-8f64-1eeed087b0d1) shows the calculation of the height.

The calculation looks as follows, assuming @orientation=same, and using the `crgEvaluv2z` function from the ASAM OpenCRG C-API and a hypothetical `laneHeightNoCRG` function, which returns what the lane height would be if the CRG file was not present:

\\[\\begin{align*} & \\left( \\begin{array}{rrr} u \\\\ v \\\\ \\end{array}\\right)_{CRG} = \\left( \\begin{array}{rrr} s - s_{Offset} \\\\ t - t_{Offset} \\\\ \\end{array}\\right)_{OpenDRIVE} \\\\ & \\operatorname{totalHeight}(road, s, t) = \\operatorname{crgEvaluv2z}(crg, u, v) * z_{Scale} + z_{Offset} + \\operatorname{laneHeightNoCRG}(road, s, t) \\end{align*}\\]

<a id="_mode_attached0"></a>
#### 10.6.1.2 @mode = attached0

This mode is the same as the attached mode, with the exception that only the CRG data elevation value is considered (that is, the ASAM OpenDRIVE elevation is set to zero).

![img](../_images/10_roads/crg_attached0.png)

Figure 54. ASAM OpenCRG attached0 mode with elevated reference line

To avoid problems, set @sStart and @sEnd exactly to the CRG data boundaries. [Figure 54](#fig-022bce88-4812-4317-a0e9-43484592d2c0) shows the case when the @sStart or the @sEnd attributes are not set to the exact boundaries and therefore do not cover the CRG data boundaries. Otherwise this results in inconsistencies in the road surface.

The height calculation is very similar to `attached`, again assuming @orientation=same:

Formula for mode attached0

\\[\\begin{align*} & \\left( \\begin{array}{rrr} u \\\\ v \\\\ \\end{array}\\right)_{CRG} = \\left( \\begin{array}{rrr} s - s_{Offset} \\\\ t - t_{Offset} \\\\ \\end{array}\\right)_{OpenDRIVE} \\\\ & \\operatorname{totalHeight}(road, s, t) = \\operatorname{crgEvaluv2z}(crg, u, v) * z_{Scale} + z_{Offset} \\end{align*}\\]

<a id="_mode_genuine"></a>
#### 10.6.1.3 @mode = genuine

![img](../_images/10_roads/crg_genuine.png)

Figure 55. ASAM OpenCRG attachment mode, genuine

[Figure 55](#fig-fb28ac87-b3b6-4ec1-ac44-88d29be95045) shows the attachment mode `genuine`. The start point of the CRG data set reference line is positioned relative to the point on the ASAM OpenDRIVE road reference line at the position defined by @sStart, @sOffset and @tOffset. By providing offset values for the longitudinal (@sOffset) and lateral (@tOffset) displacement, the heading (@hOffset) and the elevation (@zOffset), the correlation between the two descriptions reference lines is clear. In genuine mode, the CRG data replace the ASAM OpenDRIVE elevation data, that is, the absolute elevation of a given point of the road surface is directly computed from the CRG data. When using this method, it must be assured that the geometry of the CRG data matches – within certain tolerance – the geometry of the underlying ASAM OpenDRIVE road.

The height of a given `(x,y)` position on the lane is calculated as displayed below.

The calculation uses the following helper functions:

*   `st2xyh` takes a `x/y`-coordinate on the road, and returns the world `x/y`-coordinate, in addition to the heading angle of the reference line at the given `s`-position.
    
*   `crgEvalxy2z` is the function from the ASAM OpenCRG C API.
    
*   `REFERENCE_LINE_START_X`, `REFERENCE_LINE_START_Y` and `REFERENCE_LINE_START_PHI` are road parameters from the CRG file.
    
*   `sOffset`, `tOffset`, `hOffset`, `zOffset` and `zScale` are attributes from the `<CRG>` element.
    

\\[\\begin{align*} & (x_{StartCRG}, y_{StartCRG}, h_{StartCRG}) = \\operatorname{st2xyh}(road, s_{Offset}, t_{Offset}) \\\\ & h_{RotAngle} = h_{StartCRG} + h_{Offset} - REFERENCE\\_LINE\\_START\\_PHI \\\\ & \\left( \\begin{array}{rrr} x_{CRG} \\\\ y_{CRG} \\\\ \\end{array}\\right) = \\left( \\begin{matrix}{} \\cos(h_{RotAngle}) & \\sin(h_{RotAngle}) \\\\ -\\sin(h_{RotAngle}) & \\cos(h_{RotAngle}) \\\\ \\end{matrix}\\right) \\left( \\begin{array}{rrr} x_{OpenDRIVE} - x_{StartCRG} \\\\ y_{OpenDRIVE} - y_{StartCRG} \\\\ \\end{array}\\right) + \\left( \\begin{array}{rrr} REFERENCE\\_LINE\\_START\\_X \\\\ REFERENCE\\_LINE\\_START\\_Y \\\\ \\end{array}\\right) \\\\ & \\operatorname{totalHeight}(x_{OpenDRIVE}, y_{OpenDRIVE}) = \\operatorname{crgEvalxy2z}(crg, x_{CRG}, y_{CRG}) * z_{Scale} + z_{Offset} \\end{align*}\\]

<a id="_mode_global"></a>
#### 10.6.1.4 @mode = global

The CRG data set is referenced from a given track or a junction record but no translatory or rotatory transformation is applied. All data in the CRG file remains in its native coordinate system. Elevation data is interpreted as inertial data, that is, AS IS. The ASAM OpenDRIVE height is ignored. This can be used to define heights for junctions. This is also the only mode that can be applied directly to `<junction>` elements.

The height of a given `(x,y)` position on the lane is calculated as follows:

Formula for global mode

\\[\\operatorname{totalHeight}(x_{OpenDRIVE}, y_{OpenDRIVE}) = \\operatorname{crgEvalxy2z}(crg, x_{OpenDRIVE}, y_{OpenDRIVE}) * z_{Scale} + z_{Offset}\\]
