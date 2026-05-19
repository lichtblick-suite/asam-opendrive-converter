> ASAM OpenDRIVE V1.8.1 — © ASAM e.V., 2024. Unrestricted distribution permitted.
> Source: https://publications.pages.asam.net/standards/ASAM_OpenDRIVE/ASAM_OpenDRIVE_Specification/v1.8.1/specification/

# 11 Lanes

## 11.1 Introduction

In ASAM OpenDRIVE, lanes are an essential part of all roads. Lanes are attached to the road reference line of the road and are defined from inside to outside. A minimum road definition requires a center lane and an additional lane with a defined width. The number of lanes per road is not limited.

The center lane has no width and serves as reference for lane numbering. The center lane itself has the lane id 0. The numbering of the other lanes starts at the center lane: Lane numbers descend to the right, meaning a negative t-direction, and ascend to the left, meaning a positive t-direction.

![img](../_images/11_lanes/lanes_overview.png)

Figure 57. Center lane for road with lanes of different driving directions

[Figure 57](#fig-305e76a9-2210-4dd7-acfd-bfedb3b95037) shows the center lane for a road with multiple traffic lanes and different driving directions. In this case, the center lane separates the driving directions, depending on left- and right-hand traffic, specified in Road type. Because no lane offset is used, the center lane is identical to the road reference line.

![img](../_images/11_lanes/lanes_oneway.png)

Figure 58. Center lane for road with lanes of identical driving direction

[Figure 58](#fig-ec1f8b0b-0f8c-41df-ab9c-f8193b870c11) shows the center lane for a road with lanes that have the same driving direction, meaning a one-way road.

**Elements in UML model**

**`<lanes>` element**

In ASAM OpenDRIVE, lanes are represented by the `<lanes>` element within the `<road>` element.

UML class: t_road_lanes
XML tag:   <lanes> (Multiplicity: 1)

Lanes are an essential part of all roads. Lanes are attached to the road reference line and are defined from inside to outside.

Lanes contain a series of lane section elements that define the characteristics of the road cross sections with respect to the lanes along the road reference line.

![img](../_images/uml_class_diagrams/EAID_CD586CD1_8333_46a3_A103_8F63F2BCE9C1.png)

Figure 59. UML class diagram of the Lanes class

[Figure 59](#fig-d9d918ab-493f-456c-b212-78cde856ccf8) shows the UML class diagram of the ASAM OpenDRIVE Lanes class.

**XML example**

```
<lanes>
    <laneSection s="0.0">
        <left>
            <lane id="2" type="border" level="false">
                <link>
                </link>
                <width sOffset="0.0" a="1.0" b="0.0" c="0.0" d="0.0"/>
            </lane>
            <lane id="1" type="driving" level="false">
                <link>
                </link>
                <width sOffset="0.0" a="4.0" b="0.0" c="0.0" d="0.0"/>
            </lane>
        </left>
        <center>
            <lane id="0">
                ...
            </lane>
        </center>
        <right>
            <lane id="-1" type="driving" level="false">
                <link>
                </link>
                <width sOffset="0.0" a="4.0" b="0.0" c="0.0" d="0.0"/>
            </lane>
            <lane id="-2" type="border" level="false">
                <link>
                </link>
                <width sOffset="0.0" a="1.0" b="0.0" c="0.0" d="0.0"/>
            </lane>
        </right>
    </laneSection>
</lanes>
```

**Rules**

The following rules apply to the use of lanes:

*   [asam.net:xodr:1.4.0:road.lane.center_lane](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-center-lane): Each road shall have a center lane.
    
*   Roads may have as many lanes as needed.
    
*   [asam.net:xodr:1.4.0:road.lane.center_lane_no_width](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-center-lane-no-width): The center lane shall have no width, meaning that the `<width>` element shall not be used for the center lane.
    
*   [asam.net:xodr:1.4.0:road.lane.center_lane_id](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-center-lane-id): The center lane shall have the lane id 0.
    
*   [asam.net:xodr:1.4.0:road.lane.lane_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-lane-order): Lane numbering shall start with 1 next to the center lane in positive t-direction in ascending order and -1 next to the center lane in negative t-direction in descending order.
    
*   [asam.net:xodr:1.4.0:road.lane.lane_order_no_gaps](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-lane-order-no-gaps): Lane numbering shall be consecutive without any gaps.
    
*   [asam.net:xodr:1.4.0:road.lane.lane_id_unique](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-lane-id-unique): Lane numbering shall be unique per lane section.
    
*   There may be bidirectional lanes. This is specified using the @direction attribute of the `<lane>` element.
    
*   [asam.net:xodr:1.4.0:road.lane.lane_sect_min_amount](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-lane-sect-min-amount): Each `<lanes>` element shall contain at least one `<laneSection>` element.
    
*   [asam.net:xodr:1.4.0:road.lane.s_attr_value](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-s-attr-value): All `<laneSection>` elements shall contain the @s attribute.
    
*   All drivable lanes must be continuous and smooth, with no gaps, and must account for the plan view, profiles, and lane properties during design and implementation.
    
*   The first lane section shall be defined with a value of 0.0 for the @s attribute.
    

In older ASAM OpenDRIVE versions a road required at least one lane with a width greater zero. As roads can now be used for junction boundaries and do not need an extra lane, this rule has been removed.

**Related topics**

*   [Section 11.2, "Lane groups"](11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

## 11.2 Lane groups

For easier navigation through an ASAM OpenDRIVE road description, the lanes within a lane section are grouped into left, center, and right lanes.

![img](../_images/11_lanes/lanes_group.png)

Figure 60. Lane grouping with left, center, right

[Figure 60](#fig-e2e5e357-03f8-46bc-a5c1-ab2aa53f0eaa) shows the lane grouping. Within these groups, the lanes are described by `<lane>` elements. Because lane numbers descend in a negative t-direction and ascend in a positive t-direction, applications can derive the direction of a lane from the lane id given in the @id attribute of a `<lane>` element, unless the lane is bi-directional (specified by @direction=both).

**Elements in UML model**

**`<left>` element**

In ASAM OpenDRIVE, left lane groups are represented by the `<left>` element within the `<laneSection>` element.

UML class: t_road_lanes_laneSection_left
XML tag:   <left> (Multiplicity: 0..1)

Contains all lanes left to the center lane.

**`<lane>` element**

In ASAM OpenDRIVE, lanes in the left lane group are represented by `<lane>` elements within the `<left>` element.

UML class: t_road_lanes_laneSection_left_lane
XML tag:   <lane> (Multiplicity: 1..*)

Left lanes numbered with positive IDs in ascending order from center lane to left border.

Table 34. Attributes of the <lane> element     

Name

Type

Use

Introduced

Description

`advisory`

[e_laneAdvisory](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_2F2EBD73_C3AB_4121_921A_DB492066027C)

optional

1.8.0

If true, lane can be used also by a neighboring lane. Advisory lane has priority, for example a bike lane, that can also be used by cars. If not specified, default value is none.

`direction`

[e_lane_direction](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_BDEEA32B_3F22_4f2c_A327_04437D41CC3D)

optional

1.8.0

If not specified, direction is determined by the combination of `<left>` or `<right>` lane grouping and the values LHT or RHT of the @rule attribute of a road. The standard direction can be overwritten with this attribute.

`dynamicLaneDirection`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

1.8.0

If true, lane direction can be changed dynamically by the scenario during the simulation. If not specified, default boolean value is false.

`dynamicLaneType`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

1.8.0

If true, lane type can be changed dynamically by the scenario during the simulation. Typical example is a stop lane that can be changed by VMS boards to a driving lane. If not specified, default boolean value is false.

`id`

positiveInteger

required

ID of the lane

`level`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

"true" = keep lane on level, that is, do not apply superelevation;  
"false" = apply superelevation to this lane (default, also used if attribute level is missing)

`roadWorks`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

1.8.0

If true, lane is under construction.

`type`

[e_laneType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_9692E2F3_4895_4ce6_A84E_FB1297B0B58E)

required

Type of the lane

**`<center>` element**

In ASAM OpenDRIVE, center lane groups are represented by the `<center>` element within the `<laneSection>` element.

UML class: t_road_lanes_laneSection_center
XML tag:   <center> (Multiplicity: 1)

Contains the center lane, which must be defined for all roads.

**`<lane>` element**

In ASAM OpenDRIVE, lanes in the center lane group are represented by `<lane>` elements within the `<center>` element.

UML class: t_road_lanes_laneSection_center_lane
XML tag:   <lane> (Multiplicity: 1)

Center lane element with ID zero. Has no width attribute. Mainly used for road marks.

Table 35. Attributes of the <lane> element     

Name

Type

Use

Deprecated

Description

`id`

integer

required

ID of the lane

`level`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

1.8.0

`type`

[e_laneType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_9692E2F3_4895_4ce6_A84E_FB1297B0B58E)

optional

1.8.0

**`<right>` element**

In ASAM OpenDRIVE, right lane groups are represented by the `<right>` element within the `<laneSection>` element.

UML class: t_road_lanes_laneSection_right
XML tag:   <right> (Multiplicity: 0..1)

Contains all lanes right to the center lane.

**`<lane>` element**

In ASAM OpenDRIVE, lanes in the right lane group are represented by `<lane>` elements within the `<right>` element.

UML class: t_road_lanes_laneSection_right_lane
XML tag:   <lane> (Multiplicity: 1..*)

Right lanes numbered with negative IDs in descending order from center lane to right border.

Table 36. Attributes of the <lane> element     

Name

Type

Use

Introduced

Description

`advisory`

[e_laneAdvisory](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_2F2EBD73_C3AB_4121_921A_DB492066027C)

optional

1.8.0

If true, lane can be used also by a neighboring lane. Advisory lane has priority, for example a bike lane, that can also be used by cars. If not specified, default value is none.

`direction`

[e_lane_direction](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_BDEEA32B_3F22_4f2c_A327_04437D41CC3D)

optional

1.8.0

If not specified, direction is determined by the combination of `<left>` or `<right>` lane grouping and the values LHT or RHT of the @rule attribute of a road. The standard direction can be overwritten with this attribute.

`dynamicLaneDirection`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

1.8.0

If true, lane direction can be changed dynamically by the scenario during the simulation. If not specified, default boolean value is false.

`dynamicLaneType`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

1.8.0

If true, lane type can be changed dynamically by the scenario during the simulation. Typical example is a stop lane that can be changed by VMS boards to a driving lane. If not specified, default boolean value is false.

`id`

negativeInteger

required

ID of the lane

`level`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

"true" = keep lane on level, that is, do not apply superelevation;  
"false" = apply superelevation to this lane (default, also used if attribute level is missing)

`roadWorks`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

1.8.0

If true, lane is under construction.

`type`

[e_laneType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_9692E2F3_4895_4ce6_A84E_FB1297B0B58E)

required

Type of the lane

**Rules**

The following rules apply to lane grouping:

*   [asam.net:xodr:1.4.0:road.lane.lanes_numbered_correctly](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-lanes-numbered-correctly): Lanes with positive ID run on the left side of the center lane, while lanes with negative ID run on the right side of the center lane.
    
*   In order to be drivable, each lane section should contain at least one <right> or <left> element.
    
*   [asam.net:xodr:1.4.0:road.lane.center_elem_definition](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-center-elem-definition): One `<center>` element shall be defined for each s-coordinate.
    
*   [asam.net:xodr:1.4.0:road.lane.lane_listing](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-lane-listing): For better orientation, lanes should be listed from left to right, that is with descending ID.
    
*   @direction="reverse" shall not be used to change from right-hand traffic to left-hand traffic and vice versa.
    

**Related topics**

*   [Section 11.1, "Introduction to lanes"](11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)
    
*   [Section 11.3, "Lane sections"](11_03_lane_sections.html#top-e2c7cf98-db06-4a27-972a-0d165f87a867)
    

<a id="sec-290a2675-d4a5-4b71-9391-36119620d564"></a>
### 11.2.1 Driving direction

In ASAM OpenDRIVE, the driving direction is specified by a combination of different elements and attributes. For a road with the @rule="RHT" attribute, the default driving direction would be in positive direction of the road reference line for all `<right>` element lanes with negative @id attribute and against the road reference line for lanes in the `<left>` element with positive @id attribute. If the road has the @rule="LHT" attribute, the default driving direction would be in positive direction of the road reference line for all `<left>` element lanes with positive @id attribute and against the road reference line for all `<right>` element lanes with negative @id attribute. This can be influenced with the @direction attribute individually for each lane. If the @direction attribute is not specified or has a value of @direction="standard", the default driving direction is not changed. The @direction="reversed" attribute reverses the default driving direction. The @direction="both" attribute replaces the deprecated lane @type="bidirectional" and allows both driving directions.

In addition, this can be changed during the simulation if @dynamicLaneDirection="true" attribute is set, for example by a VMS board.

**Related topics**

*   [Section 10.1, "Introduction to roads"](../10_roads/10_01_introduction.html#top-f0ae72f0-300e-4f8b-9c9b-7f68a467a9f7)
    
*   [Section 14.7, "Signal boards"](../14_signals/14_07_signal_boards.html#top-33be999b-2d06-4c74-a285-e662e0a0bb55)

## 11.3 Lane sections

Lanes may be split into multiple lane sections. Each lane section contains a fixed number of lanes.

![img](../_images/11_lanes/lane_section_1.png)

Figure 61. Road section with lane sections

[Figure 61](#fig-459a1b0f-94d0-4712-8f23-45845d5f4998) shows that every time the number of lanes changes, a new lane section is required. Lane sections are defined in ascending order along the road reference line.

![img](../_images/11_lanes/lane_section_2.png)

Figure 62. Lane sections defined separately for both sides of the road

[Figure 62](#fig-fbf7c6d2-a397-4833-be55-96347c71b5a7) shows how lane sections for complex roads may be defined for one side of the road only, using the @singleSide attribute.

**Elements in UML model**

**`<laneSection>` element**

In ASAM OpenDRIVE, lane sections are represented by `<laneSection>` elements within the `<lanes>` element.

UML class: t_road_lanes_laneSection
XML tag:   <laneSection> (Multiplicity: 1..*)

A lane section splits a road into multiple parts whenever the number of lanes or their function changes.

The distance between two succeeding lane sections shall not be zero.

For easier navigation through an ASAM OpenDRIVE road description, the lanes within a lane section are grouped into left, center, and right lanes. Each lane section shall contain one `<center>` element and at least one `<right>` or `<left>` element.

Table 37. Attributes of the <laneSection> element     

Name

Type

Use

Unit

Description

`s`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position

`singleSide`

[t_bool](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_33A24631_A9D0_48ca_BB42_2B8417EDC05E)

optional

Lane section element is valid for one side only (left, center, or right), depending on the child elements.

For the child elements of the `<laneSection>` element refer to [Lane groups](11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47).

**Rules**

The following rules apply to lane sections:

*   [asam.net:xodr:1.4.0:road.lane_section.lane_sect_req](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-section-lane-sect-req): Each road shall have at least one lane section.
    
*   [asam.net:xodr:1.4.0:road.lane_section.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-section-elem-asc-order): `<laneSection>` elements shall be defined in ascending order according to the s-coordinate.
    
*   [asam.net:xodr:1.4.0:road.lane_section.valid_length](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-section-valid-length): The length of lane sections shall be greater than zero.
    
*   There shall always be exactly one center lane at each s-position.
    
*   Using lanes with a width of 0 for long distances should be avoided.
    
*   [asam.net:xodr:1.4.0:road.lane_section.lanesec_usage_lane_num](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-section-lanesec-usage-lane-num): A new lane section shall be defined each time the number of lanes change.
    
*   A lane section shall remain valid until a new lane section is defined.
    
*   The properties of lanes inside a lane section may be changed as often as needed.
    
*   Lane sections may be defined for one side of the road only using the @singleSide attribute.
    

**Related topics**

*   [Section 9.2, "Road reference line"](../09_geometries/09_02_road_reference_line.html#top-9cb15835-ff9e-4b51-9bc8-730a3695fde9)
    
*   [Section 11.1, "Introduction to lanes"](11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)
    
*   [Section 11.2, "Lane groups"](11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)

## 11.4 Lane offset

A lane offset may be used to shift the center lane away from the road reference line. This makes it easier to model local lateral shifts of lanes on roads, for example for left turn lanes.

A combination of lane offset and shape definition can lead to inconsistencies depending on the interpolation used for the lane offset. Because linear interpolation is used for the road shape along the road reference line, linear interpolation should also be used for the offset definition to enable consistent combined use of both definitions.

![img](../_images/11_lanes/lanes_offset.png)

Figure 63. Lane offset

[Figure 63](#fig-7558b905-679d-4fb9-affa-3b3b72025a18) shows the offset of the center lane away from the road reference line.

**Elements in UML model**

**`<laneOffset>` element**

In ASAM OpenDRIVE, a lane offset is represented by a `<laneOffset>` element within the `<lanes>` element.

UML class: t_road_lanes_laneOffset
XML tag:   <laneOffset> (Multiplicity: 0..*)

Lane offsets shift the center lane away from the road reference line.

Table 38. Attributes of the <laneOffset> element     

Name

Type

Use

Unit

Description

`a`

double

required

m

Polynom parameter a, offset at @s (ds=0)

`b`

double

required

1

Polynom parameter b

`c`

double

required

1/m

Polynom parameter c

`d`

double

required

1/m²

Polynom parameter d

`s`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position

**XML example**

```
<lanes>
     <laneOffset s="25.0" a="0.0" b="0.0" c="3.9e-03" d="-5.2e-05"/>
     <laneOffset s="75.0" a="3.25" b="0.0" c="0.0" d="0.0"/>
     …
</lanes>
```

*   [Ex_Simple-LaneOffset.xodr](../_attachments/examples/Ex_Simple-LaneOffset/Ex_Simple-LaneOffset.xodr)
    

**Calculation**

The offset at a given point is calculated with the following polynomial function of the third order:

`offset (ds) = a + b*ds + c*ds² + d*ds³`

where

 

`offset`

is the lateral offset at a given position

`a, b, c, d`

are the coefficients

`ds`

is the distance along the road reference line between the start of a new lane offset element and the given position

`ds` restarts at zero for each element. The absolute position of an offset value is calculated as follows:

`s = sstart + ds`

where

 

`s`

is the absolute position in the road reference line coordinate system

`sstart`

is the start position of the element in the reference line coordinate system

A new lane offset element is required each time the polynomial function changes.

**Rules**

The following rules apply to lane offsets:

*   [asam.net:xodr:1.4.0:road.lanes.lane_offset.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lanes-lane-offset-elem-asc-order): `<laneOffset>` elements shall be defined in ascending order according to the s-coordinate.
    
*   A new lane offset shall start when the underlying polynomial function changes.
    
*   [asam.net:xodr:1.4.0:road.lanes.lane_offset.no_offset_if_border_defined](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lanes-lane-offset-no-offset-if-border-defined): There shall be no `<laneOffset>` if border definitions are present.
    

**Related topics**

*   [Section 10.5.1, "Shape definition"](../10_roads/10_05_elevation.html#sec-66ac2b58-dc5e-4538-884d-204406ea53f2)
    
*   [Section 11.1, "Introduction to lanes"](11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)
    
*   [Section 11.6.1, "Lane borders"](11_06_lane_geometry.html#sec-1d7eba61-d3d2-440d-b822-55f0af8a1183)

## 11.5 Lane linkage

To enable lane navigation, linkage information for lanes may be stored in ASAM OpenDRIVE. Linkage is described by means of `<predecessor>` and `<successor>` elements for each lane. Lanes may be linked to lanes on the same or another road. A `<predecessor>` of a given lane is a lane connected to the start of its lane section in its road reference line direction. A `<successor>` of a given lane is a lane connected to the end of its lane section in road reference line direction. A lane linkage by a `<predecessor>` and a `<successor>` is independent of the driving direction.

![img](../_images/11_lanes/lane_links.png)

Figure 64. Lane links for road with id 10

[Figure 64](#fig-1f3b2b07-6e8c-4d1a-8d95-6635da9a279e) shows an example for lane linkage. The considered roads and their predecessor and successor are described in [Table 39](#tab-403158f8-3f09-4d1c-a513-50814a9b219c).

Table 39. Lane predecessors and successors for road with id 10   

Considered road

Lane predecessor

Lane successor

Road 10 with lane id 1

Lane id 1 (Road 30)

Lane id -1 (Road 20)

Road 10 with lane id -1

Lane id -1 (Road 30)

Lane id 1 (Road 20)

Road 10 with lane id -2

Lane id -2 (Road 30)

Lane id 2 (Road 20)

Lane predecessors and successors shall only be used to connect lanes if a physical connection at the beginning or end of both lanes exist. Both lanes have a non-zero width at the connection point and are semantically connected.

Examples where lane linkage should be used:

*   [asam.net:xodr:1.4.0:road.lane.link.lanes_across_laneSections](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-link-lanes-across-lanesections): Lane that continues across the lane sections shall be connected in both directions.
    
*   Lane changes its type on a highway from `exit` to `offRamp`.
    
*   Parking lane at the roadside ends, the road starts, and a vehicle can continue driving from the parking lane on the driving lane.
    

Example where lane linkage should not be used:

*   Parking lane at the roadside ends and a grass strip begins.
    

Examples where multiple predecessors and successors shall be used:

![img](../_images/11_lanes/lane_linkage_01.png)

Figure 65. Example of an ending bikeway

[Figure 65](#fig-d45dc8a4-fb40-4f14-b844-23f7100d7da3) shows an example where a bikeway ends and bicycles are expected to continue driving on the driving lane.

![img](../_images/11_lanes/lane_linkage_02.png)

Figure 66. Example of a splitting driving lane

[Figure 66](#fig-cb314ee4-8195-4c99-8b04-d7f8d8a797d6) shows an example where a driving lane splits into two or more driving lanes abruptly. The width is non-zero.

Example where multiple predecessors and successors shall not be used:

*   [asam.net:xodr:1.4.0:road.lane.link.new_lane_appear](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-link-new-lane-appear): If a new lane appears besides, only the continuing lane shall be connected to the original lane, not the appearing lane.
    

**Elements in UML model**

**`<link>` element**

In ASAM OpenDRIVE, lane linkage is represented by the `<link>` element within the `<lane>` element.

UML class: t_road_lanes_laneSection_lcr_lane_link
XML tag:   <link> (Multiplicity: 0..1)

For links between lanes with an identical road reference line, the lane predecessor and successor information provide the IDs of lanes on the preceding or following lane section.

For links between lanes with different road reference line, the lane predecessor and successor information provide the IDs of lanes on the first or last lane section of the other road reference line depending on the contact point of the road linkage.

This element may only be omitted, if lanes end at a junction or have no physical link.

![img](../_images/11_lanes/fig_uml_class_lanes_lanesection_lr_lane.png)

Figure 67. UML class diagram of the t_road_lanes_laneSection_lcr_lane_link element in the Lanes class

[Figure 67](#fig-74955d07-7be3-4527-9d4a-ea2fbbda6a1e) shows the UML class diagram of the t_road_lanes_laneSection_lcr_lane_link element in the ASAM OpenDRIVE Lanes class.

**`<predecessor>` and `<successor>` elements**

In ASAM OpenDRIVE, predecessors and successors are represented by the `<predecessor>` and `<successor>` elements within the `<link>` element.

UML class: t_road_lanes_laneSection_lcr_lane_link_predecessorSuccessor
XML tag:   <predecessor> (Multiplicity: 0..*)
XML tag:   <successor> (Multiplicity: 0..*)

Table 40. Attributes of the <predecessor> and <successor> elements    

Name

Type

Use

Description

`id`

integer

required

ID of the preceding / succeeding linked lane

**Rules**

The following rules apply to lane linkage:

*   A lane may have another lane as predecessor or successor.
    
*   [asam.net:xodr:1.4.0:road.lane.link.use_junctions](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-link-use-junctions): Two lanes shall only be linked if their linkage is clear. If the relationship to a predecessor or successor is ambiguous, junctions shall be used.
    
*   [asam.net:xodr:1.4.0:road.lane.link.multiple_connections](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-link-multiple-connections): Multiple predecessors and successors shall be used if a lane is split abruptly or several lanes are merged abruptly. All lanes that are connected shall have a non-zero width at the connection point.
    
*   [asam.net:xodr:1.7.0:road.lane.link.zero_width_at_start](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-lane-link-zero-width-at-start): Lanes that have a width of zero at the beginning of the lane section shall have no `<predecessor>` element.
    
*   [asam.net:xodr:1.7.0:road.lane.link.zero_width_at_end](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-lane-link-zero-width-at-end): Lanes that have a width of zero at the end of the lane section shall have no `<successor>` element.
    
*   [asam.net:xodr:1.4.0:road.lane.link.no_link](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-link-no-link): The `<link>` element shall be omitted if the lane starts or ends in a junction or has no link.
    

**Related topics**

*   [Section 10.3, "Road linkage"](../10_roads/10_03_road_linkage.html#top-86fc414c-6211-4777-b40e-466d4551d23e)
    
*   [Section 11.1, "Introduction to lanes"](11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)
    
*   [Section 12.1, "Introduction to junctions"](../12_junctions/12_01_introduction.html#top-ba9039b6-b319-4618-bbfb-5ad28a9c95c0)

## 11.6 Lane geometry

Lane geometry are properties that describe the shape of lanes. Lane geometries are defined per lane section but may change within that section.

![img](../_images/11_lanes/fig_uml_class_lanes_lane_properties.png)

Figure 68. UML model for lane geometry in the Lanes class

[Figure 68](#fig-24654426-8984-4a53-8627-3effc2b56faf) shows the UML model for lane geometry in the ASAM OpenDRIVE Lanes class. Examples of lane geometry are lane width, lane border, and lane height.

**Rules**

The following rules apply to lane geometry:

*   Lane geometries shall be defined relative to the start of the corresponding lane section.
    
*   A specific lane geometry shall remain valid until another lane geometry of that type is defined or the lane section ends.
    
*   [asam.net:xodr:1.4.0:road.lane.lane_properties.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-lane-properties-elem-asc-order): Lane geometries of identical types shall be defined in ascending order.
    

<a id="sec-8d8ac2e0-b3d6-4048-a9ed-d5191af5c74b"></a>
### 11.6.1 Lane width

![img](../_images/11_lanes/lane_section_3.png)

Figure 69. Change of lane width per lane section

[Figure 69](#fig-e2eb6a19-8cf4-47ac-96ac-c124f42695b0) shows the change in lane width in positive s-direction, starting at different offset positions.

**Elements in UML model**

**`<width>` element**

In ASAM OpenDRIVE, lane width is represented by the `<width>` element within the `<lane>` element.

UML class: t_road_lanes_laneSection_lr_lane_width
XML tag:   <width> (Multiplicity: 1..*)

Lane widths widen or narrow lanes along the t-coordinate within lane sections.

Lane width and lane border elements are mutually exclusive within the same lane group. If both width and lane border elements are present for a lane section in the ASAM OpenDRIVE file, the application must use the information from the `<width>` elements.

Table 41. Attributes of the <width> element     

Name

Type

Use

Unit

Description

`a`

double

required

m

Polynom parameter a, width at @s (ds=0)

`b`

double

required

1

Polynom parameter b

`c`

double

required

1/m

Polynom parameter c

`d`

double

required

1/m²

Polynom parameter d

`sOffset`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position of the `<width>` element, relative to the position of the preceding `<laneSection>` element

**XML example**

*   [Ex_Lane-Width.xodr](../_attachments/examples/Ex_Lane-Width/Ex_Lane-Width.xodr)
    

**Calculation**

The width at a given point is calculated with the following polynomial function of the third order:

`width (ds) = a + b*ds + c*ds² + d*ds³`

where

 

`width`

is the width at a given position

`a, b, c, d`

are the coefficients

`ds`

is the distance along the road reference line between the start of a new lane width element and the given position

`ds` restarts at zero for each element. The absolute position of a width value is calculated as follows:

`s = ssection + offsetstart + ds`

where

 

`s`

is the absolute position in the road reference line coordinate system

`sSection`

is the start position of the preceding lane section element in the track coordinate system

`offsetStart`

is the offset of the element relative to the preceding lane section

**Rules**

The following rules apply to lane width:

*   [asam.net:xodr:1.7.0:road.lane.width.width_defined_whole_section](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-lane-width-width-defined-whole-section): The width of the lane shall be defined for the full length of the lane section. This means that there must be a `<width>` element for @s="0".
    
*   The center lane shall have no width, meaning that the `<width>` element shall not be used for the center lane.
    
*   The width of a lane shall remain valid until a new `<width>` element is defined or the lane section ends.
    
*   A new `<width>` element shall be defined when the variables of the polynomial function change.
    
*   `<width>` elements shall not be used together with `<border>` elements in the same lane group.
    
*   [asam.net:xodr:1.4.0:road.lane.width.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-width-elem-asc-order): `<width>` elements shall be defined in ascending order according to the s-coordinate.
    
*   [asam.net:xodr:1.4.0:road.lane.width.lane_width_validity](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-width-lane-width-validity): Width (ds) shall be greater than or equal to zero.
    

**Related topics**

*   [Section 10.5.1, "Superelevation"](../10_roads/10_05_elevation.html#sec-4abf7baf-fb2f-4263-8133-ad0f64f0feac)
    
*   [Section 10.5.1, "Shape definition"](../10_roads/10_05_elevation.html#sec-66ac2b58-dc5e-4538-884d-204406ea53f2)
    
*   [Section 11.2, "Lane groups"](11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)
    
*   [Section 11.3, "Lane sections"](11_03_lane_sections.html#top-e2c7cf98-db06-4a27-972a-0d165f87a867)
    

<a id="sec-1d7eba61-d3d2-440d-b822-55f0af8a1183"></a>
### 11.6.2 Lane borders

![img](../_images/11_lanes/lane_border.png)

Figure 70. Lane with varying border shape

[Figure 70](#fig-43e509c3-ff11-4aa4-ac98-c8bc58a8e34f) shows the convention for a lane with varying border shape over a given range.

**Elements in UML model**

**`<border>` element**

In ASAM OpenDRIVE, lane borders are represented by the `<border>` element within the `<lane>` element.

UML class: t_road_lanes_laneSection_lr_lane_border
XML tag:   <border> (Multiplicity: 1..*)

Lane borders set the width of lanes. Lane borders describe the outer limits of lanes, independent of the parameters of their inner borders. In this case, inner lanes are defined as lanes which have the same sign for their ID as the lane currently defined, but with a smaller absolute value for their ID.

Especially when road data is derived from automatic measurements, this type of definition is easier than specifying the lane width because it avoids creating many lane sections.

Lane width and lane border elements are mutually exclusive within the same lane group. If both width and lane border elements are present for a lane section in the ASAM OpenDRIVE file, the application shall use the information from the `<width>` elements.

Table 42. Attributes of the <border> element     

Name

Type

Use

Unit

Description

`a`

double

required

m

Polynom parameter a, border position at @s (ds=0)

`b`

double

required

1

Polynom parameter b

`c`

double

required

1/m

Polynom parameter c

`d`

double

required

1/m²

Polynom parameter d

`sOffset`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position of the `<border>` element , relative to the position of the preceding `<laneSection>` element

**XML example**

*   [Ex_Lane-Border.xodr](../_attachments/examples/Ex_Lane-Border/Ex_Lane-Border.xodr)
    

**Calculation**

The border position at a given point is calculated with the following polynomial function of the third order:

`tborder (ds) = a + b*ds + c*ds² + d*ds³`

where

 

`tborder`

is the t-position of the border at a given ds-position

`a, b, c, d`

are the coefficients

`ds`

is the distance along the road reference line between the start of the element and the given position

`ds` restarts at zero for each element. The absolute position of a border offset value is calculated by

`s = sSection + offsetstart+ ds`

where

 

`s`

is the absolute position in the road reference line coordinate system

`sSection`

is the start position of the preceding lane section element in the track coordinate system

`offsetStart`

is the offset of the element relative to the preceding lane section element

**Rules**

The following rules apply to lane borders:

*   [asam.net:xodr:1.4.0:road.lane.border.exclusive_width_border](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-border-exclusive-width-border): `<border>` elements shall not be used together with `<width>` elements in the same lane group.
    
*   [asam.net:xodr:1.4.0:road.lane.border.exclusive_offset_border](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-border-exclusive-offset-border): `<border>` elements shall not be used together with `<laneOffset>`.
    
*   A new `<border>` element shall be defined when the variables of the polynomial function change.
    
*   [asam.net:xodr:1.4.0:road.lane.border.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-border-elem-asc-order): `<border>` elements shall be defined in ascending order according to the s-coordinate.
    
*   [asam.net:xodr:1.4.0:road.lane.border. overlap_with_inner_lanes](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-border-overlap-with-inner-lanes): Lane borders shall not intersect inner lanes.
    

**Related topics**

*   [Section 11.2, "Lane groups"](11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)
    
*   [Section 11.3, "Lane sections"](11_03_lane_sections.html#top-e2c7cf98-db06-4a27-972a-0d165f87a867)
    

<a id="sec-d30c9ef9-cb82-4683-9fb6-6487e9dffd2f"></a>
### 11.6.3 Lane height

Lane height shall be defined along the h-coordinate. Lane height may be used to elevate a lane independent from the road elevation.

![img](../_images/11_lanes/lane_height_1.png)

Figure 71. Lane height

[Figure 71](#fig-b3c6653e-058b-426d-8640-795da6c2d318) shows that lane height is used to implement small-scale elevation, such as raising pedestrian walkways. Lane height is specified as offset from the road (including elevation, superelevation, shape, cross section surface) in h-direction.

**Elements in UML model**

**`<height>` element**

In ASAM OpenDRIVE, lane height is represented by the `<height>` element within the `<lane>` element.

UML class: t_road_lanes_laneSection_lr_lane_height
XML tag:   <height> (Multiplicity: 0..*)

Lane heights elevate lanes along the h-coordinate within a lane section independent from the road elevation.

Lane height is used to implement small-scale elevation such as raising pedestrian walkways. Lane height is specified as offset from the road (including elevation, superelevation, shape, cross section surface) in h-direction.

Table 43. Attributes of the <height> element     

Name

Type

Use

Unit

Description

`inner`

double

required

m

Inner offset from road level

`outer`

double

required

m

Outer offset from road level

`sOffset`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position, relative to the position of the preceding `<laneSection>` element

**XML example**

```
<lane id="-2" type="walking" level="false">
    <link>
        <successor id="-3"/>
    </link>
    <width sOffset="0.0" a="2.0" b="0.0" c="0.0" d="0.0"/>
    <height sOffset="0.0" inner="0.12" outer="0.12"/>
</lane>
```

**Rules**

The following rules apply to lane height:

*   To modify the lane height, for example for curbstones, the `<height>` element shall be used.
    
*   [asam.net:xodr:1.4.0:road.lane.height.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-height-elem-asc-order): `<height>` elements shall be defined in ascending order according to the s-coordinate.
    
*   [asam.net:xodr:1.4.0:road.lane.height.center_lane_no_height](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-height-center-lane-no-height): The center lane shall not be elevated by lane height.
    
*   Lane height shall not be used to define road elevation or superelevation.
    
*   Lane height shall be used for small scale elevation only.
    

**Related topics**

*   [Section 10.5.1, "Road elevation"](../10_roads/10_05_elevation.html#sec-1d876c00-d69e-46d9-bbcd-709ab48f14b1)
    
*   [Section 11.1, "Introduction to lanes"](11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)
    
*   [Section 11.2, "Lane groups"](11_02_lane_groups.html#top-3c24733f-35b5-43ae-b1da-60920f47ad47)
    

<a id="sec-2b576dd1-12a6-4fe3-9345-d04a51c332c8"></a>
### 11.6.4 Excluding lanes from lateral profile

Single lanes may be excluded from lateral profile to cover use cases like roads with curbstones, borders, or sidewalks.

![img](../_images/11_lanes/lane_height_2.png)

Figure 72. Lanes excluded from road elevation

[Figure 72](#fig-3572c8fb-33ca-4f8e-88b9-15352209d4ea) shows the use of the @level attribute, which excludes the outermost lanes of a road from superelevation.

ASAM OpenDRIVE provides the @level attribute for excluding lanes from lateral profile. When the attribute is set to `true` for a lane, then this lane is excluded from superelevation, road shape definition and cross section surface definitions of the road. The elevation of the lane stays on the same height as the outer border of the inner connecting lane. For lanes with @level="true" the projection does not change. Changes between lane sections are not recommended.

There may be multiple outer lanes with @level="true", for example, for a bike lane followed by a sidewalk.

**Rules**

The following rules apply to excluding lanes from road elevation:

*   [asam.net:xodr:1.7.0:road.lane.level_true_one_side](../16_annexes/map_rules.html#asam-net-xodr-1-7-0-road-lane-level-true-one-side): If a lane has @level="true", then all further outward lanes shall be lanes with @level="true" until the edge of the road is reached.
    
*   There may be multiple outer lanes with @level="true".
    

**Related topics**

*   [Section 10.5.1, "Superelevation"](../10_roads/10_05_elevation.html#sec-4abf7baf-fb2f-4263-8133-ad0f64f0feac)
    
*   [Section 11.7.1, "Lane type"](11_07_lane_properties.html#sec-79c983d6-db57-41ad-85f7-4643c25910dc)

## 11.7 Lane properties

The lane type is defined per lane. A lane type defines the main purpose of a lane and its corresponding traffic rules.

The available lane types are:

*   `shoulder`: Soft border at the edge of the road.
    
*   `border`: Hard border at the edge of the road. It has usually the same height as the drivable lane.
    
*   `driving`: Normal drivable road that is not one of the other types.
    
*   `stop`: Hard shoulder on motorways for emergency stops
    
*   `restricted`: Lane on which cars should not drive. The lane has the same height as drivable lanes. Typically, the lane is separated with lines and often contains dotted lines as well.
    
*   `parking`: Lane with parking spaces.
    
*   `median`: Lane that sits between driving lanes that lead in opposite directions. It is typically used to separate traffic in towns on large roads.
    
*   `biking`: Lane that is reserved for cyclists.
    
*   `walking`: Lane on which pedestrians can walk.
    
*   `curb`: Curb stones. Curb stones have usually a different height than the adjacent drivable lanes.
    
*   `entry`: Lane that is used for sections that are parallel to the main road and merge into the main road. It is mainly used for acceleration lanes.
    
*   `exit`: Lane that is used for sections that are parallel to the main road and lead to an exit from the main road. It is mainly used for deceleration lanes.
    
*   `onRamp`: Ramp leading to a motorway from rural or urban roads.
    
*   `offRamp`: Ramp leading away from a motorway and onto rural urban roads.
    
*   `connectingRamp`: Ramp that connects two motorways, for example, motorway junctions.
    
*   `slipLane`: Lane on which drivers change roads without driving into the main intersection.
    
*   `none`: Space on the outermost edge of the road and does not have actual content. Its only purpose is for applications to register that ASAM OpenDRIVE is still present in case the (human) driver leaves the road.
    

The lane type `sidewalk` was deprecated, use `walking` instead. The lane type `bidirectional` was deprecated, use the @direction attribute instead. A full list including all deprecated lane types can be found at [e_laneType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_9692E2F3_4895_4ce6_A84E_FB1297B0B58E).

The following examples show typical use cases for lane types:

*   Motorway, see [Figure 74](#fig-60a46e91-de14-47b0-b5c0-c899f8dfd0e5)
    
*   Rural road, see [Figure 75](#fig-a1a80653-50b4-41a4-ab53-317ffc97204a)
    
*   Urban road, see [Figure 76](#fig-0ddd6e1b-3b70-40cd-84ad-18356b4c1e75)
    
*   Motorway exit and entry, see [Figure 77](#fig-535664ed-61f5-4eab-ac35-29bac123ffdc)
    
*   A motorway connecting to another motorway, see [Figure 78](#fig-cf209a1d-15e8-4810-9605-1781844cde25)
    

![img](../_images/11_lanes/lane_type_64.png)

Figure 74. Lane types for a motorway

[Figure 74](#fig-60a46e91-de14-47b0-b5c0-c899f8dfd0e5) shows the lane types for a one-directional motorway. There are three `driving` lanes and a `stop` lane. The `border` lane is the border to the oncoming lanes. The outer limits are `shoulder` lanes with a `none` lane indicating the end of the road.

![img](../_images/11_lanes/lane_type_65.png)

Figure 75. Lane types for a rural road

[Figure 75](#fig-a1a80653-50b4-41a4-ab53-317ffc97204a) shows a bi-directional rural road. Two `driving` lanes are bordered by `shoulder` lanes. `none` lanes indicate the end of the road. A `restricted` lane in between the driving lanes is added. This could be used, for example, for traffic islands.

![img](../_images/11_lanes/lane_type_66.png)

Figure 76. Lane types for an urban road

[Figure 76](#fig-0ddd6e1b-3b70-40cd-84ad-18356b4c1e75) shows the right side of a bi-directional urban road. The two `driving` lanes in each direction are separated by a `median` lane. Next to the driving lanes are a `walking` lane, a `biking` lane, and a `shoulder` lane. The `shoulder` lane is interrupted by a `parking` lane.

![img](../_images/11_lanes/lane_type_67.png)

Figure 77. Lane types for motorway exit and entry

[Figure 77](#fig-535664ed-61f5-4eab-ac35-29bac123ffdc) shows lane types for a typical motorway exit and entry. There are three `driving` lanes in each direction. The direction where vehicles leave the motorway have an `exit` lane on their right, flowing in to an `offRamp` lane. The `offRamp` lane runs parallel to the `driving` lanes at first, then describing a curve. Vehicles entering the motorway drive on a curvy `onRamp` lane, flowing in to an `onRamp` lane parallel to the `driving` lanes flowing in to a `entry` lane.

![img](../_images/11_lanes/lane_type_68.png)

Figure 78. Lane types for motorway connecting to another motorway

[Figure 78](#fig-cf209a1d-15e8-4810-9605-1781844cde25) shows lane types for a motorway that is connected to another motorway. There are three `driving` lanes in each direction. The direction where vehicles leave the motorway have an `exit` lane on their right, flowing in to a `connectingRamp` lane. The `connectingRamp` lane runs parallel to the `driving` lanes at first, then describing a curve. Vehicles entering the motorway drive on a curvy `connectingRamp` lane, flowing in to a `connectingRamp` lane parallel to the `driving` lanes flowing in to an `entry` lane.

Lane types are set with the @type attribute of the `<lane>` element.

**Rules**

The following rules apply to lane types:

*   The lane type may be changed as often as needed by using a new lane section.
    

**Related topics**

*   [Section 11.1, "Introduction to lanes"](11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)
    
*   [Annex A.4, "e_laneType"](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_9692E2F3_4895_4ce6_A84E_FB1297B0B58E)

## 11.8 Road markings

Lanes on roads can have different lane markings, for example lines of different colors and styles. ASAM OpenDRIVE provides the `<roadMark>` element for road markings. The road mark information defines the style of the line at the lane’s outer border. For left lanes, this is the left border, for right lanes the right one. The style of the center line that separates left and right lanes is determined by the road mark element for the center lane.

For each lane within a road cross section, multiple road mark elements may be defined. Several attributes may be used to describe the properties of the lane markings, for example @type, @weight, and @width.

There are two ways to specify the type of road marking:

*   The @type attribute within the `<roadMark>` element makes it possible to enter keywords that are stored in the application. They are used to describe simplified road marking types like solid, broken, or grass.
    
*   The `<type>` element contains further `<line>` elements making it possible to describe the road marking in a more detailed way.
    

**Elements in UML model**

**`<roadMark>` element**

In ASAM OpenDRIVE, road markings are represented by `<roadMark>` elements within `<lane>` elements.

UML class: t_road_lanes_laneSection_lcr_lane_roadMark
XML tag:   <roadMark> (Multiplicity: 0..*)

Defines the style of the line at the outer border of a lane. The style of the center line that separates left and right lanes is determined by the road mark element for the center lane.

Table 48. Attributes of the <roadMark> element     

Name

Type

Use

Unit

Description

`color`

[e_roadMarkColor](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B67AEB84_154B_4c53_979E_7F1EA9751C9E)

required

Color of the road mark

`height`

[t_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13)

optional

m

Height of road mark above the road, i.e. thickness of the road mark

`laneChange`

[e_road_lanes_laneSection_lcr_lane_roadMark_laneChange](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_ACEEA5DD_8A5C_4c13_B5B7_9233272A914D)

optional

Allows a lane change in the indicated direction, taking into account that lanes are numbered in ascending order from right to left. If the attribute is missing, “both” is used as default.

`material`

string

optional

Material of the road mark. Identifiers to be defined by the user, use "standard" as default value.

`sOffset`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position of the `<roadMark>` element, relative to the position of the preceding `<laneSection>` element

`type`

[e_roadMarkType](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_4D56116F_9736_432e_844E_64F55EAE99F7)

required

Type of the road mark

`weight`

[e_roadMarkWeight](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_239940A3_B976_4a17_BD54_8252EACCC1FD)

optional

Weight of the road mark. This attribute is optional if detailed definition is given below.

`width`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

optional

m

Width of the road mark. This attribute is optional if detailed definition is given by `<line>` element.

![img](../_images/uml_class_diagrams/EAID_D2700AD5_7968_4435_AD3F_B177C0D1C1AD.png)

Figure 81. UML class diagram of the RoadMark class

[Figure 81](#fig-2640be87-3139-4601-8202-18b81bfd5607) shows the UML class diagram of the ASAM OpenDRIVE RoadMark class.

**Rules**

The following rules apply to road markings:

*   `<roadMark>` elements shall only be used to describe the outer lane marking.
    
*   [asam.net:xodr:1.4.0:road.lane.road_mark.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-road-mark-elem-asc-order): `<roadMark>` elements shall be defined in ascending order according to the s-coordinate.
    
*   The center line of the lane marking shall be positioned on the lane’s outer border line in such a way that the outer half of the lane marking is physically placed on the next lane.
    
*   The `<roadMark>` elements of a lane shall remain valid until another `<roadMark>` element starts or the lane section ends.
    

**Related topics**

*   [Section 11.8.1, “Road marking types and lines”](#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)
    
*   [Section 11.8.2, “Explicit road marking types and lines”](#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)
    
*   [Section 11.8.3, “Offset in road markings”](#sec-52e18ce8-c575-4918-ba4b-40da1afd60d8)
    

<a id="sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34"></a>
### 11.8.1 Road marking types and lines

Detailed information about road marking types and lines may be defined in `<type>` elements within the `<roadMark>` element. Each `<type>` element definition contains one or more `<line>` element definitions with additional information about the lines of the road marking.

Road marking information in the `<type>` element is more specific than the information given in the @type attribute within the `<roadMark>` element.

The outline of the road marking is described by the attributes @length and @space:

*   @length represents the visible part of the line.
    
*   @space describes the non-visible part.
    

The position of the road marking in relation to the road reference line may be described by defining the lateral offset. A line definition is valid for a given length of the lane and is repeated automatically. The optional @rule attribute for lines defines the traffic rule for passing the lane from the inside.

**Elements in UML model**

**`<type>` element**

In ASAM OpenDRIVE, road marking types are represented by `<type>` elements within `<roadMark>` elements.

UML class: t_road_lanes_laneSection_lcr_lane_roadMark_type
XML tag:   <type> (Multiplicity: 0..1)

Each type definition shall contain one or more line definitions with additional information about the lines that the road mark is composed of.

Table 49. Attributes of the <type> element     

Name

Type

Use

Unit

Description

`name`

string

required

Name of the road mark type. May be chosen freely.

`width`

[t_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13)

required

m

Accumulated width of the road mark. In case of several `<line>` elements this @width is the sum of all @width of `<line>` elements and spaces in between, necessary to form the road mark. This attribute supersedes the definition in the `<roadMark>` element.

**`<line>` element**

In ASAM OpenDRIVE, road marking lines are represented by `<line>` elements within `<type>` elements.

UML class: t_road_lanes_laneSection_lcr_lane_roadMark_type_line
XML tag:   <line> (Multiplicity: 1..*)

A road mark may consist of one or more elements. Multiple elements are usually positioned side-by-side. A line definition is valid for a given length of the lane and will be repeated automatically.

Table 50. Attributes of the <line> element     

Name

Type

Use

Unit

Description

`color`

[e_roadMarkColor](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_B67AEB84_154B_4c53_979E_7F1EA9751C9E)

optional

Line color. If given, this attribute supersedes the definition in the `<roadMark>` element.

`length`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

Length of the visible part

`rule`

[e_roadMarkRule](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EC1E052F_B2C5_4767_9317_0E54B7A08615)

optional

Rule that must be observed when passing the line from inside, for example, from the lane with the lower absolute ID to the lane with the higher absolute ID

`sOffset`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

Initial longitudinal offset of the line definition from the start of the road mark definition

`space`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

Length of the gap between the visible parts

`tOffset`

double

required

m

Lateral offset from the lane border.  
If `<sway>` element is present, the lateral offset follows the sway.

`width`

[t_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13)

optional

m

Line width

**Related topics**

*   [Section 11.8.2, “Explicit road marking types and lines”](#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)
    
*   [Section 11.8.3, “Offset in road markings”](#sec-52e18ce8-c575-4918-ba4b-40da1afd60d8)
    

<a id="sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210"></a>
### 11.8.2 Explicit road marking types and lines

**Elements in UML model**

**`<explicit>` element**

In ASAM OpenDRIVE, irregular road marking types are represented by `<explicit>` elements within `<roadMark>` elements.

UML class: t_road_lanes_laneSection_lcr_lane_roadMark_explicit
XML tag:   <explicit> (Multiplicity: 0..1)

Irregular road markings that cannot be described by repetitive line patterns may be described by individual road marking elements. These explicit definitions also contain `<line>` elements for the line definition, however, these lines will not be repeated automatically as in repetitive road marking types. In ASAM OpenDRIVE, irregular road marking types and lines are represented by `<explicit>` elements within elements. The line definitions are contained in `<line>` elements within the `<explicit>` element.

The `<explicit>` element should specifically be used for measurement data.

**`<line>` element**

In ASAM OpenDRIVE, irregular road marking lines are represented by `<line>` elements within `<explicit>` elements.

UML class: t_road_lanes_laneSection_lcr_lane_roadMark_explicit_line
XML tag:   <line> (Multiplicity: 1..*)

Specifies a single line in an explicit road mark definition.

Table 51. Attributes of the <line> element     

Name

Type

Use

Unit

Description

`length`

[t_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13)

required

m

Length of the visible line

`rule`

[e_roadMarkRule](../16_annexes/enumerations/map_uml_enumerations.html#top-EAID_EC1E052F_B2C5_4767_9317_0E54B7A08615)

optional

Rule that must be observed when passing the line from inside, that is, from the lane with the lower absolute ID to the lane with the higher absolute ID

`sOffset`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

Offset of start position of the `<line>` element, relative to the @_sOffset_ given in the `<roadMark>` element

`tOffset`

double

required

m

Lateral offset from the lane border.  
If `<sway>` element is present, the lateral offset follows the sway.

`width`

[t_grZero](../16_annexes/map_uml_data_types.html#top-EAID_712BF396_F6CE_4c9f_861D_D959D28F0E13)

optional

m

Line width. This attribute supersedes the definition in the `<roadMark>` element.

**Related topics**

*   [Section 11.8.1, “Road marking types and lines”](#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)
    
*   [Section 11.8.3, “Offset in road markings”](#sec-52e18ce8-c575-4918-ba4b-40da1afd60d8)
    

<a id="sec-52e18ce8-c575-4918-ba4b-40da1afd60d8"></a>
### 11.8.3 Offset in road markings

To describe lane markings that are not straight but have sideway curves, `<sway>` elements may be used. A `<sway>` element relocates the lateral reference position for the following (explicit) type definition and thus defines an offset. The sway offset is relative to the nominal reference position of the lane marking, meaning the lane border.

Offsets from the lateral reference position are defined by `<sway>` elements within the `<roadMark>` element.

**Elements in UML model**

**`<sway>` element**

In ASAM OpenDRIVE, offsets are represented by `<sway>` elements within `<roadMark>` elements.

UML class: t_road_lanes_laneSection_lcr_lane_roadMark_sway
XML tag:   <sway> (Multiplicity: 0..*)

Relocates the lateral reference position for the following (explicit) type definition and thus defines an offset. The sway offset is relative to the nominal reference position of the lane marking, meaning the lane border.

Table 52. Attributes of the <sway> element     

Name

Type

Use

Unit

Description

`a`

double

required

m

Polynom parameter a, sway value at @s (ds=0)

`b`

double

required

1

Polynom parameter b

`c`

double

required

1/m

Polynom parameter c

`d`

double

required

1/m²

Polynom parameter d

`ds`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position of the `<sway>` element, relative to the @_sOffset_ given in the `<roadMark>` element

**Calculation**

For the definition of sways, the lateral reference position at a given point is calculated with the following polynomial function of the third order:

`tOffset (ds) = a + b*ds + c*ds² + d*ds³`

where

 

`tOffset`

is the lateral offset of the lateral reference position from the lane border at a given ds position

`a, b, c, d`

are the coefficients

`ds`

is the distance along the road reference line between the start of the element and the given position.

`ds` starts at zero for each element and is relative to the `sOffset` value given in the `<roadMark>` element.

**Related topics**

*   [Section 11.8.1, “Road marking types and lines”](#sec-1540a1cc-8824-480d-a1af-c20ab0bd6e34)
    
*   [Section 11.8.2, “Explicit road marking types and lines”](#sec-108966cb-ecfd-4c0c-b8d9-2e4f95b10210)

## 11.9 Specific lane rules

It is possible to define special rules for certain lanes that are not specifically defined in the ASAM OpenDRIVE standard and which are stored in the used application.

**Elements in UML model**

**`<rule>` element**

In ASAM OpenDRIVE, a lane rule is represented by the `<rule>` element within the `<lane>` element.

UML class: t_road_lanes_laneSection_lr_lane_rule
XML tag:   <rule> (Multiplicity: 0..*)

Used to add rules that are not covered by any of the other lane attributes that are described in this specification.

Table 53. Attributes of the <rule> element     

Name

Type

Use

Unit

Description

`sOffset`

[t_grEqZero](../16_annexes/map_uml_data_types.html#top-EAID_77A53B88_22D3_4a7e_8C94_45AB3C7E221D)

required

m

s-coordinate of start position, relative to the position of the preceding `<laneSection>` element

`value`

string

required

Free text; currently recommended values are  
"no stopping at any time"  
"disabled parking"  
"car pool"

**Rules**

The following rules apply to lane rules:

*   Applications may have specific lane rules that are only valid in the respective application, but not in ASAM OpenDRIVE.
    
*   [asam.net:xodr:1.4.0:road.lane.rule.elem_asc_order](../16_annexes/map_rules.html#asam-net-xodr-1-4-0-road-lane-rule-elem-asc-order): `<rule>` elements shall be defined in ascending order according to the s-coordinate.
    

**Related topics**

*   [Section 11.1, "Introduction to lanes"](11_01_introduction.html#top-9c2a8ffd-2bf4-4fa9-b861-0fbf9cd6817b)
